import React, { useState, useEffect } from 'react';
import {
    TimerIcon,
    CheckCircleOutlinedIcon,
    CloseIcon,
    ZoomInOutlinedIcon,
    ZoomOutOutlinedIcon,
    BoltIcon,
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

interface SprintSessionLayoutProps {
    question: QuestionData;
    session: any; // SprintSession type
    questionElapsed: number; // Time spent on current question
    timer: {
        elapsed: number;
        totalAllowed: number;
        remaining: number;
    };
    selectedOption: string | null;
    onSelectOption: (id: string) => void;
    onSubmit: () => void;
    onSkip: () => void;
    onEndSprint: () => void;
    currentQuestionIndex: number;
    totalQuestions: number;
    zoomedImage: string | null;
    setZoomedImage: (url: string | null) => void;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
    zoomLevel: number;
}

export function SprintSessionLayout({
    question,
    session,
    questionElapsed,
    timer,
    selectedOption,
    onSelectOption,
    onSubmit,
    onSkip,
    onEndSprint,
    currentQuestionIndex,
    totalQuestions,
    zoomedImage,
    setZoomedImage,
    setZoomLevel,
    zoomLevel
}: SprintSessionLayoutProps) {
    const [showEndConfirmation, setShowEndConfirmation] = useState(false);

    // Format timer: MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Urgency colors
    const getTimerColor = () => {
        const percentage = (timer.remaining / timer.totalAllowed) * 100;
        if (percentage <= 25) return 'text-rose-500 animate-pulse'; // Critical
        if (percentage <= 50) return 'text-orange-500'; // Warning
        return 'text-white'; // Normal
    };

    // Calculate progress dots
    // We need to know status of previous questions. 
    // Assuming 'session' has a way to track status, or we iterate up to current index.
    // For now, render dots based on index.
    const renderProgressDots = () => {
        return (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-2 no-scrollbar">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const isPast = idx < currentQuestionIndex;

                    return (
                        <div
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${isCurrent
                                ? 'bg-amber-500 scale-125 ring-2 ring-amber-500/30'
                                : isPast
                                    ? 'bg-neutral-600' // We don't signify correct/wrong in sprint mode explicitly here to avoid discouragement? Review said "filled dot"
                                    : 'bg-neutral-800 border border-neutral-700'
                                }`}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-[#0f0f0f] z-50 flex flex-col font-sans text-neutral-200">
            {/* 1. Header Row (Timer & Meta) */}
            <header className="h-20 border-b border-neutral-800 bg-[#1a1a1a]/90 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 shrink-0 relative z-40">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Time Remaining</span>
                        <div className={`flex items-center gap-2 text-3xl font-mono font-black tracking-tight ${getTimerColor()} drop-shadow-sm`}>
                            <TimerIcon sx={{ fontSize: '1.8rem' }} />
                            {formatTime(timer.remaining)}
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col border-l border-neutral-800 pl-6 h-10 justify-center">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Current Question</span>
                        <span className="text-sm font-mono text-neutral-300">
                            {formatTime(questionElapsed)}
                        </span>
                    </div>
                </div>

                {/* Progress (Desktop) */}
                <div className="hidden lg:flex flex-col items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-2">
                        Question <span className="text-white text-lg mx-1">{currentQuestionIndex + 1}</span> / {totalQuestions}
                    </span>
                    {renderProgressDots()}
                </div>

                {/* Progress (Mobile - simplified) */}
                <div className="lg:hidden flex items-center gap-2 bg-neutral-800/80 px-4 py-1.5 rounded-full border border-neutral-700">
                    <span className="text-base font-bold text-white">{currentQuestionIndex + 1}</span>
                    <span className="text-xs text-neutral-500">/ {totalQuestions}</span>
                </div>

                <button
                    onClick={() => setShowEndConfirmation(true)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all text-sm font-medium flex items-center gap-1.5"
                >
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                    <span className="hidden sm:inline">End Sprint</span>
                </button>
            </header>

            {/* Mobile Progress Bar (Strip below header) */}
            <div className="lg:hidden h-1.5 bg-neutral-800 w-full">
                <div
                    className="h-full bg-amber-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
            </div>

            {/* 2. Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* Question Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center">
                    <div className="max-w-3xl w-full pb-24 lg:pb-0">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="px-3 py-1 bg-neutral-800 text-neutral-400 rounded-md text-xs font-bold uppercase tracking-wide border border-neutral-700">
                                {question.subject}
                            </span>
                            {question.pattern && (
                                <span className="px-3 py-1 bg-neutral-800 text-neutral-400 rounded-md text-xs font-bold uppercase tracking-wide border border-neutral-700">
                                    {question.pattern}
                                </span>
                            )}
                        </div>

                        <div className="text-lg md:text-xl leading-relaxed text-neutral-100 mb-8">
                            <QuestionContent
                                text={question.text}
                                imageUrl={question.image}
                                onImageClick={setZoomedImage}
                            />
                        </div>

                        {/* Options Section on Desktop - Rendered Inline */}
                        <div className="hidden lg:grid grid-cols-1 gap-3 max-w-2xl mt-8">
                            {question.options.map((option, index) => (
                                <button
                                    key={option.id}
                                    onClick={() => onSelectOption(option.id)}
                                    className={`text-left p-4 rounded-xl border-2 transition-all group relative overflow-hidden flex items-start gap-4 ${selectedOption === option.id
                                        ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                                        : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors mt-1 ${selectedOption === option.id
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-neutral-200'
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-base text-neutral-200 pt-1">
                                            <MathText>{option.text}</MathText>
                                        </div>
                                        {option.image && (
                                            <div className="mt-3">
                                                <img
                                                    src={option.image}
                                                    alt="Option"
                                                    className="max-h-32 rounded border border-neutral-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setZoomedImage(option.image!);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column / Bottom Sheet (Mobile Options & Actions) */}
                <div className="lg:hidden bg-[#1a1a1a] border-t border-neutral-800 p-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20 max-h-[50vh] flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-1">
                        {question.options.map((option, index) => (
                            <button
                                key={option.id}
                                onClick={() => onSelectOption(option.id)}
                                className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3 w-full ${selectedOption === option.id
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-neutral-700 bg-neutral-800'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${selectedOption === option.id ? 'bg-amber-500 text-black' : 'bg-neutral-700 text-neutral-400'
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <div className="truncate text-sm text-neutral-200 font-medium">
                                    <MathText>{option.text}</MathText>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Sticky Footer Action Bar */}
            <div className="p-4 bg-[#1a1a1a] border-t border-neutral-800 shrink-0 flex items-center gap-3 lg:px-8 z-30 relative">
                <button
                    onClick={onSkip}
                    className="px-6 py-3.5 rounded-xl border border-neutral-700 text-neutral-300 font-bold hover:bg-neutral-800 hover:text-white transition-all flex-1 lg:flex-none lg:w-48"
                >
                    Skip Question
                </button>
                <button
                    onClick={onSubmit}
                    disabled={!selectedOption}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:from-amber-400 hover:to-orange-500 transition-all flex-[2] lg:flex-none lg:w-64 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                    <span>Submit Answer</span>
                </button>
                <div className="hidden lg:block ml-auto text-xs text-neutral-500">
                    Press <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700 text-neutral-300">Enter</kbd> to submit
                </div>
            </div>

            {/* End Sprint Confirmation Modal */}
            {showEndConfirmation && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
                    <div className="bg-[#1a1a1a] border border-neutral-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">End Sprint?</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            You've answered {currentQuestionIndex} of {totalQuestions} questions.
                            Unanswered questions will be marked as skipped.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEndConfirmation(false)}
                                className="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-300 font-bold hover:bg-neutral-800 transition-colors"
                            >
                                Continue
                            </button>
                            <button
                                onClick={() => {
                                    setShowEndConfirmation(false);
                                    onEndSprint();
                                }}
                                className="flex-1 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 font-bold hover:bg-rose-500/20 transition-colors"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
                        <button
                            className="p-3 rounded-full bg-neutral-800/80 backdrop-blur text-white hover:bg-neutral-700 transition-colors border border-neutral-700"
                            onClick={() => {
                                setZoomedImage(null);
                                setZoomLevel(1);
                            }}
                        >
                            <CloseIcon sx={{ fontSize: '1.5rem' }} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
