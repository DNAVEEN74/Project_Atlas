"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatTopicName } from '@/utils/format';
import { CustomSelect } from '@/components/ui/CustomSelect';
import Header from '@/components/layout/Header';
import { ChevronLeftIcon, RadioButtonUncheckedOutlinedIcon, CheckCircleIcon, TrendingUpIcon, WarningIcon, BarChartIcon } from '@/components/icons';

interface TopicStat {
    name: string;
    total: number;
    correct: number;
    accuracy: number;
    subject: string;
}

export default function TopicPerformancePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [sortBy, setSortBy] = useState('worst'); // 'worst' | 'best' | 'az'

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            setPageLoading(true);
            fetch('/api/attempts/stats')
                .then(res => res.json())
                .then(data => {
                    if (data.data) {
                        setStats(data.data);
                    }
                })
                .catch(err => console.error('Failed to fetch stats:', err))
                .finally(() => setPageLoading(false));
        }
    }, [user]);

    if (loading || pageLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    // Process and group topics
    const allTopics: TopicStat[] = stats?.topics || []; // Ensure API returns 'topics' array
    // Note: The API returns `bestTopic` and `worstTopic` but we need ALL topics.
    // I need to update the API to return the full list of topics as well.
    // Wait, the API returns `bestTopic` and `worstTopic` calculated from `topics` array but currently DOES NOT return `topics` array in the response `data`.
    // I must update the API to return `topics` array.

    // Placeholder for now until API is updated in next step
    const filteredTopics = (stats?.allTopics || []).filter((t: TopicStat) => {
        if (subjectFilter === 'all') return true;
        return t.subject === subjectFilter;
    });

    const sortTopics = (topics: TopicStat[]) => {
        return [...topics].sort((a, b) => {
            if (sortBy === 'worst') {
                // Prioritize ATTEMPTED topics with lowest accuracy
                // 1. Attempted (lowest accuracy first)
                // 2. Unattempted (at bottom)

                const aAttempted = a.total > 0;
                const bAttempted = b.total > 0;

                if (aAttempted && !bAttempted) return -1; // a comes first
                if (!aAttempted && bAttempted) return 1;  // b comes first
                if (!aAttempted && !bAttempted) return a.name.localeCompare(b.name); // both unattempted (A-Z)

                // Both attempted: distinct by accuracy asc, then total desc
                return (a.accuracy - b.accuracy) || (b.total - a.total);
            } else if (sortBy === 'best') {
                // Highest Accuracy first, then Highest Attempts
                return (b.accuracy - a.accuracy) || (b.total - a.total);
            } else {
                // A-Z
                return a.name.localeCompare(b.name);
            }
        });
    };

    const groupedTopics = {
        QUANT: sortTopics(filteredTopics.filter((t: TopicStat) => t.subject === 'QUANT')),
        REASONING: sortTopics(filteredTopics.filter((t: TopicStat) => t.subject === 'REASONING'))
    };

    const hasQuant = groupedTopics.QUANT.length > 0;
    const hasReasoning = groupedTopics.REASONING.length > 0;

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            <Header activePage="dashboard" />

            <main className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BarChartIcon className="text-indigo-400 w-8 h-8" />
                            Topic Performance
                        </h1>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#1a1a1a] p-4 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <CustomSelect
                                value={subjectFilter}
                                onChange={setSubjectFilter}
                                options={[
                                    { value: 'all', label: 'All Subjects' },
                                    { value: 'QUANT', label: 'Quantitative Aptitude' },
                                    { value: 'REASONING', label: 'Reasoning' }
                                ]}
                            />
                            <CustomSelect
                                value={sortBy}
                                onChange={setSortBy}
                                options={[
                                    { value: 'worst', label: 'Sort: Worst First' },
                                    { value: 'best', label: 'Sort: Best First' },
                                    { value: 'az', label: 'Sort: A-Z' }
                                ]}
                            />
                        </div>
                        <div className="text-neutral-400 text-sm">
                            Showing {filteredTopics.length} topics
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-10">
                        {(!hasQuant && !hasReasoning) && (
                            <div className="text-center py-12 text-neutral-500">
                                No topic data available based on current filters.
                            </div>
                        )}

                        {hasQuant && (subjectFilter === 'all' || subjectFilter === 'QUANT') && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-wider px-2">Quantitative Aptitude</h3>
                                <div className="space-y-3">
                                    {groupedTopics.QUANT.map(topic => (
                                        <TopicRow key={topic.name} topic={topic} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasReasoning && (subjectFilter === 'all' || subjectFilter === 'REASONING') && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider px-2">Reasoning</h3>
                                <div className="space-y-3">
                                    {groupedTopics.REASONING.map(topic => (
                                        <TopicRow key={topic.name} topic={topic} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function getStatusBadge(total: number, accuracy: number) {
    if (total === 0) {
        return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1.5">
                <RadioButtonUncheckedOutlinedIcon className="w-3.5 h-3.5" />
                Not Started
            </span>
        );
    }
    if (accuracy >= 70) {
        return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Mastered
            </span>
        );
    }
    if (accuracy >= 50) {
        return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5">
                <TrendingUpIcon className="w-3.5 h-3.5" />
                Improving
            </span>
        );
    }
    return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5">
            <WarningIcon className="w-3.5 h-3.5" />
            Needs Work
        </span>
    );
}

function TopicRow({ topic }: { topic: TopicStat }) {
    return (
        <div className="bg-[#1a1a1a] hover:bg-neutral-800/80 border border-neutral-800 rounded-xl p-4 transition-all group">
            <div className="flex items-center gap-4">
                {/* Name */}
                <div className="w-48 md:w-64 shrink-0">
                    <div className="font-medium text-white truncate" title={formatTopicName(topic.name)}>
                        {formatTopicName(topic.name)}
                    </div>
                </div>

                {/* Accuracy Badge (Mobile/Compact) */}
                <div className="shrink-0 md:hidden">
                    <span className={`font-mono text-sm font-bold ${topic.accuracy >= 80 ? 'text-emerald-500' :
                        topic.accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                        {topic.accuracy}%
                    </span>
                </div>

                {/* Progress Bar & Stats (Desktop) */}
                <div className="hidden md:flex flex-1 items-center gap-6">
                    <div className="flex-1 flex items-center gap-3">
                        <div className="text-xs text-neutral-400 font-mono w-16 text-right">
                            {topic.correct}/{topic.total}
                        </div>
                        <div className="flex-1 h-2 rounded-full overflow-hidden relative">
                            {topic.total === 0 ? (
                                // Dotted empty bar
                                <div className="absolute inset-0 w-full h-full flex items-center">
                                    <div className="w-full border-b-2 border-dotted border-neutral-700"></div>
                                </div>
                            ) : (
                                // Progress bar
                                <div className="w-full h-full bg-neutral-800">
                                    <div
                                        className={`h-full rounded-full ${topic.accuracy >= 80 ? 'bg-emerald-500' :
                                            topic.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                        style={{ width: `${topic.accuracy}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                        <div className="text-sm font-bold font-mono w-10 text-right text-neutral-300">
                            {topic.accuracy === 0 ? '—' : `${topic.accuracy}%`}
                        </div>
                    </div>

                    {/* Status Badge (Desktop) */}
                    <div className="w-32 flex justify-center">
                        {getStatusBadge(topic.total, topic.accuracy)}
                    </div>
                </div>

                {/* CTA */}
                <div className="shrink-0 ml-auto">
                    <Link
                        href={`/problems?pattern=${topic.name}`}
                        className="text-xs font-medium text-neutral-900 bg-white hover:bg-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                    >
                        Practice <span>→</span>
                    </Link>
                </div>
            </div>
            {/* Progress Bar (Mobile) */}
            <div className="mt-3 md:hidden h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${topic.accuracy >= 80 ? 'bg-emerald-500' :
                        topic.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                    style={{ width: `${topic.accuracy}%` }}
                ></div>
            </div>
        </div>
    );
}
