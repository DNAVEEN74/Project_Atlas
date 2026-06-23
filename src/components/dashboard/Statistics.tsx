
'use client';

import React from 'react';

interface StatisticsProps {
    accuracy: number;     // 0-1
    total_solved: number;
    streak: number;
    max_streak: number;
    sprint_discipline?: number;
    className?: string;
}

const Statistics: React.FC<StatisticsProps> = ({
    accuracy,
    total_solved,
    streak,
    max_streak,
    sprint_discipline = 0,
    className
}) => {
    // Dynamic Color Logic
    const getAccuracyColor = (acc: number) => acc >= 0.9 ? 'text-emerald-400' : 'text-rose-500';
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
            label: "Solved",
            value: total_solved,
            subtext: "All-time Solved",
            color: "text-white", 
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
        },
        {
            label: "Discipline",
            value: `${Math.round(sprint_discipline * 100)}%`,
            subtext: "Sprint completion rate",
            color: sprint_discipline > 0.8 ? "text-emerald-400" : "text-amber-500",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/20"
        }
    ];

    return (
        <div className={`grid grid-cols-2 gap-4 h-full ${className || ''}`}>
            {stats.map((stat, idx) => (
                <div key={idx} className={`rounded-xl p-4 border flex flex-col justify-center h-full ${stat.bg} ${stat.border}`}>
                    <div className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
                        {stat.label}
                    </div>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2">
                        {stat.subtext}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Statistics;
