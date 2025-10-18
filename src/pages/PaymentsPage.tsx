// src/pages/PaymentsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import Layout from "../components/layout";
import "./PaymentsPage.css";
import { useNavigate } from "react-router-dom";

type Member = {
  id: number;
  name: string;        // "Meno Priezvisko"
  birth_date: string;
  number: string;
  all_payments_paid: boolean;
};

type SortKey = "name" | "birth_date" | "number" | "all_payments_paid";
type SortDirection = "asc" | "desc";

export default function PaymentsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetchWithAuth("/admin-member-payments-summary/");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      } else {
        console.error("Nepodarilo sa načítať členov."); 
      }
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const collator = useMemo(
    () => new Intl.Collator("sk", { sensitivity: "base" }),
    []
  );

 const surnameFirst = (full: string) => {
    const parts = (full || "").trim().split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? `${parts[parts.length - 1]} ${parts.slice(0, -1).join(" ")}`
      : full || "—";
  };

  const filtered = useMemo(() => {
    let result = [...members];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.number.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case "birth_date": {
          const aDate = a.birth_date ? new Date(a.birth_date).getTime() : 0;
          const bDate = b.birth_date ? new Date(b.birth_date).getTime() : 0;
          return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
        }
        case "all_payments_paid": {
          const diff = Number(a.all_payments_paid) - Number(b.all_payments_paid);
          return sortDirection === "asc" ? diff : -diff;
        }
        case "number":
          return sortDirection === "asc"
            ? collator.compare(a.number, b.number)
            : collator.compare(b.number, a.number);
        case "name":
        default: {
          const tokens = (full: string) => {
            const parts = (full || "").trim().split(/\s+/).filter(Boolean);
            const last = parts.length ? parts[parts.length - 1] : "";
            const first = parts.slice(0, -1).join(" ");
            return { first, last };
          };

          const A = tokens(a.name);
          const B = tokens(b.name);

          const byLast = collator.compare(A.last, B.last);
          if (byLast !== 0)
            return sortDirection === "asc" ? byLast : -byLast;
          const byFirst = collator.compare(A.first, B.first);
          return sortDirection === "asc" ? byFirst : -byFirst;
        }
      }
    });
    return result;
  }, [members, search, sortKey, sortDirection, collator]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey)
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const formatBirth = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  return (
    <Layout>
            {/* Podnavigácia */}
            <div className="subnav">
                <button onClick={() => navigate("/PaymentsPage")}>
                    Zoznam členov
                </button>
                <button onClick={() => navigate("/UploadStatementPage")}>
                     📂 Nahrať výpis z účtu
                </button>
                <button onClick={() => navigate("/PaymentsAdminPage")}>
                    ✅ Kontrola platieb
                </button>
                <button onClick={() => navigate("/admin/payments/create")}>
                    ➕ Vytvoriť platbu
                </button>
            </div>

      {/* Vyhľadávanie */}
      <input
        type="text"
        placeholder="🔍 Hľadať meno alebo číslo"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Načítavam...</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("number")}>#</th>
              <th onClick={() => handleSort("name")}>Meno</th>
              <th onClick={() => handleSort("birth_date")}>Dátum narodenia</th>
              <th onClick={() => handleSort("all_payments_paid")}>Platby</th>
            </tr>
          </thead>
            <tbody>
            {filtered.map((m) => (
                <tr key={m.id}>
                <td>{m.number}</td>
                <td>{surnameFirst(m.name)}</td>   {/* tu sa zobrazuje Priezvisko Meno */}
                <td>{formatBirth(m.birth_date)}</td>
                <td>{m.all_payments_paid ? "✅" : "❌"}</td>
                </tr>
            ))}
            </tbody>
        </table>
      )}
    </Layout>
  );
}
