import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api"; // uprav podľa cesty v tvojom webe

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      alert("Vyplň všetky polia");
      return;
    }
    if (password !== confirmPassword) {
      alert("Heslá sa nezhodujú");
      return;
    }

    try {
        const res = await fetch(`${BASE_URL}/password_reset/confirm_custom/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
        });
      if (res.ok) {
        alert("✅ Heslo bolo úspešne zmenené");
        navigate("/login");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.detail || "Nepodarilo sa zmeniť heslo.");
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
        type="password"
        placeholder="Nové heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Potvrď nové heslo"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleSubmit} style={{ padding: 10, background: "#D32F2F", color: "#fff", border: "none", width: "100%" }}>
        Uložiť heslo
      </button>
    </div>
  );
}
