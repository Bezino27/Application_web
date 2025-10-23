import { useEffect, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import Layout from "../components/layout";
import "./AdminOrdersPage.css";

type JerseyOrder = {
  id: number;
  club: number;
  surname: string;
  jersey_size: string;
  shorts_size: string;
  number: number;
  created_at: string;
  amount: number;
  is_paid: boolean;
  iban?: string;
};

const formatSK = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function AdminJerseyOrdersPage() {
  const [clubId] = useState<number>(1); // nastav podľa prihláseného admina
  const [orders, setOrders] = useState<JerseyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetchWithAuth(`/clubs/${clubId}/jersey-orders/`);
    if (res.ok) {
      setOrders(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

    const handleSaveAll = async () => {
    const payload = orders.map((o) => ({
        id: o.id,
        amount: o.amount,
        is_paid: Boolean(o.is_paid),   // 🔥 vždy pošli boolean
    }));

    const res = await fetchWithAuth(`/jersey-orders/bulk-update/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        alert("✅ Všetky objednávky dresov boli uložené");
        await fetchOrders();
    } else {
        const text = await res.text();
        alert("❌ Chyba pri ukladaní:\n" + text);
    }
    };

  const handleGeneratePayment = async (id: number) => {
    const res = await fetchWithAuth(`/jersey-orders/${id}/generate-payment/`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      alert(
        `Platba vygenerovaná ✅\n\nVS: ${data.vs}\nIBAN: ${data.iban}\nSuma: ${data.amount} €`
      );
    } else {
      const text = await res.text();
      alert("❌ Chyba pri generovaní platby:\n" + text);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Naozaj chceš vymazať objednávku dresu #${id}?`)) return;

    const res = await fetchWithAuth(`/jersey-orders/${id}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert(`✅ Objednávka dresu #${id} bola vymazaná`);
      await fetchOrders();
    } else {
      const text = await res.text();
      alert("❌ Nepodarilo sa vymazať objednávku:\n" + text);
    }
  };

  

  return (
    <Layout>
      <div className="page">
        <div className="row between center" style={{ marginBottom: 16 }}>
          <h2>Objednávky dresov</h2>
          <div className="row gap">
            <button onClick={fetchOrders}>Obnoviť</button>
            <button onClick={handleSaveAll}>Uložiť všetko</button>
          </div>
        </div>

        {loading ? (
          <div>Načítavam…</div>
        ) : orders.length === 0 ? (
          <div>Žiadne objednávky dresov.</div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Priezvisko</th>
                  <th>Číslo</th>
                  <th>Dres veľkosť</th>
                  <th>Kraťasy veľkosť</th>
                  <th>Dátum</th>
                  <th>IBAN</th>
                  <th>Suma (€)</th>
                  <th>Zaplatené</th>
                  <th>Akcie</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.surname}</td>
                    <td>{o.number}</td>
                    <td>{o.jersey_size}</td>
                    <td>{o.shorts_size}</td>
                    <td>{formatSK(o.created_at)}</td>
                    <td>{o.iban || "-"}</td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={o.amount ?? 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setOrders((prev) =>
                            prev.map((ord) =>
                              ord.id === o.id
                                ? { ...ord, amount: isNaN(val) ? 0 : val }
                                : ord
                            )
                          );
                        }}
                        style={{ width: 80 }}
                      />{" "}
                      €
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={o.is_paid}
                        onChange={(e) => {
                          setOrders((prev) =>
                            prev.map((ord) =>
                              ord.id === o.id
                                ? { ...ord, is_paid: e.target.checked }
                                : ord
                            )
                          );
                        }}
                      />
                      {o.is_paid ? "Áno" : "Nie"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleGeneratePayment(o.id)}
                        style={{
                          background: "#4CAF50",
                          color: "white",
                          marginRight: 5,
                        }}
                      >
                        💳 Vytvoriť platbu
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        style={{ background: "#D32F2F", color: "white" }}
                      >
                        🗑️ Vymazať
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
