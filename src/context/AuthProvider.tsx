import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const storedAccess = localStorage.getItem('access');
        const storedUser = localStorage.getItem('user');
        if (storedAccess && storedUser) {
            setAccessToken(storedAccess);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (token: string, user: User) => {
        const hasAccess = user.roles.some(
            (r) => r.role === 'admin' || r.role === 'coach'
        );

        if (!hasAccess) {
            alert("Nemáš oprávnenie na prihlásenie do webového rozhrania.");
            return;
        }

        setAccessToken(token);
        setUser(user);
        localStorage.setItem('access', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('access');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}