"use client";

import React from 'react';
import Link from 'next/link';
import { BoltIcon, PlayArrowIcon, CheckCircleIcon, CalendarIcon } from '@/components/icons';

import { formatDate } from '@/utils/format';

interface DailyProgressHeroProps {
    dailyGoal?: number;
    dailySolved?: number;
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
}

const DailyProgressHero = ({ dailyGoal = 20, dailySolved = 0, streak = 0, maxStreak = 0, weakTopicsQuant = [], weakTopicsReasoning = [] }: DailyProgressHeroProps) => {
    // Calculate progress
    const percentage = Math.min(100, Math.round((dailySolved / dailyGoal) * 100));
    const isGoalMet = dailySolved >= dailyGoal;

    // Logic for dynamic CTA
    let buttonText = "Start Practice";
    let buttonIcon = null;

    if (isGoalMet) {
        buttonText = "Goal Complete! Any More?";
        buttonIcon = <CheckCircleIcon className="text-emerald-500 w-5 h-5" />;
    } else if (dailySolved > 0) {
        buttonText = "Continue Practice";
        buttonIcon = <PlayArrowIcon className="text-emerald-500 w-5 h-5" />;
    }

    return (
        <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl border border-neutral-800 p-6 relative overflow-hidden group">

            {/* ... Background Glow Effect ... */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-8 relative z-10">

                {/* Left: Progress & Status */}
                <div className="flex-1 space-y-5">



                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="text-neutral-400 w-5 h-5" />
                            <span className="text-xl font-bold text-white">Today • {formatDate(new Date())}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
                            {streak > 0 ? (
                                <>
                                    <span className="text-lg">🔥</span>
                                    <span className="text-sm font-semibold text-white">{streak} Day Streak</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">💤</span>
                                    <span className="text-sm font-medium text-neutral-400">No active streak</span>
                                </>
                            )}
                            <span className="text-xs text-neutral-600 border-l border-neutral-700 pl-2 ml-1">Max: {maxStreak}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">{dailySolved}</span>
                                <span className="text-lg text-neutral-400">/ {dailyGoal} questions</span>
                            </div>
                            <span className={`text-sm font-medium ${isGoalMet ? 'text-emerald-400' : 'text-amber-500'}`}>{percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-neutral-800/50 rounded-full overflow-hidden border border-neutral-800">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isGoalMet ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-600 to-orange-500'}`}
                                style={{ width: `${percentage}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                            </div>
                        </div>
                        <div className="flex gap-6 text-xs text-neutral-500 pt-1">
                            <span>Quant: <span className="text-neutral-300 font-medium">0/{Math.ceil(dailyGoal * 0.6)}</span></span>
                            <span>Reasoning: <span className="text-neutral-300 font-medium">0/{Math.floor(dailyGoal * 0.4)}</span></span>
                        </div>
                    </div>
                </div>

                {/* Vertical Divider (Desktop) */}
                <div className="hidden lg:block w-px bg-neutral-800 self-stretch my-2"></div>

                {/* Right: Suggested Focus & Actions */}
                <div className="lg:w-[40%] flex flex-col justify-between gap-4">

                    {/* Suggested Topics */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Suggested Focus</span>
                            <div className="h-px bg-neutral-800 flex-1"></div>
                        </div>

                        {/* Topics Lists */}
                        <div className="space-y-2">
                            {/* Quant Topics */}
                            {weakTopicsQuant.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-1 rounded-full self-center border border-blue-500/20">QUANT</span>
                                    {weakTopicsQuant.slice(0, 3).map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-neutral-800/40 border border-neutral-800 rounded-lg px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5">
                                            {/* Removed warning icon as requested */}
                                            <span className="">{topic.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reasoning Topics */}
                            {weakTopicsReasoning.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-1 rounded-full self-center border border-purple-500/20">REASON</span>
                                    {weakTopicsReasoning.slice(0, 3).map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-neutral-800/40 border border-neutral-800 rounded-lg px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:border-purple-500/30 hover:bg-purple-500/5">
                                            {/* Removed warning icon as requested */}
                                            <span className="">{topic.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {weakTopicsQuant.length === 0 && weakTopicsReasoning.length === 0 && (
                                <div className="text-xs text-neutral-500 italic py-2 flex items-center gap-2">
                                    <CheckCircleIcon className="text-emerald-500 w-4 h-4" /> Great job! No critical weak areas detected yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                        <Link href="/problems" className="flex-1">
                            <button className="w-full h-12 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98] duration-200">
                                {buttonIcon}
                                {buttonText}
                            </button>
                        </Link>
                        <Link href="/sprint">
                            <button className="h-12 px-6 bg-neutral-800 text-neutral-300 font-semibold rounded-xl hover:bg-neutral-700 border border-neutral-700 transition-all hover:text-white flex items-center justify-center gap-2 active:scale-[0.98] duration-200">
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
