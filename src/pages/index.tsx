// src/pages/index.tsx
import './index.css';
import logo from '../assets/nazov-black.png';
import heroImage from '../assets/ludimus.png';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div>
            <header className="header">
                <img src={logo} alt="Ludimus Logo" className="logo-img" />
                <nav className="nav">
                    <a href="#features">Funkcie</a>
                    <a href="#stats">Štatistiky</a>
                    <a href="#demo">Ukážka</a>
                    <Link to="/login" className="login-button">Prihlásiť sa</Link>
                </nav>
            </header>

            <section className="hero">
                <div className="hero-text">
                    <h1>Moderný klubový systém pre športové tímy</h1>
                    <p>Spravuj tréningy, zápasy, dochádzku, platby a komunikáciu na jednom mieste. Ideálne riešenie pre kluby všetkých veľkostí.</p>
                    <Link to="/login" className="cta-button">Začať používať</Link>
                </div>
                <img src={heroImage} alt="Ilustrácia aplikácie" className="hero-img" />
            </section>

            <section className="features" id="features">
                <h2>Prečo Ludimus?</h2>
                <p className="section-subtitle">Všetko, čo tvoj klub potrebuje – v jednej aplikácii.</p>
                <div className="feature-grid">
                    <div>
                        <h3>🏋️ Dochádzka</h3>
                        <p>Prehľadná evidencia účasti hráčov na tréningoch a zápasoch.</p>
                    </div>
                    <div>
                        <h3>💳 Platby</h3>
                        <p>Automatická kontrola platieb, notifikácie a prehľad stavu členského.</p>
                    </div>
                    <div>
                        <h3>📢 Push notifikácie</h3>
                        <p>Okamžité informovanie hráčov o zmenách a novinkách v klube.</p>
                    </div>
                    <div>
                        <h3>📲 Mobilná aplikácia</h3>
                        <p>Dostupná pre Android aj iOS. Hráči majú vlastný profil a prehľad.</p>
                    </div>
                </div>
            </section>

            <section className="video" id="demo">
                <h2>Pozri si ukážku v praxi</h2>
                <p className="section-subtitle">Začni s digitálnou transformáciou tvojho klubu ešte dnes.</p>
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
                <h2>Úspešne používané klubmi</h2>
                <div className="stat-grid">
                    <div>
                        <h3>1</h3>
                        <p>Zapojený klub</p>
                    </div>
                    <div>
                        <h3>100+</h3>
                        <p>Aktívnych používateľov</p>
                    </div>
                    <div>
                        <h3>30+</h3>
                        <p>Odtrénovaných udalostí</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2025 Ludimus. Všetky práva vyhradené.</p>
            </footer>
        </div>
    );
}
