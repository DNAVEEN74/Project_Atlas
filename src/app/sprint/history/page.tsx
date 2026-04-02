'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    BoltIcon,
    TrendingUpIcon
} from '@/components/icons';
import { TrophyIcon, InfoIcon, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import SummaryCards from '@/components/sprint/SummaryCards';
import AccuracyTrendChart from '@/components/sprint/AccuracyTrendChart';

interface SprintSubmission {
    id: string;
    createdAt: string;
    subject: string;
    topics: string[];
    difficulty: string;
    score: number;
    incorrectCount: number;
    skippedCount: number;
    totalQuestions: number;
    accuracy: number;
    timeTaken: number;
    completed: boolean;
    topicPerformance?: any[];
}

export default function SprintHistoryPage() {
    const { user, loading } = useAuth();

    // State
    const [sessions, setSessions] = useState<SprintSubmission[]>([]);
    const [stats, setStats] = useState({
        totalSprints: 0,
        avgAccuracy: 0,
        completedCount: 0,
        avgTimePerQuestion: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 0,
        pages: 1,
        limit: 10
    });

    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, QUANT, REASONING
    const [analytics, setAnalytics] = useState<any>(null);

    // Fetch Data
    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // Build query params
                const params = new URLSearchParams({
                    page: pagination.current.toString(),
                    limit: '10', // Fixed 10 rows per page
                    filter: filter
                });

                const [historyRes, analyticsRes] = await Promise.all([
                    fetch(`/api/sprint/history?${params.toString()}`),
                    fetch(`/api/sprint/analytics/global`) // Fetch global analytics once
                ]);

                if (historyRes.ok) {
                    const data = await historyRes.json();
                    if (data.stats) setStats(data.stats);
                    if (data.sessions) setSessions(data.sessions);
                    if (data.chartData) setChartData(data.chartData);
                    if (data.pagination) setPagination(prev => ({ ...prev, ...data.pagination }));
                }

                if (analyticsRes.ok) {
                    const analyticsData = await analyticsRes.json();
                    if (analyticsData.success && analyticsData.analytics) {
                        setAnalytics(analyticsData.analytics);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [user, filter, pagination.current]); // Re-fetch on filter or page change

    // Helpers
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, current: newPage }));
        }
    };

    const filteredAnalytics = useMemo(() => {
        if (!analytics) return null;
        if (filter === 'ALL') return analytics;

        return {
            efficiency_matrix: analytics.efficiency_matrix.filter((t: any) => t.subject === filter),
            red_zone_topics: analytics.red_zone_topics.filter((t: any) => t.subject === filter),
            exam_readiness: analytics.exam_readiness.filter((t: any) => t.subject === filter),
            difficulty_progression: analytics.difficulty_progression.filter((t: any) => t.subject === filter)
        };
    }, [analytics, filter]);

    const smartSprints = useMemo(() => {
        if (!filteredAnalytics) return [];

        const sprints = [];

        // 1. Fix Careless Mistakes
        const careless = filteredAnalytics.efficiency_matrix.filter((t: any) => t.category === 'CARELESS');
        if (careless.length > 0) {
            const primarySubject = careless[0].subject; // To ensure single-subject sprint creation
            const topicsToUse = careless.filter((t: any) => t.subject === primarySubject).slice(0, 5).map((t: any) => t.pattern.replace(/_/g, ' '));
            if (topicsToUse.length > 0) {
                sprints.push({
                    title: 'Fix Careless Mistakes',
                    description: 'Focus on accuracy over speed for these fast-but-wrong topics.',
                    icon: <AlertTriangle className="text-amber-500 w-5 h-5" />,
                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40',
                    params: `?subject=${primarySubject}&topics=${encodeURIComponent(topicsToUse.join(','))}&difficulty=MEDIUM&count=10`
                });
            }
        }

        // 2. Speed Drills
        const needsSpeed = filteredAnalytics.efficiency_matrix.filter((t: any) => t.category === 'NEEDS_SPEED');
        if (needsSpeed.length > 0) {
            const primarySubject = needsSpeed[0].subject;
            const topicsToUse = needsSpeed.filter((t: any) => t.subject === primarySubject).slice(0, 5).map((t: any) => t.pattern.replace(/_/g, ' '));
            if (topicsToUse.length > 0) {
                sprints.push({
                    title: 'Speed Drills',
                    description: 'You know these well. Now push your speed to the limit.',
                    icon: <BoltIcon className="text-blue-500" />,
                    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',
                    params: `?subject=${primarySubject}&topics=${encodeURIComponent(topicsToUse.join(','))}&difficulty=EASY&count=15`
                });
            }
        }

        // 3. Level Up Challenge
        const mastered = filteredAnalytics.efficiency_matrix.filter((t: any) => t.category === 'MASTERED');
        if (mastered.length > 0) {
            const primarySubject = mastered[0].subject;
            const topicsToUse = mastered.filter((t: any) => t.subject === primarySubject).slice(0, 5).map((t: any) => t.pattern.replace(/_/g, ' '));
            if (topicsToUse.length > 0) {
                sprints.push({
                    title: 'Level Up Challenge',
                    description: 'Test your true mastery with Hard difficulty questions.',
                    icon: <TrophyIcon className="text-emerald-500 w-5 h-5" />,
                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
                    params: `?subject=${primarySubject}&topics=${encodeURIComponent(topicsToUse.join(','))}&difficulty=HARD&count=10`
                });
            }
        }

        // 4. Fundamentals Review (if space permits)
        const review = filteredAnalytics.efficiency_matrix.filter((t: any) => t.category === 'NEEDS_REVIEW');
        if (review.length > 0 && sprints.length < 3) {
            const primarySubject = review[0].subject;
            const topicsToUse = review.filter((t: any) => t.subject === primarySubject).slice(0, 5).map((t: any) => t.pattern.replace(/_/g, ' '));
            if (topicsToUse.length > 0) {
                sprints.push({
                    title: 'Fundamentals Review',
                    description: 'Take your time. Focus purely on getting these right.',
                    icon: <BookOpen className="text-rose-500 w-5 h-5" />,
                    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40',
                    params: `?subject=${primarySubject}&topics=${encodeURIComponent(topicsToUse.join(','))}&difficulty=EASY&count=10`
                });
            }
        }

        return sprints.slice(0, 3); // Max 3 cards
    }, [filteredAnalytics]);

    const efficiencyGroups = useMemo(() => {
        if (!filteredAnalytics?.efficiency_matrix) return [];

        const groupConfig = [
            {
                key: 'MASTERED',
                title: 'Mastered',
                tone: 'Fast & accurate',
                hint: 'Try a harder level to keep improving.',
                containerClass: 'bg-emerald-500/5 border-emerald-500/20',
                titleClass: 'text-emerald-400',
                chipClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
                emptyClass: 'text-emerald-500/60'
            },
            {
                key: 'CARELESS',
                title: 'Careless Mistakes',
                tone: 'Fast & inaccurate',
                hint: 'Slow down and re-check before submitting.',
                containerClass: 'bg-amber-500/5 border-amber-500/20',
                titleClass: 'text-amber-400',
                chipClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                emptyClass: 'text-amber-500/60'
            },
            {
                key: 'NEEDS_SPEED',
                title: 'Needs Speed',
                tone: 'Slow & accurate',
                hint: 'Use timed drills to build pace.',
                containerClass: 'bg-blue-500/5 border-blue-500/20',
                titleClass: 'text-blue-400',
                chipClass: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
                emptyClass: 'text-blue-500/60'
            },
            {
                key: 'NEEDS_REVIEW',
                title: 'Review Concepts',
                tone: 'Slow & inaccurate',
                hint: 'Revisit foundations before more sprints.',
                containerClass: 'bg-rose-500/5 border-rose-500/20',
                titleClass: 'text-rose-400',
                chipClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
                emptyClass: 'text-rose-500/60'
            }
        ];

        return groupConfig.map((group) => ({
            ...group,
            topics: filteredAnalytics.efficiency_matrix.filter((topic: any) => topic.category === group.key)
        }));
    }, [filteredAnalytics]);

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-violet-500/30">
            <Header activePage="sprint" />

            <main className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                            Sprint History
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">
                            Track your performance and improvements over time
                        </p>
                    </div>

                    <Link
                        href="/sprint"
                        className="w-fit bg-white text-black px-4 py-2 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2"
                    >
                        <BoltIcon sx={{ fontSize: '1.1rem' }} />
                        New Sprint
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-3">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => { setFilter('ALL'); setPagination(p => ({ ...p, current: 1 })); }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'ALL'
                                ? 'bg-neutral-800 text-white border border-neutral-700'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                                }`}
                        >
                            All Sprints
                        </button>
                        <button
                            onClick={() => { setFilter('QUANT'); setPagination(p => ({ ...p, current: 1 })); }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'QUANT'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Quant
                        </button>
                        <button
                            onClick={() => { setFilter('REASONING'); setPagination(p => ({ ...p, current: 1 })); }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'REASONING'
                                ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                            Reasoning
                        </button>
                    </div>
                </div>

                {isLoading && sessions.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-800 bg-[#1a1a1a] flex flex-col items-center justify-center py-20 text-neutral-500 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-600 border-t-white animate-spin mb-4"></div>
                        <p>Loading history...</p>
                    </div>
                ) : stats.totalSprints === 0 && filter === 'ALL' ? (
                    <div className="rounded-2xl border border-neutral-800 bg-[#1a1a1a] p-16 text-center">
                        <TrophyIcon size={48} className="text-neutral-800 mb-2 mx-auto" />
                        <p className="text-neutral-500">No sprint history found.</p>
                        <Link href="/sprint" className="text-amber-500 hover:text-amber-400 text-sm font-medium mt-2 inline-block">
                            Start your first Sprint
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <SummaryCards
                            totalSprints={stats.totalSprints}
                            avgAccuracy={stats.avgAccuracy}
                            completedCount={stats.completedCount}
                            avgTimePerQuestion={stats.avgTimePerQuestion}
                        />

                        {/* Smart Global Analytics Dashboard */}
                        {filteredAnalytics && (
                            <section className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-8 space-y-6">
                                        {/* <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6">
                                            <div className="flex items-center justify-between gap-3 mb-6">
                                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <TrophyIcon className="w-5 h-5 text-amber-500" />
                                                    Exam Readiness
                                                </h2>
                                                <span className="text-[11px] text-neutral-500 uppercase tracking-widest font-bold">
                                                    Accuracy and Speed
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                {filteredAnalytics.exam_readiness.slice(0, 5).map((topic: any, idx: number) => {
                                                    const scoreColor = topic.score >= 80 ? 'bg-emerald-500' :
                                                        topic.score >= 65 ? 'bg-amber-500' :
                                                            topic.score >= 40 ? 'bg-blue-500' : 'bg-rose-500';

                                                    return (
                                                        <div key={idx} className="space-y-1.5">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <span className="text-sm font-semibold text-neutral-200 truncate">{topic.pattern.replace(/_/g, ' ')}</span>
                                                                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-neutral-700 text-neutral-500 shrink-0">{topic.subject}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <span className="text-xs text-neutral-400">{topic.label}</span>
                                                                    <span className="text-sm font-bold text-white">{topic.score}/100</span>
                                                                </div>
                                                            </div>
                                                            <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                                                                <div className={`h-full ${scoreColor} transition-all duration-700`} style={{ width: `${topic.score}%` }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {filteredAnalytics.exam_readiness.length === 0 && (
                                                    <p className="text-sm text-neutral-500 text-center py-4">
                                                        Complete more varied sprints to see readiness scores.
                                                    </p>
                                                )}
                                            </div>
                                        </div> */}

                                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-bold text-white">Efficiency Matrix Summary</h2>
                                                <span className="text-xs text-neutral-500">{filteredAnalytics.efficiency_matrix.length} tagged topics</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {efficiencyGroups.map((group) => (
                                                    <div key={group.key} className={`rounded-xl border p-4 ${group.containerClass}`}>
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className={`text-sm font-bold ${group.titleClass}`}>{group.title}</p>
                                                                <p className="text-[11px] uppercase tracking-wide text-neutral-500 mt-0.5">{group.tone}</p>
                                                                <p className="text-xs text-neutral-400 mt-2">{group.hint}</p>
                                                            </div>
                                                            <span className={`text-2xl font-black ${group.titleClass}`}>{group.topics.length}</span>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                                                            {group.topics.map((topic: any) => (
                                                                <span
                                                                    key={topic.pattern}
                                                                    className={`text-xs font-semibold px-2 py-1 rounded-md border ${group.chipClass}`}
                                                                    title={topic.message}
                                                                >
                                                                    {topic.pattern.replace(/_/g, ' ')}
                                                                </span>
                                                            ))}
                                                            {group.topics.length === 0 && (
                                                                <span className={`text-xs italic ${group.emptyClass}`}>No topics in this category yet.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="bg-[#1a1a1a] border border-rose-900/40 rounded-2xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                            <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2 mb-2 relative z-10">
                                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]"></span>
                                                Red Zone Topics
                                            </h2>
                                            <p className="text-sm text-neutral-400 mb-4 relative z-10">Topics pulling down your current performance.</p>

                                            <div className="space-y-3 relative z-10">
                                                {filteredAnalytics.red_zone_topics.length > 0 ? filteredAnalytics.red_zone_topics.map((topic: any, idx: number) => (
                                                    <div key={idx} className="bg-neutral-900/80 border border-rose-900/30 rounded-xl p-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-bold text-neutral-200">{topic.pattern.replace(/_/g, ' ')}</span>
                                                            <span className="text-sm font-bold text-rose-500">{topic.accuracy}% acc</span>
                                                        </div>
                                                        <Link
                                                            href={`/sprint?subject=${topic.subject}&topics=${encodeURIComponent(topic.pattern.replace(/_/g, ' '))}&difficulty=EASY&count=5`}
                                                            className="block w-full text-center text-xs py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg transition-colors border border-rose-500/20"
                                                        >
                                                            Practice Now
                                                        </Link>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-6">
                                                        <p className="text-sm text-emerald-400 font-semibold mb-1">No red-zone topics right now.</p>
                                                        <p className="text-xs text-neutral-500">Keep practicing to maintain this trend.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {filteredAnalytics.difficulty_progression.length > 0 && (
                                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6">
                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                    <TrendingUpIcon sx={{ fontSize: '1.2rem' }} className="text-emerald-400" />
                                                    Recommended Difficulty Moves
                                                </h2>
                                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                    {filteredAnalytics.difficulty_progression.map((item: any, idx: number) => (
                                                        <div key={idx} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex items-start gap-3">
                                                            <div className={`mt-1 bg-neutral-800 rounded-full px-2 py-1 text-[10px] font-bold ${item.recommendation === 'LEVEL_UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                {item.recommendation === 'LEVEL_UP' ? 'UP' : 'DOWN'}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white mb-0.5">{item.pattern.replace(/_/g, ' ')}</p>
                                                                <p className="text-xs text-neutral-400 leading-relaxed">{item.message}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {filteredAnalytics.topic_correlation && filteredAnalytics.topic_correlation.length > 0 && (
                                            <div className="bg-[#1a1a1a] border border-indigo-500/20 rounded-2xl p-6">
                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                    <InfoIcon className="w-5 h-5 text-indigo-400" />
                                                    Topic Interconnections
                                                </h2>
                                                <p className="text-xs text-neutral-400 mb-4">Insights based on related topic performance.</p>
                                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                    {filteredAnalytics.topic_correlation.map((item: any, idx: number) => (
                                                        <div key={idx} className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-xl relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                                                            <p className="text-sm text-neutral-300 leading-relaxed relative z-10">{item.message}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {filteredAnalytics.consistency_alerts && filteredAnalytics.consistency_alerts.length > 0 && (
                                            <div className="bg-[#1a1a1a] border border-amber-500/20 rounded-2xl p-6">
                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                    Consistency Warnings
                                                </h2>
                                                <p className="text-xs text-neutral-400 mb-4">Topics with volatile scores across recent sessions.</p>
                                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                    {filteredAnalytics.consistency_alerts.map((item: any, idx: number) => (
                                                        <div key={idx} className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                                                            <p className="text-sm font-bold text-amber-400 mb-1 relative z-10">{item.topic.replace(/_/g, ' ')}</p>
                                                            <p className="text-xs text-neutral-300 mb-3 leading-relaxed relative z-10">{item.message}</p>
                                                            <div className="flex gap-1 items-end h-8 relative z-10">
                                                                {item.history.map((acc: number, hIdx: number) => (
                                                                    <div key={hIdx} className="w-1.5 h-full bg-neutral-800 rounded-sm relative overflow-hidden" title={`${acc}%`}>
                                                                        <div className={`absolute bottom-0 left-0 right-0 transition-all ${acc >= 70 ? 'bg-emerald-500' : acc >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ height: `${Math.max(10, acc)}%` }}></div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {smartSprints.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {smartSprints.map((sprint, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/sprint${sprint.params}`}
                                                className={`flex flex-col p-5 bg-[#1a1a1a] border rounded-2xl group transition-all duration-300 ${sprint.color}`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2.5 rounded-xl bg-black/40 group-hover:scale-110 transition-transform duration-300">
                                                        {sprint.icon}
                                                    </div>
                                                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{sprint.title}</h3>
                                                </div>
                                                <p className="text-sm font-medium opacity-80 mb-6 flex-1">{sprint.description}</p>
                                                <div className="flex items-center text-xs font-bold uppercase tracking-wider gap-1">
                                                    Start Smart Sprint <ChevronRightIcon className="w-4 h-4" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                        {/* Chart - Use separate chartData */}
                        {/* <div className="[&>div]:mb-0">
                            <AccuracyTrendChart submissions={chartData} />
                        </div> */}

                        {/* Pagination Table */}
                        {sessions.length > 0 && (
                            <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#1a1a1a]">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                                    <h2 className="text-base font-semibold text-white">Sprint Sessions</h2>
                                    <span className="text-xs text-neutral-500">{pagination.total} total records</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <div className="min-w-[900px]">
                                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                                            <div className="col-span-3">Date</div>
                                            <div className="col-span-2">Subject</div>
                                            <div className="col-span-2">Topics</div>
                                            <div className="col-span-1">Diff</div>
                                            <div className="col-span-1 text-center">Score</div>
                                            <div className="col-span-1 text-center">Acc</div>
                                            <div className="col-span-1 text-center">Time</div>
                                            <div className="col-span-1 text-right">Action</div>
                                        </div>

                                        {sessions.map((sub) => (
                                            <div key={sub.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-neutral-800/30 transition-colors border-b border-neutral-800/50 last:border-0">
                                                <div className="col-span-3">
                                                    <p className="text-sm md:text-base font-medium text-neutral-200">{formatDate(sub.createdAt)}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded border ${sub.subject === 'QUANT'
                                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                        : 'bg-violet-500/10 text-violet-500 border-violet-500/20'}`}>
                                                        {sub.subject}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-sm text-neutral-400 truncate" title={sub.topics?.includes('ALL') ? 'All Topics' : sub.topics?.join(', ')}>
                                                    {sub.topics?.length ? (sub.topics.includes('ALL') ? 'All Topics' : sub.topics.join(', ')) : 'All Topics'}
                                                </div>
                                                <div className="col-span-1">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${sub.difficulty === 'HARD' ? 'bg-rose-500/20 text-rose-400' :
                                                        sub.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                                            'bg-emerald-500/20 text-emerald-400'
                                                        }`}>
                                                        {sub.difficulty || 'MEDIUM'}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 text-center">
                                                    <span className="text-base font-bold text-white">{sub.score}</span>
                                                    <span className="text-sm text-neutral-500">/{sub.totalQuestions}</span>
                                                </div>
                                                <div className="col-span-1 text-center">
                                                    <span className={`text-base font-bold ${sub.accuracy >= 80 ? 'text-emerald-400' : sub.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {sub.accuracy}%
                                                    </span>
                                                </div>
                                                <div className="col-span-1 text-center text-sm text-neutral-400 font-mono">
                                                    {formatTime(sub.timeTaken)}
                                                </div>
                                                <div className="col-span-1 flex justify-end">
                                                    <Link
                                                        href={`/sprint/${sub.id}/review`}
                                                        className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-all"
                                                    >
                                                        Review
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {pagination.pages > 1 && (
                                    <div className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-neutral-800 bg-neutral-900/30">
                                        <p className="text-xs text-neutral-500">
                                            Showing <span className="font-medium text-white">{(pagination.current - 1) * 10 + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.current * 10, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span> results
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.current - 1)}
                                                disabled={pagination.current === 1}
                                                className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
                                            </button>
                                            <div className="flex items-center gap-1 px-2">
                                                <span className="text-sm text-neutral-400">Page {pagination.current} of {pagination.pages}</span>
                                            </div>
                                            <button
                                                onClick={() => handlePageChange(pagination.current + 1)}
                                                disabled={pagination.current === pagination.pages}
                                                className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                            >
                                                <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

