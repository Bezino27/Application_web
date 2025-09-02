import { createContext, useState, useEffect, ReactNode } from 'react';

type User = {
    id: number;
    username: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    accessToken: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    accessToken: null,
    login: () => {},
    logout: () => {},
});

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