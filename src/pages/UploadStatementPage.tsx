import { useContext, useState } from "react";
import Layout from "../components/layout";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../api";
import "./UploadStatementPage.css";
import { useNavigate } from "react-router-dom";


export default function UploadStatementPage() {
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawResponse(null);

    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/upload-pdf-chatgpt/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = data?.error || "Neznáma chyba";
        const raw = data?.raw_response || null;
        if (raw) setRawResponse(raw);
        throw new Error(errMsg);
      }

      alert(`✅ Hotovo: ${data.message}`);
    } catch (err: any) {
      alert(`❌ Chyba: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
      <div className="upload-container">
        <h1>📄 Nahranie výpisu z banky</h1>
        <p>Nahraj PDF výpis a AI spracuje údaje o platbách.</p>

        <label className="upload-btn">
          {loading ? "⏳ Nahrávam..." : "📎 Vybrať PDF výpis"}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            disabled={loading}
            hidden
          />
        </label>

        {rawResponse && (
          <div className="debug-box">
            <h3>⚠️ Odpoveď AI:</h3>
            <pre>{rawResponse}</pre>
          </div>
        )}
      </div>
    </Layout>
  );
}
