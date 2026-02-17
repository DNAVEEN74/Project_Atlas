
'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { BarChartIcon } from '@/components/icons';

// ... (interface remains same)
interface DifficultyStat {
    total: number;
    correct: number;
    accuracy: number;
}

interface DifficultyBreakdownProps {
    stats: {
        EASY?: DifficultyStat;
        MEDIUM?: DifficultyStat;
        HARD?: DifficultyStat;
    };
    className?: string;
    isGlobal?: boolean;
}

const DifficultyBreakdown: React.FC<DifficultyBreakdownProps> = ({ stats, className, isGlobal = false }) => {

    const levels = [
        { key: 'EASY', label: 'Easy', color: 'bg-emerald-500', text: 'text-emerald-400' },
        { key: 'MEDIUM', label: 'Medium', color: 'bg-amber-400', text: 'text-amber-400' },
        { key: 'HARD', label: 'Hard', color: 'bg-rose-400', text: 'text-rose-400' },
    ] as const;

    return (
        <div className={`bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <BarChartIcon className="text-emerald-500 w-5 h-5" />
                    <h3 className="font-bold text-white text-lg">Difficulty</h3>
                </div>
                {isGlobal && (
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded border border-neutral-800">Global Stats</span>
                )}
            </div>

            <div className="space-y-5">
                {levels.map((level) => {
                    const stat = stats[level.key] || { total: 0, correct: 0, accuracy: 0 };

                    return (
                        <div key={level.key}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className={`text-sm font-medium ${level.text}`}>{level.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-neutral-500">{stat.correct}/{stat.total}</span>
                                    {stat.total > 0 ? (
                                        <span className="text-sm font-bold text-neutral-300">
                                            {Math.round(stat.accuracy * 100)}%
                                        </span>
                                    ) : (
                                        <span className="text-sm text-neutral-600">—</span>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.accuracy * 100}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full rounded-full ${level.color}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DifficultyBreakdown;
