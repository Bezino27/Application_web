import { useState } from "react";
import "./index.css";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    club_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    plan: "yearly", // alebo "start" / "monthly"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://ludimus.sk/api/orders_ludimus/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Chyba pri odosielaní");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Nepodarilo sa odoslať objednávku");
    }
  };

  if (submitted) {
    return (
      <div className="order-success">
        <h2>✅ Ďakujeme!</h2>
        <p>Tvoje údaje sme úspešne prijali.</p>
        <p>
          <strong>Ozveme sa Vám čoskoro</strong> a dohodneme ďalšie kroky.
        </p>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h2>Objednať balík</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <label>
          Názov klubu
          <input
            type="text"
            name="club_name"
            value={formData.club_name}
            onChange={handleChange}
            required
          />
        </label>
        <div className="form-row">
          <label>
            Meno
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Priezvisko
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Telefón
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Vybraný balík
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
          >
            <option value="start">Štart – 0 € (1. mesiac zdarma)</option>
            <option value="yearly">Ročne – 25 €/mes (platba ročne)</option>
            <option value="monthly">Flexi – 30 €/mes (platba mesačne)</option>
          </select>
        </label>
        <button type="submit" className="order-button">
          Odoslať
        </button>
      </form>
    </div>
  );
}
