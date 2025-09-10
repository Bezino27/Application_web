import { createContext } from 'react';

export type User = {
    id: number;
    username: string;
    name: string;
    roles: { role: string; category__id: number; category__name: string }[];

};

export type AuthContextType = {
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