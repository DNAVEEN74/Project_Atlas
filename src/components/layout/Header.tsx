'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    DashboardIcon,
    BookmarkIcon,
    LogoutIcon,
    ExpandMoreIcon,
    DocumentIcon,
    FireIcon,
    PersonIcon,
    SettingsIcon,
    HelpIcon,
    StarIcon,
} from '@/components/icons';

interface HeaderProps {
    activePage?: 'problems' | 'games' | 'sprint' | 'dashboard' | 'submissions' | 'bookmarks';
}

export default function Header({ activePage }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

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
                                    {/* Solved Stats Pill */}
                                    <Link
                                        href="/submissions"
                                        className="group relative flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all cursor-pointer"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold text-emerald-400">
                                            {user.totalSolved === 0 ? (
                                                "🎯 Start Solving!"
                                            ) : (
                                                <>
                                                    {user.totalSolved}/{user.totalQuestions} Solved ({Math.round((user.totalSolved / (user.totalQuestions || 1)) * 100)}%)
                                                </>
                                            )}
                                        </span>
                                        {/* Tooltip */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-medium rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {user.totalSolved === 0
                                                ? "You haven't solved any questions yet. Start your journey today!"
                                                : `You've solved ${user.totalSolved} questions. Keep going!`}
                                        </div>
                                    </Link>

                                    {/* Streak Stats Pill */}
                                    <Link
                                        href="/dashboard"
                                        className="group relative flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full hover:bg-orange-500/15 hover:border-orange-500/30 transition-all cursor-pointer"
                                    >
                                        <span className="text-sm">🔥</span>
                                        <span className="text-xs font-semibold text-orange-400">
                                            {user.streak === 0 ? (
                                                "Build Your Streak!"
                                            ) : (
                                                <>
                                                    {user.streak} Day Streak {user.streak >= 7 && "⚡"}
                                                </>
                                            )}
                                        </span>
                                        {/* Tooltip */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-medium rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {user.streak === 0
                                                ? "Solve at least 1 question today to start your streak!"
                                                : `${user.streak}-day streak! Solve 1 question today to maintain it`}
                                        </div>
                                    </Link>
                                </div>

                                <div className="relative" ref={userMenuRef}>
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
                                        <div className="absolute right-0 top-full mt-2 w-60 bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] z-50 overflow-hidden">
                                            <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-800">
                                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                                <p className="text-xs text-neutral-500">{user?.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href="/pricing" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-amber-500 hover:bg-neutral-800 transition-colors">
                                                    <StarIcon sx={{ fontSize: '1.1rem' }} />
                                                    Upgrade Plan
                                                </Link>
                                                <div className="h-px bg-neutral-800 my-1 mx-4"></div>

                                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <DashboardIcon sx={{ fontSize: '1.1rem' }} />
                                                    Dashboard
                                                </Link>
                                                <Link href="/submissions" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <DocumentIcon sx={{ fontSize: '1.1rem' }} />
                                                    My Submissions
                                                </Link>
                                                <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <BookmarkIcon sx={{ fontSize: '1.1rem' }} />
                                                    Bookmarks
                                                </Link>
                                                <Link href="/sprint/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors group">
                                                    <FireIcon sx={{ fontSize: '1.1rem' }} className="text-orange-500 group-hover:animate-pulse" />
                                                    Sprint History
                                                </Link>

                                                <div className="h-px bg-neutral-800 my-1 mx-4"></div>

                                                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <PersonIcon sx={{ fontSize: '1.1rem' }} />
                                                    My Profile
                                                </Link>
                                                <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <SettingsIcon sx={{ fontSize: '1.1rem' }} />
                                                    Settings
                                                </Link>
                                                <Link href="/support" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <HelpIcon sx={{ fontSize: '1.1rem' }} />
                                                    Help & Support
                                                </Link>
                                            </div>
                                            <div className="border-t border-neutral-800 py-1">
                                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-neutral-800 transition-colors w-full">
                                                    <LogoutIcon sx={{ fontSize: '1.1rem' }} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
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
        </header >
    );
}
