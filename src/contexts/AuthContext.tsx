"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
                // If user is not found (e.g. deleted from DB) or token invalid, ensure cookie is cleared
                await fetch('/api/auth/logout', { method: 'POST' });
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                await refreshUser();
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
                await refreshUser();
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
