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
            switch (sortKey) {
                case 'birth_date': {
                    const aDate = a.birth_date ? new Date(a.birth_date).getTime() : 0;
                    const bDate = b.birth_date ? new Date(b.birth_date).getTime() : 0;
                    return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
                }

                case 'all_payments_paid': {
                    return sortDirection === 'asc'
                        ? Number(a.all_payments_paid) - Number(b.all_payments_paid)
                        : Number(b.all_payments_paid) - Number(a.all_payments_paid);
                }

                case 'name': {
                    return sortDirection === 'asc'
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                }

                case 'number': {
                    return sortDirection === 'asc'
                        ? a.number.localeCompare(b.number)
                        : b.number.localeCompare(a.number);
                }
            }
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