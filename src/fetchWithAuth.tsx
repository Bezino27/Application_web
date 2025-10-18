// src/utils/fetchWithAuth.ts
import {BASE_URL} from "./api.tsx";

const getAccessToken = () => localStorage.getItem('access');
const getRefreshToken = () => localStorage.getItem('refresh');

// ⏬ Obnovenie access tokenu
const refreshAccessToken = async (): Promise<string | null> => {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    const res = await fetch(`${BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access', data.access);
        return data.access;
    } else {
        // logout, ak token neplatný
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return null;
    }
};

// ⏬ Fetch s automatickou obnovou tokenu
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    let access = getAccessToken();

    const headers: HeadersInit = {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json',
    };

    let res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // 401 → skúsiť obnoviť a retry
    if (res.status === 401) {
        access = await refreshAccessToken();
        if (!access) return res;

        const retryHeaders: HeadersInit = {
            ...(options.headers || {}),
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
        };

        res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers: retryHeaders });
    }

    return res;
};