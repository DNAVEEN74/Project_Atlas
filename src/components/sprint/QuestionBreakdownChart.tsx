import React from 'react';

interface Submission {
    id: string;
    createdAt: string;
    score: number;
    incorrectCount: number;
    skippedCount: number;
    totalQuestions: number;
    completed: boolean;
}

interface QuestionBreakdownChartProps {
    submissions: Submission[];
}

export default function QuestionBreakdownChart({ submissions }: QuestionBreakdownChartProps) {
    const recentSubmissions = submissions.slice(0, 10).reverse();

    return (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 mb-6">
            <h4 className="text-sm font-semibold text-neutral-400 mb-4">Question Breakdown (Correct / Wrong / Skipped)</h4>

            <div className="flex items-end justify-between gap-3 h-40">
                {recentSubmissions.map((sub, i) => {
                    const total = sub.totalQuestions || 1;
                    const correctPct = (sub.score / total) * 100;
                    const incorrectPct = (sub.incorrectCount / total) * 100;
                    const skippedPct = (sub.skippedCount / total) * 100;

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-neutral-900 border border-neutral-700 rounded-lg p-2 shadow-xl z-20 whitespace-nowrap">
                                <p className="text-[10px] font-bold text-neutral-300 mb-1">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                <p className="text-[10px] text-emerald-400">✓ {sub.score} correct</p>
                                <p className="text-[10px] text-rose-400">✗ {sub.incorrectCount} wrong</p>
                                <p className="text-[10px] text-amber-400">⊘ {sub.skippedCount} skipped</p>
                            </div>

                            <div className="w-full bg-neutral-800 rounded overflow-hidden flex flex-col items-stretch relative" style={{ height: '100%' }}>
                                {/* Stacked bars - Render from top to bottom: Skipped -> Incorrect -> Correct */}
                                <div
                                    className="w-full bg-amber-500/80 transition-all duration-500"
                                    style={{ height: `${skippedPct}%`, minHeight: skippedPct > 0 ? '2px' : '0' }}
                                ></div>
                                <div
                                    className="w-full bg-rose-500/80 transition-all duration-500"
                                    style={{ height: `${incorrectPct}%`, minHeight: incorrectPct > 0 ? '2px' : '0' }}
                                ></div>
                                <div
                                    className="w-full bg-emerald-500 transition-all duration-500"
                                    style={{ height: `${correctPct}%`, minHeight: correctPct > 0 ? '2px' : '0' }}
                                ></div>
                            </div>
                            <span className="text-[9px] font-bold text-neutral-500">{total}</span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-neutral-400">Correct</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-[10px] text-neutral-400">Wrong</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] text-neutral-400">Skipped</span>
                </div>
            </div>
        </div>
    );
}
