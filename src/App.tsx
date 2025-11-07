import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/index';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import PaymentsCreatePage from './pages/PaymentsCreate';
import AdminOrdersPage from "./pages/AdminOrdersPage.tsx";
import PaymentsPage from './pages/PaymentsPage.tsx';
import UploadStatementPage from './pages/UploadStatementPage.tsx';
import PaymentsAdminPage from './pages/PaymentsAdminPage.tsx';
import AdminJerseyOrdersPage from './pages/AdminJerseyOrders.tsx';
import OrderForm from './pages/OrderForm.tsx';
import PartnerShipPage from './pages/partnership.tsx';
import About from './pages/About.tsx';
import Kontakt from './pages/kontakt.tsx';
import ResetPasswordPage from './pages/reset-password.tsx';
import PrivacyPolicyPage from './pages/privacy.tsx';
import SorryPage from './pages/sorry.tsx';
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/AdminCategoriesPage" element={<AdminCategoriesPage />} />
            <Route path="/admin/payments/create" element={<PaymentsCreatePage />} />
            <Route path="/AdminOrdersPage" element={<AdminOrdersPage />} />
            <Route path="/PaymentsPage" element={<PaymentsPage />} />
            <Route path="/UploadStatementPage" element={<UploadStatementPage />} />
            <Route path="/PaymentsAdminPage" element={<PaymentsAdminPage />} />
            <Route path="/AdminJerseyOrders" element={<AdminJerseyOrdersPage />} />
            <Route path="/OrderForm" element={<OrderForm />} />
            <Route path="/PartnerShip" element={<PartnerShipPage />} />
            <Route path="/About" element={<About />} />
            <Route path="/Kontakt" element={<Kontakt />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/policy" element={<PrivacyPolicyPage />} />
            <Route path="/sorry" element={<SorryPage />} />


        </Routes>
    );
}