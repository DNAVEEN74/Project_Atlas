'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    ArrowBackIcon,
    HistoryIcon,
    FilterIcon,
    SearchIcon,
    CalculateIcon,
    PsychologyOutlinedIcon,
    CheckCircleOutlinedIcon,
    TimerIcon,
    TrophyIcon,
    ChevronRightIcon,
    ExpandMoreIcon,
    DashboardIcon,
    BookmarkIcon,
    LogoutIcon
} from '@/components/icons';
import { GAMES } from '@/components/games/games-config';

interface GameAttempt {
    _id: string;
    gameId: string;
    gameName: string;
    color: string;
    category: 'QUANT' | 'REASONING';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    score: number;
    metrics: {
        totalQuestions: number;
        correctAnswers: number;
        timeTaken: number;
    };
    createdAt: string;
}

export default function GamesHistoryPage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [attempts, setAttempts] = useState<GameAttempt[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        avgAccuracy: 0,
        totalTime: 0
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'QUANT' | 'REASONING'>('ALL');
    const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

    const fetchHistory = async (pageToFetch: number, append = false) => {
        setIsFetching(true);
        try {
            const queryParams = new URLSearchParams({
                page: pageToFetch.toString(),
                limit: '15',
                category: categoryFilter,
                difficulty: difficultyFilter
            });
            const res = await fetch(`/api/games/history?${queryParams.toString()}`);
            const data = await res.json();

            if (data.success) {
                if (append) {
                    setAttempts(prev => [...prev, ...data.data]);
                } else {
                    setAttempts(data.data);
                }
                setTotalPages(data.pagination.pages);
                setStats(prev => ({
                    ...prev,
                    total: data.pagination.total
                }));
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (user) {
            setPage(1);
            fetchHistory(1, false);
        }
    }, [user, categoryFilter, difficultyFilter]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchHistory(nextPage, true);
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative selection:bg-amber-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem'
                    }}
                />
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
            </div>

            {/* HEADER */}
            <header className="bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-neutral-800/50 sticky top-0 z-50">
                <div className="w-full px-6 lg:px-12">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-10">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="relative w-8 h-8">
                                    <Image src="/logo-final.png" alt="Logo" fill className="object-contain" />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-lg font-bold text-white">PrepLeague</span>
                                </div>
                            </Link>
                            <nav className="hidden lg:flex items-center gap-1">
                                <Link href="/games" className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">Games</Link>
                                <span className="text-neutral-700 mx-1">/</span>
                                <span className="px-4 py-2 text-sm font-semibold text-amber-500 bg-amber-500/10 rounded-full">History</span>
                            </nav>
                        </div>

                        <div className="relative">
                            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 p-1.5 hover:bg-neutral-800 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                    {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : getUserInitials()}
                                </div>
                                <ExpandMoreIcon sx={{ fontSize: '1rem' }} className="text-neutral-500 hidden sm:block" />
                            </button>
                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                        <div className="py-1">
                                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                <DashboardIcon sx={{ fontSize: '1rem' }} /> Dashboard
                                            </Link>
                                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-neutral-800 transition-colors w-full">
                                                <LogoutIcon sx={{ fontSize: '1rem' }} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 w-full px-6 lg:px-12 py-12 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link href="/games" className="inline-flex items-center gap-2 text-neutral-500 hover:text-amber-500 transition-colors text-xs font-black uppercase tracking-widest mb-4 group">
                            <ArrowBackIcon sx={{ fontSize: '1rem' }} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                            SESSION <span className="text-amber-500">HISTORY</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4 bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 p-4 rounded-[2rem]">
                        <div className="px-6 border-r border-white/5 last:border-0">
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Total Sessions</p>
                            <h3 className="text-2xl font-black text-white">{stats.total}</h3>
                        </div>
                        <div className="px-6 last:border-0 hidden sm:block">
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Performance Level</p>
                            <h3 className="text-2xl font-black text-emerald-500">OPTIMAL</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-neutral-400 mr-2">
                            <FilterIcon sx={{ fontSize: '1.2rem' }} />
                            <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                        </div>

                        <div className="flex p-1.5 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-full">
                            {(['ALL', 'QUANT', 'REASONING'] as const).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-neutral-500 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex p-1.5 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-full">
                            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficultyFilter(diff)}
                                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${difficultyFilter === diff
                                        ? diff === 'EASY' ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                                            : diff === 'HARD' ? 'bg-rose-500 text-black shadow-rose-500/20'
                                                : 'bg-amber-500 text-black shadow-amber-500/20'
                                        : 'text-neutral-500 hover:text-white'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative group w-full lg:w-64">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-hover:text-amber-500 transition-colors" sx={{ fontSize: '1.2rem' }} />
                        <input
                            type="text"
                            placeholder="Search Game Name..."
                            className="bg-white/5 border border-white/5 text-sm rounded-2xl py-3 pl-12 pr-6 w-full focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.08] transition-all text-white font-medium"
                        />
                    </div>
                </div>

                {/* History Grid/List */}
                {attempts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {attempts.map((attempt) => (
                            <div
                                key={attempt._id}
                                className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center border text-2xl ${attempt.category === 'QUANT' ? 'bg-amber-500/10 border-amber-500/10' : 'bg-violet-500/10 border-violet-500/10'
                                                }`}
                                        >
                                            {GAMES.find(g => g.id === attempt.gameId)?.icon || (attempt.category === 'QUANT' ? '🧮' : '🧠')}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">{attempt.gameName}</h3>
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{attempt.category}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${attempt.difficulty === 'EASY' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' :
                                        attempt.difficulty === 'HARD' ? 'border-rose-500/20 bg-rose-500/10 text-rose-500' :
                                            'border-amber-500/20 bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {attempt.difficulty}
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-all">
                                        <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1">Score</p>
                                        <p className="text-2xl font-black text-white">{attempt.score}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-all">
                                        <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1">Accuracy</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-black text-white">
                                                {Math.round((attempt.metrics.correctAnswers / Math.max(attempt.metrics.totalQuestions, 1)) * 100)}%
                                            </p>
                                            <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} className="text-emerald-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-2">
                                        <TimerIcon sx={{ fontSize: '1rem' }} className="text-neutral-600" />
                                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{attempt.metrics.timeTaken}s Taken</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                                        {new Date(attempt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Subtle background icon */}
                                <div className="absolute -bottom-6 -right-6 text-6xl opacity-5 transform group-hover:rotate-12 transition-transform pointer-events-none grayscale">
                                    {GAMES.find(g => g.id === attempt.gameId)?.icon}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isFetching ? (
                    <div className="text-center py-32 bg-[#1a1a1a]/40 backdrop-blur-md rounded-[3rem] border border-dashed border-white/10">
                        <HistoryIcon sx={{ fontSize: '4rem' }} className="text-neutral-800 mb-6" />
                        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">No Records Found</h3>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto font-medium">We couldn't find any drill sessions matching your filters. Time to start practicing!</p>
                        <Link href="/games" className="inline-flex items-center gap-3 px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-[.2em] text-xs rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all">
                            Start a Drill
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white/5 rounded-[2.5rem] h-64 animate-pulse border border-white/5" />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {page < totalPages && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            className={`flex items-center gap-3 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[.2em] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all ${isFetching ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isFetching ? 'Loading...' : 'Load More Sessions'}
                            {!isFetching && <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />}
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full px-12 py-10 border-t border-neutral-900 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <Image src="/logo-final.png" alt="Logo" width={24} height={24} />
                        <span className="text-sm font-bold text-white tracking-widest uppercase">PrepLeague Games</span>
                    </div>
                    <p className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em]">
                        Your performance data is private and encrypted. Keep grinding.
                    </p>
                </div>
            </footer>
        </div>
    );
}
