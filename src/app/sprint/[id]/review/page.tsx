'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleOutlinedIcon,
    CloseIcon,
    ExpandMoreIcon,
    DashboardIcon,
    LogoutIcon,
    BookmarkIcon,
    BoltIcon,
} from '@/components/icons';

interface ReviewQuestion {
    index: number;
    questionId: string;
    text: string;
    image?: string;
    options: Array<{ id: string; text: string; image?: string }>;
    correct_option: string;            // "A"|"B"|"C"|"D"
    difficulty: string;
    userAnswer: string | null;
    isCorrect: boolean;
    timeTaken: number;
    wasAttempted: boolean;
}

interface SprintData {
    id: string;
    subject: string;
    difficulty: string;
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
}

export default function SprintReviewPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const sprintId = params.id as string;

    const [sprint, setSprint] = useState<SprintData | null>(null);
    const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await fetch(`/api/sprint/${sprintId}/review`);
                const data = await res.json();

                if (data.success) {
                    setSprint(data.sprint);
                    setQuestions(data.questions);
                }
            } catch (error) {
                console.error('Failed to fetch review:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (sprintId) fetchReview();
    }, [sprintId]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentIndex(index);
        }
    };

    const getOptionStyle = (option: { id: string }, correctOption: string, userAnswer: string | null) => {
        const baseStyle = "p-4 rounded-xl border transition-all flex items-center gap-4";
        const isCorrect = option.id === correctOption;

        if (isCorrect) {
            return `${baseStyle} border-emerald-500/50 bg-emerald-500/10`;
        }
        if (userAnswer === option.id && !isCorrect) {
            return `${baseStyle} border-rose-500/50 bg-rose-500/10`;
        }
        return `${baseStyle} border-neutral-800 bg-neutral-900/50 opacity-50`;
    };

    const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

    const getDifficultyBadge = (difficulty: string) => {
        const styles = {
            EASY: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            HARD: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        };
        return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-lg border ${styles[difficulty as keyof typeof styles] || styles.MEDIUM}`}>
                {difficulty}
            </span>
        );
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!sprint || questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-400 mb-4">Sprint review not found</p>
                    <Link href="/sprint" className="text-amber-500 hover:text-amber-400">
                        Back to Sprint
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isQuant = sprint.subject === 'QUANT';
    const primaryColor = isQuant ? 'text-amber-500' : 'text-violet-500';

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200">
            {/* Header */}
            <header className="bg-[#1a1a1a]/90 backdrop-blur-md border-b border-neutral-800/50 sticky top-0 z-50">
                <div className="w-full px-6 lg:px-12">
                    <div className="flex items-center justify-between h-14">
                        <Link href="/sprint/summary" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm">Back to Summary</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700">
                                <BoltIcon sx={{ fontSize: '1rem' }} className={primaryColor} />
                                <span className="text-sm font-medium text-white">Sprint Review</span>
                            </div>
                            <span className="text-sm font-bold text-amber-400">
                                {currentIndex + 1} / {questions.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToQuestion(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400 hover:text-white"
                            >
                                <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
                                <span className="text-sm font-medium">Previous</span>
                            </button>
                            <button
                                onClick={() => goToQuestion(currentIndex + 1)}
                                disabled={currentIndex === questions.length - 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400 hover:text-white"
                            >
                                <span className="text-sm font-medium">Next</span>
                                <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-56px)]">
                {/* Question Sidebar */}
                <div className="w-[300px] bg-[#1a1a1a] border-r border-neutral-800 overflow-y-auto">
                    <div className="p-4 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white mb-2">Questions</h3>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                {sprint.correctCount} Correct
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                {sprint.totalQuestions - sprint.correctCount} Wrong
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-neutral-800">
                        {questions.map((q, idx) => (
                            <button
                                key={q.questionId}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-full p-4 text-left flex items-center gap-3 transition-all border-l-4 ${idx === currentIndex
                                    ? q.isCorrect
                                        ? 'bg-emerald-500/15 border-l-emerald-500'
                                        : 'bg-rose-500/15 border-l-rose-500'
                                    : q.isCorrect
                                        ? 'border-l-emerald-500/50 hover:bg-emerald-500/5'
                                        : 'border-l-rose-500/50 hover:bg-rose-500/5'
                                    }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${q.isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-neutral-400 truncate">
                                        {q.text?.substring(0, 50) || 'Question'}...
                                    </p>
                                </div>
                                {q.isCorrect ? (
                                    <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} className="text-emerald-500 shrink-0" />
                                ) : (
                                    <CloseIcon sx={{ fontSize: '1rem' }} className="text-rose-500 shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Question Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-lg font-bold text-white">Q{currentQuestion.index}</span>
                            {getDifficultyBadge(currentQuestion.difficulty)}
                        </div>

                        {/* Question Content */}
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 mb-6">
                            <div className="text-lg leading-relaxed text-neutral-200">
                                <MathText>{currentQuestion.text || ''}</MathText>
                            </div>
                            {currentQuestion.image && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={currentQuestion.image}
                                        alt="Question"
                                        className="rounded-xl border border-neutral-700 bg-white p-2 max-w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options?.map((option, idx) => {
                                const isCorrect = option.id === currentQuestion.correct_option;
                                return (
                                    <div
                                        key={option.id}
                                        className={getOptionStyle(option, currentQuestion.correct_option, currentQuestion.userAnswer)}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isCorrect
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : currentQuestion.userAnswer === option.id
                                                ? 'bg-rose-500/20 text-rose-400'
                                                : 'bg-neutral-800 text-neutral-500'
                                            }`}>
                                            {getOptionLabel(idx)}
                                        </div>
                                        <div className="flex-1">
                                            <MathText>{option.text}</MathText>
                                        </div>
                                        {isCorrect && (
                                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                                Correct
                                            </span>
                                        )}
                                        {currentQuestion.userAnswer === option.id && !isCorrect && (
                                            <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
                                                Your Answer
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time Taken */}
                        <div className="mt-6 text-sm text-neutral-500">
                            Time taken: {(currentQuestion.timeTaken / 1000).toFixed(1)}s
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
