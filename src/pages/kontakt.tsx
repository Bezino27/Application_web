// src/pages/kontakt.tsx
import './kontakt.css';
import MainLayout from '../components/MainLayout';
export default function KontaktPage() {
  return (
    <MainLayout>
    <div className="contact-wrapper">
      <header className="contact-hero">
        <h1>Kontakt a podpora</h1>
        <p>
          Máš otázku k aplikácii Ludimus, potrebuješ pomôcť s nastavením alebo chceš navrhnúť novú
          funkciu? Ozvi sa – radi pomôžeme.
        </p>
      </header>

      <section className="contact-grid">
        <a className="contact-card" href="mailto:support@ludimus.sk">
          <div className="icon" aria-hidden>
            {/* Mail icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M22 8 12.8 13.2a2 2 0 0 1-1.6 0L2 8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2>E‑mail podpora</h2>
          <p className="muted">support@ludimus.sk</p>
          <span className="cta">Napísať e‑mail →</span>
        </a>

        <a className="contact-card" href="tel:+421910811911">
          <div className="icon" aria-hidden>
            {/* Phone icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l2-2a1.5 1.5 0 0 1 1.6-.36c1.04.35 2.16.54 3.24.54.66 0 1.2.54 1.2 1.2v3a1.2 1.2 0 0 1-1.2 1.2C10.86 20 4 13.14 4 4.2A1.2 1.2 0 0 1 5.2 3h3c.66 0 1.2.54 1.2 1.2 0 1.08.19 2.2.54 3.24.17.53.03 1.11-.36 1.5l-2 1.86Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2>Telefonická podpora</h2>
          <p className="muted">+421 910 811 911</p>
          <span className="cta">Zavolať →</span>
        </a>

        <div className="contact-card">
          <div className="icon" aria-hidden>
            {/* Person icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2>Kontaktná osoba</h2>
          <p className="muted">Tomáš Bezeg</p>
          <p className="muted small">(zakladateľ projektu Ludimus)</p>
        </div>
      </section>

      <section className="contact-extra">
        <div className="pill">Info</div>
        <ul>
          <li>Chyba v aplikácii? Pošli krátky popis a prípadne screenshot na <strong>support@ludimus.sk</strong>.</li>
          <li>Klubový účet a administrácia: radi nastavíme kategórie, roly a notifikácie za pár minút.</li>
          <li>Požiadavka na funkcionalitu: prilož príklad použitia (čo/komu/kedy) – urýchli to realizáciu.</li>
        </ul>
      </section>

      <footer className="contact-footer">
        <p>
          Zvyčajne odpovieme čo najskôr. Ďakujeme, že pomáhaš budovať lepší
          informačný systém pre športové kluby.
        </p>
      </footer>
    </div>
    </MainLayout>
  );
}

