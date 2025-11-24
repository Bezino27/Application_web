// test.tsx
import React, { useState } from "react";

// ---------- HELP FUNKCIA NA SHUFFLE ----------
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- TYPUJEME ----------
type Statement = {
  id: string;
  label: string;
  text: string;
  correct: boolean;
};

type Question = {
  id: string;
  title: string;
  statements: Statement[];
};

// ---------- DATA – všetko zachované presne ako si poslal ----------
const BASE_QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "1. Určte ktoré vyjadrenia sú pravdivé",
    statements: [
      {
        id: "1a",
        label: "a.",
        text: "Stratifikovaná krížová validácia pri svojom použití stratí informáciu o distribúcii príkladov jednotlivých tried vo svojich trénovacích a testovacích podmnožinách",
        correct: false,
      },
      {
        id: "1b",
        label: "b.",
        text: "Pre úspešnú klasifikáciu musí byť počet False Positive príkladov vyšší ako počet False Negative prípadov",
        correct: false,
      },
      {
        id: "1c",
        label: "c.",
        text: "Ak má cieľový numerický atribút zápornú hodnotu, nemôžeme pre predikciu jeho hodnoty použiť viacnásobnú regresiu",
        correct: false,
      },
      {
        id: "1d",
        label: "d.",
        text: "Pri Naive Bayes klasifikácii zaradíme príklad vždy do triedy s najvyššou podmienenou pravdepodobnosťou danej triedy vzhľadom k danému príkladu",
        correct: true,
      },
      {
        id: "1e",
        label: "e.",
        text: "Konvolučné neurónové siete dokážu spracovať aj jednorozmerné vstupné dáta, nielen obrázky",
        correct: true,
      },
    ],
  },

  /* 
     Tu vieš doplniť otázku č.2 ak mi ju pošleš 
  */

  {
    id: "q3",
    title: "3. Určite ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "3a", label: "a.", text: "Algoritmus Apriori pre získavanie asociačných pravidiel vyhľadáva frekventované množiny spoločne sa vyskytujúcich hodnôt atribútov", correct: true },
      { id: "3b", label: "b.", text: "Vplyv falošne negatívnych príkladov na kvalitu klasifikácie je možné sledovať aj pomocou metriky návratnosť", correct: true },
      { id: "3c", label: "c.", text: "Nahradenie hodnôt atribútu čas nákupu z mesiaca na rok sa nazýva proces špecializácie", correct: false },
      { id: "3d", label: "d.", text: "Pre-pruning je technika zlepšenia klasifikácie rozhodovacieho stromu zastavujúca ďalšie vetvenie stromu, ak by podľa zvolenej štatistiky nebol dosiahnutý zvolený prah", correct: true },
      { id: "3e", label: "e.", text: "Pri hodnotení klasifikácie AUC (Area Under Curve) metrikou uprednostňujeme klasifikátory s hodnotou čo najbližšie k hodnote 0.9", correct: true },
    ],
  },

  {
    id: "q4",
    title: "4. Určite ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "4a", label: "a.", text: "Pri učení neurónových sietí, regularizácia typu Dropout penalizuje váhy v chybovej funkcii", correct: false },
      { id: "4b", label: "b.", text: "V spracovaní obrazu pomocou neurónových sietí, príznakové mapy môžu byť analyzované na identifikáciu oblastí vstupu, ktoré najviac ovplyvnili rozhodovanie modelu", correct: true },
      { id: "4c", label: "c.", text: "Medzi metódy, ktoré pomáhajú pri zamedzení preučenia radíme nasledujúce postupy: regularizácia modelu, včasné zastavenie, kombinácia modelov, augmentácia dát", correct: true },
      { id: "4d", label: "d.", text: "Vplyv falošne negatívnych príkladov na kvalitu klasifikácie je možné sledovať aj pomocou metriky presnosť", correct: false },
      { id: "4e", label: "e.", text: "Pri regresných úlohách sa metrika MSE (Mean Squared Error) zameriava na odhad variancie rozdielov medzi skutočnými a predikovanými hodnotami", correct: false },
    ],
  },

  {
    id: "q5",
    title: "5. Určite ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "5a", label: "a.", text: "ROC krivka umožňuje porovnať klasifikátory sledovaním závislosti medzi falošne negatívnymi a skutočne pozitívnymi príkladmi", correct: false },
      { id: "5b", label: "b.", text: "Makrospriemerovanie je výhodnejšie pre triedy s nízkym počtom príkladov", correct: true },
      { id: "5c", label: "c.", text: "Post-prunning je metóda orezania rozhodovacieho stromu, ktorá zamedzuje ďalšiemu vetveniu stromu počas učenia", correct: false },
      { id: "5d", label: "d.", text: "Jednou z metód výberu testovacieho atribútu v rozhodovacom strome je sledovanie rozdielu medzi aktuálnou entropiou daného uzla a entropiou po vetvení daným atribútom", correct: true },
      { id: "5e", label: "e.", text: "Pri klasifikácii pomocou kMeans je dobré zvoliť nepárne k pre binárnu klasifikáciu", correct: false },
    ],
  },

  {
    id: "q6",
    title: "6. Určte ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "6a", label: "a.", text: "Pri hodnotení klasifikácie ALC (Area Under Curve) metrikou uprednostňujeme klasifikátory s hodnotou čo najviac prevyšujúce 0.5", correct: true },
      { id: "6b", label: "b.", text: "Odhad zovšeobecnenej chyby predikcie dostaneme z chyby aproximácie odpočítaním variančnej odchýlky testovacích prípadov", correct: false },
      { id: "6c", label: "c.", text: "Majme nasledujúce asociačné pravidlo: atribúty ľavej strany sa vyskytujú 10 krát spoločne v celej množine dát a všetky atribúty v rámci celého pravidla sa spoločne vyskytujú 4 krát v celej množine dát, potom spoľahlivosť takého pravidla je 40%", correct: true },
      { id: "6d", label: "d.", text: "V neurónových sieťach, výstupná vrstva pre viac triednu klasifikáciu do N tried obsahuje N neurónov so sigmoidalnou aktivačnou funkciou", correct: false },
      { id: "6e", label: "e.", text: "V konvolučných neurónových sieťach slúžia Pooling vrstvy na agregáciu hodnôt kovolučných filtrov, čím sa zvýši rozlíšenie obrázku v ďalšej vrstve", correct: false },
    ],
  },

  {
    id: "q7",
    title: "7. Určte ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "7a", label: "a.", text: "Ak je cieľový atribút numerický, je možné pre jeho predikciu použiť metódu k najbližších susedov", correct: true },
      { id: "7b", label: "b.", text: "V prípade použitia regresie na klasifikačnú úlohu musíme použiť aproximáciu viacnásobnej regresie pomocou logaritmu", correct: false },
      { id: "7c", label: "c.", text: "Algoritmus k-Medoids nemá ako centroidy stredy vypočítané cez medián, ale stredom je vždy jeden z príkladov zhluku", correct: true },
      { id: "7d", label: "d.", text: "Validačná množina je časť trénovacej množiny vďaka ktorej vieme určiť, či sa už náš model nepreučil", correct: true },
      { id: "7e", label: "e.", text: "Ak chceme určiť koeficienty pri viacnásobnej regresii, používa sa na to metóda najmenších štvorcov", correct: true },
    ],
  },

  {
    id: "q8",
    title: "8. Určite ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "8a", label: "a.", text: "Úprava rôznych tvarov zápisu pohlavia osoby pri spojení dát z rôznych databáz na jeden spoločný tvar patrí v rámci predspracovania do časti Čistenia dát", correct: true },
      { id: "8b", label: "b.", text: "V rámci čistenia dát je často dôležité upraviť hodnoty numerického atribútu pomocou štandardizácie", correct: true },
      { id: "8c", label: "c.", text: "Zhlukovanie je možné použiť ako redukčnú metódu pre úpravu atribútu z numerického na kategoriálny", correct: false },
      { id: "8d", label: "d.", text: "Metóda k-NN umožňuje zhlukovať dáta obsahujúce kategoriálne aj numerické typy atribútov", correct: false },
      { id: "8e", label: "e.", text: "Nahradenie hodnôt numerického atribútu hodnotami ich modelu na báze lineárnej regresie je príklad parametrickej redukcie dát", correct: true },
    ],
  },

  {
    id: "q9",
    title: "9. Určite ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "9a", label: "a.", text: "Cieľom zhlukovania je získať zhluky, ktoré sú vnútorne konzistentné a od seba vzájomne dobre odlíšené", correct: true },
      { id: "9b", label: "b.", text: "Proces premeny ordinálneho kategorálneho atribútu na intervalový kvantitatívny atribút sa nazýva diskretizácia", correct: false },
      { id: "9c", label: "c.", text: "Algoritmus k-Means dokáže lepšie riešiť problém tzv. outliers (výrazne vzdialených príkladov od ostatných) ako k-Medoids", correct: false },
      { id: "9d", label: "d.", text: "Lineárna regresia sa dá použiť v procese predspracovania na vyhladzovanie hodnôt nameraných časových radov", correct: true },
      { id: "9e", label: "e.", text: "V neurónových sieťach, aktivačná funkcia typu ReLU vracia pre záporné vstupy hodnotu nula", correct: true },
    ],
  },

  {
    id: "q10",
    title: "10. Určte ktoré vyjadrenia sú pravdivé",
    statements: [
      { id: "10a", label: "a.", text: "Čistota zhlukov je externé kritérium vyhodnotenia zhlukovania založené na požiadavke mať silné majoritné zastúpenie jednej triedy objektov v zhluku", correct: true },
      { id: "10b", label: "b.", text: "Čím podobnejšie sú si príklady v uzle rozhodovacieho stromu, tým nižšia je jeho entropia", correct: true },
      { id: "10c", label: "c.", text: "Ak je chi-kvadrát pre dvojicu kategoriálnych atribútov v absolútnej hodnote väčší ako 0.8, hovoríme o ich silnej korelácii", correct: false },
      { id: "10d", label: "d.", text: "Transformácia atribútu odpočítaním strednej hodnoty a predelením maximálnou hodnoty sa nazýva štandardizácia", correct: false },
      { id: "10e", label: "e.", text: "Použitie malého k pri metóde k najbližších susedov znižuje vplyv šumu v dátach", correct: false },
    ],
  },
];

