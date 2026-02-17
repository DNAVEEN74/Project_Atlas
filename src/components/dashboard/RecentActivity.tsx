
'use client';

import React from 'react';
import Link from 'next/link';



import { MathText } from '@/components/ui/MathText';
import { formatDate } from '@/utils/format';
import {
    HistoryEduOutlinedIcon,
    CheckCircleIcon,
    CancelIcon,
    BoltIcon,
    ChevronRightIcon,
    HistoryIcon
} from '@/components/icons';

// ... (interface remains same)
interface RecentAttempt {
    _id: string;
    question_id: {
        _id: string;
        text: string;
        source?: {
            section: string;
        };
    } | string;
    display_name: string;
    is_correct: boolean;
    time_ms: number;
    created_at: string;
}

interface RecentActivityProps {
    attempts: RecentAttempt[];
    className?: string;
}

const RecentActivity = ({ attempts, className }: RecentActivityProps) => {

    // Limit to 6 items
    const displayAttempts = attempts.slice(0, 6);

    if (displayAttempts.length === 0) {
        return (
            <div className={`bg-[#1a1a1a] rounded-xl border border-neutral-800 p-6 ${className}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <HistoryIcon className="text-indigo-500 w-5 h-5" />
                        <h3 className="font-bold text-white text-lg">Recent Submissions</h3>
                    </div>
                    <Link href="/submissions" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                        View All →
                    </Link>
                </div>
                <div className="text-center py-8 text-neutral-500 text-sm">
                    No recent activity.
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#1a1a1a] rounded-xl border border-neutral-800 overflow-hidden ${className}`}>
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-white font-semibold">
                    <HistoryIcon className="text-indigo-500 w-5 h-5" />
                    <h3>Recent Submissions</h3>
                </div>
                <Link href="/submissions" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                    View All →
                </Link>
            </div>

            <div className="divide-y divide-neutral-800/50">
                {displayAttempts.map((attempt) => {
                    // Safe access to question data
                    const questionData = typeof attempt.question_id === 'object' ? attempt.question_id : null;
                    const questionText = questionData?.text || attempt.display_name;

                    const questionId = questionData?._id || attempt._id;
                    const section = questionData?.source?.section || 'Practice';

                    // Time calculations
                    const timeSeconds = Math.round(attempt.time_ms / 1000);

                    // Logic for "Fast Wrong" warning (Wrong & < 10s)
                    const isFastWrong = !attempt.is_correct && timeSeconds < 10;

                    return (
                        <Link
                            key={attempt._id}
                            href={`/problems/${questionId}?section=${section}`}
                            className="flex items-center gap-4 p-4 hover:bg-neutral-800/40 transition-colors group"
                        >
                            {/* Status Icon */}
                            <div className="shrink-0">
                                {attempt.is_correct ? (
                                    <CheckCircleIcon className="text-emerald-500 w-5 h-5" />
                                ) : (
                                    <CancelIcon className="text-rose-500 w-5 h-5" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                                    <MathText>{questionText?.slice(0, 100) || 'Question'}</MathText>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                                    <span className="uppercase tracking-wide text-[10px] font-semibold text-neutral-600">
                                        {section}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(attempt.created_at)}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        {timeSeconds}s
                                        {isFastWrong && (
                                            <span
                                                className="text-amber-500 flex items-center gap-0.5 cursor-help"
                                                title="Very fast - did you rush?"
                                            >
                                                <BoltIcon className="w-3 h-3" />
                                                {/* <span className="text-[10px] font-bold">⚡</span> */}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Action Arrow */}
                            <ChevronRightIcon className="text-neutral-700 group-hover:text-neutral-500 transition-colors w-5 h-5" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivity;
