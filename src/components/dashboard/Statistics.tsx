
'use client';

import React from 'react';

interface StatisticsProps {
    accuracy: number;     // 0-1
    avg_time_ms: number;
    total_solved: number;
    streak: number;
    max_streak: number;
    className?: string;
}

const Statistics: React.FC<StatisticsProps> = ({
    accuracy,
    avg_time_ms,
    total_solved,
    streak,
    max_streak,
    className
}) => {
    // Format time: 42s or 1m 20s
    const formatTime = (ms: number) => {
        const seconds = Math.round(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    // Dynamic Color Logic
    const getAccuracyColor = (acc: number) => acc >= 0.9 ? 'text-emerald-400' : 'text-rose-500';
    const getTimeColor = (ms: number) => {
        const seconds = ms / 1000;
        if (seconds < 36) return 'text-amber-500'; // Too fast
        return 'text-emerald-400'; // Good pace
    };
    const getStreakColor = (s: number) => s > 0 ? 'text-orange-500' : 'text-neutral-500';

    const stats = [
        {
            label: "Accuracy",
            value: `${Math.round(accuracy * 100)}%`,
            subtext: "Goal: 90%",
            color: getAccuracyColor(accuracy),
            bg: "bg-[#1a1a1a]",
            border: "border-neutral-800"
        },
        {
            label: "Avg Time",
            value: formatTime(avg_time_ms),
            subtext: "Target: 36s",
            color: getTimeColor(avg_time_ms),
            bg: "bg-[#1a1a1a]",
            border: "border-neutral-800"
        },
        {
            label: "Solved",
            value: total_solved,
            subtext: "All-time Solved",
            color: "text-white", // Neutral as requested
            bg: "bg-[#1a1a1a]",
            border: "border-neutral-800"
        },
        {
            label: "Streak",
            value: streak > 0 ? `${streak} 🔥` : '0 💤',
            subtext: `Max: ${max_streak}`,
            color: getStreakColor(streak),
            bg: "bg-[#1a1a1a]",
            border: "border-neutral-800"
        }
    ];

    return (
        <div className={`grid grid-cols-2 gap-4 ${className}`}>
            {stats.map((stat, idx) => (
                <div key={idx} className={`rounded-xl p-4 border ${stat.bg} ${stat.border}`}>
                    <div className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">
                        {stat.label}
                    </div>
                    <div className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                        {stat.subtext}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Statistics;