// ---------- UI ŠTÝLY ----------
const containerStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
  fontFamily: "system-ui",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  border: "1px solid #ddd",
};

const statementStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #eee",
  marginBottom: 8,
};

// ---------- HLAVNÁ STRÁNKA ----------
export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>(
    shuffleArray(
      BASE_QUESTIONS.map((q) => ({
        ...q,
        statements: shuffleArray(q.statements),
      }))
    )
  );

  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [totalScore, setTotalScore] = useState<number | null>(null);

  const toggle = (id: string) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const evaluate = () => {
    const newResults: Record<string, boolean> = {};
    let total = 0;

    for (const q of questions) {
      const correctCount = q.statements.filter((s) => s.correct).length;
      const pointValue = 1 / correctCount;

      let score = 0;

      q.statements.forEach((s) => {
        const user = answers[s.id] ?? false;
        const ok = user === s.correct;
        newResults[s.id] = ok;

        if (ok) score += pointValue; // správne
        else score -= pointValue; // nesprávne
      });

      total += score;
    }

    setResults(newResults);
    setTotalScore(total);
  };

  const regenerate = () => {
    setQuestions(
      shuffleArray(
        BASE_QUESTIONS.map((q) => ({
          ...q,
          statements: shuffleArray(q.statements),
        }))
      )
    );
    setAnswers({});
    setResults({});
    setTotalScore(null);
  };

  return (
    <div style={containerStyle}>
      <h1>KDD/DM – Testovanie</h1>
      <p>Zaškrtni len tvrdenia, ktoré sú podľa teba pravdivé.</p>

      <button
        onClick={evaluate}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          background: "#D32F2F",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Vyhodnotiť test
      </button>

      <button
        onClick={regenerate}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          background: "#f4f4f4",
          marginLeft: 12,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        🔁 Vygenerovať nové poradie
      </button>

      {totalScore !== null && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#f7f7f7",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        >
          <h2>
            Výsledok: {totalScore.toFixed(2)} / {questions.length}
          </h2>
          <p>
            ({((totalScore / questions.length) * 100).toFixed(1)} %)
          </p>
        </div>
      )}

      {questions.map((q) => (
        <div key={q.id} style={cardStyle}>
          <h2>{q.title}</h2>

          {q.statements.map((s) => {
            const userChecked = answers[s.id] ?? false;
            const correct = results[s.id];

            let bg = "#fafafa";
            if (results[s.id] !== undefined)
              bg = correct ? "#0ce21dff" : "#e60325b8";

            return (
              <div key={s.id} style={{ ...statementStyle, background: bg }}>
                <label style={{ display: "flex", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={userChecked}
                    onChange={() => toggle(s.id)}
                  />
                  <b>{s.label}</b> {s.text}
                </label>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
