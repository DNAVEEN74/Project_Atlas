import React, { useState } from 'react';
import { TargetIcon } from 'lucide-react';
import Link from 'next/link';

interface TopicStat {
    topic: string;
    total: number;
    correct: number;
    accuracy: number;
    avgTime: number;
    lastActive: string; // ISO Date
}

interface ExternalSubmission {
    id: string;
    createdAt: string;
    topicPerformance?: {
        topic: string;
        total: number;
        correct: number;
        accuracy: number;
        avgTime: number;
    }[];
}

interface TopicPerformanceSectionProps {
    submissions: ExternalSubmission[];
}

export default function TopicPerformanceSection({ submissions }: TopicPerformanceSectionProps) {
    const [sortMode, setSortMode] = useState<'WORST' | 'BEST' | 'ATTEMPTS'>('WORST');

    // Aggregate Data
    const aggregateData = () => {
        const topicMap = new Map<string, TopicStat>();

        submissions.forEach(sub => {
            if (!sub.topicPerformance) return;

            sub.topicPerformance.forEach(tp => {
                const existing = topicMap.get(tp.topic) || {
                    topic: tp.topic,
                    total: 0,
                    correct: 0,
                    accuracy: 0, // Recocalculated
                    avgTime: 0,  // Recalculated
                    lastActive: sub.createdAt
                };

                // Merge
                const newTotal = existing.total + tp.total;
                const newCorrect = existing.correct + tp.correct;
                // Weighted avg for time
                const newAvgTime = ((existing.avgTime * existing.total) + (tp.avgTime * tp.total)) / newTotal;

                topicMap.set(tp.topic, {
                    topic: tp.topic,
                    total: newTotal,
                    correct: newCorrect,
                    accuracy: Math.round((newCorrect / newTotal) * 100),
                    avgTime: newAvgTime,
                    // Keep most recent date
                    lastActive: new Date(existing.lastActive) > new Date(sub.createdAt) ? existing.lastActive : sub.createdAt
                });
            });
        });

        return Array.from(topicMap.values());
    };

    const stats = aggregateData();

    // Sorting
    const sortedStats = [...stats].sort((a, b) => {
        if (sortMode === 'WORST') return a.accuracy - b.accuracy || b.total - a.total;
        if (sortMode === 'BEST') return b.accuracy - a.accuracy || b.total - a.total;
        return b.total - a.total;
    });

    if (stats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Main List */}
            <div className="lg:col-span-2 bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TargetIcon size={20} className="text-rose-500" />
                        Topic Performance
                    </h3>
                    <div className="flex bg-neutral-900 rounded-lg p-1 text-xs">
                        <button
                            onClick={() => setSortMode('WORST')}
                            className={`px-3 py-1 rounded-md transition-colors ${sortMode === 'WORST' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Weakest
                        </button>
                        <button
                            onClick={() => setSortMode('BEST')}
                            className={`px-3 py-1 rounded-md transition-colors ${sortMode === 'BEST' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Strongest
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {sortedStats.slice(0, 5).map((stat) => (
                        <div key={stat.topic} className="group">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-white">{stat.topic}</span>
                                <div className="flex gap-3">
                                    <span className="text-neutral-400">{stat.correct}/{stat.total}</span>
                                    <span className={`font-bold ${stat.accuracy >= 70 ? 'text-emerald-500' : stat.accuracy >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {stat.accuracy}%
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-1">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${stat.accuracy >= 70 ? 'bg-emerald-500' : stat.accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                    style={{ width: `${Math.max(stat.accuracy, 5)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Avg Time: {Math.round(stat.avgTime / 1000)}s</span>
                                <Link href="/sprint" className="text-violet-400 hover:text-violet-300">Practice →</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weakest Topics Summary */}
            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">🔥 Focus Areas</h4>
                <div className="space-y-4">
                    {sortedStats
                        .filter(s => s.accuracy < 70)
                        .sort((a, b) => a.accuracy - b.accuracy)
                        .slice(0, 3)
                        .map((stat, i) => (
                            <div key={stat.topic} className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-white text-sm">{stat.topic}</h5>
                                    <span className="text-xs font-bold text-rose-500">{stat.accuracy}%</span>
                                </div>
                                <p className="text-xs text-neutral-400 mb-3">
                                    {stat.total} attempts • {stat.correct} correct
                                </p>
                                <Link
                                    href="/sprint"
                                    className="block w-full text-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Practice Now
                                </Link>
                            </div>
                        ))}

                    {sortedStats.filter(s => s.accuracy < 70).length === 0 && (
                        <div className="text-center py-8 text-neutral-500">
                            <p>🎉 No weak topics found!</p>
                            <p className="text-xs mt-1">Keep up the great work.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
