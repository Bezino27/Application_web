import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout";
import { fetchWithAuth } from "../fetchWithAuth";
import "./PaymentsAdminPage.css";
import { useNavigate } from "react-router-dom";

type Payment = {
  id: number;
  amount: string;
  due_date: string;
  variable_symbol: string;
  is_paid: boolean;
  description: string;
  user: {
    id: number;
    name: string;
    username: string;
  };
};

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      const res = await fetchWithAuth(`/admin-member-payments/`);
      const data = await res.json();
      setPayments(data);
    } catch (e) {
      alert("❌ Nepodarilo sa načítať platby.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const togglePaymentStatus = async (paymentId: number, currentStatus: boolean) => {
    try {
      const res = await fetchWithAuth(`/admin-member-payments/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paymentId, is_paid: !currentStatus }),
      });

      if (!res.ok) throw new Error();

      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, is_paid: !currentStatus } : p
        )
      );
    } catch {
      alert("❌ Nepodarilo sa zmeniť stav platby.");
    }
  };

  const toggleBulkStatus = async (newStatus: boolean) => {
    try {
      const res = await fetchWithAuth(`/admin-member-payments/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selectedIds.map((id) => ({ id, is_paid: newStatus }))
        ),
      });

      if (!res.ok) throw new Error();

      setPayments((prev) =>
        prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, is_paid: newStatus } : p
        )
      );
      setSelectedIds([]);
    } catch {
      alert("❌ Nepodarilo sa zmeniť stav vybraných platieb.");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

    const collator = useMemo(
    () => new Intl.Collator("sk", { sensitivity: "base" }),
    []
  );

  // pomocná funkcia: zobrazí priezvisko prvé
  const surnameFirst = (full: string) => {
    const parts = (full || "").trim().split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? `${parts[parts.length - 1]} ${parts.slice(0, -1).join(" ")}`
      : full || "—";
  };

  const filtered = useMemo(() => {
    let result = [...payments];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const name = (p.user.name || "").toLowerCase();
        const username = (p.user.username || "").toLowerCase();
        const vs = (p.variable_symbol || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return (
          name.includes(q) ||
          username.includes(q) ||
          vs.includes(q) ||
          desc.includes(q)
        );
      });
    }

    // zoradenie podľa priezviska → mena
    result.sort((a, b) => {
      const tokens = (full: string) => {
        const parts = (full || "").trim().split(/\s+/).filter(Boolean);
        const last = parts.length ? parts[parts.length - 1] : "";
        const first = parts.slice(0, -1).join(" ");
        return { first, last };
      };

      const A = tokens(a.user.name || a.user.username);
      const B = tokens(b.user.name || b.user.username);

      const byLast = collator.compare(A.last, B.last);
      if (byLast !== 0) return byLast;
      return collator.compare(A.first, B.first);
    });

    return result;
  }, [payments, search, collator]);


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
      <div className="actions">
        <input
          type="text"
          placeholder="🔍 Hľadať meno, VS alebo popis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {selectedIds.length > 0 && (
          <div className="bulk-actions">
            <button
              className="bulk-btn green"
              onClick={() => toggleBulkStatus(true)}
            >
              ✅ Označiť ako uhradené ({selectedIds.length})
            </button>
            <button
              className="bulk-btn red"
              onClick={() => toggleBulkStatus(false)}
            >
              ❌ Označiť ako neuhradené ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p>Načítavam...</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th></th>
              <th>Meno</th>
              <th>VS</th>
              <th>Popis</th>
              <th>Suma</th>
              <th>Splatnosť</th>
              <th>Stav</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td>{surnameFirst(p.user.name || p.user.username)}</td>
                <td>{p.variable_symbol}</td>
                <td>{p.description}</td>
                <td>{p.amount} €</td>
                <td>
                  {new Date(p.due_date).toLocaleDateString("sk-SK")}
                </td>
                <td>
                  <button
                    className={`status-btn ${
                      p.is_paid ? "green" : "red"
                    }`}
                    onClick={() => togglePaymentStatus(p.id, p.is_paid)}
                  >
                    {p.is_paid ? "✅ Uhradené" : "❌ Neuhradené"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
