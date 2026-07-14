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
    DocumentIcon,
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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header activePage="submissions" />

            {/* Main Content */}
            <main className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">

                    {/* Top App Bar & Navigation */}
                    <div className="mb-10">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors mb-4 rounded-full px-3 py-1.5 hover:bg-[#1f1f1f] -ml-3">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm tracking-wide">Back to Dashboard</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#E6E1E5] flex items-center gap-4">
                            <DocumentIcon className="text-indigo-400 w-10 h-10" />
                            All Submissions
                        </h1>
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

                    {/* Elevated Cards List */}
                    <div className="space-y-4">
                        {pageLoading ? (
                            <div className="p-16 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
                            </div>
                        ) : attempts.length === 0 ? (
                            <div className="py-20 px-8 text-center bg-[#141414] rounded-[24px]">
                                <DocumentIcon className="text-[#938F99] w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-medium text-[#E6E1E5] mb-2">
                                    No submissions found
                                </h3>
                                <p className="text-[#CAC4D0]">
                                    Questions you solve will appear here.
                                </p>
                            </div>
                        ) : (
                            attempts.map((attempt: Attempt) => (
                                <Link
                                    key={attempt._id}
                                    href={`/problems/${attempt.q_id._id}?section=${attempt.q_id.subject}`}
                                    className="block group"
                                >
                                    <div className="bg-[#141414] hover:bg-[#1f1f1f] rounded-[24px] p-6 transition-all duration-200">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1 min-w-0">
                                                {/* Meta Row */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1 border-transparent ${attempt.is_correct ? 'bg-[#143224] text-[#6DD58C]' : 'bg-[#4B191D] text-[#FFB4AB]'}`}>
                                                        {attempt.is_correct ? <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} /> : <CancelIcon sx={{ fontSize: '1rem' }} />}
                                                        {attempt.is_correct ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full border-transparent ${attempt.q_id.difficulty === 'EASY' ? 'bg-[#143224] text-[#6DD58C]' :
                                                        attempt.q_id.difficulty === 'MEDIUM' ? 'bg-[#594100] text-[#FFB951]' :
                                                            'bg-[#4B191D] text-[#FFB4AB]'
                                                        }`}>
                                                        {attempt.q_id.difficulty.charAt(0) + attempt.q_id.difficulty.slice(1).toLowerCase()}
                                                    </span>
                                                    <span className="px-3 py-1.5 text-xs font-medium bg-[#2b2b2b] text-[#CAC4D0] rounded-full border-transparent">
                                                        {attempt.q_id.subject.charAt(0) + attempt.q_id.subject.slice(1).toLowerCase()}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <p className="text-[#E6E1E5] group-hover:text-indigo-400 transition-colors line-clamp-2 font-medium text-[18px] leading-relaxed mb-4">
                                                    <MathText>{attempt.q_id.text}</MathText>
                                                </p>
                                                
                                                {/* Bottom Metadata */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#938F99] font-medium">
                                                    <span className="bg-[#0a0a0a] border border-[#2b2b2b] px-3 py-1 rounded-full">
                                                        {formatTopicName(attempt.q_id.pattern) || 'General'}
                                                    </span>
                                                    <span className="bg-[#0a0a0a] border border-[#2b2b2b] px-3 py-1 rounded-full">
                                                        {formatDate(attempt.createdAt)}
                                                    </span>
                                                    <span className="bg-[#0a0a0a] border border-[#2b2b2b] px-3 py-1 rounded-full font-mono">
                                                        {formatTime(attempt.time_ms)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                ))
                            )}
                        </div>

                        {/* MD3 Pagination */}
                        {attempts.length > 0 && pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
                                <p className="text-sm font-medium text-[#CAC4D0]">
                                    Showing <span className="text-[#E6E1E5]">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[#E6E1E5]">{Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-[#E6E1E5]">{pagination.total}</span> submissions
                                </p>

                                <div className="flex items-center gap-2 bg-[#141414] p-1 rounded-full">
                                    <button
                                        onClick={() => updatePage(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        aria-label="Previous page"
                                        className="p-2 text-[#CAC4D0] hover:text-indigo-400 hover:bg-[#1f1f1f] rounded-full disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((p, i) => (
                                            p === '...' ? (
                                                <span key={i} className="px-2 text-neutral-600 text-sm">...</span>
                                            ) : (
                                                <button
                                                    key={i}
                                                    onClick={() => updatePage(p as number)}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all ${pagination.page === p
                                                        ? accentColor === 'amber'
                                                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                                            : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                        : 'text-neutral-400 hover:bg-[#1f1f1f] hover:text-neutral-200 border border-transparent'
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
                                        className="p-2 text-[#CAC4D0] hover:text-indigo-400 hover:bg-[#1f1f1f] rounded-full disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronRightIcon sx={{ fontSize: '1.5rem' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </main>
        </div>
    );
}
