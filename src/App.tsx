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

        
        </Routes>
    );
}