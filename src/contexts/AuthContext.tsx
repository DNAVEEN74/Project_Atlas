"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    targetExam: string;
    targetYear: number;
    totalSolved: number;
    totalCorrect: number;
    streak: number;
    maxStreak: number;
    bookmarks: string[];
    heatmap: { date: string; count: number; intensity: number }[];
    avatar_url?: string;
    dailyQuantGoal: number;
    dailyReasoningGoal: number;
    totalQuestions: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    targetExam?: string;
    targetYear?: number;
    dailyQuantGoal?: number;
    dailyReasoningGoal?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const hydrateUser = useCallback((incoming: Partial<User> | null | undefined) => {
        if (!incoming) return;

        setUser((prev) => {
            const base: User = prev ?? {
                id: '',
                email: '',
                name: '',
                targetExam: 'SSC_CGL',
                targetYear: new Date().getFullYear(),
                totalSolved: 0,
                totalCorrect: 0,
                streak: 0,
                maxStreak: 0,
                bookmarks: [],
                heatmap: [],
                dailyQuantGoal: 5,
                dailyReasoningGoal: 5,
                totalQuestions: 0,
            };

            return {
                ...base,
                ...incoming,
                bookmarks: incoming.bookmarks ?? base.bookmarks,
                heatmap: incoming.heatmap ?? base.heatmap,
                dailyQuantGoal: incoming.dailyQuantGoal ?? base.dailyQuantGoal,
                dailyReasoningGoal: incoming.dailyReasoningGoal ?? base.dailyReasoningGoal,
                totalQuestions: incoming.totalQuestions ?? base.totalQuestions,
            };
        });
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                hydrateUser(data.user);
            } else if (res.status === 401 || res.status === 404) {
                setUser(null);
                // If user is not found (e.g. deleted from DB) or token invalid, ensure cookie is cleared
                await fetch('/api/auth/logout', { method: 'POST' });
            } else {
                console.error(`refreshUser failed with status ${res.status}`);
            }
        } catch {
            // Keep current user on transient network errors.
        } finally {
            setLoading(false);
        }
    }, [hydrateUser]);

    useEffect(() => {
        void refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                hydrateUser(data.user);
                setLoading(false);
                // Keep dashboard/profile data in sync without blocking navigation.
                void refreshUser();
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch {
            return { success: false, error: 'Network error' };
        }
    };

    const register = async (registerData: RegisterData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });

            const data = await res.json();

            if (res.ok) {
                hydrateUser(data.user);
                setLoading(false);
                // Keep dashboard/profile data in sync without blocking navigation.
                void refreshUser();
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Registration failed' };
            }
        } catch {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch {
            console.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
