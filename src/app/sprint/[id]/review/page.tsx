'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    ArrowBackIcon,
    FilterIcon,
    CheckCircleIcon,
    CancelIcon,
    RemoveCircleIcon,
    TimerIcon,
    ArrowForwardIcon,
    BoltIcon
} from '@/components/icons';
import Header from '@/components/layout/Header';

interface ReviewQuestion {
    _id: string;
    title: string;
    content: string;
    pattern: string;
    difficulty: string;
    correctOption: string; // 'A', 'B', 'C', 'D'
    userAttempt?: {
        isCorrect: boolean;
        selectedOption: string;
        timeMs: number;
    } | null;
}

interface ReviewData {
    sprintId: string;
    subject: string;
    questions: ReviewQuestion[];
}

export default function SprintReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [data, setData] = useState<ReviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'INCORRECT' | 'SKIPPED' | 'CORRECT'>('ALL');
    const [sprintId, setSprintId] = useState<string | null>(null);

    useEffect(() => {
        // Resolve params
        params.then(unwrappedParams => {
            setSprintId(unwrappedParams.id);
            const fetchReview = async () => {
                try {
                    const res = await fetch(`/api/sprint/${unwrappedParams.id}/review`);
                    if (res.ok) {
                        const apiRes = await res.json();

                        if (apiRes.success && apiRes.review) {
                            const { review } = apiRes;

                            // Map API data to component state structure
                            const mappedData: ReviewData = {
                                sprintId: review.session_id,
                                subject: 'QUANT', // Todo: get from API if available
                                questions: review.questions.map((q: any) => ({
                                    _id: q.question_id,
                                    title: q.text || 'Question',
                                    content: q.text || '',
                                    pattern: q.pattern || 'Topic',
                                    difficulty: q.difficulty || 'MEDIUM',
                                    correctOption: q.correct_option,
                                    userAttempt: q.status === 'NOT_ATTEMPTED' ? null : {
                                        isCorrect: q.status === 'CORRECT',
                                        selectedOption: q.selected_option || 'SKIPPED',
                                        timeMs: q.time_ms || 0
                                    }
                                }))
                            };
                            setData(mappedData);
                        } else {
                            console.error("Failed to fetch review data", apiRes.error);
                        }
                    } else {
                        console.error("Failed to fetch review data");
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReview();
        });
    }, [params, router]);

    const formatTime = (ms: number) => {
        return `${(ms / 1000).toFixed(1)}s`;
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!data) return null;

    const filteredQuestions = data.questions.filter(q => {
        if (filter === 'ALL') return true;
        if (filter === 'CORRECT') return q.userAttempt?.isCorrect === true;
        if (filter === 'INCORRECT') return q.userAttempt?.isCorrect === false && q.userAttempt?.selectedOption !== 'SKIPPED';
        if (filter === 'SKIPPED') return !q.userAttempt || q.userAttempt?.selectedOption === 'SKIPPED';
        return true;
    });

    const isQuant = data.subject === 'QUANT';
    const primaryColor = isQuant ? 'text-amber-500' : 'text-violet-500';

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans selection:bg-amber-500/30">
            <Header activePage="sprint" />

            <main className="w-full px-6 lg:px-12 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <Link
                            href={`/sprint/${sprintId}/summary`}
                            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-2 transition-colors"
                        >
                            <ArrowBackIcon sx={{ fontSize: '1rem' }} />
                            Back to Summary
                        </Link>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BoltIcon sx={{ fontSize: '1.8rem' }} className={primaryColor} />
                            Sprint Review
                        </h1>
                        <p className="text-neutral-400 text-sm">
                            Review your performance on each question.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-neutral-800 self-start md:self-center">
                        {(['ALL', 'CORRECT', 'INCORRECT', 'SKIPPED'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f
                                    ? 'bg-neutral-800 text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuestions.map((q, idx) => {
                        const isCorrect = q.userAttempt?.isCorrect;
                        const isSkipped = !q.userAttempt || q.userAttempt?.selectedOption === 'SKIPPED';

                        // Status Color/Icon
                        let statusColor = 'text-neutral-500';
                        let borderColor = 'border-neutral-800';
                        let StatusIcon = RemoveCircleIcon;

                        if (isCorrect) {
                            statusColor = 'text-emerald-500';
                            borderColor = 'border-emerald-500/20';
                            StatusIcon = CheckCircleIcon;
                        } else if (!isSkipped) {
                            statusColor = 'text-rose-500';
                            borderColor = 'border-rose-500/20';
                            StatusIcon = CancelIcon;
                        }

                        return (
                            <div key={q._id} className={`bg-[#1a1a1a] border ${borderColor} rounded-xl p-5 flex flex-col h-full hover:border-neutral-700 transition-colors group`}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <span className="bg-neutral-900 text-neutral-400 text-[10px] font-bold px-2 py-1 rounded">
                                        Q{idx + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded bg-black/40 ${statusColor} flex items-center gap-1`}>
                                            <StatusIcon sx={{ fontSize: '0.8rem' }} />
                                            {isSkipped ? 'Skipped' : (isCorrect ? 'Correct' : 'Incorrect')}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 mb-4">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="text-[10px] text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            {q.pattern}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-neutral-300 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: q.title || 'Question content not available' }}
                                    />
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        {!isSkipped && (
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                <TimerIcon sx={{ fontSize: '0.9rem' }} />
                                                <span className="font-mono">{formatTime(q.userAttempt?.timeMs || 0)}</span>
                                            </div>
                                        )}
                                        {!isSkipped && !isCorrect && (
                                            <div className="text-xs">
                                                <span className="text-rose-500 font-bold strike-through mr-1">
                                                    {q.userAttempt?.selectedOption}
                                                </span>
                                                <span className="text-neutral-600">→</span>
                                                <span className="text-emerald-500 font-bold ml-1">
                                                    {q.correctOption}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/problems/${q._id}?section=${data.subject}&from=sprint-review&sprintId=${sprintId}`}
                                        className="text-white hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                                        title="View Full Question"
                                    >
                                        <ArrowForwardIcon sx={{ fontSize: '1.2rem' }} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredQuestions.length === 0 && (
                    <div className="text-center py-20 text-neutral-500">
                        <FilterIcon sx={{ fontSize: '3rem' }} className="mb-4 opacity-50" />
                        <p>No questions found with this filter.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
