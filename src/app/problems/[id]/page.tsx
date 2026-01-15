"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MenuBookOutlinedIcon,
    CheckCircleOutlinedIcon,
    CalculateOutlinedIcon,
    CalendarTodayOutlinedIcon,
    BookmarkIcon,
    PsychologyOutlinedIcon,
} from '@/components/icons';

interface QuestionOption {
    id: string;
    text: string;
    is_correct: boolean;
    image?: string;
}

interface QuestionData {
    id: string;
    content: {
        text: string;
        options: QuestionOption[];
        correct_option_id: string;
        image?: string;
    };
    pattern: {
        name: string;
        code: string;
        topic: string;
        subtopic: string;
    } | null;
    source: {
        exam: string;
        year: number;
        paper: string;
        section: string;
        question_number: number;
    };
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    is_verified: boolean;
}

interface NavigationData {
    prevId: string | null;
    nextId: string | null;
    currentPosition: number;
    totalCount: number;
    section: string;
}

function formatPaperInfo(paper: string): string {
    const dateMatch = paper.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!dateMatch) return paper;

    const [fullDate, day, month, year] = dateMatch;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];
    const formattedDate = `${day} ${monthName} ${year}`;

    let result = paper.replace(fullDate, formattedDate);

    const timeMatch = result.match(/(\d{2})\.(\d{2})\s+(AM|PM)\s+(\d{2})\.(\d{2})\s+(AM|PM)/);
    if (timeMatch) {
        const [fullTime, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch;
        const formattedTime = `(${startHour}:${startMin} ${startPeriod} - ${endHour}:${endMin} ${endPeriod})`;
        result = result.replace(fullTime, formattedTime);
    }

    return result;
}

