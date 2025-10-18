import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/nazov-black.png";
import "./MainLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <Link to="/">
            <img src={logo} alt="Ludimus Logo" className="logo" />
          </Link>
                    <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <a href="/About">O aplikácii</a>
            <Link to="/PartnerShip">Spolupráca</Link>
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
  );
}
