
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

    // Group re-attempts by question ID
    const groupedAttemptsMap = new Map<string, RecentAttempt & { attempt_count: number }>();
    attempts.forEach(attempt => {
        const questionData = typeof attempt.question_id === 'object' ? attempt.question_id : null;
        const qId = questionData?._id || attempt._id;

        if (groupedAttemptsMap.has(qId)) {
            groupedAttemptsMap.get(qId)!.attempt_count += 1;
        } else {
            groupedAttemptsMap.set(qId, { ...attempt, attempt_count: 1 });
        }
    });

    // Limit to 6 unique questions
    const displayAttempts = Array.from(groupedAttemptsMap.values()).slice(0, 6);

    if (displayAttempts.length === 0) {
        return (
            <div className={`bg-[#141414] rounded-[24px] border border-[#1f1f1f] p-6 ${className}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <HistoryIcon className="text-[#FFB951] w-5 h-5" />
                        <h3 className="font-bold text-[#E6E1E5] text-lg">Recent Submissions</h3>
                    </div>
                    <Link href="/submissions" className="text-xs font-medium text-[#FFB951] hover:text-[#FFDE9C] transition-colors">
                        View All →
                    </Link>
                </div>
                <div className="text-center py-8 text-[#938F99] text-sm font-medium">
                    No recent activity.
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#141414] rounded-[24px] border border-[#1f1f1f] overflow-hidden flex flex-col h-full ${className}`}>
            <div className="flex justify-between items-center p-4 border-b border-[#1f1f1f] shrink-0">
                <div className="flex items-center gap-2">
                    <HistoryIcon className="text-[#FFB951] w-5 h-5" />
                    <h3 className="font-bold text-[#E6E1E5] text-lg">Recent Submissions</h3>
                </div>
                <Link href="/history" className="text-[#FFB951] text-sm hover:text-[#FFDE9C] transition-colors font-medium">
                    View full history
                </Link>
            </div>

            <div className="divide-y divide-[#1f1f1f] flex-1 flex flex-col justify-center">
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
                            className="flex items-center gap-4 p-4 hover:bg-[#1f1f1f]/50 transition-colors group"
                        >
                            {/* Status Icon */}
                            <div className="shrink-0">
                                {attempt.is_correct ? (
                                    <CheckCircleIcon className="text-[#6DD58C] w-5 h-5" />
                                ) : (
                                    <CancelIcon className="text-[#FFB4AB] w-5 h-5" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-[#CAC4D0] font-medium truncate group-hover:text-[#E6E1E5] transition-colors">
                                    <MathText>{questionText?.slice(0, 100) || 'Question'}</MathText>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-[#938F99]">
                                    <span className="uppercase tracking-wide text-[10px] font-semibold text-[#CAC4D0]">
                                        {section}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(attempt.created_at)}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        {timeSeconds}s
                                        {isFastWrong && (
                                            <span
                                                className="text-[#FFB951] flex items-center gap-0.5 cursor-help"
                                                title="Very fast - did you rush?"
                                            >
                                                <BoltIcon className="w-3 h-3" />
                                            </span>
                                        )}
                                    </span>
                                    {(attempt as any).attempt_count > 1 && (
                                        <>
                                            <span>•</span>
                                            <span className="text-[9px] font-bold bg-[#1f1f1f] text-[#CAC4D0] px-1.5 py-0.5 rounded">
                                                {(attempt as any).attempt_count} tries
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Action Arrow */}
                            <ChevronRightIcon className="text-[#49454F] group-hover:text-[#938F99] transition-colors w-5 h-5 shrink-0" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivity;