function QuestionContent({ text, image }: { text: string; image?: string }) {
    if (text.includes('[IMAGE]') && image) {
        const parts = text.split('[IMAGE]');
        return (
            <div className="text-lg leading-relaxed text-neutral-200">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <MathText>{part}</MathText>
                        {index < parts.length - 1 && (
                            <div className="my-6 flex justify-center">
                                <img
                                    src={image}
                                    alt="Question illustration"
                                    className="rounded-xl border border-neutral-700 shadow-lg bg-white p-2"
                                    style={{ minWidth: '500px', maxWidth: '100%' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    return (
        <div className="text-lg leading-relaxed text-neutral-200">
            <MathText>{text}</MathText>
            {image && (
                <div className="mt-6 flex justify-center">
                    <img
                        src={image}
                        alt="Question illustration"
                        className="rounded-xl border border-neutral-700 shadow-lg bg-white p-2"
                        style={{ minWidth: '500px', maxWidth: '100%' }}
                    />
                </div>
            )}
        </div>
    );
}

export default function QuestionPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();
    const questionId = params.id as string;
    const section = searchParams.get('section') || 'QUANT';

    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [navigation, setNavigation] = useState<NavigationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        async function fetchQuestionAndNavigation() {
            setLoading(true);
            setSelectedOption(null);
            setIsSubmitted(false);
            setShowSolution(false);

            try {
                const [questionRes, navRes, bookmarksRes, attemptRes] = await Promise.all([
                    fetch(`/api/questions/${questionId}`),
                    fetch(`/api/questions/${questionId}/navigation?section=${section}`),
                    fetch('/api/user/bookmarks'),
                    fetch(`/api/attempts?questionId=${questionId}&limit=1`)
                ]);

                const questionData = await questionRes.json();
                const navData = await navRes.json();
                const bookmarksData = await bookmarksRes.json();
                const attemptData = await attemptRes.json();

                if (questionData.data) setQuestion(questionData.data);
                if (navData.data) setNavigation(navData.data);
                if (bookmarksData.success) {
                    setIsBookmarked(bookmarksData.bookmarks.includes(questionId));
                }

                // Pre-populate previous attempt if exists
                if (attemptData.data && attemptData.data.length > 0) {
                    const previousAttempt = attemptData.data[0];
                    setSelectedOption(previousAttempt.option_selected);
                    setIsSubmitted(true);
                }
            } catch (error) {
                console.error('Error fetching question:', error);
            }
            setLoading(false);
        }

        if (questionId) fetchQuestionAndNavigation();
    }, [questionId, section]);

    const goToPrevious = () => {
        if (navigation?.prevId) router.push(`/problems/${navigation.prevId}?section=${section}`);
    };

    const goToNext = () => {
        if (navigation?.nextId) router.push(`/problems/${navigation.nextId}?section=${section}`);
    };

    const handleOptionSelect = (optionId: string) => {
        if (!isSubmitted) setSelectedOption(optionId);
    };

    const handleSubmit = async () => {
        if (selectedOption && question) {
            const timeMs = Date.now() - startTime;
            setIsSubmitted(true);

            try {
                await fetch('/api/attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        questionId: question.id,
                        optionSelected: selectedOption,
                        timeMs,
                    }),
                });
                refreshUser();
            } catch (error) {
                console.error('Failed to record attempt:', error);
            }
        }
    };

    const handleReset = () => {
        setSelectedOption(null);
        setIsSubmitted(false);
        setShowSolution(false);
        setStartTime(Date.now());
    };

    const handleClearSelection = () => {
        if (!isSubmitted) setSelectedOption(null);
    };

    const handleBookmarkToggle = async () => {
        try {
            const action = isBookmarked ? 'remove' : 'add';
            const res = await fetch('/api/user/bookmarks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, action }),
            });
            const data = await res.json();
            if (data.success) {
                setIsBookmarked(!isBookmarked);
                refreshUser();
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        }
    };

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

    const getOptionStyle = (option: QuestionOption) => {
        const baseStyle = "p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4";

        if (!isSubmitted) {
            if (selectedOption === option.id) {
                return `${baseStyle} border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10`;
            }
            return `${baseStyle} border-neutral-700 bg-neutral-800/50 hover:border-amber-500/30 hover:bg-neutral-800`;
        }

        if (option.is_correct) {
            return `${baseStyle} border-emerald-500/50 bg-emerald-500/10`;
        }
        if (selectedOption === option.id && !option.is_correct) {
            return `${baseStyle} border-rose-500/50 bg-rose-500/10`;
        }
        return `${baseStyle} border-neutral-800 bg-neutral-900/50 opacity-50`;
    };

    const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f]">
                <div className="h-14 bg-[#1a1a1a]"></div>
                <div className="flex h-[calc(100vh-56px)]">
                    <div className="flex-1 p-8 animate-pulse">
                        <div className="h-10 bg-neutral-800 rounded-lg w-1/3 mb-6"></div>
                        <div className="h-40 bg-neutral-800 rounded-xl mb-6"></div>
                        <div className="h-64 bg-neutral-800 rounded-xl"></div>
                    </div>
                    <div className="w-[420px] bg-[#1a1a1a] border-l border-neutral-800 p-6 animate-pulse">
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-neutral-800 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center bg-[#1a1a1a] p-10 rounded-2xl border border-neutral-800">
                    <MenuBookOutlinedIcon sx={{ fontSize: '4rem' }} className="text-neutral-600 mb-4" />
                    <h2 className="text-2xl font-bold text-neutral-300">Question Not Found</h2>
                    <p className="text-neutral-500 mt-2">The question you're looking for doesn't exist.</p>
                    <Link href="/problems" className="mt-6 inline-block px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-400 transition-colors">
                        Back to Problems
                    </Link>
                </div>
            </div>
        );
    }

    const isCorrect = isSubmitted && selectedOption === question.content.correct_option_id;
    const hasPrevious = !!navigation?.prevId;
    const hasNext = !!navigation?.nextId;

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
            {/* Top Bar */}
            <header className="bg-[#1a1a1a] border-b border-neutral-800 h-14 flex items-center px-4 lg:px-6 justify-between shrink-0">
                <Link href="/problems" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                    <span className="font-medium text-sm">Back to Problems</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg">
                            <CalendarTodayOutlinedIcon sx={{ fontSize: '1rem' }} className="text-neutral-500" />
                            <span className="text-neutral-300 font-medium">SSC CGL {question.source.year}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg">
                            {section === 'QUANT' ? (
                                <CalculateOutlinedIcon sx={{ fontSize: '1rem' }} className="text-amber-500" />
                            ) : (
                                <PsychologyOutlinedIcon sx={{ fontSize: '1rem' }} className="text-violet-500" />
                            )}
                            <span className="text-neutral-300">{question.source.section}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBookmarkToggle}
                        className={`p-2 rounded-lg transition-colors ${isBookmarked
                            ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-amber-500'
                            }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                        <BookmarkIcon sx={{ fontSize: '1.25rem' }} />
                    </button>
                    <button
                        onClick={goToPrevious}
                        disabled={!hasPrevious}
                        className="p-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400 hover:text-white"
                    >
                        <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                    </button>
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 rounded-lg">
                        Q.{question.source.question_number}
                    </span>
                    <button
                        onClick={goToNext}
                        disabled={!hasNext}
                        className="p-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400 hover:text-white"
                    >
                        <ChevronRightIcon sx={{ fontSize: '1.25rem' }} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Question */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 lg:p-8 max-w-4xl">
                        {/* Metadata Tags */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-500 text-sm">Question</span>
                                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg text-sm">
                                    #{question.source.question_number}
                                </span>
                            </div>
                            <div className="w-px h-5 bg-neutral-700"></div>
                            {getDifficultyBadge(question.difficulty)}
                            <div className="w-px h-5 bg-neutral-700"></div>
                            <span className="text-neutral-400 text-sm">{formatPaperInfo(question.source.paper)}</span>
                            {question.pattern && (
                                <>
                                    <div className="w-px h-5 bg-neutral-700"></div>
                                    <span className="px-3 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-lg text-sm font-medium">
                                        {question.pattern.name}
                                    </span>
                                </>
                            )}
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`ml-auto p-2 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-500 bg-yellow-500/10' : 'text-neutral-500 hover:text-yellow-500 hover:bg-neutral-800'}`}
                            >
                                <BookmarkIcon sx={{ fontSize: '1.25rem' }} />
                            </button>
                        </div>

                        {/* Question Content */}
                        <div className="mb-8">
                            <QuestionContent text={question.content.text} image={question.content.image} />
                        </div>

                        {/* Solution Panel */}
                        {showSolution && (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mt-6">
                                <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                                    💡 Solution
                                </h3>
                                <div className="text-neutral-300">
                                    <p className="mb-2">
                                        <span className="text-neutral-500">Correct Answer:</span>{' '}
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg">
                                            Option {getOptionLabel(question.content.options.findIndex(o => o.is_correct))}
                                        </span>
                                    </p>
                                    <p className="text-neutral-500 mt-4 text-sm">
                                        Detailed explanation coming soon.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Options */}
                <div className="w-[420px] bg-[#1a1a1a] border-l border-neutral-800 flex flex-col shrink-0">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-neutral-800">
                        <h3 className="text-lg font-bold text-white">Choose Your Answer</h3>
                        <p className="text-sm text-neutral-500 mt-0.5">Select one option below</p>
                    </div>

                    {/* Options */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {question.content.options.map((option, index) => (
                            <div
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={getOptionStyle(option)}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0
                                    ${isSubmitted && option.is_correct
                                        ? 'bg-emerald-500 text-white'
                                        : isSubmitted && selectedOption === option.id && !option.is_correct
                                            ? 'bg-rose-500 text-white'
                                            : selectedOption === option.id
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                                : 'bg-neutral-700 text-neutral-300'
                                    }`}
                                >
                                    {isSubmitted && option.is_correct ? (
                                        <CheckCircleOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                                    ) : (
                                        getOptionLabel(index)
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-neutral-200 text-sm">
                                        <MathText>{option.text}</MathText>
                                    </div>
                                    {option.image && (
                                        <img
                                            src={option.image}
                                            alt={`Option ${getOptionLabel(index)}`}
                                            className="mt-3 max-w-full rounded-lg border border-neutral-700 bg-white p-1"
                                            style={{ minWidth: '180px' }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-neutral-900/50 border-t border-neutral-800 space-y-3">
                        {/* Result */}
                        {isSubmitted && (
                            <div className={`text-center py-3 rounded-xl font-bold text-sm ${isCorrect
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}>
                                {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-2">
                            {!isSubmitted ? (
                                <>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedOption}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                                    >
                                        Submit Answer
                                    </button>
                                    <button
                                        onClick={handleClearSelection}
                                        disabled={!selectedOption}
                                        className="px-4 py-3 border border-neutral-700 text-neutral-400 font-medium rounded-xl hover:border-rose-500/50 hover:text-rose-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Clear
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-3 border border-neutral-700 text-neutral-300 font-bold rounded-xl hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => setShowSolution(!showSolution)}
                                        className="flex-1 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-colors"
                                    >
                                        {showSolution ? 'Hide Solution' : 'View Solution'}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-2 pt-2 border-t border-neutral-800">
                            <button
                                onClick={goToPrevious}
                                disabled={!hasPrevious}
                                className="flex-1 py-2.5 text-neutral-400 hover:text-white font-medium rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
                                Previous
                            </button>
                            <button
                                onClick={goToNext}
                                disabled={!hasNext}
                                className="flex-1 py-2.5 text-neutral-400 hover:text-white font-medium rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
