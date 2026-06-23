"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatTopicName } from '@/utils/format';
import { CustomSelect } from '@/components/ui/CustomSelect';
import Header from '@/components/layout/Header';
import { ChevronLeftIcon, BarChartIcon, TargetIcon, RocketLaunchIcon, WarningIcon, TrendingUpIcon, CheckCircleIcon, BookIcon } from '@/components/icons';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

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

    const filteredTopics = (stats?.allTopics || []).filter((t: TopicStat) => {
        if (subjectFilter === 'all') return true;
        return t.subject === subjectFilter;
    });

    // Grouping by Mastery Level
    const mastered = filteredTopics.filter((t: TopicStat) => t.total > 0 && t.accuracy >= 80).sort((a: TopicStat, b: TopicStat) => b.accuracy - a.accuracy);
    const improving = filteredTopics.filter((t: TopicStat) => t.total > 0 && t.accuracy >= 50 && t.accuracy < 80).sort((a: TopicStat, b: TopicStat) => b.accuracy - a.accuracy);
    const needsWork = filteredTopics.filter((t: TopicStat) => t.total > 0 && t.accuracy < 50).sort((a: TopicStat, b: TopicStat) => a.accuracy - b.accuracy);
    const notStarted = filteredTopics.filter((t: TopicStat) => t.total === 0).sort((a: TopicStat, b: TopicStat) => a.name.localeCompare(b.name));

    // Radar Chart Data - Top 6 most attempted topics to form a nice web
    const radarData = [...(stats?.allTopics || [])]
        .sort((a: TopicStat, b: TopicStat) => b.total - a.total)
        .slice(0, 6)
        .map((t: TopicStat) => ({
            subject: formatTopicName(t.name).substring(0, 15) + (t.name.length > 15 ? '...' : ''),
            accuracy: t.accuracy,
            fullMark: 100
        }));

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            <Header activePage="dashboard" />

            <main className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3 tracking-tight">
                            <BarChartIcon className="text-indigo-400 w-8 h-8" />
                            Topic Performance
                        </h1>
                    </div>

                    {/* Top Level: Radar Chart + Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* The Skill Web */}
                        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-3xl border border-neutral-800 p-6 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <TargetIcon className="text-indigo-400 w-5 h-5" />
                                Performance Overview
                            </h3>
                            <p className="text-sm text-neutral-400 mb-6">Your accuracy mapped across your top 6 most practiced topics.</p>
                            
                            <div className="w-full h-[300px]">
                                {radarData.length >= 3 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                            <PolarGrid stroke="#333" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11 }} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                                                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                                            />
                                            <Radar name="Accuracy" dataKey="accuracy" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                        Practice more topics to unlock your Performance Overview.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls & Quick Stats */}
                        <div className="bg-[#1a1a1a] rounded-3xl border border-neutral-800 p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6">Filter Options</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Filter by Subject</label>
                                        <CustomSelect
                                            value={subjectFilter}
                                            onChange={setSubjectFilter}
                                            options={[
                                                { value: 'all', label: 'All Subjects' },
                                                { value: 'QUANT', label: 'Quantitative Aptitude' },
                                                { value: 'REASONING', label: 'Reasoning' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-neutral-800/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800/50">
                                        <div className="text-2xl font-black text-white">{mastered.length}</div>
                                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Mastered</div>
                                    </div>
                                    <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800/50">
                                        <div className="text-2xl font-black text-white">{needsWork.length}</div>
                                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Critical</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mastered Section */}
                    {mastered.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-xl font-black text-emerald-500 mb-6 flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6" /> Mastered
                            </h2>
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {mastered.map(topic => (
                                    <motion.div key={topic.name} variants={itemVariants} className="h-full">
                                        <TopicCard topic={topic} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* Improving Section */}
                    {improving.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-xl font-black text-amber-500 mb-6 flex items-center gap-2">
                                <TrendingUpIcon className="w-6 h-6" /> Improving
                            </h2>
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {improving.map(topic => (
                                    <motion.div key={topic.name} variants={itemVariants} className="h-full">
                                        <TopicCard topic={topic} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* Needs Work Section */}
                    {needsWork.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-xl font-black text-rose-500 mb-6 flex items-center gap-2">
                                <WarningIcon className="w-6 h-6" /> Needs Work
                            </h2>
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {needsWork.map(topic => (
                                    <motion.div key={topic.name} variants={itemVariants} className="h-full">
                                        <TopicCard topic={topic} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* Not Started Section */}
                    {notStarted.length > 0 && (
                        <div className="mb-12 opacity-70 hover:opacity-100 transition-opacity">
                            <h2 className="text-xl font-black text-neutral-500 mb-6 flex items-center gap-2">
                                <BookIcon className="w-6 h-6" /> Not Started
                            </h2>
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {notStarted.map(topic => (
                                    <motion.div key={topic.name} variants={itemVariants} className="h-full">
                                        <TopicCard topic={topic} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function TopicCard({ topic }: { topic: TopicStat }) {
    const isNotStarted = topic.total === 0;
    
    let colorClass = 'text-neutral-500';
    let progressBg = 'bg-neutral-800';
    let progressFill = 'bg-neutral-600';

    if (!isNotStarted) {
        if (topic.accuracy >= 80) {
            colorClass = 'text-emerald-500';
            progressBg = 'bg-emerald-500/10';
            progressFill = 'bg-emerald-500';
        }
        else if (topic.accuracy >= 50) {
            colorClass = 'text-amber-500';
            progressBg = 'bg-amber-500/10';
            progressFill = 'bg-amber-500';
        }
        else {
            colorClass = 'text-rose-500';
            progressBg = 'bg-rose-500/10';
            progressFill = 'bg-rose-500';
        }
    }

    return (
        <div className="bg-[#121212] hover:bg-[#181818] border border-neutral-800/60 hover:border-neutral-700 rounded-xl p-5 transition-colors flex flex-col h-full group">
            <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1.5 block">
                        {topic.subject}
                    </span>
                    <h4 className="font-semibold text-neutral-200 text-base leading-snug line-clamp-2" title={formatTopicName(topic.name)}>
                        {formatTopicName(topic.name)}
                    </h4>
                </div>
                {!isNotStarted && (
                    <div className={`text-2xl font-bold tracking-tight ${colorClass}`}>
                        {topic.accuracy}%
                    </div>
                )}
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-center mb-2.5">
                    <div className="text-xs font-medium text-neutral-400">
                        {isNotStarted ? 'No attempts yet' : `${topic.correct} of ${topic.total} correct`}
                    </div>
                </div>
                
                {/* Thin, minimalist progress bar */}
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${progressBg}`}>
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${progressFill}`}
                        style={{ width: `${Math.max(topic.accuracy, isNotStarted ? 0 : 2)}%` }}
                    />
                </div>

                <div className="mt-5">
                    <Link
                        href={`/problems?pattern=${topic.name}`}
                        className="w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-neutral-400 bg-neutral-900 hover:bg-neutral-800 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-700"
                    >
                        Practice Topic
                    </Link>
                </div>
            </div>
        </div>
    );
}
