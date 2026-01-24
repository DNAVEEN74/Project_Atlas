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
} from '@/components/icons';
import Header from '@/components/layout/Header';
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



    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* HEADER */}
            <Header activePage="games" />

            <main className="w-full px-6 lg:px-12 py-12 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link href="/games" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider mb-4 group">
                            <ArrowBackIcon sx={{ fontSize: '1rem' }} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                            Session History
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-[#1a1a1a] border border-neutral-800 px-6 py-3 rounded-xl">
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Total Sessions</p>
                            <h3 className="text-xl font-bold text-white">{stats.total}</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full border border-neutral-800 text-neutral-400">
                            <FilterIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-xs font-medium uppercase tracking-wider">Filters</span>
                        </div>

                        <div className="flex p-1 bg-[#1a1a1a] border border-neutral-800 rounded-full">
                            {(['ALL', 'QUANT', 'REASONING'] as const).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${categoryFilter === cat ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex p-1 bg-[#1a1a1a] border border-neutral-800 rounded-full">
                            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficultyFilter(diff)}
                                    className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${difficultyFilter === diff
                                        ? diff === 'EASY' ? 'bg-emerald-500/10 text-emerald-500'
                                            : diff === 'HARD' ? 'bg-rose-500/10 text-rose-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                        : 'text-neutral-500 hover:text-white'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative group w-full lg:w-64">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" sx={{ fontSize: '1.2rem' }} />
                        <input
                            type="text"
                            placeholder="Search Game Name..."
                            className="bg-[#1a1a1a] border border-neutral-800 text-sm rounded-full py-2.5 pl-11 pr-4 w-full focus:outline-none focus:border-neutral-600 transition-all text-white placeholder:text-neutral-500"
                        />
                    </div>
                </div>

                {/* History List - Table Style */}
                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl overflow-hidden">
                    {attempts.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-[300px_1fr_1fr_1fr_120px] gap-4 px-8 py-4 border-b border-neutral-800 bg-neutral-900/50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                <div>Game Focus</div>
                                <div className="text-center">Score</div>
                                <div className="text-center">Accuracy</div>
                                <div className="text-center">Speed</div>
                                <div className="text-right">Completed</div>
                            </div>

                            <div className="divide-y divide-neutral-800/50">
                                {attempts.map((attempt) => (
                                    <div
                                        key={attempt._id}
                                        className="px-8 py-5 grid grid-cols-1 md:grid-cols-[300px_1fr_1fr_1fr_120px] gap-4 items-center hover:bg-neutral-800/30 transition-colors group"
                                    >
                                        {/* Game Info */}
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border border-white/5 ${attempt.category === 'QUANT' ? 'bg-amber-500/10 text-amber-500' : 'bg-violet-500/10 text-violet-500'}`}
                                            >
                                                {GAMES.find(g => g.id === attempt.gameId)?.icon || (attempt.category === 'QUANT' ? '🧮' : '🧠')}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">{attempt.gameName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${attempt.difficulty === 'EASY' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' :
                                                        attempt.difficulty === 'HARD' ? 'bg-rose-500/5 border-rose-500/10 text-rose-500' :
                                                            'bg-amber-500/5 border-amber-500/10 text-amber-500'
                                                        }`}>
                                                        {attempt.difficulty}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">{attempt.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="flex items-center justify-between md:justify-center">
                                            <span className="md:hidden text-xs text-neutral-500 font-bold uppercase tracking-wider">Score</span>
                                            <p className="text-base font-bold text-white tabular-nums">{attempt.score}</p>
                                        </div>

                                        {/* Accuracy */}
                                        <div className="flex items-center justify-between md:justify-center">
                                            <span className="md:hidden text-xs text-neutral-500 font-bold uppercase tracking-wider">Accuracy</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-base font-bold tabular-nums ${Math.round((attempt.metrics.correctAnswers / Math.max(attempt.metrics.totalQuestions, 1)) * 100) >= 90 ? 'text-emerald-500' : 'text-white'
                                                    }`}>
                                                    {Math.round((attempt.metrics.correctAnswers / Math.max(attempt.metrics.totalQuestions, 1)) * 100)}%
                                                </span>
                                                {Math.round((attempt.metrics.correctAnswers / Math.max(attempt.metrics.totalQuestions, 1)) * 100) >= 90 && (
                                                    <CheckCircleOutlinedIcon sx={{ fontSize: '0.875rem' }} className="text-emerald-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center justify-between md:justify-center">
                                            <span className="md:hidden text-xs text-neutral-500 font-bold uppercase tracking-wider">Time</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-base font-bold text-white tabular-nums">{attempt.metrics.timeTaken}s</span>
                                                <TimerIcon sx={{ fontSize: '0.875rem' }} className="text-neutral-600" />
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center justify-between md:justify-end">
                                            <span className="md:hidden text-xs text-neutral-500 font-bold uppercase tracking-wider">Date</span>
                                            <div className="text-right">
                                                <p className="text-xs text-neutral-300 font-medium">
                                                    {new Date(attempt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] text-neutral-600 mt-0.5 font-medium">
                                                    {new Date(attempt.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : !isFetching ? (
                        <div className="text-center py-20">
                            <HistoryIcon sx={{ fontSize: '3rem' }} className="text-neutral-800 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No Records Found</h3>
                            <p className="text-neutral-500 mb-6 text-sm">No drill sessions match your filters.</p>
                            <Link href="/games" className="inline-flex items-center px-6 py-2.5 bg-neutral-100 hover:bg-white text-black font-semibold text-sm rounded-lg transition-colors">
                                Start a Drill
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-800">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="p-5 flex items-center justify-between gap-4 animate-pulse">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-800" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-neutral-800 rounded w-1/4" />
                                            <div className="h-3 bg-neutral-800 rounded w-1/6" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {page < totalPages && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            className={`flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] border border-neutral-800 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-all ${isFetching ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isFetching ? 'Loading...' : 'Load More'}
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
