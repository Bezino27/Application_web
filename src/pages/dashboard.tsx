import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '../fetchWithAuth';
import './dashboard.css';
import Layout from '../components/layout.tsx';

type Member = {
    id: number;
    name: string;        // "Meno Priezvisko"
    birth_date: string;
    number: string;
    all_payments_paid: boolean;
};

type SortKey = 'name' | 'birth_date' | 'number' | 'all_payments_paid';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
        const fetchMembers = async () => {
            const res = await fetchWithAuth('/admin-member-payments-summary/');
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            } else {
                console.error('Nepodarilo sa načítať členov.');
            }
            setLoading(false);
        };
        fetchMembers();
    }, []);

    // helper: rozbij meno
    const tokens = (fullName: string) => {
        const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
        const last = parts.length ? parts[parts.length - 1] : '';
        const first = parts.slice(0, -1).join(' ');
        return { first, last };
    };

    const collator = useMemo(() => new Intl.Collator('sk', { sensitivity: 'base' }), []);

    const filtered = useMemo(() => {
        let result = [...members];

        // filter podľa mena alebo čísla
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(q) || m.number.toLowerCase().includes(q)
            );
        }

        // zoradenie
        result.sort((a, b) => {
            switch (sortKey) {
                case 'birth_date': {
                    const aDate = a.birth_date ? new Date(a.birth_date).getTime() : 0;
                    const bDate = b.birth_date ? new Date(b.birth_date).getTime() : 0;
                    return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
                }
                case 'all_payments_paid': {
                    const diff =
                        Number(a.all_payments_paid) - Number(b.all_payments_paid);
                    return sortDirection === 'asc' ? diff : -diff;
                }
                case 'number': {
                    const diff = collator.compare(a.number, b.number);
                    return sortDirection === 'asc' ? diff : -diff;
                }
                case 'name':
                default: {
                    // priezvisko -> meno
                    const A = tokens(a.name);
                    const B = tokens(b.name);
                    const byLast = collator.compare(A.last, B.last);
                    const res = byLast !== 0 ? byLast : collator.compare(A.first, B.first);
                    return sortDirection === 'asc' ? res : -res;
                }
            }
        });

        return result;
    }, [members, search, sortKey, sortDirection, collator]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
        else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const formatBirth = (d?: string) => {
        if (!d) return '';
        const date = new Date(d);
        if (isNaN(date.getTime())) return d;
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`; // 9.11.2003
    };

    const surnameFirst = (full: string) => {
        const parts = (full || '').trim().split(/\s+/).filter(Boolean);
        return parts.length > 1
            ? `${parts[parts.length - 1]} ${parts.slice(0, -1).join(' ')}`
            : full || '—';
    };

    return (
        <Layout>
            <h1 className="title">Členovia klubu</h1>

            <input
                type="text"
                placeholder="🔍 Hľadať meno alebo číslo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            {loading ? (
                <p>Načítavam...</p>
            ) : (
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('number')}>#</th>
                        <th onClick={() => handleSort('name')}>Meno (Priezvisko Meno)</th>
                        <th onClick={() => handleSort('birth_date')}>Dátum narodenia</th>
                        <th onClick={() => handleSort('all_payments_paid')}>Platby</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((m) => (
                        <tr key={m.id}>
                            <td>{m.number}</td>
                            <td>{surnameFirst(m.name)}</td>
                            <td>{formatBirth(m.birth_date)}</td>
                            <td>{m.all_payments_paid ? '✅' : '❌'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}