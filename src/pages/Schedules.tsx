import { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import "./Trainings.css";

type Category = { id: number; name: string };

type ScheduleStrategy = "weekly_batch" | "days_before";

type ScheduleItem = {
  id?: number;
  weekday: number;
  time: string;
  location: string;
  description: string;
};

type TrainingSchedule = {
  id: number;
  category: number;
  start_date: string;
  end_date: string;
  strategy: ScheduleStrategy;

  batch_weekday: number | null;
  batch_time: string | null;

  days_before: number | null;

  is_active: boolean;
  next_run_at: string | null;

  items: ScheduleItem[];
};

const WEEKDAYS = [
  { id: 0, name: "Pondelok" },
  { id: 1, name: "Utorok" },
  { id: 2, name: "Streda" },
  { id: 3, name: "Štvrtok" },
  { id: 4, name: "Piatok" },
  { id: 5, name: "Sobota" },
  { id: 6, name: "Nedeľa" },
];

function weekdayName(id: number) {
  return WEEKDAYS.find((w) => w.id === id)?.name ?? String(id);
}

function normalizeTime(t: string) {
  if (!t) return "00:00:00";
  return t.length === 5 ? `${t}:00` : t;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const emptyDraft = (): Omit<TrainingSchedule, "id" | "next_run_at"> => ({
  category: 0,
  start_date: "",
  end_date: "",
  strategy: "weekly_batch",
  batch_weekday: 5,
  batch_time: "15:00:00",
  days_before: null,
  is_active: true,
  items: [{ weekday: 0, time: "16:30:00", location: "", description: "Tréning" }],
});

export default function Schedules() {
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Omit<TrainingSchedule, "id" | "next_run_at">>(emptyDraft());
  const [saving, setSaving] = useState(false);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: number) => map.get(id) ?? `Kategória #${id}`;
  }, [categories]);

  const fetchSchedules = async () => {
    setSchedulesLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetchWithAuth(`/training-schedules/`),
        fetchWithAuth(`/my-coach-categories/`),
      ]);

      if (!sRes.ok) {
        const text = await sRes.text();
        console.error("training-schedules error:", sRes.status, text);
        throw new Error(`training-schedules ${sRes.status}`);
      }
      if (!cRes.ok) {
        const text = await cRes.text();
        console.error("my-coach-categories error:", cRes.status, text);
        throw new Error(`my-coach-categories ${cRes.status}`);
      }

      const sData = await sRes.json();
      const cData = await cRes.json();

      setSchedules(Array.isArray(sData) ? sData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (e) {
      console.error(e);
      alert("❌ Nepodarilo sa načítať rozvrhy alebo kategórie.");
    } finally {
      setSchedulesLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setOpen(true);
  };

  const openEdit = (s: TrainingSchedule) => {
    setEditingId(s.id);
    setDraft({
      category: s.category,
      start_date: s.start_date,
      end_date: s.end_date,
      strategy: s.strategy,
      batch_weekday: s.batch_weekday,
      batch_time: s.batch_time,
      days_before: s.days_before,
      is_active: s.is_active,
      items: (s.items ?? []).map((i) => ({
        id: i.id,
        weekday: i.weekday,
        time: i.time,
        location: i.location,
        description: i.description ?? "",
      })),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
  };

  const validateDraft = (): string | null => {
    if (!draft.category) return "Vyber kategóriu.";
    if (!draft.start_date) return "Vyber dátum od.";
    if (!draft.end_date) return "Vyber dátum do.";
    if (draft.end_date < draft.start_date) return "Dátum do nemôže byť pred dátumom od.";

    if (!draft.items.length) return "Pridaj aspoň jeden tréning v týždni.";
    for (const it of draft.items) {
      if (!it.location.trim()) return "Každý tréning musí mať miesto.";
      if (!it.time) return "Každý tréning musí mať čas.";
    }

    if (draft.strategy === "weekly_batch") {
      if (draft.batch_weekday === null || draft.batch_weekday === undefined)
        return "Nastav deň batch vytvorenia.";
      if (!draft.batch_time) return "Nastav čas batch vytvorenia.";
    }

    if (draft.strategy === "days_before") {
      if (draft.days_before === null || draft.days_before === undefined)
        return "Nastav koľko dní pred udalosťou.";
      if (draft.days_before < 0 || draft.days_before > 60) return "days_before musí byť 0–60.";
    }

    return null;
  };

  const saveSchedule = async () => {
    const err = validateDraft();
    if (err) return alert("❌ " + err);

    setSaving(true);
    try {
      const payload = {
        ...draft,
        batch_time: draft.batch_time ? normalizeTime(draft.batch_time) : null,
        items: draft.items.map((i) => ({
          weekday: i.weekday,
          time: normalizeTime(i.time),
          location: i.location,
          description: i.description ?? "",
        })),
      };

      if (editingId) {
        const res = await fetchWithAuth(`/training-schedules/${editingId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("PUT failed");
      } else {
        const res = await fetchWithAuth(`/training-schedules/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("POST failed");
      }

      closeModal();
      await fetchSchedules();
      alert("✅ Rozvrh uložený.");
    } catch {
      alert("❌ Nepodarilo sa uložiť rozvrh.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async (id: number) => {
    if (!confirm("Naozaj chceš zmazať tento rozvrh?")) return;
    try {
      const res = await fetchWithAuth(`/training-schedules/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE failed");
      await fetchSchedules();
    } catch {
      alert("❌ Nepodarilo sa zmazať rozvrh.");
    }
  };

  const addItem = () => {
    setDraft((d) => ({
      ...d,
      items: [...d.items, { weekday: 0, time: "16:30:00", location: "", description: "Tréning" }],
    }));
  };

  const removeItem = (index: number) => {
    setDraft((d) => ({ ...d, items: d.items.filter((_, i) => i !== index) }));
  };

  const updateItem = (index: number, patch: Partial<ScheduleItem>) => {
    setDraft((d) => ({
      ...d,
      items: d.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));
  };

  return (
    <>
      <div className="card">
        <div className="cardTop">
          <div className="title">Automatické rozvrhy</div>
          <div className="actions">
            <button className="btn" onClick={fetchSchedules}>
              Obnoviť
            </button>
            <button className="btn primary" onClick={openCreate}>
              + Pridať rozvrh
            </button>
          </div>
        </div>

        {schedulesLoading ? (
          <div className="muted">Načítavam…</div>
        ) : schedules.length === 0 ? (
          <div className="muted">Zatiaľ nemáš žiadne rozvrhy.</div>
        ) : (
          <div className="scheduleGrid">
            {schedules.map((s) => (
              <div key={s.id} className="scheduleCard">
                <div className="scheduleHead">
                  <div>
                    <div className="subTitle">{categoryName(s.category)}</div>
                    <div className="muted">
                      {s.start_date} → {s.end_date} •{" "}
                      {s.strategy === "weekly_batch"
                        ? `Batch: ${weekdayName(s.batch_weekday ?? 0)} ${s.batch_time?.slice(0, 5) ?? ""}`
                        : `X dní pred: ${s.days_before ?? 0}`}
                    </div>
                    <div className="muted">
                      Next run: {s.next_run_at ? formatDateTime(s.next_run_at) : "—"}
                    </div>
                  </div>

                  <div className={`pill ${s.is_active ? "on" : "off"}`}>
                    {s.is_active ? "Aktívny" : "Neaktívny"}
                  </div>
                </div>

                <div className="items">
                  {(s.items ?? []).map((it, idx) => (
                    <div key={idx} className="item">
                      <b>{weekdayName(it.weekday)}</b> • {it.time.slice(0, 5)} • {it.location}
                      <span className="muted" style={{ marginLeft: 8 }}>
                        {it.description}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="actions">
                  <button className="btn" onClick={() => openEdit(s)}>
                    Upraviť
                  </button>
                  <button className="btn danger" onClick={() => deleteSchedule(s.id)}>
                    Zmazať
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="modalBackdrop" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <h2>{editingId ? "Upraviť rozvrh" : "Nový rozvrh"}</h2>
              <button className="btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="form">
              <div className="row">
                <label>Kategória</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: Number(e.target.value) }))}
                >
                  <option value={0}>-- vyber --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row2">
                <div className="row">
                  <label>Od</label>
                  <input
                    type="date"
                    value={draft.start_date}
                    onChange={(e) => setDraft((d) => ({ ...d, start_date: e.target.value }))}
                  />
                </div>
                <div className="row">
                  <label>Do</label>
                  <input
                    type="date"
                    value={draft.end_date}
                    onChange={(e) => setDraft((d) => ({ ...d, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row">
                <label>Stratégia vytvárania</label>
                <select
                  value={draft.strategy}
                  onChange={(e) => {
                    const strategy = e.target.value as ScheduleStrategy;
                    setDraft((d) => ({
                      ...d,
                      strategy,
                      batch_weekday: strategy === "weekly_batch" ? d.batch_weekday ?? 5 : null,
                      batch_time: strategy === "weekly_batch" ? d.batch_time ?? "15:00:00" : null,
                      days_before: strategy === "days_before" ? d.days_before ?? 3 : null,
                    }));
                  }}
                >
                  <option value="weekly_batch">Vytvoriť celý ďalší týždeň v 1 deň</option>
                  <option value="days_before">Vytvárať X dní pred udalosťou</option>
                </select>
              </div>

              {draft.strategy === "weekly_batch" && (
                <div className="row2">
                  <div className="row">
                    <label>Deň vytvorenia</label>
                    <select
                      value={draft.batch_weekday ?? 5}
                      onChange={(e) => setDraft((d) => ({ ...d, batch_weekday: Number(e.target.value) }))}
                    >
                      {WEEKDAYS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <label>Čas vytvorenia</label>
                    <input
                      type="time"
                      value={(draft.batch_time ?? "15:00:00").slice(0, 5)}
                      onChange={(e) => setDraft((d) => ({ ...d, batch_time: normalizeTime(e.target.value) }))}
                    />
                  </div>
                </div>
              )}

              {draft.strategy === "days_before" && (
                <div className="row">
                  <label>Koľko dní pred udalosťou</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={draft.days_before ?? 3}
                    onChange={(e) => setDraft((d) => ({ ...d, days_before: Number(e.target.value) }))}
                  />
                </div>
              )}

              <div className="row">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.is_active}
                    onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                  />{" "}
                  Aktívny
                </label>
              </div>

              <hr />

              <div className="itemsHead">
                <h3>Týždenné tréningy</h3>
                <button className="btn" onClick={addItem}>
                  + Pridať
                </button>
              </div>

              <div className="itemsEditor">
                {draft.items.map((it, idx) => (
                  <div key={idx} className="itemRow">
                    <select value={it.weekday} onChange={(e) => updateItem(idx, { weekday: Number(e.target.value) })}>
                      {WEEKDAYS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={it.time.slice(0, 5)}
                      onChange={(e) => updateItem(idx, { time: normalizeTime(e.target.value) })}
                    />

                    <input
                      placeholder="Miesto (napr. Jedlíkova)"
                      value={it.location}
                      onChange={(e) => updateItem(idx, { location: e.target.value })}
                    />

                    <input
                      placeholder="Popis (napr. Tréning)"
                      value={it.description}
                      onChange={(e) => updateItem(idx, { description: e.target.value })}
                    />

                    <button className="btn danger" onClick={() => removeItem(idx)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="modalActions">
                <button className="btn" onClick={closeModal}>
                  Zrušiť
                </button>
                <button className="btn primary" onClick={saveSchedule} disabled={saving}>
                  {saving ? "Ukladám…" : "Uložiť"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
