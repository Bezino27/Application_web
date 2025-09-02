import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/index';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/AdminCategoriesPage" element={<AdminCategoriesPage />} />
        </Routes>
    );
}