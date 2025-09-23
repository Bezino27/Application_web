import './index.css';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

export default function HomePage() {
    return (
        
        <div className="homepage">
            <MainLayout>
            <section className="hero">
                <div className="overlay" />
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Ludimus – digitálne srdce tvojho klubu</h1>
                        <p>Spravuj tréningy, zápasy, platby a komunikáciu. Všetko na jednom mieste.</p>
                        <div className="slogan-block">
                            <div><span className="red-letter">L</span>acný</div>
                            <div><span className="red-letter">U</span>žitočný</div>
                            <div><span className="red-letter">D</span>ostupný</div>
                            <div><span className="red-letter">I</span>ntuitívny</div>
                            <div><span className="red-letter">M</span>oderný</div>
                            <div><span className="red-letter">U</span>nikátny</div>
                            <div><span className="red-letter">S</span>poľahlivý</div>

                        </div>
                        <p className="latin">Simul ludimus, simul vincimus</p>
                        <Link to="/OrderForm" className="cta">Začať používať</Link>
                    </div>
                </div>
            </section>

            <section className="features" id="features">
                <h2>Funkcie aplikácie</h2>
                <div className="feature-grid">
                    <div><h3>Dochádzka</h3><p>Jednoduchá a prehľadná evidencia tréningov a zápasov.</p></div>
                    <div><h3>Platby</h3><p>Automatická kontrola platieb, notifikácie, prehľad.</p></div>
                    <div><h3>Notifikácie</h3><p>Push správy pre hráčov aj trénerov v reálnom čase.</p></div>
                    <div><h3>Mobilná appka</h3><p>Dostupná pre Android aj iOS. Každý hráč má profil.</p></div>
                </div>
            </section>

            <section className="video" id="demo">
                <h2>Ukážka aplikácie</h2>
                <div className="video-wrapper">
                    <iframe
                        src="https://www.youtube.com/embed/tqD2NReoGNs?si=NuTNdadlMwZcUCu9"
                        title="Ukážka aplikácie"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            </section>

            <section className="pricing" id="pricing">
                <h2>Cenník</h2>
                <p className="pricing-subtitle">Začni úplne zadarmo a presvedč sa sám 👇</p>
                <div className="pricing-grid">
                    <div className="pricing-card highlight">
                        <h3>Štart</h3>
                        <p className="price">0 €</p>
                        <p className="period">na 1. mesiac</p>
                        <ul>
                            <li>✅ Všetky funkcie bez obmedzenia</li>
                            <li>✅ Bez viazanosti</li>
                            <li>✅ Ideálne na vyskúšanie</li>
                        </ul>
                        <Link to="/OrderForm" className="pricing-cta">Začni ešte dnes</Link>
                    </div>
                    <div className="pricing-card">
                        <h3>Ročne</h3>
                        <p className="price">25 €</p>
                        <p className="period">mesačne (platba ročne)</p>
                        <ul>
                            <li>💡 Najvýhodnejšia voľba</li>
                            <li>✅ Všetky funkcie aplikácie</li>
                            <li>✅ Podpora klubu a hráčov</li>
                        </ul>
                        <Link to="/OrderForm" className="pricing-cta">Začni ešte dnes</Link>
                    </div>
                    <div className="pricing-card">
                        <h3>Flexi</h3>
                        <p className="price">30 €</p>
                        <p className="period">mesačne (platba mesačne)</p>
                        <ul>
                            <li>✅ Flexibilná platba po mesiacoch</li>
                            <li>✅ Žiadna viazanosť</li>
                            <li>✅ Všetky funkcie aplikácie</li>
                        </ul>
                        <Link to="/OrderForm" className="pricing-cta">Začni ešte dnes</Link>
                    </div>
                </div>
            </section>

            <section className="stats" id="stats">
                <h2>Štatistiky</h2>
                <div className="stat-grid">
                    <div><h3>3</h3><p>Zapojené kluby</p></div>
                    <div><h3>250+</h3><p>Aktívnych používateľov</p></div>
                    <div><h3>100+</h3><p>Zorganizovaných udalostí</p></div>
                </div>
            </section>
            </MainLayout>

        </div>

    );
}