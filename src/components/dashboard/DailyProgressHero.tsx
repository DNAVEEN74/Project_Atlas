"use client";

import React from 'react';
import Link from 'next/link';
import { BoltIcon, PlayArrowIcon, CheckCircleIcon, CalendarIcon } from '@/components/icons';

import { formatDate } from '@/utils/format';

interface DailyProgressHeroProps {
    dailyGoal?: number;
    dailySolved?: number;
    quantGoal?: number;
    quantSolved?: number;
    reasoningGoal?: number;
    reasoningSolved?: number;
    streak?: number;
    maxStreak?: number;
    weakTopicsQuant?: {
        topic: string;
        accuracy?: number;
        questionCount?: number;
    }[];
    weakTopicsReasoning?: {
        topic: string;
        accuracy?: number;
        questionCount?: number;
    }[];
    heatmap?: any[];
}

const DailyProgressHero = ({
    dailyGoal = 20,
    dailySolved = 0,
    quantGoal = 10,
    quantSolved = 0,
    reasoningGoal = 10,
    reasoningSolved = 0,
    streak = 0,
    maxStreak = 0,
    weakTopicsQuant = [],
    weakTopicsReasoning = []
}: DailyProgressHeroProps) => {
    // Calculate progress
    const percentage = Math.min(100, Math.round((dailySolved / dailyGoal) * 100));
    const isGoalMet = dailySolved >= dailyGoal;

    // Logic for dynamic CTA
    let buttonText = "Start Practice";
    let buttonIcon = null;

    if (isGoalMet) {
        buttonText = "Goal Complete! Any More?";
        buttonIcon = <CheckCircleIcon className="text-white w-5 h-5" />;
    } else if (dailySolved > 0) {
        buttonText = "Continue Practice";
        buttonIcon = <PlayArrowIcon className="text-white w-5 h-5" />;
    }

    return (
        <div className="w-full bg-[#141414] rounded-[24px] border border-[#1f1f1f] p-6 relative overflow-hidden group">

            {/* ... Background Glow Effect ... */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-8 relative z-10">

                {/* Left: Progress & Status */}
                <div className="flex-1 space-y-5">

                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="text-[#CAC4D0] w-5 h-5" />
                            <span className="text-xl font-medium tracking-tight text-[#E6E1E5]">Today • {formatDate(new Date())}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#0a0a0a] px-3 py-1.5 rounded-full border border-[#1f1f1f]">
                            {streak > 0 ? (
                                <>
                                    <span className="text-lg">🔥</span>
                                    <span className="text-sm font-medium text-[#E6E1E5]">{streak} Day Streak</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm">😴</span>
                                    <span className="text-sm font-medium text-[#938F99]">No active streak</span>
                                </>
                            )}
                            <span className="text-xs text-[#938F99] border-l border-[#1f1f1f] pl-2 ml-1">Max: {maxStreak}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-medium tracking-tight text-[#E6E1E5]">{dailySolved}</span>
                                <span className="text-lg text-[#938F99]">/ {dailyGoal} questions</span>
                            </div>
                            <span className={`text-sm font-medium ${isGoalMet ? 'text-[#6DD58C]' : 'text-[#FFB951]'}`}>{percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-[#1f1f1f] rounded-full overflow-hidden border border-[#1f1f1f]">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isGoalMet ? 'bg-[#6DD58C]' : 'bg-gradient-to-r from-[#FFB951] to-[#FFB951]/80'}`}
                                style={{ width: `${percentage}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                            </div>
                        </div>
                        <div className="flex gap-6 text-xs text-[#938F99] pt-1">
                            <span>Quant: <span className="text-[#CAC4D0] font-medium">{quantSolved}/{quantGoal}</span></span>
                            <span>Reasoning: <span className="text-[#CAC4D0] font-medium">{reasoningSolved}/{reasoningGoal}</span></span>
                        </div>
                    </div>
                </div>

                {/* Vertical Divider (Desktop) */}
                <div className="hidden lg:block w-px bg-[#1f1f1f] self-stretch my-2"></div>

                {/* Right: Suggested Focus & Actions */}
                <div className="lg:w-[40%] flex flex-col justify-between gap-4">

                    {/* Suggested Topics */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-[#FFB951] uppercase tracking-wider">Suggested Focus</span>
                            <div className="h-px bg-[#1f1f1f] flex-1"></div>
                        </div>

                        {/* Topics Lists */}
                        <div className="space-y-2">
                            {/* Quant Topics */}
                            {weakTopicsQuant.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center justify-center text-[10px] font-medium text-[#FFB951] bg-[#594100] px-3 h-6 rounded-full border border-transparent">QUANT</span>
                                    {weakTopicsQuant.slice(0, 3).map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-full px-3 h-6 text-[11px] text-[#CAC4D0]">
                                            <span className="">{topic.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reasoning Topics */}
                            {weakTopicsReasoning.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center justify-center text-[10px] font-medium text-[#D0BCFF] bg-[#332D41] px-3 h-6 rounded-full border border-transparent">REASON</span>
                                    {weakTopicsReasoning.slice(0, 3).map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-full px-3 h-6 text-[11px] text-[#CAC4D0]">
                                            <span className="">{topic.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {weakTopicsQuant.length === 0 && weakTopicsReasoning.length === 0 && (
                                <div className="text-xs text-[#938F99] italic py-2 flex items-center gap-2">
                                    <CheckCircleIcon className="text-[#6DD58C] w-4 h-4" /> Great job! No critical weak areas detected yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                        <Link href="/problems" className="flex-1">
                            <button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] duration-200 shadow-lg shadow-orange-500/20 border border-orange-500/20">
                                {buttonIcon}
                                {buttonText}
                            </button>
                        </Link>
                        <Link href="/sprint">
                            <button className="h-12 px-6 bg-[#36343B] text-[#E6E1E5] font-medium rounded-full hover:bg-[#4A4458] transition-all flex items-center justify-center gap-2 active:scale-[0.98] duration-200 border border-transparent">
                                <BoltIcon className="text-amber-500 w-5 h-5" />
                                Sprint
                            </button>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default DailyProgressHero;
