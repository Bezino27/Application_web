// src/pages/index.tsx
import './index.css';
import logo from '../assets/nazov-black.png';
import heroImage from '../assets/ludimus.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="homepage">
            <header className="header">
                <div className="header-content">
                    <img src={logo} alt="Ludimus Logo" className="logo" />
                    <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                        <a href="#features">Funkcie</a>
                        <a href="#values">Hodnoty</a>
                        <a href="#stats">Štatistiky</a>
                        <a href="#demo">Ukážka</a>
                        <Link to="/login" className="login-button">Prihlásenie</Link>
                    </nav>
                    <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                </div>
            </header>

            <section className="hero">
                <div className="hero-text">
                    <h1>Ludimus – digitálne srdce tvojho klubu</h1>
                    <p>Spravuj tréningy, zápasy, platby a komunikáciu. Všetko na jednom mieste.</p>
                    <p className="slogan">Simul ludimus, simul vincimus – <strong>Spolu hráme, spolu víťazíme.</strong></p>
                    <Link to="/login" className="cta">Začať používať</Link>
                </div>
                <div className="hero-image">
                    <img src={heroImage} alt="Ukážka aplikácie" />
                </div>
            </section>

            <section className="features" id="features">
                <h2>🎯 Funkcie aplikácie</h2>
                <div className="feature-grid">
                    <div><h3>✅ Dochádzka</h3><p>Jednoduchá a prehľadná evidencia tréningov a zápasov.</p></div>
                    <div><h3>💳 Platby</h3><p>Automatická kontrola platieb, notifikácie, prehľad.</p></div>
                    <div><h3>📢 Notifikácie</h3><p>Push správy pre hráčov aj trénerov v reálnom čase.</p></div>
                    <div><h3>📱 Mobilná appka</h3><p>Dostupná pre Android aj iOS. Každý hráč má profil.</p></div>
                </div>
            </section>

            <section className="values" id="values">
                <h2>🌟 Naše hodnoty</h2>
                <ul className="value-list">
                    <li><strong>L</strong> – Lacný</li>
                    <li><strong>U</strong> – Užitočný</li>
                    <li><strong>D</strong> – Dostupný</li>
                    <li><strong>I</strong> – Intuitívny</li>
                    <li><strong>M</strong> – Moderný</li>
                    <li><strong>U</strong> – Unikátny</li>
                    <li><strong>S</strong> – Spoľahlivý</li>
                </ul>
            </section>

            <section className="video" id="demo">
                <h2>🎥 Ukážka aplikácie</h2>
                <div className="video-wrapper">
                    <iframe
                        src="https://www.youtube.com/embed/tqD2NReoGNs?si=NuTNdadlMwZcUCu9"
                        title="Ukážka aplikácie"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            </section>

            <section className="stats" id="stats">
                <h2>📊 Štatistiky</h2>
                <div className="stat-grid">
                    <div><h3>1</h3><p>Zapojený klub</p></div>
                    <div><h3>100+</h3><p>Aktívnych používateľov</p></div>
                    <div><h3>30+</h3><p>Zorganizovaných udalostí</p></div>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2025 Ludimus – Všetky práva vyhradené</p>
            </footer>
        </div>
    );
}