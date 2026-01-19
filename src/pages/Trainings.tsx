import { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import "./Trainings.css";

type Category = { id: number; name: string };

type Training = {
  id: number;
  category: number;
  category_name?: string;
  date: string; // ISO
  location: string;
  description: string;

  attendance_summary: {
    goalies: number;
    present: number;
    absent: number;
    unknown: number;
  };
};

const SEASON_START_MONTH = 8; // 0=Jan ... 8=Sep

function seasonKeyFromDate(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth();
  const startYear = m >= SEASON_START_MONTH ? y : y - 1;
  return `${startYear}/${startYear + 1}`;
}

function monthKeyFromDate(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function monthLabelFromKey(key: string) {
  const [y, mm] = key.split("-");
  return `${mm}/${y}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function Trainings() {
  // trainings
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingsLoading, setTrainingsLoading] = useState(true);

  // filtre
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSeason, setFilterSeason] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");

  // categories (pre filter + názvy skupín)
  const [categories, setCategories] = useState<Category[]>([]);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: number) => map.get(id) ?? `Kategória #${id}`;
  }, [categories]);

  const fetchTrainings = async () => {
    setTrainingsLoading(true);
    try {
      const res = await fetchWithAuth(`/coach-trainings/`);
      const data = await res.json();
      setTrainings(Array.isArray(data) ? data : []);
    } catch {
      alert("❌ Nepodarilo sa načítať tréningy.");
    } finally {
      setTrainingsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth(`/my-coach-categories/`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      // necháme page fungovať aj bez názvov
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchCategories();
  }, []);

  // dostupné sezóny a mesiace z dát
  const availableSeasons = useMemo(() => {
    const set = new Set<string>();
    for (const t of trainings) {
      const d = new Date(t.date);
      if (!isNaN(d.getTime())) set.add(seasonKeyFromDate(d));
    }
    return [...set].sort((a, b) => Number(b.split("/")[0]) - Number(a.split("/")[0]));
  }, [trainings]);

  const availableMonthsForSeason = useMemo(() => {
    const set = new Set<string>();
    for (const t of trainings) {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) continue;
      const sk = seasonKeyFromDate(d);
      if (filterSeason && sk !== filterSeason) continue;
      set.add(monthKeyFromDate(d));
    }
    return [...set].sort((a, b) => (a < b ? 1 : -1));
  }, [trainings, filterSeason]);

  // keď zmeníš sezónu, ak mesiac nepatrí do sezóny -> reset
  useEffect(() => {
    if (!filterMonth) return;
    if (!availableMonthsForSeason.includes(filterMonth)) setFilterMonth("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSeason]);

  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) => {
      if (filterCategory && t.category !== filterCategory) return false;

      const d = new Date(t.date);
      if (isNaN(d.getTime())) return true;

      if (filterSeason && seasonKeyFromDate(d) !== filterSeason) return false;
      if (filterMonth && monthKeyFromDate(d) !== filterMonth) return false;

      return true;
    });
  }, [trainings, filterCategory, filterSeason, filterMonth]);

  // trainings grouped (už z filtrovaných)
  const trainingsByCategory = useMemo(() => {
    const map = new Map<number, Training[]>();
    for (const t of filteredTrainings) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      map.set(k, arr);
    }
    return map;
  }, [filteredTrainings]);

  function formatRosterCounts(t: Training) {
    const p = typeof t.attendance_summary?.present === "number" ? t.attendance_summary.present : null;
    const g = typeof t.attendance_summary?.goalies === "number" ? t.attendance_summary.goalies : null;
    if (p === null && g === null) return "—";
    return `${p ?? 0}+${g ?? 0}`;
  }

  return (
    <div className="card">
      <div className="cardTop">
        <div className="title">Zoznam tréningov</div>
        <div className="actions">
          <button className="btn" onClick={fetchTrainings}>
            Obnoviť
          </button>
        </div>
      </div>

      {/* FILTRE */}
      <div className="filtersRow" style={{ marginTop: 12 }}>
        <div className="row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
            <label className="muted">Kategória</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(Number(e.target.value))}>
              <option value={0}>Všetky kategórie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 6, minWidth: 180 }}>
            <label className="muted">Sezóna</label>
            <select value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)}>
              <option value="">Všetky sezóny</option>
              {availableSeasons.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 6, minWidth: 160 }}>
            <label className="muted">Mesiac</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="">Všetky mesiace</option>
              {availableMonthsForSeason.map((m) => (
                <option key={m} value={m}>
                  {monthLabelFromKey(m)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "end", gap: 10 }}>
            <button
              className="btn"
              onClick={() => {
                setFilterCategory(0);
                setFilterSeason("");
                setFilterMonth("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {trainingsLoading ? (
        <div className="muted">Načítavam…</div>
      ) : filteredTrainings.length === 0 ? (
        <div className="muted">Nič nevyhovuje filtrom.</div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {[...trainingsByCategory.entries()].map(([catId, list]) => (
            <div key={catId} className="subCard">
              <div className="subTitle">{categoryName(catId)}</div>

              <div className="list">
                {list.map((t) => (
                  <div
                    key={t.id}
                    className="rowItem"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ minWidth: 240 }}>
                      <b>{formatDateTime(t.date)}</b>
                      <div className="muted">{t.location}</div>
                    </div>

                    <div className="muted" style={{ flex: 1 }}>
                      {t.description}
                    </div>

                    <div
                      title="Hráči + brankári"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: 700,
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#f2f2f2",
                        border: "1px solid #e0e0e0",
                        color: "#111",
                      }}
                    >
                      {formatRosterCounts(t)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
