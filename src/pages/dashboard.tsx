import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '../fetchWithAuth';
import './dashboard.css';
import Layout from '../components/layout.tsx';

type Member = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  number: string;
  email: string;
  email_2?: string;
  all_payments_paid: boolean;
};

type EditForm = {
  username: string;
  first_name: string;
  last_name: string;
  number: string;
  email: string;
  email_2?: string;
  password?: string;
};

type SortKey = 'name' | 'birth_date' | 'number' | 'all_payments_paid';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<EditForm>({
    username: '',
    first_name: '',
    last_name: '',
    number: '',
    email: '',
    email_2: '',
    password: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const res = await fetchWithAuth('/admin-member-payments-summary/');
    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    } else {
      console.error('Nepodarilo sa načítať členov.');
    }
    setLoading(false);
  };

  const collator = useMemo(() => new Intl.Collator('sk', { sensitivity: 'base' }), []);

  const filtered = useMemo(() => {
    let result = [...members];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          m.number.toLowerCase().includes(q)
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
          const diff = Number(a.all_payments_paid) - Number(b.all_payments_paid);
          return sortDirection === 'asc' ? diff : -diff;
        }
        case 'number': {
          const diff = collator.compare(a.number, b.number);
          return sortDirection === 'asc' ? diff : -diff;
        }
        case 'name':
        default: {
          const fullA = `${a.last_name} ${a.first_name}`;
          const fullB = `${b.last_name} ${b.first_name}`;
          const diff = collator.compare(fullA, fullB);
          return sortDirection === 'asc' ? diff : -diff;
        }
      }
    });

    return result;
  }, [members, search, sortKey, sortDirection, collator]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const formatBirth = (d?: string) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({
      username: m.username || '',
      first_name: m.first_name || '',
      last_name: m.last_name || '',
      number: m.number || '',
      email: m.email || '',
      email_2: m.email_2 || '',
      password: '',
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    const res = await fetchWithAuth(`/admin-member/${editing.id}/`, {
      method: 'PUT',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('✅ Údaje boli uložené');
      setEditing(null);
      fetchMembers();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`❌ Chyba pri ukladaní: ${data.detail || 'Neznáma chyba'}`);
    }
  };

  return (
    <Layout>
      <h1 className="title">Členovia klubu</h1>

      <input
        type="text"
        placeholder="🔍 Hľadať meno, číslo alebo username"
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
              <th>#</th>
              <th onClick={() => handleSort('name')}>Meno</th>
              <th>Username</th>
              <th>Email</th>
              <th>Email 2</th>
              <th onClick={() => handleSort('birth_date')}>Dátum narodenia</th>
              <th onClick={() => handleSort('all_payments_paid')}>Platby</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>{m.number}</td>
                <td>{m.last_name} {m.first_name}</td>
                <td>{m.username}</td>
                <td>{m.email}</td>
                <td>{m.email_2 || '—'}</td>
                <td>{formatBirth(m.birth_date)}</td>
                <td>{m.all_payments_paid ? '✅' : '❌'}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(m)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upraviť člena</h2>

            <label>Username:</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label>Meno:</label>
            <input
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />

            <label>Priezvisko:</label>
            <input
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />

            <label>Číslo:</label>
            <input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />

            <label>Email 1:</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label>Email 2:</label>
            <input
              value={form.email_2}
              onChange={(e) => setForm({ ...form, email_2: e.target.value })}
            />

            <label>Nové heslo (nepovinné):</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={handleSave} className="save-btn">💾 Uložiť</button>
              <button onClick={() => setEditing(null)} className="cancel-btn">Zrušiť</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
