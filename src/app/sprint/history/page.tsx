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
import AccuracyTrendChart from '@/components/sprint/AccuracyTrendChart';

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
    const [chartData, setChartData] = useState<any[]>([]);
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

                const res = await fetch(`/api/sprint/history?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();

                    if (data.stats) setStats(data.stats);
                    if (data.sessions) setSessions(data.sessions);
                    if (data.chartData) setChartData(data.chartData);
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
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-violet-500/30">
            <Header activePage="sprint" />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                            Sprint History
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">
                            Track your performance and improvements over time
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/sprint"
                            className="bg-white text-black px-4 py-2 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2"
                        >
                            <BoltIcon sx={{ fontSize: '1.1rem' }} />
                            New Sprint
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => { setFilter('ALL'); setPagination(p => ({ ...p, current: 1 })); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'ALL'
                            ? 'bg-neutral-800 text-white border border-neutral-700'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                            }`}
                    >
                        All Sprints
                    </button>
                    <button
                        onClick={() => { setFilter('QUANT'); setPagination(p => ({ ...p, current: 1 })); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'QUANT'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Quant
                    </button>
                    <button
                        onClick={() => { setFilter('REASONING'); setPagination(p => ({ ...p, current: 1 })); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'REASONING'
                            ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        Reasoning
                    </button>
                </div>

                {isLoading && sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-600 border-t-white animate-spin mb-4"></div>
                        <p>Loading history...</p>
                    </div>
                ) : stats.totalSprints === 0 && filter === 'ALL' ? (
                    <div className="p-16 text-center">
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

                        {/* Chart - Use separate chartData */}
                        <AccuracyTrendChart submissions={chartData} />

                        {/* Pagination Table */}
                        {sessions.length > 0 && (
                            <>
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
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
                                    <div key={sub.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-neutral-800/30 transition-colors group border-b border-neutral-800/50 last:border-0">
                                        <div className="col-span-3">
                                            <p className="text-base font-medium text-neutral-200">{formatDate(sub.createdAt)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded border ${sub.subject === 'QUANT'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-violet-500/10 text-violet-500 border-violet-500/20'}`}>
                                                {sub.subject}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-base text-neutral-400 truncate" title={sub.topics?.join(', ')}>
                                            {sub.topics?.length ? sub.topics.join(', ') : 'All Topics'}
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${sub.difficulty === 'HARD' ? 'bg-rose-500/20 text-rose-400' :
                                                sub.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {sub.difficulty || 'MEDIUM'}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className="text-base font-bold text-white">{sub.score}</span>
                                            <span className="text-sm text-neutral-500">/{sub.totalQuestions}</span>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className={`text-base font-bold ${sub.accuracy >= 80 ? 'text-emerald-400' : sub.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {sub.accuracy}%
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-center text-sm text-neutral-400 font-mono">
                                            {formatTime(sub.timeTaken)}
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <Link
                                                href={`/sprint/${sub.id}/review`}
                                                className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-all shadow-sm hover:shadow"
                                            >
                                                Review
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {pagination.pages > 1 && (
                                    <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-800 bg-neutral-900/20 mt-4 rounded-b-lg">
                                        <p className="text-xs text-neutral-500">
                                            Showing <span className="font-medium text-white">{(pagination.current - 1) * 10 + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.current * 10, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span> results
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.current - 1)}
                                                disabled={pagination.current === 1}
                                                className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
                                            </button>

                                            {/* Simple Page Numbers */}
                                            <div className="flex items-center gap-1 px-2">
                                                <span className="text-sm text-neutral-400">Page {pagination.current} of {pagination.pages}</span>
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(pagination.current + 1)}
                                                disabled={pagination.current === pagination.pages}
                                                className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
