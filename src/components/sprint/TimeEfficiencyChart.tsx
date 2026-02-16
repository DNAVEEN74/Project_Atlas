import React from 'react';
import { ZapIcon } from 'lucide-react';

interface TimeEfficiencyChartProps {
    avgTimePerQuestion: number;
}

export default function TimeEfficiencyChart({ avgTimePerQuestion }: TimeEfficiencyChartProps) {
    const targetTime = 36; // SSC CGL target

    // Calculate percentage for bars (capped at 60s for scale)
    const maxScale = 60;
    const userWidth = Math.min((avgTimePerQuestion / maxScale) * 100, 100);
    const targetWidth = (targetTime / maxScale) * 100;

    const getInsight = () => {
        if (avgTimePerQuestion < 10) return "You're rushing! Slow down to improve accuracy.";
        if (avgTimePerQuestion < 20) return "Very fast speed. Ensure you're not making silly mistakes.";
        if (avgTimePerQuestion <= targetTime) return "Perfect pace! You're well within the time limit.";
        return "A bit slow. Practice more to improve speed.";
    };

    const speedDiff = avgTimePerQuestion > 0 ? (targetTime / avgTimePerQuestion).toFixed(1) : '0';
    const isFaster = avgTimePerQuestion < targetTime;

    return (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ZapIcon size={20} className="text-amber-400" />
                Time Efficiency Analysis
            </h3>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">Your Average</span>
                        <span className="font-bold text-white">{Math.round(avgTimePerQuestion)}s / question</span>
                    </div>
                    <div className="h-4 bg-neutral-800 rounded-full overflow-hidden relative">
                        {/* Scale Markers */}
                        <div className="absolute top-0 bottom-0 border-l border-neutral-700" style={{ left: '25%' }}></div>
                        <div className="absolute top-0 bottom-0 border-l border-neutral-700" style={{ left: '50%' }}></div>
                        <div className="absolute top-0 bottom-0 border-l border-neutral-700" style={{ left: '75%' }}></div>

                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${avgTimePerQuestion < 20 ? 'bg-amber-500' : 'bg-violet-500'}`}
                            style={{ width: `${userWidth}%` }}
                        ></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">SSC Target</span>
                        <span className="font-bold text-neutral-300">{targetTime}s / question</span>
                    </div>
                    <div className="h-4 bg-neutral-800 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-neutral-600 rounded-full w-full opacity-50"
                            style={{ width: `${targetWidth}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-2xl">{isFaster ? '⚡' : '🐌'}</span>
                    <div>
                        <p className="text-white font-bold mb-1">
                            {isFaster
                                ? `You are ${speedDiff}x faster than target`
                                : `You are ${((avgTimePerQuestion - targetTime) / targetTime * 100).toFixed(0)}% slower than target`
                            }
                        </p>
                        <p className="text-sm text-neutral-400">
                            {getInsight()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
