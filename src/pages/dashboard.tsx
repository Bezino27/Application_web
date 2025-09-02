import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../fetchWithAuth';
import './dashboard.css';
import Layout from '../components/layout.tsx';

type Member = {
    id: number;
    name: string;
    birth_date: string;
    number: string;
    all_payments_paid: boolean;
};

type SortKey = 'name' | 'birth_date' | 'number' | 'all_payments_paid';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
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
                setFiltered(data);
            } else {
                console.error('Nepodarilo sa načítať členov.');
            }
            setLoading(false);
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        let result = [...members];

        if (search.trim() !== '') {
            result = result.filter((m) =>
                m.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        result.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (sortKey === 'birth_date') {
                const aDate = aValue ? new Date(aValue).getTime() : 0;
                const bDate = bValue ? new Date(bValue).getTime() : 0;
                return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
            }

            if (sortKey === 'all_payments_paid') {
                return sortDirection === 'asc'
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }

            const aStr = aValue ? String(aValue) : '';
            const bStr = bValue ? String(bValue) : '';
            return sortDirection === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });

        setFiltered(result);
    }, [search, sortKey, sortDirection, members]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    return (
        <Layout>
        <h1 className="title">Členovia klubu</h1>

            <input
                type="text"
                placeholder="🔍 Hľadať meno..."
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
                        <th onClick={() => handleSort('name')}>Meno</th>
                        <th onClick={() => handleSort('birth_date')}>Dátum narodenia</th>
                        <th onClick={() => handleSort('all_payments_paid')}>Platby</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((m) => (
                        <tr key={m.id}>
                            <td>{m.number}</td>
                            <td>{m.name}</td>
                            <td>
                                {m.birth_date
                                    ? new Date(m.birth_date).toLocaleDateString('sk-SK')
                                    : ''}
                            </td>
                            <td>{m.all_payments_paid ? '✅' : '❌'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            </Layout>
    );
}