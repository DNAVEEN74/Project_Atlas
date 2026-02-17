
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { TargetIcon } from '@/components/icons';

// ... (interface remains same)
interface TopicStat {
    pattern: string;
    display_name: string;
    subject: string;
    total: number;
    correct: number;
    accuracy: number;
    avg_time_ms: number;
}

interface TopicPerformanceProps {
    stats: TopicStat[];
    className?: string;
    selectedSubject?: string;
}

const TopicPerformance: React.FC<TopicPerformanceProps> = ({ stats, className, selectedSubject = 'All Subjects' }) => {
    // Show top 5 worst performing topics (API already sorts by ascending accuracy)
    const worstTopics = stats.filter(t => t.total >= 3).slice(0, 5);

    // If no topics have enough data, show empty state or just the first few
    const displayTopics = worstTopics.length > 0 ? worstTopics : stats.slice(0, 5);

    const subjectLabel = selectedSubject === 'ALL' ? 'All Subjects' :
        selectedSubject === 'QUANT' ? 'Quantitative Aptitude' :
            selectedSubject === 'REASONING' ? 'Reasoning' : selectedSubject;

    return (
        <div className={`bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <TargetIcon className="text-indigo-500 w-5 h-5" />
                    <h3 className="font-bold text-white text-lg">Topic Performance</h3>
                </div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{subjectLabel}</span>
            </div>

            <div className="space-y-5">
                {displayTopics.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                        No topic data yet. Start practicing!
                    </div>
                ) : (
                    displayTopics.map((topic) => (
                        <div key={topic.pattern}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-neutral-300" title={topic.display_name}>
                                    {topic.display_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-neutral-500">{topic.correct}/{topic.total}</span>
                                <span className={`text-sm font-bold ${getAccuracyColor(topic.accuracy, topic.total)}`}>
                                    {Math.round(topic.accuracy * 100)}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    // Let's just use the calculated width.
                                    animate={{ width: `${topic.accuracy * 100}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full rounded-full ${getProgressBarColor(topic.accuracy, topic.total)}`}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Link
                href="/dashboard/topics"
                className="block w-full mt-6 py-2 text-sm text-center text-indigo-400 font-medium hover:bg-neutral-800 rounded-lg transition-colors"
            >
                View All Topics →
            </Link>
        </div>
    );
};

function getAccuracyColor(accuracy: number, total: number): string {
    if (total === 0) return 'text-neutral-500';
    if (accuracy >= 0.8) return 'text-emerald-400';
    if (accuracy >= 0.5) return 'text-amber-400';
    return 'text-rose-400';
}

function getProgressBarColor(accuracy: number, total: number): string {
    if (total === 0) return 'bg-neutral-700'; // Unattempted
    if (accuracy >= 0.8) return 'bg-emerald-500';
    if (accuracy >= 0.5) return 'bg-amber-400';
    return 'bg-rose-400';
}

export default TopicPerformance;
