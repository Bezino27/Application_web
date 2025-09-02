import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../assets/nazov-black.png';
import ludimus from '../assets/ludimus.png';
import { BASE_URL } from "../api.tsx";
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);

                const profileRes = await fetch(`${BASE_URL}/me/`, {
                    headers: { Authorization: `Bearer ${data.access}` },
                });

                if (!profileRes.ok) throw new Error("Nepodarilo sa načítať profil");

                const user = await profileRes.json();
                login(data.access, user);
                navigate('/dashboard');
            } else {
                setError('Neplatné meno alebo heslo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logo} alt="logo" className="login-logo" />
                <img src={ludimus} alt="ludimus" className="login-image-large" />
                <h2 className="login-title">Vitaj späť 👋</h2>
                <p className="login-subtitle">Prihlás sa do systému</p>

                <input
                    className="login-input"
                    placeholder="Používateľské meno"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="login-error">{error}</p>}

                <button className="login-button" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Prihlasujem...' : 'Prihlásiť sa'}
                </button>
            </div>
        </div>
    );
}