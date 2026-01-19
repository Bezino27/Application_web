import { useMemo, useState } from "react";

type QuestionType = "single" | "multi";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  points: number;
  type: QuestionType;
  text: string;
  options: Option[];
  correctOptionIds: string[]; // pri single je 1 prvok
};

const QUESTIONS: Question[] = [
  // --- PAGE 1 ---
  {
    id: "q1",
    points: 1,
    type: "multi",
    text: "Aké typy reprezentácie neurčitosti poznáte?",
    options: [
      { id: "a", text: "tabuľková reprezentácia" },
      { id: "b", text: "grafická reprezentácia" },
      { id: "c", text: "numerická reprezentácia" },
      { id: "d", text: "symbolická reprezentácia" },
    ],
    correctOptionIds: ["c", "d"],
  },
  {
    id: "q2",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných možností inicializujú vysvetlenia generované z behu programu?",
    options: [
      { id: "a", text: "WHY" },
      { id: "b", text: "HOW" },
      { id: "c", text: "WHAT-IF" },
      { id: "d", text: "GOAL" },
      { id: "e", text: "TRACE" },
    ],
    correctOptionIds: ["a", "b", "c", "d", "e"],
  },
  {
    id: "q3",
    points: 1,
    type: "single",
    text: "Aké znalosti nepoužíva pri riešení problémov znalostný systém, hoci ľudský riešiteľ ich používa?",
    options: [
      { id: "a", text: "konkrétne znalosti" },
      { id: "b", text: "metaznalosti" },
      { id: "c", text: "predmetné znalosti" },
      { id: "d", text: "všeobecné znalosti" },
    ],
    correctOptionIds: ["d"],
  },
  {
    id: "q4",
    points: 1,
    type: "single",
    text: "Verifikácia znalostného systému je:",
    options: [
      { id: "a", text: "testovanie formálnej správnosti (konzistentnosti a úplnosti)" },
      { id: "b", text: "testovanie významovej správnosti (prijateľnosti výsledkov)" },
      { id: "c", text: "testovanie hypotéz" },
    ],
    correctOptionIds: ["a"],
  },
  {
    id: "q5",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných možností predstavujú známe typy metaznalostí?",
    options: [
      { id: "a", text: "ozmyslenie pravidiel" },
      { id: "b", text: "detekcia chýb v pravidlách" },
      { id: "c", text: "zdôvodnenie architektúry systému" },
      { id: "d", text: "modelovanie možností systému" },
    ],
    correctOptionIds: ["a", "b", "c", "d"],
  },
  {
    id: "q6",
    points: 1,
    type: "multi",
    text: "Pod ladením bázy znalostí rozumieme:",
    options: [
      { id: "a", text: "dopĺňanie pravidiel" },
      { id: "b", text: "analýzu globálnych zákonitostí" },
      { id: "c", text: "ladenie náhodných súvislostí" },
      { id: "d", text: "modifikáciu pravidiel" },
      { id: "e", text: "redukciu bázy znalostí" },
    ],
    correctOptionIds: ["a", "d", "e"],
  },
  {
    id: "q7",
    points: 1,
    type: "single",
    text: "Cieľom objasnenia generovaného vysvetľovacím mechanizmom pre špecialistu je:",
    options: [
      { id: "a", text: "učenie" },
      { id: "b", text: "objasnenie významu získaného výsledku" },
      { id: "c", text: "lokalizácia chýb v báze znalostí" },
      { id: "d", text: "objasnenie spôsobu získania výsledku" },
    ],
    correctOptionIds: ["d"],
  },

  // --- PAGE 2 ---
  {
    id: "q8",
    points: 1,
    type: "multi",
    text: "Aké úlohy môže hrať v procese tvorby a používania človek?",
    options: [
      { id: "a", text: "tvorca nástroja" },
      { id: "b", text: "používateľ" },
      { id: "c", text: "znalostný inžinier" },
      { id: "d", text: "expert" },
    ],
    correctOptionIds: ["a", "b", "c", "d"],
  },
  {
    id: "q9",
    points: 1,
    type: "single",
    text: "Študent využíva znalostný systém preto, aby:",
    options: [
      { id: "a", text: "ho ladil a modifikoval bázu znalostí" },
      { id: "b", text: "si osvojil všetky znalosti danej domény" },
      { id: "c", text: "zvýšil kvalitu vlastného riešenia" },
      { id: "d", text: "získal riešenie daného problému" },
    ],
    correctOptionIds: ["b"],
  },
  {
    id: "q10",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných tvrdení, týkajúcich sa kombinačnej analýzy dát, sú pravdivé?",
    options: [
      {
        id: "a",
        text: "Implikácia je odvoditeľná z podkombinácií, ak platnosť danej implikácie sa významne líši od váhy zloženej z váh podkombinácií.",
      },
      {
        id: "b",
        text: "Platnosť implikácie je pomer frekvencie súčasného výskytu kombinácie a triedy ku frekvencii výskytu triedy.",
      },
      {
        id: "c",
        text: "Pravidlá, ktoré sa dajú odvodiť z iných axiomatických pravidiel, sa nezaradia do bázy znalostí.",
      },
      { id: "d", text: "Uvažujeme iba platné kombinácie založenej na fundovanej implikácii." },
    ],
    correctOptionIds: ["a", "d"],
  },
  {
    id: "q11",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných tvrdení sú pravdivé?",
    options: [
      { id: "a", text: "Produkčné pravidlá sú metaznalosti nultého stupňa." },
      { id: "b", text: "Metaznalosti o neurčitosti sú zabudované v inferenčnom mechanizme." },
      { id: "c", text: "Reprezentácia metaznalostí je zhodná s reprezentáciou znalostí, teda produkčných pravidiel." },
    ],
    correctOptionIds: ["b", "c"],
  },
  {
    id: "q12",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných funkcií a operácií predstavujú sekvenčnú kombináciu v rámci spracovania neurčitosti?",
    options: [
      { id: "a", text: "operácia inferencie" },
      { id: "b", text: "funkcia CTR" },
      { id: "c", text: "funkcia GLOB" },
      { id: "d", text: "operácia agregácie" },
    ],
    correctOptionIds: ["a", "b"],
  },
  {
    id: "q13",
    points: 1,
    type: "single",
    text: "Validácia znalostného systému je:",
    options: [
      { id: "a", text: "testovanie hypotéz" },
      { id: "b", text: "testovanie formálnej správnosti (konzistentnosti a úplnosti)" },
      { id: "c", text: "testovanie významovej správnosti (prijateľnosti výsledkov)" },
    ],
    correctOptionIds: ["c"],
  },
  {
    id: "q14",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných vlastností by ste priradili intenzionálnemu modelu spracovania neurčitosti?",
    options: [
      { id: "a", text: "rýchlosť spracovania" },
      { id: "b", text: "globálnosť" },
      { id: "c", text: "kombinačná funkcia" },
      { id: "d", text: "distribúcia neurčitosti" },
      { id: "e", text: "teoretická správnosť" },
      { id: "f", text: "princíp modularity" },
    ],
    correctOptionIds: ["b", "d", "e"],
  },

  // --- PAGE 3 ---
  {
    id: "q15",
    points: 1,
    type: "multi",
    text: "Modifikácia pravidiel sa môže realizovať:",
    options: [
      { id: "a", text: "zmenou váh jednotlivých pravidiel" },
      { id: "b", text: "zmenou počtu podmienok v pravidlách" },
      { id: "c", text: "modifikáciou hypotéz" },
    ],
    correctOptionIds: ["a", "b"],
  },
  {
    id: "q16",
    points: 1,
    type: "multi",
    text: "Inferenčná sieť obsahuje nasledovné typy uzlov:",
    options: [
      { id: "a", text: "medziľahlé" },
      { id: "b", text: "odľahlé" },
      { id: "c", text: "priľahlé" },
      { id: "d", text: "listové" },
      { id: "e", text: "koreňové" },
    ],
    correctOptionIds: ["a", "d", "e"],
  },
  {
    id: "q17",
    points: 1,
    type: "single",
    text: "Pri zjemňovaní (modifikácii a dopĺňaní) bázy znalostí sa používa výhradne:",
    options: [
      { id: "a", text: "strojové učenie" },
      { id: "b", text: "priamy prenos" },
      { id: "c", text: "klasická cesta" },
    ],
    correctOptionIds: ["c"],
  },
  {
    id: "q18",
    points: 1,
    type: "single",
    text: "Báza znalostí obsahuje vedomosti:",
    options: [
      { id: "a", text: "používateľa" },
      { id: "b", text: "experta" },
      { id: "c", text: "tvorcu nástroja" },
      { id: "d", text: "znalostného inžiniera" },
    ],
    correctOptionIds: ["b"],
  },
  {
    id: "q19",
    points: 1,
    type: "multi",
    text: "Aké bloky obsahuje základná štruktúra znalostného systému?",
    options: [
      { id: "a", text: "báza dát" },
      { id: "b", text: "metaznalosti" },
      { id: "c", text: "báza znalostí" },
      { id: "d", text: "inferenčný mechanizmus" },
    ],
    correctOptionIds: ["a", "b", "c", "d"],
  },
  {
    id: "q20",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných možností predstavujú typy atribútov dátovej časti trénovacich príkladov?",
    options: [
      { id: "a", text: "binárne" },
      { id: "b", text: "nominálne" },
      { id: "c", text: "hierarchické" },
      { id: "d", text: "ordinárne" },
      { id: "e", text: "numerické" },
    ],
    correctOptionIds: ["a", "b", "c", "d", "e"],
  },
  {
    id: "q21",
    points: 1,
    type: "single",
    text: "Ktoré typy uzlov inferenčnej siete môžu byť cieľovými?",
    options: [
      { id: "a", text: "koreňové" },
      { id: "b", text: "odľahlé" },
      { id: "c", text: "listové" },
      { id: "d", text: "medziľahlé" },
    ],
    correctOptionIds: ["a"],
  },

  // --- PAGE 4 ---
  {
    id: "q22",
    points: 1,
    type: "multi",
    text: "Pri testovaní prijatia používateľom sa používajú?",
    options: [
      { id: "a", text: "pozorovanie" },
      { id: "b", text: "interview" },
      { id: "c", text: "dotazník" },
      { id: "d", text: "nahrávka" },
      { id: "e", text: "zápis akcií systému" },
    ],
    correctOptionIds: ["a", "b", "c"],
  },
  {
    id: "q23",
    points: 1,
    type: "multi",
    text: "Každý konštrukt repertoárovej siete je reprezentovaný:",
    options: [
      { id: "a", text: "maximálnym pólom" },
      { id: "b", text: "pravým pólom" },
      { id: "c", text: "ľavým pólom" },
      { id: "d", text: "minimálnym pólom" },
    ],
    correctOptionIds: ["b", "c"],
  },
  {
    id: "q24",
    points: 1,
    type: "single",
    text: "Cieľom objasnenia generovaného vysvetľovacím mechanizmom pre laika je:",
    options: [
      { id: "a", text: "objasnenie významu získaného výsledku" },
      { id: "b", text: "lokalizácia chýb v báze znalostí" },
      { id: "c", text: "objasnenie spôsobu získania výsledku" },
      { id: "d", text: "učenie" },
    ],
    correctOptionIds: ["a"],
  },
  {
    id: "q25",
    points: 1,
    type: "multi",
    text: "Vymenujte kombinačné funkcie extenzionálneho modelu spracovania neurčitosti:",
    options: [
      { id: "a", text: "INFER" },
      { id: "b", text: "CONJ" },
      { id: "c", text: "GLOB" },
      { id: "d", text: "AGREG" },
      { id: "e", text: "CTR" },
      { id: "f", text: "DISJ" },
      { id: "g", text: "NEG" },
    ],
    // v PDF sú označené: CONJ, GLOB, CTR, DISJ, NEG (INFER a AGREG nie)
    correctOptionIds: ["b", "c", "e", "f", "g"],
  },
  {
    id: "q26",
    points: 1,
    type: "single",
    text: "Pri získavaní znalostí priamym prenosom vytvára bázu znalostí:",
    options: [
      { id: "a", text: "iba expert" },
      { id: "b", text: "znalostný inžinier spolu s expertom" },
      { id: "c", text: "iba znalostný inžinier" },
    ],
    correctOptionIds: ["a"],
  },
  {
    id: "q27",
    points: 1,
    type: "single",
    text: "Voľba testovacieho atribútu pri generovaní rozhodovacieho stromu sa uskutočňuje:",
    options: [
      { id: "a", text: "systematicky" },
      { id: "b", text: "náhodne" },
      { id: "c", text: "pomocou podobnosti" },
      { id: "d", text: "pomocou informačného zisku" },
      { id: "e", text: "pomocou entrópie" },
    ],
    correctOptionIds: ["e"],
  },
  {
    id: "q28",
    points: 1,
    type: "multi",
    text: "Ktoré z nasledovných tvrdení, týkajúcich sa kombinačnej analýzy dát, sú pravdivé?",
    options: [
      { id: "a", text: "Pravidlá, ktoré sa dajú odvodiť z iných axiomatických pravidiel, sa zaradia do bázy znalostí." },
      { id: "b", text: "Platná je implikácia vyskytujúca sa v dostatočnom počte trénovacích príkladov." },
      { id: "c", text: "Uvažujeme iba platné kombinácie založené na fundovanej implikácii." },
      {
        id: "d",
        text: "Implikácia je odvoditeľná z podkombinácií, ak platnosť danej implikácie sa významne nelíši od váhy zloženej z váh podkombinácií.",
      },
    ],
    correctOptionIds: ["b", "c", "d"],
  },

  // --- PAGE 5 ---
  {
    id: "q29",
    points: 1,
    type: "multi",
    text: "Ako je možné indikovať ohrozenie bezpečnej činnosti znalostného systému?",
    options: [
      { id: "a", text: "pomocou numerických informácií" },
      { id: "b", text: "spadnutím systému" },
      { id: "c", text: "pomocou symbolických informácií" },
      { id: "d", text: "pomocou nesprávnych záverov" },
    ],
    correctOptionIds: ["a", "c"],
  },
  {
    id: "q30",
    points: 1,
    type: "multi",
    text: "Čo obsahuje inferenčný mechanizmus plánovacieho znalostného systému?",
    options: [
      { id: "a", text: "test zhody s dátami" },
      { id: "b", text: "generátor riešení" },
      { id: "c", text: "zásobník riešení" },
      { id: "d", text: "obmedzovač generovaných riešení" },
    ],
    correctOptionIds: ["a", "b", "d"],
  },
  {
    id: "q31",
    points: 1,
    type: "multi",
    text: "Numerická reprezentácia neurčitosti môže byť:",
    options: [
      { id: "a", text: "relatívna" },
      { id: "b", text: "jednohodnotová" },
      { id: "c", text: "dvojhodnotová" },
      { id: "d", text: "absolútna" },
    ],
    correctOptionIds: ["a", "b", "c", "d"],
  },
  {
    id: "q32",
    points: 1,
    type: "multi",
    text: "Repertoárová sieť je:",
    options: [
      { id: "a", text: "založená na numerickom hodnotení miery príslušnosti pojmu ku konštruktu" },
      { id: "b", text: "určená na generovanie pravidiel v tvare: ak konštrukt, potom pojem" },
      { id: "c", text: "navrhnutá psychológom Georgom Kellym" },
      { id: "d", text: "určená na tvorbu iba dvojstupňovej bázy znalostí" },
      { id: "e", text: "založená na teórii osobných konštruktov" },
    ],
    // z PDF sú označené: b, c
    correctOptionIds: ["b", "c"],
  },
  {
    id: "q33",
    points: 1,
    type: "multi",
    text: "Riadenie typu tabuľa spočíva v:",
    options: [
      { id: "a", text: "rozdelení rozsiahlej BZ na niekoľko menších báz" },
      { id: "b", text: "vo vyhľadávaní nových zdrojov znalostí" },
      { id: "c", text: "v zápise medzivýsledkov pri prechode na nový zdroj na pomyselnú tabuľu" },
    ],
    correctOptionIds: ["a", "c"],
  },
  {
    id: "q34",
    points: 1,
    type: "multi",
    text: "Analýza repertoárovej siete pozostáva z:",
    options: [
      { id: "a", text: "analýzy podobnosti konštruktov" },
      { id: "b", text: "analýzy pravidiel" },
      { id: "c", text: "analýzy neurčitosti" },
      { id: "d", text: "analýzy podobnosti pojmov" },
    ],
    correctOptionIds: ["a", "d"],
  },
  {
    id: "q35",
    points: 1,
    type: "single",
    text: "Špecialista používa znalostný systém preto, aby:",
    options: [
      { id: "a", text: "ho ladil a modifikoval bázu znalostí" },
      { id: "b", text: "si osvojil všetky znalosti danej domény" },
      { id: "c", text: "zvýšil kvalitu vlastného riešenia" },
      { id: "d", text: "získal riešenie daného problému" },
    ],
    correctOptionIds: ["a"],
  },

  // --- PAGE 6 ---
  {
    id: "q36",
    points: 1,
    type: "multi",
    text: "Pri neúplnom priamom chode sa:",
    options: [
      { id: "a", text: "uzly na ceste neexpandujú" },
      { id: "b", text: "uzly na ceste expandujú" },
      { id: "c", text: "postupuje od listových uzlov ku koreňovým" },
      { id: "d", text: "postupuje od koreňových uzlov k listovým" },
    ],
    correctOptionIds: ["a", "c"],
  },
  {
    id: "q37",
    points: 1,
    type: "multi",
    text: "Aká môže byť reprezentácia výstupu algoritmu strojového učenia?",
    options: [
      { id: "a", text: "klasifikačné pravidlo" },
      { id: "b", text: "tabuľka kritérií" },
      { id: "c", text: "rozhodovací strom" },
      { id: "d", text: "hodnoty atribútov" },
      { id: "e", text: "trénovacia množina" },
      { id: "f", text: "rozhodovací zoznam" },
    ],
    correctOptionIds: ["c", "f"],
  },
  {
    id: "q38",
    points: 1,
    type: "single",
    text: "Báza znalostí obsahuje:",
    options: [
      { id: "a", text: "konkrétne znalosti" },
      { id: "b", text: "metaznalosti" },
      { id: "c", text: "všeobecné znalosti" },
      { id: "d", text: "predmetné (doménové) znalosti" },
    ],
    correctOptionIds: ["d"],
  },
  {
    id: "q39",
    points: 1,
    type: "single",
    text: "Ktoré tvrdenie charakterizuje spätné reťazenie pravidiel v inferenčnej sieti?",
    options: [
      {
        id: "a",
        text: "Dokazujú sa všetky hypotézy (závery), ktoré sa dajú odvodiť z platných predpokladov v aktuálnom modeli.",
      },
      {
        id: "b",
        text: "Overujú sa iba tie predpoklady, ktoré je nutné dokázať pre overenie platnosti jednej konkrétnej cieľovej hypotézy.",
      },
    ],
    correctOptionIds: ["b"],
  },
  {
    id: "q40",
    points: 1,
    type: "single",
    text: "Pri získavaní znalostí klasickou cestou vytvára bázu znalostí:",
    options: [
      { id: "a", text: "iba znalostný inžinier" },
      { id: "b", text: "iba expert" },
      { id: "c", text: "znalostný inžinier spolu s expertom" },
    ],
    correctOptionIds: ["c"],
  },
];

