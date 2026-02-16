'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CircularProgress } from '@/components/ui/CircularProgress';
import {
    TimerIcon,
    PlayArrowIcon,
    ArrowBackIcon,
    EmojiEventsIcon,
    TargetIcon,
    SpeedIcon,
    BoltIcon,
    TrendingUpIcon,
} from '@/components/icons';
import Header from '@/components/layout/Header';

interface SprintResult {
    sprintId: string;
    correctCount: number;
    totalQuestions: number;
    totalTimeSpent: number;
    accuracy: number;
    subject: string;
    difficulty: string;
    topics: string[];
    timedOut: boolean;
    topicPerformance?: {
        topic: string;
        total: number;
        correct: number;
        accuracy: number;
    }[];
}

export default function SprintSummaryByIdPage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading, logout } = useAuth();

    const [result, setResult] = useState<SprintResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);

    const sprintId = params?.id as string;

    useEffect(() => {
        const fetchResults = async () => {
            if (!sprintId) {
                router.push('/sprint/history');
                return;
            }

            try {
                // Fetch sprint details/summary by ID
                const res = await fetch(`/api/sprint/${sprintId}/summary`);

                if (res.ok) {
                    const apiRes = await res.json();

                    if (!apiRes.success || !apiRes.summary) {
                        throw new Error("Invalid response format");
                    }

                    const { summary } = apiRes;
                    const stats = summary.stats || {};
                    const config = summary.config || {};

                    setResult({
                        sprintId,
                        correctCount: stats.correct || 0,
                        totalQuestions: stats.total_questions || 0,
                        totalTimeSpent: stats.total_time_ms || 0,
                        accuracy: stats.accuracy || 0,
                        subject: config.subject || 'QUANT',
                        difficulty: config.difficulty || 'MEDIUM',
                        topics: config.patterns || [],
                        timedOut: summary.expired || false,
                        topicPerformance: summary.topic_performance || []
                    });
                } else {
                    console.error("Failed to fetch summary from server");
                    router.push('/sprint/history');
                    return;
                }

                // Fetch history for trend (limit 5)
                const histRes = await fetch('/api/sprint/history?limit=5');
                if (histRes.ok) {
                    const histData = await histRes.json();
                    setHistory(histData.reverse()); // Show oldest to newest
                }

            } catch (error) {
                console.error("Error fetching sprint summary:", error);
                router.push('/sprint/history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [sprintId, router]);

    const formatTime = (ms: number) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRetrySprint = async () => {
        if (!result) return;

        try {
            // Retry the same sprint with the same questions
            const res = await fetch(`/api/sprint/${result.sprintId}/retry`, {
                method: 'POST'
            });

            if (res.ok) {
                const data = await res.json();
                // Store session data with startTime
                sessionStorage.setItem('sprintSession', JSON.stringify({
                    sessionId: data.sessionId,
                    questionIds: data.questionIds,
                    subject: data.subject,
                    difficulty: data.difficulty,
                    totalTimeAllowed: data.totalTimeAllowed,
                    currentIndex: 0,
                    startTime: Date.now()
                }));
                // Navigate to first question
                router.push(`/problems/${data.questionIds[0]}?section=${data.subject}&sprint=true`);
            } else {
                console.error('Failed to retry sprint');
                alert('Failed to retry sprint. Please try again.');
            }
        } catch (error) {
            console.error('Error retrying sprint:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const getAvgTimePerQuestion = () => {
        if (!result || result.totalQuestions === 0) return '0s';
        const avgMs = result.totalTimeSpent / result.totalQuestions;
        return `${Math.round(avgMs / 1000)}s`;
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!result) {
        return null;
    }

    const isQuant = result.subject === 'QUANT';
    const primaryColor = isQuant ? 'text-amber-500' : 'text-violet-500';

    const performance = result.accuracy >= 80
        ? { label: 'Excellent', color: 'text-emerald-400' }
        : result.accuracy >= 50
            ? { label: 'Good', color: 'text-amber-400' }
            : { label: 'Needs Practice', color: 'text-rose-400' };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans">
            <Header activePage="sprint" />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link href="/sprint/history" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6 transition-colors">
                    <ArrowBackIcon sx={{ fontSize: '1rem' }} />
                    Back to Sprint History
                </Link>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN - Score Circle (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-full">
                            {/* Background decoration */}
                            <div className="absolute inset-0 opacity-5">
                                <EmojiEventsIcon sx={{ fontSize: '8rem' }} className="text-white" />
                            </div>

                            <div className="mb-6 relative z-10">
                                <CircularProgress
                                    value={result.accuracy}
                                    size={160}
                                    strokeWidth={12}
                                    color={isQuant ? 'text-amber-500' : 'text-violet-500'}
                                    trackColor="text-neutral-800"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-5xl font-bold text-white tracking-tighter">{result.correctCount}</span>
                                        <span className="text-sm text-neutral-500 font-medium uppercase tracking-widest mt-1">/ {result.totalQuestions}</span>
                                    </div>
                                </CircularProgress>
                            </div>

                            <div className="text-center relative z-10">
                                <div className={`inline-block px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-sm font-bold ${performance.color} mb-2`}>
                                    {performance.label}
                                </div>
                                <p className="text-sm text-neutral-500">{result.accuracy}% Accuracy</p>
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
                                    <p className="text-base font-bold text-white capitalize">{result.difficulty.toLowerCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Subject</p>
                                    <p className={`text-base font-bold ${primaryColor}`}>{result.subject}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN - Topic Breakdown (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 h-full">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUpIcon sx={{ fontSize: '1.25rem' }} className="text-neutral-400" />
                                Topic-Wise Breakdown
                            </h3>

                            {result.topicPerformance && result.topicPerformance.length > 0 ? (
                                <div className="space-y-5">
                                    {result.topicPerformance.map((tp, idx) => {
                                        let color = 'bg-rose-500';
                                        let textColor = 'text-rose-400';
                                        if (tp.accuracy >= 80) { color = 'bg-emerald-500'; textColor = 'text-emerald-400'; }
                                        else if (tp.accuracy >= 50) { color = 'bg-amber-500'; textColor = 'text-amber-400'; }

                                        return (
                                            <div key={idx}>
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
                                <div className="h-40 flex items-center justify-center text-neutral-500 text-sm">
                                    No topic data available
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-neutral-800">
                                <p className="text-xs text-neutral-500 italic text-center">
                                    💡 Tip: Focus on topics with {'<'} 50% accuracy in your next practice.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Actions (3 cols) */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5 mb-2">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Next Steps</h3>

                            <Link
                                href={`/sprint/${result.sprintId}/review`}
                                className="w-full flex items-center justify-center gap-2 py-3.5 mb-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-all border border-neutral-700 hover:border-neutral-600 group"
                            >
                                <TargetIcon sx={{ fontSize: '1.1rem' }} className="text-neutral-400 group-hover:text-white transition-colors" />
                                Review Questions
                            </Link>

                            <button
                                onClick={handleRetrySprint}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-600 text-sm font-semibold transition-all mb-1"
                                title="Start a new sprint with the same configuration"
                            >
                                🔁 Retry This Sprint
                            </button>
                        </div>

                        <Link
                            href="/sprint"
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold shadow-lg transition-all ${isQuant
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25'
                                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-violet-500/25'
                                }`}
                        >
                            <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
                            New Sprint
                        </Link>

                        <Link
                            href="/sprint/history"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-neutral-400 hover:text-white transition-all hover:bg-neutral-900/50"
                        >
                            <ArrowBackIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-sm">Back to History</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
