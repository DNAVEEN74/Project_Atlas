
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
    const getAccuracyColor = (acc: number) => acc >= 0.9 ? 'text-[#6DD58C]' : 'text-[#FFB4AB]';
    const getStreakColor = (s: number) => s > 0 ? 'text-[#FFB951]' : 'text-[#938F99]';

    const stats = [
        {
            label: "Accuracy",
            value: `${Math.round(accuracy * 100)}%`,
            subtext: "Goal: 90%",
            color: getAccuracyColor(accuracy),
            bg: "bg-[#141414]",
            border: "border-[#1f1f1f]"
        },
        {
            label: "Solved",
            value: total_solved,
            subtext: "All-time Solved",
            color: "text-[#E6E1E5]", 
            bg: "bg-[#141414]",
            border: "border-[#1f1f1f]"
        },
        {
            label: "Streak",
            value: streak > 0 ? `${streak} 🔥` : '0 💤',
            subtext: `Max: ${max_streak}`,
            color: getStreakColor(streak),
            bg: "bg-[#141414]",
            border: "border-[#1f1f1f]"
        },
        {
            label: "Discipline",
            value: `${Math.round(sprint_discipline * 100)}%`,
            subtext: "Sprint completion rate",
            color: sprint_discipline > 0.8 ? "text-[#6DD58C]" : "text-[#FFB951]",
            bg: sprint_discipline > 0.8 ? "bg-[#003912]/30" : "bg-[#594100]/30",
            border: sprint_discipline > 0.8 ? "border-[#005325]" : "border-[#FFB951]/30"
        }
    ];

    return (
        <div className={`grid grid-cols-2 gap-4 h-full ${className || ''}`}>
            {stats.map((stat, idx) => (
                <div key={idx} className={`rounded-[24px] p-4 border flex flex-col justify-center h-full ${stat.bg} ${stat.border}`}>
                    <div className="text-[#CAC4D0] text-xs font-medium tracking-wide mb-2">
                        {stat.label}
                    </div>
                    <div className={`text-3xl font-medium tracking-tight ${stat.color}`}>
                        {stat.value}
                    </div>
                    <div className="text-[10px] text-[#938F99] mt-2">
                        {stat.subtext}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Statistics;
