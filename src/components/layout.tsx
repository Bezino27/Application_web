// src/components/Layout.tsx
import { Link, useNavigate } from 'react-router-dom';
import './layout.css';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);

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

                    <div
                        className="dropdown"
                        onMouseEnter={() => setShowOrdersDropdown(true)}
                        onMouseLeave={() => setShowOrdersDropdown(false)}
                    >
                        <div className="dropbtn">
                            Objednávky ▾
                        </div>
                        {showOrdersDropdown && (
                            <div className="dropdown-content">
                                <Link to="/AdminOrdersPage">FlorbalExpert</Link>
                                <Link to="/AdminJerseyOrders">Dresy</Link>
                                <Link to="/orders/oblecenie">Oblečenie</Link>
                            </div>
                        )}
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>
                        Odhlásiť sa
                    </button>
                </div>
            </nav>
            <main className="layout-content">{children}</main>
        </div>
    );
}
