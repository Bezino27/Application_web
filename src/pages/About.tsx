import './About.css';
import MainLayout from '../components/MainLayout';
import menu from "../assets/menu.jpg";
import chat from "../assets/chat.jpg";
import spravy from "../assets/spravy.jpg";
import zapasy from "../assets/zapasy.jpg";
import dochadzka from "../assets/dochadzka.jpg";
import logo from "../assets/ludimus.png"

export default function PartnerShipPage() {
  return (
    <MainLayout>
      {/* HERO */}
      <section className="partnership-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <img src={logo} alt="Ludimus Logo" className="hero-logo" />
          <h1>Aplikácia Ludimus</h1>
          <p>
            Ludimus je informačný systém novej generácie pre športové kluby.  
            Prepája tréningy, zápasy, dochádzku, platby aj komunikáciu do jedného riešenia.  
            Všetko, čo klub potrebuje – dostupné a jednoduché na používanie.
          </p>
          <div className="hero-cta">
            <a href="/OrderForm">Začať spoluprácu</a>
          </div>
        </div>
      </section>

      {/* Dochádzka */}
      <section className="feature-block left">
        <img src={dochadzka} alt="Dochádzka" />
        <div className="text">
          <h2>Dochádzka</h2>
          <p>
            Prehľadná evidencia tréningov a zápasov.  
            Tréneri okamžite vidia, kto prišiel a hráči majú históriu svojej účasti vždy k dispozícii.
          </p>
        </div>
      </section>

      {/* Zápasy */}
      <section className="feature-block right">
        <div className="text">
          <h2>Zápasy</h2>
          <p>
            Kompletný manažment zápasov – nominácie hráčov, potvrdenia účasti, výsledky aj štatistiky.  
            Jednoduchý prehľad pre trénerov aj hráčov.
          </p>
        </div>
        <img src={zapasy} alt="Zápasy" />
      </section>

      {/* Správy */}
      <section className="feature-block left">
        <img src={spravy} alt="Správy" />
        <div className="text">
          <h2>Správy</h2>
          <p>
            Dôležité oznamy pre celý tím alebo vybraných hráčov.  
            Už žiadne stratené informácie v záplave sociálnych sietí.
          </p>
        </div>
      </section>

      {/* Chat */}
      <section className="feature-block right">
        <div className="text">
          <h2>Chat</h2>
          <p>
            Rýchla komunikácia medzi hráčmi, trénermi a rodičmi.  
            Podpora reakcií, notifikácií a reálneho času – aby nikomu nič neuniklo.
          </p>
        </div>
        <img src={chat} alt="Chat" />
      </section>

      {/* Menu */}
      <section className="feature-block left">
        <img src={menu} alt="Menu aplikácie" />
        <div className="text">
          <h2>Intuitívne menu</h2>
          <p>
            Moderné a jednoduché rozhranie navrhnuté pre maximálnu prehľadnosť.  
            Každý používateľ má prístup k funkciám, ktoré potrebuje – na pár klikov.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="partnership-cta">
        <h2>Začnime spolupracovať</h2>
        <p>
          Moderný klubový manažment by mal byť dostupný pre všetkých –  
          od mládežníckych tímov až po profesionálne organizácie.  
          Spoj sa s nami a posuň svoj klub na vyššiu úroveň.
        </p>
        <a href="/kontakt" className="cta-button">Kontaktujte nás</a>
      </section>
    </MainLayout>
  );
}
