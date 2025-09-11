// src/components/Layout.tsx
import { Link, useNavigate } from 'react-router-dom';
import './layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    return (
        <div className="layout">
            <nav className="top-nav">
                <div className="logo">Ludimus</div>
                <div className="nav-links">
                    <Link to="/dashboard">Členovia</Link>
                    <Link to="/AdminCategoriesPage">Kategórie</Link>
                    <Link to="/PaymentsPage">Platby</Link>
                    <Link to="/AdminOrdersPage">Objednávky</Link>

                    <button className="logout-btn" onClick={handleLogout}>
                        Odhlásiť sa
                    </button>
                </div>
            </nav>
            <main className="layout-content">{children}</main>
        </div>
    );
}
