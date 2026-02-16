import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon, TargetIcon, AlertTriangleIcon } from 'lucide-react';

interface Submission {
    id: string;
    createdAt: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    timeTaken: number;
    subject: string;
    completed: boolean;
}

interface AccuracyTrendChartProps {
    submissions: Submission[];
}

export default function AccuracyTrendChart({ submissions }: AccuracyTrendChartProps) {
    const [hoveredData, setHoveredData] = useState<{ data: Submission, x: number, y: number } | null>(null);

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const avgAcc = Math.round(submissions.reduce((acc, s) => acc + s.accuracy, 0) / submissions.length);
    const hasProgress = submissions.some(s => s.accuracy > 0);
    // Show all submissions
    const recentSubmissions = submissions;

    // Empty State
    if (!hasProgress) {
        return (
            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUpIcon size={20} className="text-neutral-400" />
                    Accuracy Over Time
                </h3>
                <div className="text-center py-12">
                    <TargetIcon size={48} className="text-violet-500 mb-4 mx-auto" />
                    <p className="text-xl font-bold text-white mb-2">No correct answers yet!</p>
                    <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
                        Don't worry - everyone starts here. Here's how to improve:
                    </p>
                    <div className="text-left max-w-md mx-auto space-y-2 mb-6">
                        <p className="text-sm text-neutral-300">1. Practice individual topics first (not "All Topics")</p>
                        <p className="text-sm text-neutral-300">2. Start with Easy difficulty</p>
                        <p className="text-sm text-neutral-300">3. Take your time to read questions carefully</p>
                        <p className="text-sm text-neutral-300">4. Review solutions after each question</p>
                    </div>
                    <Link
                        href="/sprint"
                        className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Start Focused Practice →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 mb-6 relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUpIcon size={20} className="text-neutral-400" />
                Accuracy Over Time
            </h3>

            <div className="relative">
                {/* Target Line Description */}
                <div className="absolute right-0 top-[30%] text-[10px] text-neutral-500 z-0 pointer-events-none select-none pr-4">
                    Target: 70%
                </div>
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div
                        className="flex justify-between gap-3 h-48 mb-4 relative items-stretch w-full"
                        style={{ minWidth: `${submissions.length * 40}px` }}
                    >
                        {submissions.map((sub, i) => {
                            const barHeight = `${Math.max(sub.accuracy, 5)}%`;
                            const isQuant = sub.subject === 'QUANT';
                            const color = sub.accuracy >= 70 ? 'bg-emerald-500' : sub.accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500';
                            const textColor = sub.accuracy >= 70 ? 'text-emerald-400' : sub.accuracy >= 40 ? 'text-amber-400' : 'text-rose-400';

                            return (
                                <div
                                    key={i}
                                    className="flex-1 flex flex-col items-center gap-2 group relative z-10 h-full justify-end min-w-[30px]"
                                    onMouseEnter={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setHoveredData({
                                            data: sub,
                                            x: rect.left + rect.width / 2,
                                            y: rect.top
                                        });
                                    }}
                                    onMouseLeave={() => setHoveredData(null)}
                                >
                                    {/* Bar Track */}
                                    <div className="w-full bg-neutral-800 rounded-t-lg overflow-visible flex items-end relative hover:bg-neutral-700 transition-colors flex-1 min-h-0">
                                        {/* Target line at 70% INSIDE Bar Track */}
                                        <div className="absolute left-0 right-0 border-t border-dashed border-neutral-700/50 pointer-events-none w-full" style={{ bottom: '70%' }}></div>

                                        <div
                                            className={`w-full transition-all duration-500 rounded-t-lg ${color} ${!sub.completed ? 'opacity-40' : ''}`}
                                            style={{ height: barHeight }}
                                        ></div>
                                    </div>
                                    <span className={`text-[10px] font-bold ${textColor}`}>
                                        {sub.accuracy}%
                                    </span>
                                    {!sub.completed && (
                                        <div className="absolute -bottom-5" title="Abandoned">
                                            <AlertTriangleIcon size={12} className="text-rose-500" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Fixed Tooltip */}
                {hoveredData && (
                    <div
                        className="fixed z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-3 shadow-xl whitespace-nowrap min-w-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
                        style={{
                            left: hoveredData.x,
                            top: hoveredData.y - 10
                        }}
                    >
                        <p className="text-xs font-bold text-white mb-1">{new Date(hoveredData.data.createdAt).toLocaleDateString()}</p>
                        <div className="space-y-1">
                            <p className="text-xs text-neutral-400 flex justify-between gap-3">
                                <span>Score:</span>
                                <span className="text-white">{hoveredData.data.score}/{hoveredData.data.totalQuestions}</span>
                            </p>
                            <p className="text-xs text-neutral-400 flex justify-between gap-3">
                                <span>Time:</span>
                                <span className="text-white">{formatTime(hoveredData.data.timeTaken)}</span>
                            </p>
                            <p className="text-xs text-neutral-400 flex justify-between gap-3">
                                <span>Subject:</span>
                                <span className={hoveredData.data.subject === 'QUANT' ? 'text-amber-500' : 'text-violet-500'}>{hoveredData.data.subject}</span>
                            </p>
                        </div>
                        {/* Little triangle arrow at bottom */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700 transform rotate-45"></div>
                    </div>
                )}

                {/* Trend Analysis */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mt-4">
                    {(() => {
                        const first = recentSubmissions[0]?.accuracy || 0;
                        const last = recentSubmissions[recentSubmissions.length - 1]?.accuracy || 0;
                        const change = last - first;
                        const TrendIcon = change > 0 ? TrendingUpIcon : change < 0 ? TrendingDownIcon : MinusIcon;
                        const trendText = change > 0 ? 'Improving' : change < 0 ? 'Declining' : 'Flat';
                        const trendColor = change > 0 ? 'text-emerald-400' : change < 0 ? 'text-rose-400' : 'text-neutral-400';

                        return (
                            <div className="flex items-center text-sm">
                                <span className={`font-semibold ${trendColor} flex items-center gap-1`}>
                                    <TrendIcon size={16} />
                                    {trendText}
                                </span>
                                <span className="text-neutral-500 mx-2">•</span>
                                <span className="text-neutral-300">
                                    {avgAcc < 40 && 'Focus on accuracy first, speed later.'}
                                    {avgAcc >= 40 && avgAcc < 70 && 'Good progress! Keep practicing to reach 70%.'}
                                    {avgAcc >= 70 && 'Excellent performance! You are exam ready.'}
                                </span>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
