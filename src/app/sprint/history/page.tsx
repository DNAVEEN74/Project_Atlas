'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchIcon,
    FilterIcon,
    DownloadIcon,
    AccessTimeOutlinedIcon,
    CheckCircleOutlinedIcon,
    BoltIcon,
    EmojiEventsIcon
} from '@/components/icons';
import Header from '@/components/layout/Header';

interface SprintSubmission {
    id: string;
    createdAt: string;
    subject: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    timeTaken: number;
    completed: boolean;
}

export default function SprintHistoryPage() {
    const { user, loading, logout } = useAuth();
    const [submissions, setSubmissions] = useState<SprintSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filter, setFilter] = useState('ALL'); // ALL, QUANT, REASONING
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/sprint/history');
                if (res.ok) {
                    const data = await res.json();
                    setSubmissions(data);
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);



    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatTime = (ms: number) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}m ${secs}s`;
    };

    const filteredSubmissions = filter === 'ALL'
        ? submissions
        : submissions.filter(s => s.subject === filter);

    const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
    const paginatedSubmissions = filteredSubmissions.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans">
            {/* Header */}
            {/* Header */}
            <Header activePage="sprint" />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/sprint" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-2 transition-colors">
                            <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} /> Back to Sprint Setup
                        </Link>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BoltIcon sx={{ fontSize: '2rem' }} className="text-amber-500" />
                            Sprint History
                        </h1>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl overflow-hidden">
                    {/* Filters & Actions */}
                    <div className="p-4 border-b border-neutral-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {['ALL', 'QUANT', 'REASONING'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setFilter(t); setPage(1); }}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${filter === t
                                        ? 'bg-neutral-100 text-neutral-900 border-neutral-100'
                                        : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-neutral-300'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-neutral-800">
                        {isLoading ? (
                            <div className="p-10 text-center text-neutral-500">Loading history...</div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="p-16 text-center">
                                <EmojiEventsIcon sx={{ fontSize: '3rem' }} className="text-neutral-800 mb-2" />
                                <p className="text-neutral-500">No sprint history found.</p>
                                <Link href="/sprint" className="text-amber-500 hover:text-amber-400 text-sm font-medium mt-2 inline-block">
                                    Start your first Sprint
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-900/30 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                    <div className="col-span-3">Date</div>
                                    <div className="col-span-2">Subject</div>
                                    <div className="col-span-2 text-center">Score</div>
                                    <div className="col-span-2 text-center">Accuracy</div>
                                    <div className="col-span-1 text-right">Time</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                {paginatedSubmissions.map((sub) => (
                                    <div key={sub.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-neutral-800/30 transition-colors group">
                                        <div className="col-span-3">
                                            <p className="text-sm font-medium text-neutral-200">{formatDate(sub.createdAt)}</p>
                                            <p className="text-[10px] text-neutral-600 font-mono mt-0.5 truncate w-24 opacity-0 group-hover:opacity-100 transition-opacity">
                                                ID: {sub.id.substring(sub.id.length - 6)}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded border ${sub.subject === 'QUANT'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-violet-500/10 text-violet-500 border-violet-500/20'}`}>
                                                {sub.subject}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="text-sm font-bold text-white">{sub.score}</span>
                                            <span className="text-xs text-neutral-500">/{sub.totalQuestions}</span>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className={`text-sm font-bold ${sub.accuracy >= 80 ? 'text-emerald-400' : sub.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {sub.accuracy}%
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-right text-sm text-neutral-400 font-mono">
                                            {formatTime(sub.timeTaken)}
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <Link
                                                href={`/sprint/${sub.id}/review`}
                                                className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-all"
                                            >
                                                Review
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-800 bg-neutral-900/20">
                                        <p className="text-xs text-neutral-500">
                                            Showing <span className="font-medium text-white">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-white">{Math.min(page * ITEMS_PER_PAGE, filteredSubmissions.length)}</span> of <span className="font-medium text-white">{filteredSubmissions.length}</span> results
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
                                            </button>
                                            <div className="flex items-center gap-1 px-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p)}
                                                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${page === p
                                                            ? 'bg-neutral-700 text-white'
                                                            : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
