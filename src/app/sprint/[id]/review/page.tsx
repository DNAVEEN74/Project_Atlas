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
    TrendingUpIcon,
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
    difficulty: string;
    questions: ReviewQuestion[];
    stats: {
        correctCount: number;
        totalQuestions: number;
        totalTimeSpent: number;
        accuracy: number;
    };
    timedOut: boolean;
    topicPerformance: {
        topic: string;
        total: number;
        correct: number;
        accuracy: number;
    }[];
    insights?: {
        negative_marking: {
            actual_marks: number; max_marks: number; optimized_marks: number; optimized_max: number; skip_count: number; saved_time_ms: number;
        };
        time_distribution: {
            under_20: { count: number; correct: number };
            btn_20_40: { count: number; correct: number };
            btn_40_60: { count: number; correct: number };
            over_60: { count: number; correct: number };
        };
        fatigue: {
            detected: boolean; first_half_accuracy: number; second_half_accuracy: number; drop_percent: number;
        } | null;
    };
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
                                subject: review.config?.subject || 'QUANT',
                                difficulty: review.config?.difficulty || 'MEDIUM',
                                stats: {
                                    correctCount: review.stats?.correct || 0,
                                    totalQuestions: review.stats?.total_questions || 0,
                                    totalTimeSpent: review.stats?.total_time_ms || 0,
                                    accuracy: review.stats?.accuracy || 0
                                },
                                timedOut: review.expired || false,
                                topicPerformance: review.topic_performance || [],
                                insights: review.insights,
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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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

    const performance = data.stats.accuracy >= 80
        ? { label: 'Excellent', color: 'text-emerald-400' }
        : data.stats.accuracy >= 50
            ? { label: 'Good', color: 'text-amber-400' }
            : { label: 'Needs Practice', color: 'text-rose-400' };

    const getAvgTimePerQuestion = () => {
        if (!data || data.stats.totalQuestions === 0) return '0s';
        const avgMs = data.stats.totalTimeSpent / data.stats.totalQuestions;
        return `${Math.round(avgMs / 1000)}s`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#E6E1E5] font-sans selection:bg-amber-500/30">
            <Header activePage="sprint" />

            <main className="w-full px-6 lg:px-12 py-8 max-w-[1600px] mx-auto">
                <div className="mb-8">
                    <Link
                        href={'/sprint'}
                        className="inline-flex items-center gap-2 text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors mb-6 rounded-full px-3 py-1.5 hover:bg-[#1f1f1f] -ml-3"
                    >
                        <ArrowBackIcon sx={{ fontSize: '1rem' }} />
                        <span className="font-medium text-sm tracking-wide">Back to Sprint Setup</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-medium tracking-tight flex items-center gap-4">
                        <TrendingUpIcon className="text-amber-500 w-8 h-8" />
                        Sprint Review
                    </h1>
                </div>

                {/* Dashboard / Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
                    {/* LEFT COLUMN - Quick Stats (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-6 flex flex-col justify-center">
                            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Sprint Score</h2>
                            <div className="flex items-end gap-3 mb-4">
                                <span className={`text-5xl font-black ${primaryColor} leading-none tracking-tighter`}>{data.stats.correctCount}</span>
                                <span className="text-2xl font-bold text-neutral-600 leading-none pb-1">/ {data.stats.totalQuestions}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold ${performance.color} bg-[#0a0a0a] border border-[#1f1f1f] px-3 py-1.5 rounded-full`}>
                                    {data.stats.accuracy}% Accuracy - {performance.label}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-5">
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Avg Time</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-[#E6E1E5] font-mono">{getAvgTimePerQuestion()}</span>
                                    <span className="text-[10px] text-neutral-600 uppercase">Target 30s</span>
                                </div>
                            </div>
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-5">
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Config</p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-sm font-bold ${primaryColor}`}>{data.subject}</span>
                                    <span className="text-neutral-600 text-xs">•</span>
                                    <span className="text-xs font-bold text-[#CAC4D0] capitalize">{data.difficulty.toLowerCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Topic Breakdown (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-6 h-full">
                            <h3 className="text-sm font-bold text-[#E6E1E5] mb-6 flex items-center gap-2">
                                <TrendingUpIcon sx={{ fontSize: '1rem' }} className="text-[#CAC4D0]" />
                                Topic Performance
                            </h3>

                            {data.topicPerformance && data.topicPerformance.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    {data.topicPerformance.map((tp, idx) => {
                                        let color = 'bg-[#4B191D]';
                                        let textColor = 'text-[#FFB4AB]';
                                        if (tp.accuracy >= 80) { color = 'bg-[#143224]'; textColor = 'text-[#6DD58C]'; }
                                        else if (tp.accuracy >= 50) { color = 'bg-[#594100]'; textColor = 'text-[#FFB951]'; }

                                        // Format topic name nicely: "speed_distance_time" -> "Speed Distance Time"
                                        const formattedTopic = tp.topic.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                                        return (
                                            <div key={idx} className="w-full">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-xs font-bold text-[#CAC4D0] truncate pr-2">{formattedTopic}</span>
                                                    <div className="text-right shrink-0">
                                                        <span className={`text-xs font-bold ${textColor}`}>{tp.correct}/{tp.total}</span>
                                                        <span className="text-[10px] text-neutral-600 ml-1 font-mono">({tp.accuracy}%)</span>
                                                    </div>
                                                </div>
                                                <div className="h-1 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${color} transition-all duration-500`}
                                                        style={{ width: `${Math.max(tp.accuracy, 5)}%` }} // Min 5% so bar is visible
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-32 flex items-center justify-center text-neutral-600 text-xs">
                                    No topic data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-[#E6E1E5] flex items-center gap-2">
                            Detailed Question Review
                        </h2>
                    </div>

                    {/* Filters */}
                    <div className="flex bg-[#141414] p-1.5 rounded-full border border-[#1f1f1f] self-start md:self-center">
                        {(['ALL', 'CORRECT', 'INCORRECT', 'SKIPPED'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                    ? 'bg-[#36343B] text-[#E6E1E5] shadow-sm'
                                    : 'text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f]'
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
                            <div key={q._id} className={`bg-[#141414] border ${borderColor} rounded-[24px] p-6 flex flex-col h-full hover:border-[#CAC4D0] transition-colors group`}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <span className="bg-[#0a0a0a] text-[#CAC4D0] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#1f1f1f]">
                                        Q{idx + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#0a0a0a] ${statusColor} flex items-center gap-1.5 border border-[#1f1f1f]`}>
                                            <StatusIcon sx={{ fontSize: '0.8rem' }} />
                                            {isSkipped ? 'Skipped' : (isCorrect ? 'Correct' : 'Incorrect')}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 mb-5">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-[10px] text-[#938F99] border border-[#1f1f1f] bg-[#0a0a0a] px-2 py-1 rounded-full uppercase tracking-wider">
                                            {q.pattern}
                                        </span>
                                        <span className="text-[10px] text-[#938F99] border border-[#1f1f1f] bg-[#0a0a0a] px-2 py-1 rounded-full uppercase tracking-wider">
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-[15px] font-medium text-[#E6E1E5] leading-relaxed line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: q.title || 'Question content not available' }}
                                    />
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-[#1f1f1f] flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        {!isSkipped && (
                                            <div className="flex items-center gap-1.5 text-xs text-[#CAC4D0]">
                                                <TimerIcon sx={{ fontSize: '0.9rem' }} />
                                                <span className="font-mono">{formatTime(q.userAttempt?.timeMs || 0)}</span>
                                            </div>
                                        )}
                                        {!isSkipped && !isCorrect && (
                                            <div className="text-xs">
                                                <span className="text-[#FFB4AB] font-bold strike-through mr-1">
                                                    {q.userAttempt?.selectedOption}
                                                </span>
                                                <span className="text-[#938F99]">→</span>
                                                <span className="text-[#6DD58C] font-bold ml-1">
                                                    {q.correctOption}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/sprint/${sprintId}/review/${q._id}`}
                                        className="text-[#CAC4D0] hover:text-[#E6E1E5] hover:bg-[#1f1f1f] p-2 rounded-full transition-colors"
                                        title="View Detailed Question & Solution"
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
