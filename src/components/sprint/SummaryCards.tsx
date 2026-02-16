import React from 'react';
import {
    CalendarIcon,
    CheckCircle2Icon,
    TrendingUpIcon,
    AlertCircleIcon,
    ZapIcon,
    TimerIcon,
    TurtleIcon
} from 'lucide-react';

interface SummaryCardsProps {
    totalSprints: number;
    avgAccuracy: number;
    completedCount: number;
    avgTimePerQuestion: number;
}

export default function SummaryCards({
    totalSprints,
    avgAccuracy,
    completedCount,
    avgTimePerQuestion
}: SummaryCardsProps) {

    // Accuracy Helpers
    const getAccuracyColor = (acc: number) => {
        if (acc >= 70) return 'text-emerald-500';
        if (acc >= 40) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getAccuracyInsight = (acc: number) => {
        if (acc >= 70) return { icon: CheckCircle2Icon, text: 'Excellent!' };
        if (acc >= 40) return { icon: TrendingUpIcon, text: 'Good progress' };
        return { icon: AlertCircleIcon, text: 'Need work' };
    };
    const accInsight = getAccuracyInsight(avgAccuracy);
    const AccIcon = accInsight.icon;

    // Completion Helpers
    const completionRate = totalSprints > 0 ? Math.round((completedCount / totalSprints) * 100) : 0;
    const getCompletionColor = (rate: number) => {
        if (rate >= 80) return 'text-emerald-500';
        if (rate >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };
    const getCompletionIcon = (rate: number) => {
        if (rate >= 80) return CheckCircle2Icon;
        if (rate >= 50) return TrendingUpIcon;
        return AlertCircleIcon;
    };
    const CompIcon = getCompletionIcon(completionRate);

    // Time Helpers
    const targetTime = 36; // SSC CGL target
    const getTimeColor = (time: number) => {
        if (time <= targetTime) return 'text-violet-500';
        return 'text-orange-500';
    };
    const getTimeInsight = (time: number) => {
        if (time < 20) return { icon: ZapIcon, text: 'Too fast!' };
        if (time <= targetTime) return { icon: TimerIcon, text: 'Good pace' };
        return { icon: TurtleIcon, text: 'Too slow' };
    };
    const timeInsight = getTimeInsight(avgTimePerQuestion);
    const TimeIcon = timeInsight.icon;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Sprints */}
            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Total Sprints</p>
                <p className="text-3xl font-bold text-white mb-1">{totalSprints}</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <CalendarIcon size={14} />
                    <span>All time</span>
                </div>
            </div>

            {/* Avg Accuracy */}
            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Avg Accuracy</p>
                <p className={`text-3xl font-bold ${getAccuracyColor(avgAccuracy)} mb-1`}>{avgAccuracy}%</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <AccIcon size={14} />
                    <span>{accInsight.text}</span>
                </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Completed</p>
                <p className={`text-3xl font-bold ${getCompletionColor(completionRate)} mb-1`}>
                    {completedCount}/{totalSprints}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <CompIcon size={14} />
                    <span>{completionRate}% completion</span>
                </div>
            </div>

            {/* Avg Time/Q */}
            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Avg Time/Q</p>
                <p className={`text-3xl font-bold ${getTimeColor(avgTimePerQuestion)} mb-1`}>
                    {Math.round(avgTimePerQuestion)}s
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <TimeIcon size={14} />
                    <span>{timeInsight.text}</span>
                </div>
            </div>
        </div>
    );
}
