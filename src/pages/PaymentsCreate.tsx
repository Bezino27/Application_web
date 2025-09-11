import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '../fetchWithAuth';
import Layout from '../components/layout.tsx';
import './PaymentsCreate.css';
import { useNavigate } from "react-router-dom";

type Member = {
    id: number;
    name: string;       // "Meno Priezvisko"
    username: string;
    birth_date?: string;
};

type CreateResult = {
    userId: number;
    name: string;
    ok: boolean;
    message?: string;
};

export default function PaymentsCreatePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [onlyNew, setOnlyNew] = useState(false);  // 👈 filter "noví bez platieb"
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [amount, setAmount] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>(''); // yyyy-mm-dd
    const [description, setDescription] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });
    const [results, setResults] = useState<CreateResult[]>([]);

    // načítanie zoznamu – rešpektuje prepínač onlyNew
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const url = onlyNew ? '/new-members-without-payments/' : '/users-in-club/';
            const res = await fetchWithAuth(url);
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
            setLoading(false);
        };
        load();
    }, [onlyNew]); // 👈 refetch pri zmene prepínača

    // rozdelenie mena na { first, last, full }
    const getNameTokens = (m: Member) => {
        const full = (m.name || '').trim() || m.username;
        const parts = full.split(/\s+/).filter(Boolean);
        const last = parts.length ? parts[parts.length - 1] : '';
        const first = parts.slice(0, -1).join(' ');
        return { first, last, full };
    };

    const collator = useMemo(() => new Intl.Collator('sk', { sensitivity: 'base' }), []);

    const filtered = useMemo(() => {
        let list = members;

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(m => {
                const { full } = getNameTokens(m);
                return full.toLowerCase().includes(q) || m.username.toLowerCase().includes(q);
            });
        }

        // zoradenie: priezvisko -> meno -> username
        return [...list].sort((a, b) => {
            const A = getNameTokens(a);
            const B = getNameTokens(b);
            const byLast = collator.compare(A.last, B.last);
            if (byLast !== 0) return byLast;
            const byFirst = collator.compare(A.first, B.first);
            if (byFirst !== 0) return byFirst;
            return collator.compare(a.username, b.username);
        });
    }, [members, search, collator]);

    const toggleOne = (id: number) => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };

    const allVisibleIds = useMemo(() => filtered.map(m => m.id), [filtered]);

    const toggleAllVisible = () => {
        const allSelected = allVisibleIds.every(id => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !allVisibleIds.includes(id)));
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...allVisibleIds])));
        }
    };

    const validate = () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert('Zadaj platnú sumu (amount).');
            return false;
        }
        if (!dueDate) {
            alert('Vyber dátum splatnosti.');
            return false;
        }
        if (selectedIds.length === 0) {
            alert('Vyber aspoň jedného hráča.');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!validate()) return;

        setSubmitting(true);
        setProgress({ total: selectedIds.length, done: 0 });
        setResults([]);

        const concurrency = 5;
        let idx = 0;
        const localResults: CreateResult[] = [];

        // Pomocná na meno vo formáte „Priezvisko Meno“
        const displayNameById = (id: number) => {
            const m = members.find(x => x.id === id);
            if (!m) return `user_id ${id}`;
            const parts = (m.name || '').trim().split(/\s+/).filter(Boolean);
            return parts.length > 1
                ? `${parts[parts.length - 1]} ${parts.slice(0, -1).join(' ')}`
                : (m.name || m.username);
        };

        const worker = async () => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (idx >= selectedIds.length) break;
                const myIdx = idx++;
                const userId = selectedIds[myIdx];

                try {
                    const res = await fetchWithAuth('/create-member-payments/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: userId,
                            amount: Number(amount),
                            due_date: dueDate,
                            description: description ?? '',
                        }),
                    });
                    const name = displayNameById(userId);
                    if (res.ok) {
                        localResults.push({ userId, name, ok: true });
                    } else {
                        let message = 'Chyba';
                        try {
                            const data = await res.json();
                            message = (data && (data.error as string)) || JSON.stringify(data);
                        } catch {
                            /* ignore JSON parse error */
                        }
                        localResults.push({ userId, name, ok: false, message });
                    }
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Network error';
                    const name = displayNameById(userId);
                    localResults.push({ userId, name, ok: false, message });
                }
                setProgress(prev => ({ total: prev.total, done: prev.done + 1 }));
            }
        };

        const workers = Array.from({ length: Math.min(concurrency, selectedIds.length) }, () => worker());
        await Promise.all(workers);

        setResults(localResults);
        setSubmitting(false);
    };

    const successCount = results.filter(r => r.ok).length;
    const failCount = results.filter(r => !r.ok).length;

    const formatBirthDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    };

    return (
        <Layout>
            {/* Podnavigácia */}
            <div className="subnav">
                <button onClick={() => navigate("/PaymentsPage")}>
                    Zoznam členov
                </button>
                <button onClick={() => navigate("/UploadStatementPage")}>
                     📂 Nahrať výpis z účtu
                </button>
                <button onClick={() => navigate("/PaymentsAdminPage")}>
                    ✅ Kontrola platieb
                </button>
                <button onClick={() => navigate("/admin/payments/create")}>
                    ➕ Vytvoriť platbu
                </button>
            </div>
            <div className="payments-create">
                <h1>Vytvoriť platby pre viacerých hráčov</h1>

                <section className="panel">
                    <div className="field-row">
                        <label>Množstvo (amount):</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="napr. 20 alebo 20.00"
                        />
                    </div>

                    <div className="field-row">
                        <label>Dátum splatnosti:</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="field-row">
                        <label>Popis (voliteľné):</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="napr. Členské september 2025"
                        />
                    </div>

                    <div className="field-row">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Hľadaj meno alebo username…"
                        />
                        <button onClick={toggleAllVisible} disabled={loading}>
                            {allVisibleIds.every(id => selectedIds.includes(id))
                                ? 'Odznačiť zobrazených'
                                : 'Označiť všetkých zobrazených'}
                        </button>
                    </div>

                    {/* 👇 nový prepínač */}
                    <div className="field-row">
                        <label>
                            <input
                                type="checkbox"
                                checked={onlyNew}
                                onChange={e => setOnlyNew(e.target.checked)}
                            />
                            {' '}Len noví (bez platieb)
                        </label>
                    </div>
                </section>

                <section className="list-panel">
                    <div className="list-header">
                        <div style={{ width: 48 }}></div>
                        <div>Meno (Priezvisko Meno)</div>
                        <div>Username</div>
                        <div>Dátum narodenia</div>
                    </div>

                    {loading ? (
                        <div className="loading">Načítavam členov…</div>
                    ) : filtered.length === 0 ? (
                        <div className="empty">Žiadni členovia.</div>
                    ) : (
                        filtered.map(m => {
                            const parts = (m.name || '').trim().split(/\s+/).filter(Boolean);
                            const surnameFirst =
                                parts.length > 1 ? `${parts[parts.length - 1]} ${parts.slice(0, -1).join(' ')}` : (m.name || '—');

                            return (
                                <div className="list-row" key={m.id}>
                                    <div style={{ width: 48 }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(m.id)}
                                            onChange={() => toggleOne(m.id)}
                                        />
                                    </div>
                                    <div>{surnameFirst}</div>
                                    <div>{m.username}</div>
                                    <div>{formatBirthDate(m.birth_date)}</div>
                                </div>
                            );
                        })
                    )}
                </section>

                <section className="actions">
                    <button
                        className="primary"
                        onClick={handleCreate}
                        disabled={submitting || loading || selectedIds.length === 0}
                    >
                        Vytvoriť platby ({selectedIds.length})
                    </button>
                    {submitting && (
                        <div className="progress">
                            Vytváram platby… {progress.done}/{progress.total}
                        </div>
                    )}
                </section>

                {results.length > 0 && (
                    <section className="results">
                        <h2>Výsledok</h2>
                        <div className="summary">
                            <span className="ok">Úspešne: {successCount}</span>
                            <span className="fail">Neúspešné: {failCount}</span>
                        </div>
                        <div className="result-list">
                            {results.map(r => (
                                <div key={r.userId} className={r.ok ? 'result ok' : 'result fail'}>
                                    {r.ok ? `OK – ${r.name}` : `CHYBA – ${r.name}: ${r.message ?? ''}`}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}