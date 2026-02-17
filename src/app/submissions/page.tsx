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

                    {/* Stats Card */}
                    {stats && (
                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span>📊</span> Your Submission Stats
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: General Stats */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-400">Total Submissions</span>
                                        <span className="text-white font-mono font-medium text-lg">{stats.total}</span>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Correct Bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 text-[#22C55E] font-medium">
                                                    <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} /> Correct
                                                </span>
                                                <span className="text-neutral-200 font-mono">
                                                    {stats.correct} <span className="text-neutral-500">({stats.correctPct}%)</span>
                                                </span>
                                            </div>
                                            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${stats.correctPct}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Wrong Bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 text-[#EF4444] font-medium">
                                                    <CancelIcon sx={{ fontSize: '1rem' }} /> Wrong
                                                </span>
                                                <span className="text-neutral-200 font-mono">
                                                    {stats.wrong} <span className="text-neutral-500">({stats.wrongPct}%)</span>
                                                </span>
                                            </div>
                                            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${stats.wrongPct}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-800">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-neutral-400 flex items-center gap-2">
                                                <span>⚡</span> Avg Time per Question
                                            </span>
                                            <span className="text-white font-mono text-lg">{stats.avgTimeSec}s</span>
                                        </div>
                                        <div className="text-xs text-neutral-500 flex items-center justify-end gap-2">
                                            <span>Target: 36s</span>
                                            {stats.avgTimeSec < 36 ? (
                                                <span className="text-emerald-500">• Good Pace</span>
                                            ) : (
                                                <span className="text-amber-500">• Too Slow</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Best/Worst Topic */}
                                <div className="space-y-6 border-t md:border-t-0 md:border-l border-neutral-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                                    {/* Best Topic */}
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 group hover:border-emerald-500/20 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">Best Topic</div>
                                                <div className="text-white font-medium text-lg">
                                                    {stats.bestTopic ? formatTopicName(stats.bestTopic.name) : '-'}
                                                </div>
                                            </div>
                                            {stats.bestTopic && (
                                                <div className="text-2xl font-bold text-[#22C55E]">
                                                    {stats.bestTopic.accuracy}%
                                                </div>
                                            )}
                                        </div>
                                        {stats.bestTopic && (
                                            <div className="text-xs text-neutral-400 font-mono">
                                                {stats.bestTopic.correct}/{stats.bestTopic.total} Correct
                                            </div>
                                        )}
                                    </div>

                                    {/* Worst Topic */}
                                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 group hover:border-rose-500/20 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-[#EF4444] uppercase tracking-wider">Worst Topic</div>
                                                <div className="text-white font-medium text-lg">
                                                    {stats.worstTopic ? formatTopicName(stats.worstTopic.name) : '-'}
                                                </div>
                                            </div>
                                            {stats.worstTopic && (
                                                <div className="text-2xl font-bold text-[#EF4444]">
                                                    {stats.worstTopic.accuracy}%
                                                </div>
                                            )}
                                        </div>
                                        {stats.worstTopic && (
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="text-xs text-neutral-400 font-mono">
                                                    {stats.worstTopic.total} Attempted
                                                </div>
                                                <Link
                                                    href={`/problems?pattern=${stats.worstTopic.name}`}
                                                    className="text-xs font-medium text-white bg-[#EF4444] hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    Practice {formatTopicName(stats.worstTopic.name)} <span>→</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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

                        {/* Pagination */}
                        {pagination.total > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/50 border-t border-neutral-800">
                                <p className="text-sm text-neutral-500">
                                    <span className="text-neutral-300 font-medium">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-neutral-300 font-medium">{pagination.total}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updatePage(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className="p-2 text-neutral-500 hover:text-indigo-400 hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-neutral-700"
                                    >
                                        <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                    <span className="px-4 py-2 text-sm text-neutral-400 font-medium">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => updatePage(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="p-2 text-neutral-500 hover:text-indigo-400 hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-neutral-700"
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
