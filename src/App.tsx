import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/index';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

export default function App() {
    const handleLogin = () => {
        console.log("Login successful");
    };

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/AdminCategoriesPage" element={<AdminCategoriesPage />} />
        </Routes>
    );
}