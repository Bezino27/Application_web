// src/pages/PaymentsPage.tsx
import Layout from "../components/layout";
import "./PaymentsPage.css";
import { useNavigate } from "react-router-dom";

export default function PaymentsPage() {

  const navigate = useNavigate();



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

    </Layout>
  );
}
