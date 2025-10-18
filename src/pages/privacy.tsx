import MainLayout from '../components/MainLayout';
import './privacy.css';


export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
    
    <div className="privacy-container">
      <h1>Zásady ochrany osobných údajov – Ludimus</h1>

      <p>
        Tieto zásady vysvetľujú, aké osobné údaje zhromažďujeme a ako ich
        spracovávame v rámci systému <strong>Ludimus</strong>, ktorý slúži na
        správu športových klubov, tréningov, zápasov a dochádzky hráčov.
      </p>

      <section>
        <h2>1. Správca údajov</h2>
        <p>
          Správcom osobných údajov je spoločnosť alebo klub, ktorý používa
          systém <strong>Ludimus</strong> na správu svojich členov.
        </p>
        <p>
          Prevádzkovateľ systému: <br />
          <strong>Ludimus</strong> <br />
          Kontakt:{" "}
          <a href="mailto:support@ludimus.sk">support@ludimus.sk</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">2. Aké údaje spracovávame</h2>
        <p>V rámci systému Ludimus spracovávame tieto osobné údaje:</p>
        <ul className="list-disc ml-6 mt-3">
          <li>Meno a priezvisko</li>
          <li>Dátum narodenia</li>
          <li>Používateľské meno a heslo</li>
          <li>Priradenie ku klubu (Club)</li>
          <li>Číslo na drese, výška, váha, preferovaná strana (ľavá/pravá)</li>
          <li>Email a alternatívny email</li>
          <li>Pozícia hráča na ihrisku</li>
          <li>Preferovaná rola (hráč, tréner, admin, rodič)</li>
          <li>IBAN – používaný pre platby členských príspevkov</li>
          <li>Dochádzka na tréningoch, účasť na zápasoch a štatistiky</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">3. Účel spracovania údajov</h2>
        <p>Údaje spracovávame za účelom:</p>
        <ul className="list-disc ml-6 mt-3">
          <li>vedenia evidencie hráčov a členov klubu,</li>
          <li>organizácie tréningov, zápasov a účasti,</li>
          <li>sledovania štatistík a výkonnosti,</li>
          <li>komunikácie medzi hráčmi, trénermi a klubom,</li>
          <li>evidencie platieb a členských príspevkov,</li>
          <li>správy používateľských účtov a profilov.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">4. Právny základ spracovania</h2>
        <p>
          Spracovanie osobných údajov je založené na právnom základe
          <strong> súhlasu používateľa</strong> podľa článku 6 ods. 1 písm. a)
          GDPR. Súhlas sa udeľuje pri registrácii a môže byť kedykoľvek
          odvolaný zaslaním požiadavky na e-mail{" "}
          <a
            href="mailto:support@ludimus.sk"
            className="text-red-600 underline"
          >
            support@ludimus.sk
          </a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">5. Doba uchovávania údajov</h2>
        <p>
          Osobné údaje uchovávame po dobu aktívneho členstva používateľa v
          systéme Ludimus. Po zmazaní účtu sa všetky osobné údaje a štatistiky
          nenávratne odstránia z databázy.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">6. Prístup k údajom</h2>
        <p>
          K osobným údajom majú prístup iba oprávnené osoby – tréneri,
          administrátori a správcovia klubov v rámci ich klubu. Žiadne údaje sa
          neposkytujú tretím stranám ani mimo EÚ.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">7. Práva používateľov</h2>
        <p>Používateľ má podľa GDPR tieto práva:</p>
        <ul className="list-disc ml-6 mt-3">
          <li>právo na prístup k svojim osobným údajom,</li>
          <li>právo na opravu alebo vymazanie údajov,</li>
          <li>právo na obmedzenie spracovania,</li>
          <li>právo na prenosnosť údajov,</li>
          <li>
            právo odvolať súhlas so spracovaním zaslaním e-mailu na{" "}
            <a
              href="mailto:support@ludimus.sk"
              className="text-red-600 underline"
            >
              support@ludimus.sk
            </a>.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-red-600">8. Zabezpečenie údajov</h2>
        <p>
          Systém Ludimus používa šifrované pripojenie (HTTPS) a všetky heslá sú
          bezpečne hashované. Prístup k databáze je chránený a monitorovaný.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-red-600">9. Kontakt</h2>
        <p>
          V prípade otázok alebo požiadaviek ohľadom spracovania údajov nás môžete
          kontaktovať na:{" "}
          <a
            href="mailto:support@ludimus.sk"
            className="text-red-600 underline"
          >
            support@ludimus.sk
          </a>
        </p>
      </section>

      <p className="privacy-updated">
        Posledná aktualizácia:{" "}
        {new Date().toLocaleDateString("sk-SK")}
      </p>
    </div>
    </MainLayout>
    
  );
}
