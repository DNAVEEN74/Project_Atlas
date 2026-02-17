
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuickPracticeProps {
    questions_left: number;
    weak_topics: string[];
    className?: string;
}

const QuickPracticeCard: React.FC<QuickPracticeProps> = ({
    questions_left,
    weak_topics,
    className
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartPractice = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'QUICK_PRACTICE',
                    config: {
                        subject: 'QUANT',
                        question_count: Math.min(questions_left, 10),
                    }
                })
            });

            if (!res.ok) throw new Error('Failed to create session');

            const data = await res.json();
            if (data.session && data.session._id) {
                router.push(`/session/${data.session._id}`);
            }
        } catch (error) {
            console.error("Quick Practice Error:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className={`bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between ${className}`}>

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">⚡</span>
                    <h3 className="font-bold text-indigo-400 text-lg">Quick Practice</h3>
                </div>

                <p className="text-neutral-400 mb-6 text-sm">
                    {questions_left > 0
                        ? `You have ${questions_left} questions remaining for your daily goal.`
                        : "Daily goal met! Maintain your streak with a quick session."}
                </p>

                {weak_topics.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Focus Areas</p>
                        <div className="space-y-2">
                            {weak_topics.map(topic => (
                                <div key={topic} className="flex items-center gap-2 text-sm text-neutral-300 bg-neutral-900 px-3 py-2 rounded-lg border border-neutral-700">
                                    <span className="text-amber-500">⚠️</span>
                                    <span>{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleStartPractice}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>Start Practice</span>
                        <span>→</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default QuickPracticeCard;
