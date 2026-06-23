"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import { formatTopicName, formatTime, formatDate } from '@/utils/format';
import { CustomSelect } from '@/components/ui/CustomSelect';
import Header from '@/components/layout/Header';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleOutlinedIcon,
    CancelIcon,
    BarChartOutlinedIcon,
    BoltIcon,
} from '@/components/icons';

interface Question {
    _id: string;
    text: string;
    difficulty: string;
    subject: string;
    pattern: string;
    source: {
        exam: string;
        year: number;
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
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [patternFilter, setPatternFilter] = useState('all');
    const [availableFilters, setAvailableFilters] = useState<{ subjects: string[], patterns: string[] }>({ subjects: [], patterns: [] });
    const [resultFilter, setResultFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    const [stats, setStats] = useState<any>(null);

    // Fetch stats
    useEffect(() => {
        if (user) {
            fetch('/api/attempts/stats')
                .then(res => res.json())
                .then(data => {
                    if (data.data) {
                        setStats(data.data);
                    }
                })
                .catch(err => console.error('Failed to fetch stats:', err));
        }
    }, [user]);

    // Fetch available filters
    useEffect(() => {
        if (user) {
            fetch('/api/attempts/filters')
                .then(res => res.json())
                .then(data => {
                    if (data.data) {
                        setAvailableFilters(data.data);
                    }
                })
                .catch(err => console.error('Failed to fetch filters:', err));
        }
    }, [user]);

    const ITEMS_PER_PAGE = 20;

    const accentColor = subjectFilter === 'REASONING' ? 'violet' : 'amber';

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchAttempts = async () => {
            setPageLoading(true);
            try {
                const offset = (pagination.page - 1) * ITEMS_PER_PAGE;
                const params = new URLSearchParams({
                    limit: ITEMS_PER_PAGE.toString(),
                    offset: offset.toString(),
                    status: resultFilter, // api expects 'correct' | 'wrong' | 'all'
                    difficulty: difficultyFilter,
                    subject: subjectFilter,
                    pattern: patternFilter
                });

                const res = await fetch(`/api/attempts/history?${params.toString()}`);
                const data = await res.json();
                if (data.data) {
                    // Map to Attempt shape expected by template
                    setAttempts(data.data.map((a: any) => ({
                        _id: a.id,
                        q_id: {
                            _id: a.questionId,
                            text: a.questionTitle,
                            difficulty: a.difficulty,
                            subject: a.subject || '',
                            pattern: a.pattern || '',
                            source: { exam: '', year: 0 },
                        },
                        is_correct: a.isCorrect,
                        time_ms: a.timeMs,
                        createdAt: a.createdAt,
                    })));

                    if (data.pagination) {
                        setPagination(data.pagination);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch submissions:', error);
            }
            setPageLoading(false);
        };

        if (user) fetchAttempts();
    }, [pagination.page, resultFilter, difficultyFilter, subjectFilter, patternFilter, user]);

    const updatePage = (page: number) => {
        setPagination((prev: any) => ({ ...prev, page }));
    };

    const getPageNumbers = () => {
        const totalPages = pagination.totalPages;
        const current = pagination.page;
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (current <= 3) pages.push(1, 2, 3, 4, '...', totalPages);
            else if (current >= totalPages - 2) pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            else pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
        }
        return pages;
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            <Header activePage="submissions" />

            {/* Main Content */}
            <main className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">

                    {/* Page Title */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/dashboard" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white">All Submissions</h1>
                    </div>



                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <CustomSelect
                            value={subjectFilter}
                            onChange={(val) => { setSubjectFilter(val); updatePage(1); }}
                            options={[
                                { value: 'all', label: 'All Subjects' },
                                { value: 'QUANT', label: 'Quant' },
                                { value: 'REASONING', label: 'Reasoning' },
                            ]}
                        />
                        <CustomSelect
                            value={patternFilter}
                            onChange={(val) => { setPatternFilter(val); updatePage(1); }}
                            options={[
                                { value: 'all', label: 'All Topics' },
                                ...availableFilters.patterns.map((p: string) => ({
                                    value: p,
                                    label: formatTopicName(p)
                                }))
                            ]}
                        />
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
                                </div>
                            ) : attempts.length === 0 ? (
                                <div className="p-12 text-center text-neutral-500">
                                    No submissions found
                                </div>
                            ) : (
                                attempts.map((attempt: Attempt) => (
                                    <Link
                                        key={attempt._id}
                                        href={`/problems/${attempt.q_id._id}?section=${attempt.q_id.subject}`}
                                        className="block px-6 py-4 hover:bg-neutral-800/50 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {attempt.is_correct ? (
                                                        <CheckCircleOutlinedIcon className="text-emerald-500" sx={{ fontSize: '1.2rem' }} />
                                                    ) : (
                                                        <CancelIcon className="text-rose-500" sx={{ fontSize: '1.2rem' }} />
                                                    )}
                                                    <span className={`text-sm font-medium ${attempt.is_correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {attempt.is_correct ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${attempt.q_id.difficulty === 'EASY' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                                                        attempt.q_id.difficulty === 'MEDIUM' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                                            'bg-rose-400/10 text-rose-400 border border-rose-400/20'
                                                        }`}>
                                                        {attempt.q_id.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-neutral-200 group-hover:text-indigo-400 transition-colors line-clamp-2 font-medium">
                                                    <MathText>{attempt.q_id.text}</MathText>
                                                </p>
                                                <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                                                    <span>{formatTopicName(attempt.q_id.pattern) || 'General'}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(attempt.createdAt)}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">{formatTime(attempt.time_ms)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Pagination with Context */}
                        {attempts.length > 0 && pagination.totalPages > 1 && (
                            <div className="p-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-neutral-500 font-medium">
                                    Showing <span className="text-neutral-300 font-bold">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-neutral-300 font-bold">{Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-neutral-300 font-bold">{pagination.total}</span> submissions
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updatePage(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        aria-label="Previous page"
                                        className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((p, i) => (
                                            p === '...' ? (
                                                <span key={i} className="px-2 text-neutral-600 text-sm">...</span>
                                            ) : (
                                                <button
                                                    key={i}
                                                    onClick={() => updatePage(p as number)}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${pagination.page === p
                                                        ? accentColor === 'amber'
                                                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                                            : 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                                                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-transparent hover:border-neutral-800'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => updatePage(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        aria-label="Next page"
                                        className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
