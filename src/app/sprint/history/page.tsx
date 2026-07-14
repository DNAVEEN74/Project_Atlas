'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    BoltIcon
} from '@/components/icons';
import { TrophyIcon } from 'lucide-react';
import Header from '@/components/layout/Header';
import SummaryCards from '@/components/sprint/SummaryCards';

interface SprintSubmission {
    id: string;
    createdAt: string;
    subject: string;
    topics: string[];
    difficulty: string;
    score: number;
    incorrectCount: number;
    skippedCount: number;
    totalQuestions: number;
    accuracy: number;
    timeTaken: number;
    completed: boolean;
    topicPerformance?: any[];
}

export default function SprintHistoryPage() {
    const { user, loading } = useAuth();

    // State
    const [sessions, setSessions] = useState<SprintSubmission[]>([]);
    const [stats, setStats] = useState({
        totalSprints: 0,
        avgAccuracy: 0,
        completedCount: 0,
        avgTimePerQuestion: 0
    });
    const [pagination, setPagination] = useState({
        current: 1,
        total: 0,
        pages: 1,
        limit: 10
    });

    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, QUANT, REASONING

    // Fetch Data
    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // Build query params
                const params = new URLSearchParams({
                    page: pagination.current.toString(),
                    limit: '10', // Fixed 10 rows per page
                    filter: filter
                });

                const historyRes = await fetch(`/api/sprint/history?${params.toString()}`);

                if (historyRes.ok) {
                    const data = await historyRes.json();
                    if (data.stats) setStats(data.stats);
                    if (data.sessions) setSessions(data.sessions);
                    if (data.pagination) setPagination(prev => ({ ...prev, ...data.pagination }));
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [user, filter, pagination.current]); // Re-fetch on filter or page change

    // Helpers
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, current: newPage }));
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-violet-500/30">
            <Header activePage="sprint" />

            <main className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors mb-4 rounded-full px-3 py-1.5 hover:bg-[#1f1f1f] -ml-3">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm tracking-wide">Back to Dashboard</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#E6E1E5] flex items-center gap-4">
                            <BoltIcon className="text-amber-500 w-10 h-10" />
                            Sprint History
                        </h1>
                    </div>

                    <Link
                        href="/sprint"
                        className="w-fit bg-[#E8DEF8] text-[#1D192B] px-6 py-3 rounded-full font-medium text-sm hover:bg-[#E8DEF8]/90 transition-colors flex items-center gap-2 shadow-sm mt-4 md:mt-0"
                    >
                        <BoltIcon sx={{ fontSize: '1.1rem' }} />
                        New Sprint
                    </Link>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="rounded-full border border-[#1f1f1f] bg-[#141414] p-2 flex items-center w-fit">
                    <div className="flex items-center overflow-x-auto">
                        <button
                            onClick={() => { setFilter('ALL'); setPagination(p => ({ ...p, current: 1 })); }}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'ALL'
                                ? 'bg-[#36343B] text-[#E6E1E5]'
                                : 'text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f]'
                                }`}
                        >
                            All Sprints
                        </button>
                        <button
                            onClick={() => { setFilter('QUANT'); setPagination(p => ({ ...p, current: 1 })); }}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'QUANT'
                                ? 'bg-[#594100] text-[#FFB951]'
                                : 'text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f]'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Quant
                        </button>
                        <button
                            onClick={() => { setFilter('REASONING'); setPagination(p => ({ ...p, current: 1 })); }}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'REASONING'
                                ? 'bg-[#332D41] text-[#D0BCFF]'
                                : 'text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f]'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                            Reasoning
                        </button>
                    </div>
                </div>

                {isLoading && sessions.length === 0 ? (
                    <div className="rounded-[24px] border border-[#1f1f1f] bg-[#141414] flex flex-col items-center justify-center py-20 text-neutral-500 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-600 border-t-white animate-spin mb-4"></div>
                        <p>Loading history...</p>
                    </div>
                ) : stats.totalSprints === 0 && filter === 'ALL' ? (
                    <div className="rounded-[24px] border border-[#1f1f1f] bg-[#141414] p-16 text-center">
                        <TrophyIcon size={48} className="text-neutral-800 mb-2 mx-auto" />
                        <p className="text-neutral-500">No sprint history found.</p>
                        <Link href="/sprint" className="text-amber-500 hover:text-amber-400 text-sm font-medium mt-2 inline-block">
                            Start your first Sprint
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <SummaryCards
                            totalSprints={stats.totalSprints}
                            avgAccuracy={stats.avgAccuracy}
                            completedCount={stats.completedCount}
                            avgTimePerQuestion={stats.avgTimePerQuestion}
                        />

                        {/* Pagination Table */}
                        {sessions.length > 0 && (
                            <section className="overflow-hidden rounded-[24px] border border-[#1f1f1f] bg-[#141414]">
                                <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f1f]">
                                    <h2 className="text-lg font-medium text-[#E6E1E5]">Sprint Sessions</h2>
                                    <span className="text-sm font-medium text-[#CAC4D0]">{pagination.total} total</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <div className="min-w-[900px]">
                                        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-[#938F99] uppercase tracking-wider border-b border-[#1f1f1f]">
                                            <div className="col-span-3">Date</div>
                                            <div className="col-span-2">Subject</div>
                                            <div className="col-span-2">Topics</div>
                                            <div className="col-span-1">Diff</div>
                                            <div className="col-span-1 text-center">Score</div>
                                            <div className="col-span-1 text-center">Acc</div>
                                            <div className="col-span-1 text-center">Time</div>
                                            <div className="col-span-1 text-right">Action</div>
                                        </div>

                                        {sessions.map((sub) => (
                                            <div key={sub.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#1f1f1f]/50 transition-colors border-b border-[#1f1f1f] last:border-0">
                                                <div className="col-span-3">
                                                    <p className="text-sm md:text-base font-medium text-[#E6E1E5]">{formatDate(sub.createdAt)}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${sub.subject === 'QUANT'
                                                        ? 'bg-[#594100] text-[#FFB951]'
                                                        : 'bg-[#332D41] text-[#D0BCFF]'}`}>
                                                        {sub.subject.charAt(0) + sub.subject.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-sm text-[#CAC4D0] truncate" title={sub.topics?.includes('ALL') ? 'All Topics' : sub.topics?.join(', ')}>
                                                    {sub.topics?.length ? (sub.topics.includes('ALL') ? 'All Topics' : sub.topics.join(', ')) : 'All Topics'}
                                                </div>
                                                <div className="col-span-1">
                                                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${sub.difficulty === 'HARD' ? 'bg-[#4B191D] text-[#FFB4AB]' :
                                                        sub.difficulty === 'MEDIUM' ? 'bg-[#594100] text-[#FFB951]' :
                                                            'bg-[#143224] text-[#6DD58C]'
                                                        }`}>
                                                        {sub.difficulty ? sub.difficulty.charAt(0) + sub.difficulty.slice(1).toLowerCase() : 'Medium'}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 text-center">
                                                    <span className="text-base font-bold text-[#E6E1E5]">{sub.score}</span>
                                                    <span className="text-sm font-medium text-[#CAC4D0]">/{sub.totalQuestions}</span>
                                                </div>
                                                <div className="col-span-1 text-center">
                                                    <span className={`text-base font-bold ${sub.accuracy >= 80 ? 'text-[#6DD58C]' : sub.accuracy >= 50 ? 'text-[#FFB951]' : 'text-[#FFB4AB]'}`}>
                                                        {sub.accuracy}%
                                                    </span>
                                                </div>
                                                <div className="col-span-1 text-center text-sm font-medium text-[#CAC4D0] font-mono">
                                                    {formatTime(sub.timeTaken)}
                                                </div>
                                                <div className="col-span-1 flex justify-end">
                                                    <Link
                                                        href={`/sprint/${sub.id}/review`}
                                                        className="px-4 py-2 text-xs font-bold text-[#E6E1E5] hover:text-white bg-[#36343B] hover:bg-[#4A4458] rounded-full transition-all"
                                                    >
                                                        Review
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {pagination.pages > 1 && (
                                    <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#1f1f1f]">
                                        <p className="text-sm font-medium text-[#CAC4D0]">
                                            Showing <span className="font-medium text-[#E6E1E5]">{(pagination.current - 1) * 10 + 1}</span> to <span className="font-medium text-[#E6E1E5]">{Math.min(pagination.current * 10, pagination.total)}</span> of <span className="font-medium text-[#E6E1E5]">{pagination.total}</span> results
                                        </p>
                                        <div className="flex gap-2 bg-[#0a0a0a] p-1 rounded-full border border-[#1f1f1f]">
                                            <button
                                                onClick={() => handlePageChange(pagination.current - 1)}
                                                disabled={pagination.current === 1}
                                                className="p-2 rounded-full text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                                            </button>
                                            <div className="flex items-center gap-1 px-3">
                                                <span className="text-sm font-medium text-[#E6E1E5]">Page {pagination.current} of {pagination.pages}</span>
                                            </div>
                                            <button
                                                onClick={() => handlePageChange(pagination.current + 1)}
                                                disabled={pagination.current === pagination.pages}
                                                className="p-2 rounded-full text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronRightIcon sx={{ fontSize: '1.25rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

