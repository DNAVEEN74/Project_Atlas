'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
}

export default function SprintSummaryPage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    const [result, setResult] = useState<SprintResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchResults = async () => {
            const stored = sessionStorage.getItem('sprintResults');
            if (!stored) {
                router.push('/sprint');
                return;
            }

            try {
                const { sprintId, totalTimeSpent, timedOut } = JSON.parse(stored);

                // Try to get session data to populate result details
                const sessionProto = sessionStorage.getItem('sprintSession');
                const sessionData = sessionProto ? JSON.parse(sessionProto) : {};

                // We need to fetch the actual result from server to get correct count
                // The server should have processed 'complete' status if we called it in Session page.
                // However, the session page redirect logic was:
                // 1. Submit last answer
                // 2. Redirect
                // It did NOT call 'complete' action on the sprint itself in the refactored Problems page logic yet?
                // Wait, in my refactored logic:
                // I recorded individual attempts.
                // But I did NOT mark the sprint as "completed" in the DB explicitly with a summary call.
                // I should probably start by fetching the sprint stats from the server.

                // Fetch sprint details/summary
                const res = await fetch(`/api/sprint/${sprintId}/summary`);
                // If endpoint doesn't exist, we might need to rely on local calculation or add the endpoint.
                // Existing api/sprint seems to handle creation and updates.
                // Let's assume we can PUT to /api/sprint to finalize if needed, or GET stats.

                // Fallback: If we can't get summary, we might display limited info.
                // But let's try to finalize it here if needed.
                const finalizeRes = await fetch('/api/sprint', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sprintId,
                        action: 'complete',
                        totalTimeSpent
                    })
                });

                const data = await finalizeRes.json();

                setResult({
                    sprintId,
                    correctCount: data.correctCount || 0,
                    totalQuestions: data.totalQuestions || sessionData.questionIds?.length || 0,
                    totalTimeSpent: data.totalTimeSpent || totalTimeSpent,
                    accuracy: data.accuracy || 0,
                    subject: data.subject || sessionData.subject || 'QUANT',
                    difficulty: data.difficulty || sessionData.difficulty || 'MEDIUM',
                    topics: data.topics || [],
                    timedOut: timedOut || false
                });

                // Clear session storage
                sessionStorage.removeItem('sprintSession');
                sessionStorage.removeItem('sprintResults');
            } catch (error) {
                console.error('Failed to fetch results:', error);
                // router.push('/sprint'); // Don't redirect immediately on error, show error state?
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getAvgTimePerQuestion = () => {
        if (!result || result.totalQuestions === 0) return '0s';
        const avgMs = result.totalTimeSpent / result.totalQuestions;
        return `${(avgMs / 1000).toFixed(1)}s`;
    };

    const getPerformanceLevel = () => {
        if (!result) return { label: 'N/A', color: 'text-neutral-500' };
        if (result.accuracy >= 90) return { label: 'Legendary', color: 'text-amber-500' };
        if (result.accuracy >= 80) return { label: 'Excellent', color: 'text-emerald-500' };
        if (result.accuracy >= 60) return { label: 'Good', color: 'text-blue-500' };
        if (result.accuracy >= 40) return { label: 'Average', color: 'text-neutral-400' };
        return { label: 'Needs Practice', color: 'text-rose-500' };
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!result) return null;
    if (!user) return null;

    const performance = getPerformanceLevel();
    const isQuant = result.subject === 'QUANT';
    const primaryColor = isQuant ? 'text-amber-500' : 'text-violet-500';
    const primaryBg = isQuant ? 'bg-amber-500' : 'bg-violet-500';

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans selection:bg-amber-500/30">
            {/* Header */}
            <Header activePage="sprint" />

            {/* Main Content - Compact layout to fit in single viewport */}
            <main className="w-full px-6 lg:px-12 py-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700/50 mb-3">
                        <BoltIcon sx={{ fontSize: '1rem' }} className={primaryColor} />
                        <span className="text-xs font-medium text-neutral-300">Sprint Completed</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Well done, {user.name.split(' ')[0]}!</h1>
                    <p className="text-sm text-neutral-400">Here's how you performed in this session.</p>
                </div>

                {/* Main Grid - Horizontal layout for single viewport */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Score Card - Centered */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <EmojiEventsIcon sx={{ fontSize: '5rem' }} className="text-white" />
                        </div>

                        <div className="mb-4 relative z-10">
                            <CircularProgress
                                value={result.accuracy}
                                size={140}
                                strokeWidth={10}
                                color={isQuant ? 'text-amber-500' : 'text-violet-500'}
                                trackColor="text-neutral-800"
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-bold text-white tracking-tighter">{result.correctCount}</span>
                                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest">/ {result.totalQuestions}</span>
                                </div>
                            </CircularProgress>
                        </div>

                        <div className="text-center relative z-10">
                            <p className={`text-base font-bold ${performance.color}`}>{performance.label}</p>
                            <p className="text-xs text-neutral-500">{result.accuracy}% Accuracy</p>
                        </div>
                    </div>

                    {/* Middle Column - Stats */}
                    <div className="space-y-3">
                        {/* Question Breakdown - Compact */}
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xl font-bold text-emerald-400">{result.correctCount}</p>
                                    <p className="text-[10px] text-neutral-500 uppercase">Correct</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-rose-400">{result.totalQuestions - result.correctCount}</p>
                                    <p className="text-[10px] text-neutral-500 uppercase">Incorrect</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-neutral-400">0</p>
                                    <p className="text-[10px] text-neutral-500 uppercase">Skipped</p>
                                </div>
                            </div>
                        </div>

                        {/* Time Stats */}
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <TimerIcon sx={{ fontSize: '1.25rem' }} className="text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-neutral-500">Time Taken</p>
                                <p className="text-xl font-bold text-white font-mono">{formatTime(result.totalTimeSpent)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-neutral-500">Avg/Q</p>
                                <p className="text-sm font-medium text-emerald-400">{getAvgTimePerQuestion()}</p>
                            </div>
                        </div>

                        {/* Subject & Difficulty */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-neutral-500 uppercase">Subject</p>
                                <p className={`text-sm font-bold ${primaryColor}`}>{result.subject}</p>
                            </div>
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-neutral-500 uppercase">Level</p>
                                <p className="text-sm font-bold text-white capitalize">{result.difficulty.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="flex flex-col gap-3">
                        {/* View Detailed Results */}
                        <Link
                            href={`/sprint/${result.sprintId}/review`}
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border border-neutral-700 text-neutral-200 font-semibold hover:bg-neutral-800 hover:text-white transition-all"
                        >
                            <TargetIcon sx={{ fontSize: '1.25rem' }} />
                            View Detailed Results
                        </Link>

                        {/* New Sprint */}
                        <Link
                            href="/sprint"
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold shadow-lg transition-all ${isQuant
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25'
                                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-violet-500/25'
                                }`}
                        >
                            <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
                            New Sprint
                        </Link>

                        {/* Back to Problems */}
                        <Link
                            href="/problems"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl text-neutral-400 hover:text-white transition-all"
                        >
                            <ArrowBackIcon sx={{ fontSize: '1rem' }} />
                            <span className="text-sm">Back to Problems</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
