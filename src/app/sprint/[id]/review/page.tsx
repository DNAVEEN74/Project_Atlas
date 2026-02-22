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
    BoltIcon,
    EmojiEventsIcon,
    TargetIcon,
    SpeedIcon,
    TrendingUpIcon,
} from '@/components/icons';
import Header from '@/components/layout/Header';
import { CircularProgress } from '@/components/ui/CircularProgress';
import MathText from '@/components/ui/MathText';

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
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans selection:bg-amber-500/30">
            <Header activePage="sprint" />

            <main className="w-full px-6 lg:px-12 py-8 max-w-[1600px] mx-auto">
                <Link
                    href={'/sprint'}
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-6 transition-colors"
                >
                    <ArrowBackIcon sx={{ fontSize: '1rem' }} />
                    Back to Sprint Setup
                </Link>

                {/* Dashboard / Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    {/* LEFT COLUMN - Score Circle (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-full">
                            <div className="absolute inset-0 opacity-5">
                                <EmojiEventsIcon sx={{ fontSize: '8rem' }} className="text-white" />
                            </div>

                            <div className="mb-6 relative z-10">
                                <CircularProgress
                                    value={data.stats.accuracy}
                                    size={160}
                                    strokeWidth={12}
                                    color={isQuant ? 'text-amber-500' : 'text-violet-500'}
                                    trackColor="text-neutral-800"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-5xl font-bold text-white tracking-tighter">{data.stats.correctCount}</span>
                                        <span className="text-sm text-neutral-500 font-medium uppercase tracking-widest mt-1">/ {data.stats.totalQuestions}</span>
                                    </div>
                                </CircularProgress>
                            </div>

                            <div className="text-center relative z-10">
                                <div className={`inline-block px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-sm font-bold ${performance.color} mb-2`}>
                                    {performance.label}
                                </div>
                                <p className="text-sm text-neutral-500">{data.stats.accuracy}% Accuracy</p>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4">
                                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Avg Time</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-white font-mono">{getAvgTimePerQuestion()}</span>
                                    <span className="text-xs text-neutral-600">/q</span>
                                </div>
                            </div>
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4">
                                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Target</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-neutral-400 font-mono">30s</span>
                                    <span className="text-xs text-neutral-600">/q</span>
                                </div>
                            </div>
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4 col-span-2 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Difficulty</p>
                                    <p className="text-base font-bold text-white capitalize">{data.difficulty.toLowerCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Subject</p>
                                    <p className={`text-base font-bold ${primaryColor}`}>{data.subject}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN - Topic Breakdown (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 h-full">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUpIcon sx={{ fontSize: '1.25rem' }} className="text-neutral-400" />
                                Topic-Wise Breakdown
                            </h3>

                            {data.topicPerformance && data.topicPerformance.length > 0 ? (
                                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start">
                                    {data.topicPerformance.map((tp, idx) => {
                                        let color = 'bg-rose-500';
                                        let textColor = 'text-rose-400';
                                        if (tp.accuracy >= 80) { color = 'bg-emerald-500'; textColor = 'text-emerald-400'; }
                                        else if (tp.accuracy >= 50) { color = 'bg-amber-500'; textColor = 'text-amber-400'; }

                                        return (
                                            <div key={idx} className="w-full mt-0">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-sm font-medium text-neutral-300">{tp.topic}</span>
                                                    <div className="text-right">
                                                        <span className={`text-sm font-bold ${textColor}`}>{tp.correct}/{tp.total}</span>
                                                        <span className="text-xs text-neutral-600 ml-1">({tp.accuracy}%)</span>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
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
                                <div className="h-32 flex items-center justify-center text-neutral-500 text-sm">
                                    No topic data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Single-Sprint Smart Insights */}
                {data.insights && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Negative Marking & Skip Strategy */}
                        <div className="bg-[#1a1a1a] border border-neutral-800 hover:border-violet-500/50 transition-colors rounded-2xl p-6 flex flex-col">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TargetIcon sx={{ fontSize: '1rem' }} /> Marking Simulation
                            </h3>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-neutral-400 text-sm">Raw Score (No Negative)</span>
                                    <span className="text-white font-bold">{data.stats.correctCount}/{data.stats.totalQuestions}</span>
                                </div>
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                                    <span className="text-neutral-400 text-sm">SSC CGL System (+2, -0.5)</span>
                                    <span className="text-amber-500 font-bold">{data.insights.negative_marking.actual_marks}/{data.insights.negative_marking.max_marks} marks</span>
                                </div>
                                {data.insights.negative_marking.skip_count > 0 ? (
                                    <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/80 mt-auto">
                                        <p className="text-xs text-neutral-300 leading-relaxed">
                                            If you had <span className="text-emerald-400 font-bold">skipped the {data.insights.negative_marking.skip_count} slowest wrong answers</span>,
                                            your score would be <span className="text-emerald-400 font-bold">{data.insights.negative_marking.optimized_marks}/{data.insights.negative_marking.optimized_max}</span>.
                                            You'd also save <span className="text-amber-400 font-bold">{Math.round(data.insights.negative_marking.saved_time_ms / 1000)}s</span>!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/80 mt-auto">
                                        <p className="text-xs text-neutral-300 leading-relaxed">
                                            Great job! You didn't lose any unnecessary marks to negative marking because you didn't guess incorrectly.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time Distribution Histogram */}
                        <div className="bg-[#1a1a1a] border border-neutral-800 hover:border-amber-500/50 transition-colors rounded-2xl p-6 flex flex-col">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TimerIcon sx={{ fontSize: '1rem' }} /> Time Spent
                            </h3>
                            <div className="flex-1 flex flex-col justify-end gap-3 mt-4">
                                {(() => {
                                    const dist = data.insights!.time_distribution;
                                    const maxCount = Math.max(1, dist.under_20.count, dist.btn_20_40.count, dist.btn_40_60.count, dist.over_60.count);
                                    const rows = [
                                        { label: '< 20s', data: dist.under_20, color: 'bg-emerald-500' },
                                        { label: '20-40s', data: dist.btn_20_40, color: 'bg-emerald-400' },
                                        { label: '40-60s', data: dist.btn_40_60, color: 'bg-amber-500' },
                                        { label: '> 60s', data: dist.over_60, color: 'bg-rose-500' }
                                    ];

                                    return rows.map(r => (
                                        <div key={r.label} className="flex items-center gap-3">
                                            <div className="w-12 text-xs text-neutral-500 text-right shrink-0">{r.label}</div>
                                            <div className="flex-1 h-3 bg-neutral-900 rounded-full overflow-hidden flex">
                                                <div
                                                    className={`h-full ${r.color}`}
                                                    style={{ width: `${(r.data.count / maxCount) * 100}%` }}
                                                />
                                            </div>
                                            <div className="w-5 text-xs font-bold text-white shrink-0 text-right">
                                                {r.data.count > 0 ? r.data.count : ''}
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                            <div className="mt-4 text-[11px] text-neutral-400 border-t border-neutral-800 pt-3">
                                {data.insights.time_distribution.over_60.count > 0
                                    ? <><span className="text-rose-400 font-bold">⚠️ Warning:</span> You spent over 60s on {data.insights.time_distribution.over_60.count} questions. Consider skipping these next time.</>
                                    : <><span className="text-emerald-400 font-bold">✓ Great pace!</span> No questions took longer than 60 seconds.</>
                                }
                            </div>
                        </div>

                        {/* Fatigue Detection */}
                        <div className="bg-[#1a1a1a] border border-neutral-800 hover:border-emerald-500/50 transition-colors rounded-2xl p-6 flex flex-col">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <SpeedIcon sx={{ fontSize: '1rem' }} /> Stamina Check
                            </h3>
                            <div className="flex-1 flex flex-col justify-center">
                                {!data.insights.fatigue ? (
                                    <div className="text-center text-neutral-500 text-sm">Not enough questions to analyze stamina.</div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-end mb-4 px-2">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white mb-1">{Math.round(data.insights.fatigue.first_half_accuracy * 100)}%</div>
                                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">First Half Acc.</div>
                                            </div>
                                            <div className="h-10 border-r border-neutral-800 mx-4"></div>
                                            <div className="text-center">
                                                <div className={`text-2xl font-bold mb-1 ${data.insights.fatigue.detected ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {Math.round(data.insights.fatigue.second_half_accuracy * 100)}%
                                                </div>
                                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Second Half Acc.</div>
                                            </div>
                                        </div>

                                        <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/80 mt-auto">
                                            {data.insights.fatigue.detected ? (
                                                <p className="text-xs text-neutral-300 leading-relaxed">
                                                    Your accuracy drops by <span className="text-rose-400 font-bold">{Math.round(data.insights.fatigue.drop_percent * 100)}%</span> in the second half.
                                                    Your focus is fading. Try building stamina by increasing sprint lengths gradually.
                                                </p>
                                            ) : (
                                                <p className="text-xs text-neutral-300 leading-relaxed">
                                                    Your focus remained steady throughout the sprint! No significant drop in accuracy detected in the second half.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <hr className="border-neutral-800 mb-8" />

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Detailed Question Review
                        </h2>
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
                                    <h3 className="text-sm font-medium text-neutral-300 line-clamp-2">
                                        <MathText>{q.title || 'Question content not available'}</MathText>
                                    </h3>
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
                                        href={`/sprint/${sprintId}/review/${q._id}`}
                                        className="text-white hover:bg-neutral-800 p-2 rounded-lg transition-colors"
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
