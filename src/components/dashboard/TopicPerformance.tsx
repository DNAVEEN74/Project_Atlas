
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
    pacing_category?: string;
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
        <div className={`bg-[#141414] rounded-[24px] border border-[#1f1f1f] overflow-hidden flex flex-col h-full ${className}`}>
            <div className="flex justify-between items-center p-4 border-b border-[#1f1f1f] shrink-0">
                <div className="flex items-center gap-2">
                    <TargetIcon className="text-[#FFB951] w-5 h-5" />
                    <h3 className="font-bold text-[#E6E1E5] text-lg">Topic Performance</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-[#938F99] tracking-wider uppercase hidden sm:block">{subjectLabel}</span>
                    <Link href="/dashboard/topics" className="text-xs font-medium text-[#FFB951] hover:text-[#FFDE9C] transition-colors">
                        View All →
                    </Link>
                </div>
            </div>

            <div className="p-4 space-y-6 flex-1 flex flex-col justify-center">
                {displayTopics.length === 0 ? (
                    <div className="text-center py-8 text-[#938F99] text-sm font-medium">
                        No topic data yet. Start practicing!
                    </div>
                ) : (
                    displayTopics.map((topic) => (
                        <div key={topic.pattern}>
                            <div className="flex justify-between items-center mb-1.5 gap-2">
                                <div className="text-sm font-medium text-[#E6E1E5] flex items-center gap-2 flex-1 min-w-0" title={topic.display_name}>
                                    <span className="truncate">{topic.display_name}</span>
                                    <div className="flex-shrink-0 flex gap-1">
                                        {topic.pacing_category === 'NEEDS_SPEED' && (
                                            <span className="text-[9px] font-bold tracking-wider text-[#FFB951] bg-[#594100]/30 px-1.5 py-0.5 rounded border border-[#FFB951]/20 whitespace-nowrap" title="Good accuracy, but slow solving time (Avg > 36s)">NEEDS SPEED</span>
                                        )}
                                        {topic.pacing_category === 'CARELESS_ERRORS' && (
                                            <span className="text-[9px] font-bold tracking-wider text-[#FFB4AB] bg-[#93000A]/30 px-1.5 py-0.5 rounded border border-[#FFB4AB]/20 whitespace-nowrap" title="Fast solving time (Avg < 36s), but low accuracy">CARELESS ERRORS</span>
                                        )}
                                        {topic.pacing_category === 'NEEDS_REVIEW' && (
                                            <span className="text-[9px] font-bold tracking-wider text-[#FFB4AB] bg-[#93000A]/30 px-1.5 py-0.5 rounded border border-[#FFB4AB]/20 whitespace-nowrap" title="Low accuracy and slow solving time">CONCEPT GAP</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-[#938F99] font-medium">{topic.correct}/{topic.total}</span>
                                <span className={`text-sm font-bold ${getAccuracyColor(topic.accuracy, topic.total)}`}>
                                    {Math.round(topic.accuracy * 100)}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
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

        </div>
    );
};

function getAccuracyColor(accuracy: number, total: number): string {
    if (total === 0) return 'text-[#938F99]';
    if (accuracy >= 0.8) return 'text-[#6DD58C]';
    if (accuracy >= 0.5) return 'text-[#FFB951]';
    return 'text-[#FFB4AB]';
}

function getProgressBarColor(accuracy: number, total: number): string {
    if (total === 0) return 'bg-[#1f1f1f]'; // Unattempted
    if (accuracy >= 0.8) return 'bg-[#008942]';
    if (accuracy >= 0.5) return 'bg-[#FFB951]';
    return 'bg-[#FFB4AB]';
}

export default TopicPerformance;
