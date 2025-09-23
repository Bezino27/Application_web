import './partnership.css';
import MainLayout from '../components/MainLayout';
import collab from "../assets/collaboration2.webp";
import future from "../assets/long_term.webp";
import website from "../assets/laptop.webp";

export default function PartnershipPage() {
  return (
    <MainLayout>
      {/* HERO */}
      <section className="partnership-hero">
        <div className="hero-content">
          <h1>Budúcnosť klubového manažmentu</h1>
          <p>
            Ludimus je nový projekt, ktorý prináša digitálne riešenia pre športové kluby.  
            Veríme, že moderný systém dokáže ušetriť čas, zjednodušiť organizáciu a posunúť kluby na novú úroveň.  
            Chceme, aby ste boli súčasťou tohto príbehu už od začiatku.
          </p>
          <div className="hero-cta">
            <a href="/OrderForm">Pridať sa k nám</a>
          </div>
        </div>
      </section>

      {/* FUTURE VISION */}
      <section className="feature-block right">
        <div className="text">
          <h2>Projekt na dlhšie obdobie</h2>
          <p>
            Naším cieľom nie je len krátkodobý projekt.  
            Ludimus je budovaný s víziou dlhodobej stability a neustáleho rozvoja.  
            Chceme, aby váš klub mohol rásť spolu s nami.
          </p>
        </div>
        <img src={future} alt="Budúcnosť projektu" />
      </section>

      {/* COLLABORATION */}
      <section className="feature-block left">
        <img src={collab} alt="Spolupráca" />
        <div className="text">
          <h2>Pomôžte nám rozbehnúť Ludimus</h2>
          <p>
            Ste medzi prvými, ktorí môžu využiť potenciál tejto platformy.  
            Vaša spätná väzba a skúsenosti nám pomôžu systém prispôsobiť reálnym potrebám klubov.  
            Spoločne môžeme vytvoriť riešenie, ktoré bude slúžiť celej športovej komunite.
          </p>
        </div>
      </section>

      {/* CUSTOM WEBSITE */}
      <section className="feature-block right">
        <div className="text">
          <h2>Webstránka na mieru</h2>
          <p>
            Okrem aplikácie vieme vytvoriť aj modernú webstránku pre váš klub.  
            Tá môže byť priamo prepojená s Ludimusom – výsledky, tréningy, zápasy či platby budú na jednom mieste.  
            Klub tak získava profesionálnu prezentáciu aj efektívny informačný systém.
          </p>
        </div>
        <img src={website} alt="Webstránka na mieru" />
      </section>

      {/* CTA */}
      <section className="partnership-cta">
        <h2>Staňte sa súčasťou rozvoja</h2>
        <p>
          Spolu môžeme pozdvihnúť fungovanie športových klubov.  
          Ludimus nie je len aplikácia, ale komunita, ktorá chce posúvať šport dopredu.  
          Pridajte sa k nám a pomôžte nám vybudovať niečo, čo bude slúžiť klubom po celé roky.
        </p>
        <a href="/OrderForm" className="cta-button">Kontaktujte nás</a>
      </section>
    </MainLayout>
  );
}
