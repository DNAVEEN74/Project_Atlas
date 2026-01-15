"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleOutlinedIcon,
    CancelIcon,
} from '@/components/icons';

interface Question {
    _id: string;
    content: {
        text: string;
    };
    difficulty: string;
    source: {
        section: string;
        year: number;
        exam: string;
    };
    pattern?: {
        topic: string;
    };
}

interface Attempt {
    _id: string;
    q_id: Question;
    is_correct: boolean;
    time_ms: number;
    createdAt: string;
}

export default function SubmissionsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
    const [resultFilter, setResultFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchAttempts = async () => {
            setPageLoading(true);
            try {
                let url = `/api/submissions?page=${pagination.page}&limit=${ITEMS_PER_PAGE}`;
                if (resultFilter !== 'all') url += `&result=${resultFilter}`;
                if (difficultyFilter !== 'all') url += `&difficulty=${difficultyFilter}`;

                const res = await fetch(url);
                const data = await res.json();
                if (data.success) {
                    setAttempts(data.data);
                    setPagination(data.pagination);
                }
            } catch (error) {
                console.error('Failed to fetch submissions:', error);
            }
            setPageLoading(false);
        };

        if (user) fetchAttempts();
    }, [pagination.page, resultFilter, difficultyFilter, user]);

    const updatePage = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const formatTime = (ms: number) => {
        if (!ms || isNaN(ms)) return '-';
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-neutral-800 h-16 flex items-center px-6 lg:px-12">
                <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                    <span className="font-medium text-sm">Back to Dashboard</span>
                </Link>
                <h1 className="text-xl font-bold text-white ml-8">All Submissions</h1>
            </header>

            {/* Main Content */}
            <main className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Filters */}
                    <div className="mb-6 flex gap-4">
                        <CustomSelect
                            value={resultFilter}
                            onChange={(val) => { setResultFilter(val); updatePage(1); }}
                            options={[
                                { value: 'all', label: 'All Results' },
                                { value: 'correct', label: 'Correct Only' },
                                { value: 'wrong', label: 'Incorrect Only' },
                            ]}
                        />
                        <CustomSelect
                            value={difficultyFilter}
                            onChange={(val) => { setDifficultyFilter(val); updatePage(1); }}
                            options={[
                                { value: 'all', label: 'All Difficulties' },
                                { value: 'EASY', label: 'Easy' },
                                { value: 'MEDIUM', label: 'Medium' },
                                { value: 'HARD', label: 'Hard' },
                            ]}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden">
                        <div className="divide-y divide-neutral-800/50">
                            {pageLoading ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent mx-auto"></div>
                                </div>
                            ) : attempts.length === 0 ? (
                                <div className="p-12 text-center text-neutral-500">
                                    No submissions found
                                </div>
                            ) : (
                                attempts.map((attempt) => (
                                    <Link
                                        key={attempt._id}
                                        href={`/problems/${attempt.q_id._id}?section=${attempt.q_id.source.section}`}
                                        className="block px-6 py-4 hover:bg-neutral-800/30 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {attempt.is_correct ? (
                                                        <CheckCircleOutlinedIcon className="text-emerald-400" sx={{ fontSize: '1.2rem' }} />
                                                    ) : (
                                                        <CancelIcon className="text-rose-400" sx={{ fontSize: '1.2rem' }} />
                                                    )}
                                                    <span className={`text-sm font-medium ${attempt.is_correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {attempt.is_correct ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${attempt.q_id.difficulty === 'EASY' ? 'bg-emerald-500/15 text-emerald-400' :
                                                        attempt.q_id.difficulty === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400' :
                                                            'bg-rose-500/15 text-rose-400'
                                                        }`}>
                                                        {attempt.q_id.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-neutral-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                                                    <MathText>{attempt.q_id.content.text}</MathText>
                                                </p>
                                                <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                                                    <span>{attempt.q_id.pattern?.topic || 'General'}</span>
                                                    <span>•</span>
                                                    <span>{new Date(attempt.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{formatTime(attempt.time_ms)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination.total > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/50 border-t border-neutral-800">
                                <p className="text-sm text-neutral-500">
                                    <span className="text-neutral-300">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-neutral-300">{pagination.total}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updatePage(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                    <span className="px-4 py-2 text-sm text-neutral-300">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => updatePage(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRightIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
