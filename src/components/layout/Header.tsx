'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    DashboardIcon,
    BookmarkIcon,
    LogoutIcon,
    ExpandMoreIcon,
} from '@/components/icons';

interface HeaderProps {
    activePage?: 'problems' | 'games' | 'sprint' | 'dashboard' | 'explanations';
}

export default function Header({ activePage }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    };

    return (
        <header className="bg-[#1a1a1a]/90 backdrop-blur-md border-b border-neutral-800/50 sticky top-0 z-50">
            <div className="w-full px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Nav */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo-final.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-white">PrepLeague</span>
                                <p className="text-[10px] text-neutral-500 font-medium -mt-0.5">SSC CGL Preparation</p>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/explanations"
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${activePage === 'explanations'
                                    ? 'text-amber-500 bg-amber-500/10 font-semibold'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                            >
                                Explanations
                            </Link>
                            <Link
                                href="/problems"
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${activePage === 'problems'
                                    ? 'text-amber-500 bg-amber-500/10 font-semibold'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                            >
                                Problems
                            </Link>
                            <Link
                                href="/sprint"
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${activePage === 'sprint'
                                    ? 'text-amber-500 bg-amber-500/10 font-semibold'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                            >
                                Sprint Mode
                            </Link>
                            <Link
                                href="/games"
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${activePage === 'games'
                                    ? 'text-amber-500 bg-amber-500/10 font-semibold'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                            >
                                Games
                            </Link>
                            <Link
                                href="/dashboard"
                                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${activePage === 'dashboard'
                                    ? 'text-amber-500 bg-amber-500/10 font-semibold'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        </nav>
                    </div>

                    {/* Stats & User */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                        <span className="text-xs font-medium text-emerald-400">{user.totalCorrect || 0} Solved</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                                        <span className="text-sm">🔥</span>
                                        <span className="text-xs font-medium text-orange-400">{user.streak || 0} Days</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-3 p-1.5 hover:bg-neutral-800 rounded-xl transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                                            {user?.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                getUserInitials()
                                            )}
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-medium text-neutral-200 leading-tight">{user?.name}</p>
                                            <p className="text-[11px] text-neutral-500">{user?.targetExam?.replace('_', ' ') || 'SSC CGL'}</p>
                                        </div>
                                        <ExpandMoreIcon sx={{ fontSize: '1.1rem' }} className="text-neutral-500 hidden sm:block" />
                                    </button>

                                    {showUserMenu && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                                            <div className="absolute right-0 top-full mt-2 w-60 bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                                <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-800">
                                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                                    <p className="text-xs text-neutral-500">{user?.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                        <DashboardIcon sx={{ fontSize: '1.1rem' }} />
                                                        Dashboard
                                                    </Link>
                                                    <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                        <BookmarkIcon sx={{ fontSize: '1.1rem' }} />
                                                        Bookmarks
                                                    </Link>
                                                </div>
                                                <div className="border-t border-neutral-800 py-1">
                                                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-neutral-800 transition-colors w-full">
                                                        <LogoutIcon sx={{ fontSize: '1.1rem' }} />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="hidden sm:block text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
