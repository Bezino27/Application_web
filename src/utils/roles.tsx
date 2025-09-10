// src/utils/roles.ts
export type UserRole = {
    role: 'player' | 'coach' | 'admin' | string;
    category?: { id: number; name: string } | null;
};

export type MeResponse = {
    id: number;
    username: string;
    roles: UserRole[];
    // ...ostatné polia z me_view
};

export const isWebAllowed = (me: MeResponse) =>
    me.roles?.some(r => r.role === 'admin' || r.role === 'coach');