function arraysEqualAsSets(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size !== sb.size) return false;
  for (const x of sa) if (!sb.has(x)) return false;
  return true;
}

function normalizeSelected(selected: string[]) {
  return [...new Set(selected)].sort();
}

export default function TestZS() {
  const totalPoints = useMemo(() => QUESTIONS.reduce((s, q) => s + q.points, 0), []);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return 0;
    let s = 0;
    for (const q of QUESTIONS) {
      const sel = normalizeSelected(answers[q.id] ?? []);
      const cor = normalizeSelected(q.correctOptionIds);
      if (arraysEqualAsSets(sel, cor)) s += q.points;
    }
    return s;
  }, [answers, submitted]);

  const answeredCount = useMemo(() => {
    return QUESTIONS.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;
  }, [answers]);

  const handleToggleMulti = (qid: string, oid: string) => {
    setAnswers((prev) => {
      const current = new Set(prev[qid] ?? []);
      if (current.has(oid)) current.delete(oid);
      else current.add(oid);
      return { ...prev, [qid]: [...current] };
    });
  };

  const handleSetSingle = (qid: string, oid: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: [oid] }));
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 18, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ margin: "6px 0 10px" }}>ZS – Samotest</h1>
      <div style={{ opacity: 0.85, marginBottom: 16 }}>
        Vyplnené: <b>{answeredCount}/{QUESTIONS.length}</b> • Po vyhodnotení uvidíš správne odpovede aj body.
      </div>

      {/* Header result box */}
      {submitted && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 14,
            marginBottom: 18,
            background: "#fafafa",
          }}
        >
          <div style={{ fontSize: 18 }}>
            Výsledok: <b>{score}</b> / <b>{totalPoints}</b> bodov
          </div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Správne otázky:{" "}
            <b>
              {QUESTIONS.filter((q) =>
                arraysEqualAsSets(normalizeSelected(answers[q.id] ?? []), normalizeSelected(q.correctOptionIds))
              ).length}
            </b>{" "}
            / <b>{QUESTIONS.length}</b>
          </div>
        </div>
      )}

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {QUESTIONS.map((q, index) => {
          const selected = new Set(answers[q.id] ?? []);
          const isCorrect =
            submitted &&
            arraysEqualAsSets(normalizeSelected([...selected]), normalizeSelected(q.correctOptionIds));

          return (
            <div
              key={q.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 14,
                boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {/* Left meta */}
                <div style={{ minWidth: 92 }}>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>Points:</div>
                  <div style={{ fontSize: 14 }}>
                    {submitted ? (
                      <b>{isCorrect ? q.points : 0}/{q.points}</b>
                    ) : (
                      <b>0/{q.points}</b>
                    )}
                  </div>
                </div>

                {/* Main */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, marginBottom: 10 }}>
                    <b>{index + 1}.</b> {q.text}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map((opt) => {
                      const checked = selected.has(opt.id);
                      const isOptCorrect = q.correctOptionIds.includes(opt.id);

                      const highlight =
                        submitted && (isOptCorrect || checked)
                          ? isOptCorrect && checked
                            ? "#e9f7ef" // correct selected
                            : isOptCorrect && !checked
                              ? "#fff7e6" // missed correct
                              : !isOptCorrect && checked
                                ? "#fdecea" // wrong selected
                                : "transparent"
                          : "transparent";

                      const border =
                        submitted && (isOptCorrect || checked)
                          ? isOptCorrect && checked
                            ? "1px solid #b7e4c7"
                            : isOptCorrect && !checked
                              ? "1px solid #ffd8a8"
                              : !isOptCorrect && checked
                                ? "1px solid #f5c2c7"
                                : "1px solid #e5e5e5"
                          : "1px solid #e5e5e5";

                      return (
                        <label
                          key={opt.id}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            padding: "10px 10px",
                            borderRadius: 12,
                            border,
                            background: highlight,
                            cursor: submitted ? "default" : "pointer",
                            userSelect: "none",
                          }}
                        >
                          {q.type === "multi" ? (
                            <input
                              type="checkbox"
                              disabled={submitted}
                              checked={checked}
                              onChange={() => handleToggleMulti(q.id, opt.id)}
                            />
                          ) : (
                            <input
                              type="radio"
                              name={q.id}
                              disabled={submitted}
                              checked={checked}
                              onChange={() => handleSetSingle(q.id, opt.id)}
                            />
                          )}
                          <span style={{ flex: 1 }}>{opt.text}</span>

                          {submitted && isOptCorrect && (
                            <span style={{ fontSize: 12, opacity: 0.9, fontWeight: 600 }}>✓ správne</span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div style={{ marginTop: 10, fontSize: 13 }}>
                      {isCorrect ? (
                        <span style={{ color: "#137333", fontWeight: 700 }}>Správne ✅</span>
                      ) : (
                        <span style={{ color: "#b3261e", fontWeight: 700 }}>
                          Nesprávne ❌{" "}
                          <span style={{ fontWeight: 500, color: "#444" }}>
                            (správne: {q.correctOptionIds.map((id) => q.options.find((o) => o.id === id)?.text).filter(Boolean).join(", ")})
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 18, position: "sticky", bottom: 12 }}>
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Vyhodnotiť test
          </button>
        ) : (
          <button
            onClick={reset}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#fff",
              color: "#111",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Skúsiť znova
          </button>
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #e5e5e5",
            background: "#fff",
            color: "#111",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Hore
        </button>
      </div>
    </div>
  );
}
