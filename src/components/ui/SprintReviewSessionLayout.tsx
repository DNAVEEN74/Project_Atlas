import React, { useState } from 'react';
import {
    ArrowBackIcon,
    CheckCircleIcon,
    CancelIcon,
    RemoveCircleIcon,
    TimerIcon
} from '@/components/icons';
import { MathText } from '@/components/ui/MathText';
import { QuestionContent } from '@/components/ui/QuestionContent';

interface QuestionOption {
    id: string;
    text: string;
    image?: string;
}

interface QuestionData {
    id: string;
    text: string;
    image?: string;
    options: QuestionOption[];
    correct_option: string;
    solution?: string;
    pattern: string | null;
    subject: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    question_number?: number;
}

interface SprintReviewSessionLayoutProps {
    question: QuestionData;
    userAttempt: {
        isCorrect: boolean;
        selectedOption: string;
        timeMs: number;
    } | null;
    onBack: () => void;
    currentQuestionIndex: number;
    totalQuestions: number;
    zoomedImage: string | null;
    setZoomedImage: (url: string | null) => void;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
    zoomLevel: number;
}

export function SprintReviewSessionLayout({
    question,
    userAttempt,
    onBack,
    currentQuestionIndex,
    totalQuestions,
    zoomedImage,
    setZoomedImage,
    setZoomLevel,
    zoomLevel
}: SprintReviewSessionLayoutProps) {
    const isSkipped = !userAttempt || userAttempt.selectedOption === 'SKIPPED';
    const isCorrect = userAttempt?.isCorrect;

    const formatTime = (ms: number) => {
        return `${(ms / 1000).toFixed(1)}s`;
    };

    return (
        <div className="fixed inset-0 bg-[#0f0f0f] z-50 flex flex-col font-sans text-neutral-200">
            {/* Header Area */}
            <header className="h-16 border-b border-neutral-800 bg-[#1a1a1a]/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-40">
                <div className="flex items-center gap-4 text-sm">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                        title="Back to Review Dashboard"
                    >
                        <ArrowBackIcon />
                    </button>
                    <div className="h-6 w-px bg-neutral-800"></div>
                    <div className="flex items-center gap-2 font-medium">
                        <span className="text-neutral-500">Q{currentQuestionIndex + 1}</span>
                        <span className="text-neutral-600">/</span>
                        <span className="text-neutral-500">{totalQuestions}</span>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                        {isSkipped ? (
                            <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-400 text-xs font-bold flex items-center gap-1">
                                <RemoveCircleIcon sx={{ fontSize: '14px' }} /> Skipped
                            </span>
                        ) : isCorrect ? (
                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                                <CheckCircleIcon sx={{ fontSize: '14px' }} /> Correct
                            </span>
                        ) : (
                            <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
                                <CancelIcon sx={{ fontSize: '14px' }} /> Incorrect
                            </span>
                        )}

                        {!isSkipped && (
                            <span className="ml-2 px-2 py-1 rounded bg-neutral-800 text-neutral-400 text-xs font-mono flex items-center gap-1">
                                <TimerIcon sx={{ fontSize: '14px' }} /> {formatTime(userAttempt.timeMs)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-0">
                    <span className="px-2 py-1 bg-neutral-800 text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wide">
                        {question.subject}
                    </span>
                    {question.pattern && (
                        <span className="px-2 py-1 bg-neutral-800 text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wide">
                            {question.pattern}
                        </span>
                    )}
                </div>
            </header>

            {/* Split Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Solution (Desktop only split, Mobile stacked) */}
                <div className="flex-1 md:w-1/2 border-r border-neutral-800 bg-[#141414] overflow-y-auto p-6 lg:p-10 order-2 md:order-1">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6">Solution</h3>
                        {question.solution ? (
                            <div className="text-lg leading-relaxed text-neutral-200">
                                <MathText>{question.solution}</MathText>
                            </div>
                        ) : (
                            <div className="p-8 border border-neutral-800 border-dashed rounded-xl text-center text-neutral-500 bg-neutral-900/50">
                                Detailed solution not available for this question.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Question Attempt Interface */}
                <div className="flex-1 md:w-1/2 overflow-y-auto p-6 lg:p-10 order-1 md:order-2">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-lg md:text-xl leading-relaxed text-neutral-100 mb-8">
                            <QuestionContent
                                text={question.text}
                                imageUrl={question.image}
                                onImageClick={setZoomedImage}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-8">
                            {question.options.map((option, index) => {
                                const isThisCorrect = option.id === question.correct_option;
                                const isUserSelected = userAttempt?.selectedOption === option.id;

                                // Determine styles based on correctness
                                let borderColor = 'border-neutral-800';
                                let bgColor = 'bg-neutral-900/40';
                                let textColor = 'text-neutral-200';
                                let IconLabel = null;
                                let letterBgColor = 'bg-neutral-800 text-neutral-400';

                                if (isThisCorrect) {
                                    borderColor = 'border-emerald-500';
                                    bgColor = 'bg-emerald-500/10';
                                    IconLabel = <div className="text-emerald-400 ml-auto flex items-center gap-1 font-bold text-sm"><CheckCircleIcon sx={{ fontSize: '1rem' }} /> Correct Answer</div>;
                                    letterBgColor = 'bg-emerald-500 text-black';
                                } else if (isUserSelected && !isThisCorrect) {
                                    borderColor = 'border-rose-500';
                                    bgColor = 'bg-rose-500/10';
                                    IconLabel = <div className="text-rose-400 ml-auto flex items-center gap-1 font-bold text-sm"><CancelIcon sx={{ fontSize: '1rem' }} /> Your Answer</div>;
                                    letterBgColor = 'bg-rose-500 text-white';
                                }

                                return (
                                    <div
                                        key={option.id}
                                        className={`text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden flex items-start gap-4 ${borderColor} ${bgColor}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 mt-1 ${letterBgColor}`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-base pt-1 ${textColor}`}>
                                                <MathText>{option.text}</MathText>
                                            </div>
                                            {option.image && (
                                                <div className="mt-3">
                                                    <img
                                                        src={option.image}
                                                        alt="Option"
                                                        className="max-h-32 rounded border border-neutral-700 cursor-pointer hover:border-neutral-500 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setZoomedImage(option.image!);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {IconLabel && <div className="shrink-0 mt-1.5">{IconLabel}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* Re-use Image Zoom Modal */}
            {zoomedImage && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] overflow-hidden"
                    onClick={() => {
                        setZoomedImage(null);
                        setZoomLevel(1);
                    }}
                >
                    <div className="fixed inset-0 flex items-center justify-center overflow-auto p-4">
                        <img
                            src={zoomedImage}
                            alt="Zoomed Content"
                            className="max-w-none transition-transform duration-200 ease-out rounded-lg"
                            style={{
                                transform: `scale(${zoomLevel})`,
                                maxHeight: zoomLevel > 1 ? 'none' : '90vh',
                                maxWidth: zoomLevel > 1 ? 'none' : '90vw'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
