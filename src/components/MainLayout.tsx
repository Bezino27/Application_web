import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/nazov-black.png";
import "./MainLayout.css";
import { Title, Meta } from "react-head";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* SEO tagy – tieto pôjdu správne do <head> */}
      <Title>Ludimus – digitálne srdce tvojho klubu</Title>
      <Meta
        name="description"
        content="Ludimus je moderný informačný systém pre športové kluby. Spravuj tréningy, zápasy, platby a komunikáciu – všetko na jednom mieste."
      />
      <Meta property="og:title" content="Ludimus – digitálne srdce tvojho klubu" />
      <Meta property="og:description" content="Spravuj tréningy, zápasy a platby v modernom systéme." />
      <Meta property="og:image" content="https://ludimus.sk/og-image.png" />

      {/* Layout */}
      <div className="main-layout">
        <header className="header">
          <div className="header-content">
            <Link to="/">
              <img src={logo} alt="Ludimus Logo" className="logo" />
            </Link>
            <nav className={`nav ${menuOpen ? "open" : ""}`}>
              <a href="/About">O aplikácii</a>
              <Link to="/PartnerShip">Spolupráca</Link>
              <Link to="/referencie">Referencie</Link>
              <Link to="/kontakt">Kontakt</Link>
              <Link to="/login" className="login-button">
                Prihlásenie
              </Link>
            </nav>
            <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>

        <footer className="footer">
          <p>&copy; 2025 Ludimus – Všetky práva vyhradené</p>
        </footer>
      </div>
    </>
  );
}
