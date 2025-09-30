import { useState } from "react";
import { BASE_URL } from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Zadaj email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/password_reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.multiple) {
        // viac účtov
        setAccounts(data.accounts);
      } else if (res.ok) {
        alert("✅ Over si email – link na reset hesla bol odoslaný.");
      } else {
        alert(data.detail || "Nepodarilo sa odoslať požiadavku.");
      }
    } catch (err) {
      console.error(err);
      alert("Chyba pri spájaní so serverom");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (userId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/password_reset/generate_for_user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Over si email – link pre vybraný účet bol odoslaný.");
      } else {
        alert(data.detail || "Nepodarilo sa vygenerovať reset link.");
      }
    } catch (err) {
      console.error(err);
      alert("Chyba pri spájaní so serverom");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h2>Obnova hesla</h2>
      <input
        type="email"
        placeholder="Zadaj email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: 10,
          background: "#D32F2F",
          color: "#fff",
          border: "none",
          width: "100%",
          marginBottom: 20,
        }}
      >
        {loading ? "Odosielam..." : "Odoslať"}
      </button>

      {accounts.length > 0 && (
        <div>
          <p>Nájdené viaceré účty, vyber prosím konkrétny:</p>
          {accounts.map((acc) => (
            <div key={acc.id} style={{ marginBottom: 10 }}>
              <button
                onClick={() => handleSelectAccount(acc.id)}
                style={{
                  padding: 8,
                  background: "#555",
                  color: "#fff",
                  border: "none",
                  width: "100%",
                }}
              >
                {acc.full_name || acc.username}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
