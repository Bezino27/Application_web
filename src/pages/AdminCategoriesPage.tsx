import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../fetchWithAuth';
import './AdminCategoriesPage.css';
import Layout from '../components/layout.tsx';

interface Player {
    id: number;
    name: string;
    birth_date: string;
    categories: string[];
    position?: string | null;
    roles: { role: string; category__name: string }[];
}

interface Category {
    id: number;
    name: string;
}

export default function AdminManageCategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedInCategory, setSelectedInCategory] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, usersRes] = await Promise.all([
                    fetchWithAuth('/categories-in-club/'),
                    fetchWithAuth('/users-in-club/'),
                ]);

                const catData: Category[] = await catRes.json();
                const userData: Player[] = await usersRes.json();

                const onlyPlayers: Player[] = userData
                    .filter((u) => u.roles.some((r) => r.role === 'player'))
                    .map((u) => ({
                        ...u,
                        categories: u.roles
                            .filter((r) => r.role === 'player')
                            .map((r) => r.category__name),
                    }));

                setCategories(catData);
                setPlayers(onlyPlayers);
                setLoading(false);
            } catch (error) {
                alert('Chyba pri načítaní údajov');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSelectCategory = (cat: Category) => {
        setSelectedCategory(cat);
        const selected = players
            .filter((p) => p.categories.includes(cat.name))
            .map((p) => p.id);
        setSelectedInCategory(selected);
    };

    const togglePlayer = (id: number) => {
        setSelectedInCategory((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!selectedCategory) return;
        try {
            const res = await fetchWithAuth('/assign-players-to-category/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_id: selectedCategory.id,
                    player_ids: selectedInCategory,
                }),
            });

            if (res.ok) {
                alert('Zmeny boli uložené');
            } else if (res.status === 401) {
                alert('⚠️ Neautorizovaný prístup – skontroluj token');
            } else {
                alert('Chyba pri ukladaní zmien');
            }
        } catch (error) {
            alert('Chyba pri požiadavke');
        }
    };

    const sortedPlayers = [...players].sort(
        (a, b) => new Date(a.birth_date).getTime() - new Date(b.birth_date).getTime()
    );

    const inCategory = sortedPlayers.filter((p) => selectedInCategory.includes(p.id));
    const notInCategory = sortedPlayers.filter((p) => !selectedInCategory.includes(p.id));

    return (
        <Layout>

        <div className="admin-category-container">
            <h1>Správa hráčov podľa kategórie</h1>

            {loading ? (
                <p>Načítavam údaje...</p>
            ) : (
                <>
                    <div className="category-buttons">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleSelectCategory(cat)}
                                className={selectedCategory?.id === cat.id ? 'active' : ''}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {selectedCategory && (
                        <>
                            <h2>Hráči v kategórii {selectedCategory.name}</h2>
                            <div className="dual-column">
                                <div>
                                    <h3>V kategórii</h3>
                                    {inCategory.map((p) => (
                                        <div key={p.id} className="player-card in" onClick={() => togglePlayer(p.id)}>
                                            <strong>{p.name}</strong> ({p.position?.slice(0, 1)}) –{' '}
                                            {p.birth_date.slice(0, 4)}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3>Mimo kategórie</h3>
                                    {notInCategory.map((p) => (
                                        <div key={p.id} className="player-card out" onClick={() => togglePlayer(p.id)}>
                                            <strong>{p.name}</strong> ({p.position?.slice(0, 1)}) –{' '}
                                            {p.birth_date.slice(0, 4)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="save-button" onClick={handleSave}>
                                💾 Uložiť zmeny
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
        </Layout>
    );
}