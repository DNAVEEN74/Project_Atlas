"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthActionGuard } from '@/components/auth/AuthActionGuard';
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
    TimerIcon,
    CloseIcon,
    ZoomInOutlinedIcon,
    ZoomOutOutlinedIcon,
    SplitscreenIcon,
    WarningIcon,
} from '@/components/icons';
import { ReportModal } from '@/components/ui/ReportModal';
import { SprintSessionLayout } from './SprintSessionLayout';
import { QuestionContent } from '@/components/ui/QuestionContent';

// ... (interfaces remain same) -> RESTORING MISSING CODE

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
    correct_option: string; // "A", "B", "C", or "D"
    solution?: string;
    pattern: string | null;
    subject: string;
    source: {
        exam: string;
        year: number;
        shift?: string;
    };
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    stats?: {
        attempt_count: number;
        accuracy_rate: number;
        avg_time_ms: number;
    };
    is_live: boolean;
    question_number?: number;
}

interface PaginationInfo {
    total: number;
    page: number;
    totalPages: number;
}

interface NavigationData {
    prevId: string | null;
    nextId: string | null;
    currentPosition: number;
    totalCount: number;
    section: string;
}

function formatShiftInfo(shift: string | undefined): string {
    if (!shift) return '';
    return shift;
}

function SolutionContent({ solution }: { solution: string }) {
    const lines = solution.split('\n').filter(line => line.trim());

    // Group lines into blocks
    const blocks: { header?: string; content: string[] }[] = [];
    let currentBlock: { header?: string; content: string[] } | null = null;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const boldHeaderMatch = trimmedLine.match(/^\*\*([^*]+)\*\*:?\s*(.*)/);

        if (boldHeaderMatch) {
            const [, headerText, remainingText] = boldHeaderMatch;
            currentBlock = { header: headerText, content: [] };
            if (remainingText) currentBlock.content.push(remainingText);
            blocks.push(currentBlock);
        } else {
            if (!currentBlock) {
                currentBlock = { content: [] };
                blocks.push(currentBlock);
            }
            currentBlock.content.push(trimmedLine);
        }
    });

    return (
        <div className="space-y-12 py-4">
            {blocks.map((block, bIdx) => (
                <div key={bIdx} className="relative pl-10 group">
                    {/* Vertical Connector Line */}
                    {bIdx !== blocks.length - 1 && (
                        <div className="absolute left-[7px] top-8 bottom-[-48px] w-px bg-neutral-800 group-hover:bg-amber-500/30 transition-colors" />
                    )}

                    {/* Step Indicator Dot */}
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-neutral-700 bg-[#0f0f0f] z-10 group-hover:border-amber-500 transition-colors flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-neutral-700 group-hover:bg-amber-500 transition-colors" />
                    </div>

                    {block.header && (
                        <h3 className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                            {block.header}
                        </h3>
                    )}

                    <div className="space-y-4">
                        {block.content.map((item, iIdx) => {
                            const trimmedItem = item.trim();

                            if (trimmedItem.startsWith('- ') || trimmedItem.startsWith('• ')) {
                                const bulletText = trimmedItem.substring(2);
                                return (
                                    <div key={iIdx} className="flex gap-4 text-neutral-300 text-[15px] leading-relaxed">
                                        <div className="mt-2.5 w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                                        <MathText>{bulletText}</MathText>
                                    </div>
                                );
                            }

                            if (trimmedItem.startsWith('$$') && trimmedItem.endsWith('$$')) {
                                return (
                                    <div key={iIdx} className="my-8 py-4 flex justify-center items-center overflow-x-auto custom-scrollbar-horizontal">
                                        <MathText>{trimmedItem}</MathText>
                                    </div>
                                );
                            }

                            return (
                                <div key={iIdx} className="text-neutral-200 text-[16px] leading-relaxed font-medium">
                                    <MathText>{trimmedItem}</MathText>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function Tooltip({ children, text, position = 'bottom' }: { children: React.ReactNode; text: string; position?: 'top' | 'bottom' | 'left' | 'right' }) {
    if (!text) return <>{children}</>;

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div className="relative group/tooltip inline-block">
            {children}
            <div className={`absolute ${positionClasses[position]} hidden group-hover/tooltip:block z-[100] pointer-events-none transition-all`}>
                <div className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
                    {text}
                </div>
            </div>
        </div>
    );
}

export default function QuestionPage({
    initialQuestion = null,
    initialNavigation = null
}: {
    initialQuestion?: QuestionData | null;
    initialNavigation?: NavigationData | null;
}) {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth(); // Removed user check
    const questionId = params.id as string;
    const section = searchParams.get('section') || 'QUANT';

    const [question, setQuestion] = useState<QuestionData | null>(initialQuestion);
    const [navigation, setNavigation] = useState<NavigationData | null>(initialNavigation);
    const [loading, setLoading] = useState(!initialQuestion);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [submittedTime, setSubmittedTime] = useState<number>(0); // Time in seconds when answer was submitted
    const { info: notifyInfo, warning: notifyWarning } = useToast();
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);


    // Timer tracking
    const [isTimerEnabled, setIsTimerEnabled] = useState(() => {
        // Restore timer enabled state from sessionStorage
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('timerEnabled') === 'true';
        }
        return false;
    });
    const [showTimerPrompt, setShowTimerPrompt] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // For normal mode: question time. For sprint mode: total sprint time.
    const [questionElapsed, setQuestionElapsed] = useState(0); // Specifically for current question time in sprint mode
    const [questionTimes, setQuestionTimes] = useState<Record<string, number>>(() => {
        // Restore question times from sessionStorage
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('questionTimes');
            return stored ? JSON.parse(stored) : {};
        }
        return {};
    });
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Practice session tracking
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceSession, setPracticeSession] = useState<{
        questionIds: string[];
        currentIndex: number;
        section: string;
        topic: string;
    } | null>(null);
    const [showPracticeCompleteModal, setShowPracticeCompleteModal] = useState(false);

    // Sprint session tracking
    const [isSprintMode, setIsSprintMode] = useState(false);
    const [sprintSession, setSprintSession] = useState<{
        sprintId: string;
        questionIds: string[];
        // Store full questions if available to avoid refetching sidebar details
        questions?: any[];
        currentIndex: number;
        subject: string;
        difficulty: string;
        topics?: string[]; // Topics/patterns for this sprint
        totalTimeAllowed: number;
        startTime: number;
    } | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);
    const [sidebarQuestions, setSidebarQuestions] = useState<Array<{
        id: string;
        text: string;
        difficulty: string;
        isAttempted: boolean;
    }>>([]);
    const [focusedSidebarIndex, setFocusedSidebarIndex] = useState(0);
    const sidebarListRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll sidebar when focusedIndex changes
    useEffect(() => {
        if (showSidebar && sidebarListRef.current) {
            const focusedItem = document.getElementById(`sidebar-item-${focusedSidebarIndex}`);
            if (focusedItem) {
                focusedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [focusedSidebarIndex, showSidebar]);

    // Update focused index when sidebar opens or question changes
    useEffect(() => {
        if (isSprintMode && sprintSession) {
            setFocusedSidebarIndex(sprintSession.currentIndex);
        } else if (isPracticeMode && practiceSession) {
            setFocusedSidebarIndex(practiceSession.currentIndex);
        }
    }, [showSidebar, isSprintMode, sprintSession?.currentIndex, isPracticeMode, practiceSession?.currentIndex]);

    // Keyboard zoom controls
    useEffect(() => {
        if (!zoomedImage) return;

        const handleZoomKeyDown = (e: KeyboardEvent) => {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                setZoomLevel(prev => Math.min(3, prev + 0.25));
            } else if (e.key === '-') {
                e.preventDefault();
                setZoomLevel(prev => Math.max(0.5, prev - 0.25));
            } else if (e.key === 'Escape') {
                setZoomedImage(null);
                setZoomLevel(1);
            }
        };

        window.addEventListener('keydown', handleZoomKeyDown);
        return () => window.removeEventListener('keydown', handleZoomKeyDown);
    }, [zoomedImage]);

    // Fetch sidebar question details when sidebar opens
    useEffect(() => {
        async function fetchSidebarQuestions() {
            if (!showSidebar) return;

            if (isPracticeMode && practiceSession) {
                // Fetch details for practice questions
                const details = await Promise.all(
                    practiceSession.questionIds.map(async (qId) => {
                        try {
                            const res = await fetch(`/api/questions/${qId}`);
                            if (res.ok) {
                                const data = await res.json();
                                return {
                                    id: qId,
                                    text: data.data?.text || '',
                                    difficulty: data.data?.difficulty || 'MEDIUM',
                                    isAttempted: false
                                };
                            }
                        } catch {
                            // Silently handle fetch errors
                        }
                        return { id: qId, text: 'Question details unavailable', difficulty: 'MEDIUM', isAttempted: false };
                    })
                );
                setSidebarQuestions(details);
            }

            if (isSprintMode && sprintSession) {
                // If we stored full questions in session, use them
                if (sprintSession.questions) {
                    const details = sprintSession.questions.map((q: any) => ({
                        id: q._id || q.id,
                        text: q.text || '',
                        difficulty: q.difficulty,
                        isAttempted: false
                    }));
                    setSidebarQuestions(details);
                    return;
                }
                // Fallback to fetching if needed (though Setup stores simple list usually)
            }
        }
        fetchSidebarQuestions();
    }, [showSidebar, isPracticeMode, practiceSession, isSprintMode, sprintSession]);

    useEffect(() => {
        async function fetchQuestionAndNavigation() {
            setLoading(true);
            setSelectedOption(null);
            setIsSubmitted(false);
            setShowSolution(false);

            try {
                const promises: Promise<any>[] = [];

                // Determine if we need to fetch question data
                const needsQuestionFetch = !initialQuestion || initialQuestion.id !== questionId;

                // Always fetch navigation unless we have valid initialNavigation for this questionId
                const needsNavigationFetch = !initialNavigation || !navigation || navigation.currentPosition === undefined;

                if (needsQuestionFetch) {
                    promises.push(fetch(`/api/questions/${questionId}`).then(r => r.json()));
                } else {
                    promises.push(Promise.resolve({ data: initialQuestion }));
                }

                // Always fetch navigation to ensure buttons work
                // Pass all filter params to navigation API
                const navParams = new URLSearchParams();
                navParams.set('section', section);
                const pattern = searchParams.get('pattern');
                const difficulty = searchParams.get('difficulty');
                const year = searchParams.get('year');
                const status = searchParams.get('status');
                const query = searchParams.get('query');

                if (pattern) navParams.set('pattern', pattern);
                if (difficulty) navParams.set('difficulty', difficulty);
                if (year) navParams.set('year', year);
                if (status) navParams.set('status', status);
                if (query) navParams.set('query', query);

                promises.push(fetch(`/api/questions/${questionId}/navigation?${navParams.toString()}`).then(r => r.json()));

                promises.push(fetch(`/api/bookmarks?limit=100`).then(r => r.ok ? r.json() : { data: [] }));
                promises.push(
                    fetch(`/api/attempts?questionId=${questionId}&limit=1`)
                        .then(r => r.ok ? r.json() : { data: [] })
                        .catch(() => ({ data: [] }))
                );

                const [questionData, navData, bookmarksData, attemptData] = await Promise.all(promises);

                if (questionData.data) setQuestion(questionData.data);
                if (navData.data) {
                    setNavigation(navData.data);
                }

                if (bookmarksData.data) {
                    const bookmarkedIds = bookmarksData.data.map((b: any) => b.question?._id?.toString() || b.question?.toString());
                    setIsBookmarked(bookmarkedIds.includes(questionId));
                }

                // Pre-populate previous attempt if exists (but NOT in sprint mode - each sprint is independent)
                const isInSprintMode = searchParams.get('sprint') === 'true';
                if (!isInSprintMode && attemptData.data && attemptData.data.length > 0) {
                    const previousAttempt = attemptData.data[0];
                    setSelectedOption(previousAttempt.option_selected);
                    setIsSubmitted(true);
                    setShowSolution(true);
                    if (previousAttempt.time_ms > 0) {
                        setSubmittedTime(Math.floor(previousAttempt.time_ms / 1000));
                    }
                }
            } catch (error) {
                console.error('Error fetching question:', error);
            }
            setLoading(false);
        }

        fetchQuestionAndNavigation();
    }, [questionId, section]);

    // Reset timer states when question changes
    useEffect(() => {
        // Reset start time for non-timer mode tracking
        setStartTime(Date.now());

        // Reset submitted time
        setSubmittedTime(0);

        // Reset elapsed time unless we have a saved time for this question
        if (!isTimerEnabled) {
            setElapsedTime(0);
            setQuestionElapsed(0);
        } else {
            // For timer mode, load saved time or start at 0
            setElapsedTime(questionTimes[questionId] || 0);
        }

        // Clear selection and submission state for new question (unless prepopulated from attempt)
        // This will be handled by the fetch effect above
    }, [questionId]);

    // Load practice session from sessionStorage
    useEffect(() => {
        const practiceParam = searchParams.get('practice');
        if (practiceParam === 'true') {
            const stored = sessionStorage.getItem('practiceSession');
            if (stored) {
                const session = JSON.parse(stored);
                setPracticeSession(session);
                setIsPracticeMode(true);
                // Update currentIndex based on current question
                const currentIdx = session.questionIds.indexOf(questionId);
                if (currentIdx !== -1 && currentIdx !== session.currentIndex) {
                    session.currentIndex = currentIdx;
                    sessionStorage.setItem('practiceSession', JSON.stringify(session));
                    setPracticeSession(session);
                }
            } else {
                // Session data not found but param is present - might be stale
                console.warn('Practice mode enabled but no session data found');
                setIsPracticeMode(false);
            }
        } else if (practiceParam === null || practiceParam === 'false') {
            // Only clear if explicitly not in practice mode
            setIsPracticeMode(false);
            setPracticeSession(null);
        }
    }, [questionId, searchParams]);

    // Load sprint session from sessionStorage
    useEffect(() => {
        const sprintParam = searchParams.get('sprint');
        if (sprintParam === 'true') {
            const stored = sessionStorage.getItem('sprintSession');
            if (stored) {
                const session = JSON.parse(stored);
                setSprintSession(session);
                setIsSprintMode(true);
                // Update currentIndex
                const currentIdx = session.questionIds.indexOf(questionId);
                if (currentIdx !== -1 && currentIdx !== session.currentIndex) {
                    session.currentIndex = currentIdx;
                    sessionStorage.setItem('sprintSession', JSON.stringify(session));
                    setSprintSession(session);
                }
            } else {
                // Session data not found but param is present - might be stale
                console.warn('Sprint mode enabled but no session data found');
                setIsSprintMode(false);
            }
        } else if (sprintParam === null || sprintParam === 'false') {
            // Only clear if explicitly not in sprint mode
            setIsSprintMode(false);
            setSprintSession(null);
        }
    }, [questionId, searchParams]);

    // Timer effect - runs when timer is enabled
    // Timer effect - runs when timer is enabled or in Sprint Mode
    useEffect(() => {
        // Continuous timer for Sprint Mode
        if (isSprintMode && sprintSession) {
            // Calculate elapsed time based on start time
            // In Sprint Mode, we track specific question time too, but main timer is global
            const updateTimer = () => {
                const now = Date.now();
                const totalElapsed = Math.floor((now - sprintSession.startTime) / 1000);

                // If time is up, finish sprint
                // Note: totalTimeAllowed is in milliseconds, convert to seconds for comparison
                const totalTimeAllowedSec = Math.floor(sprintSession.totalTimeAllowed / 1000);
                if (totalElapsed >= totalTimeAllowedSec) {
                    if (timerRef.current) clearInterval(timerRef.current);

                    // Auto-finish logic
                    const totalTimeSpent = sprintSession.totalTimeAllowed; // Already in ms
                    sessionStorage.setItem('sprintResults', JSON.stringify({
                        sprintId: sprintSession.sprintId,
                        totalTimeSpent,
                        timedOut: true
                    }));
                    router.push('/sprint/summary');
                    return;
                }

                // Update per-question time for display in SprintSessionLayout
                const qElapsedSinceLastAction = Math.floor((now - startTime) / 1000);
                setQuestionElapsed(qElapsedSinceLastAction);

                // Update general elapsed time for display if needed
                setElapsedTime(totalElapsed);
            };

            updateTimer(); // Initial call
            timerRef.current = setInterval(updateTimer, 1000);
        } else if (isTimerEnabled && !isSubmitted) {
            // Standard per-question timer
            setElapsedTime(questionTimes[questionId] || 0);
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [questionId, isTimerEnabled, isSubmitted, isSprintMode, sprintSession]);

    const goToPrevious = () => {
        // Save current question time before navigating
        if (isTimerEnabled && !isSubmitted) {
            const newTimes = { ...questionTimes, [questionId]: elapsedTime };
            setQuestionTimes(newTimes);
            sessionStorage.setItem('questionTimes', JSON.stringify(newTimes));
        }
        if (isPracticeMode && practiceSession) {
            const prevIndex = practiceSession.currentIndex - 1;
            if (prevIndex >= 0) {
                const prevId = practiceSession.questionIds[prevIndex];
                router.push(`/problems/${prevId}?section=${practiceSession.section}&practice=true`);
            }
        } else if (isSprintMode && sprintSession) {
            const prevIndex = sprintSession.currentIndex - 1;
            if (prevIndex >= 0) {
                const prevId = sprintSession.questionIds[prevIndex];
                router.push(`/problems/${prevId}?section=${sprintSession.subject}&sprint=true`);
            }
        } else if (navigation?.prevId) {
            const params = new URLSearchParams(searchParams.toString());
            // Ensure section is preserved or updated if changed (though usually same)
            params.set('section', section);
            router.push(`/problems/${navigation.prevId}?${params.toString()}`);
        }
    };



    const finishSprint = async (timedOut = false) => {
        if (!sprintSession) return;

        const totalTimeSpent = Date.now() - sprintSession.startTime;

        // Calculate stats from stored attempts
        const storedAttempts = JSON.parse(sessionStorage.getItem('sprintAttempts') || '{}');
        const correctCount = Object.values(storedAttempts).filter((a: any) => a.isCorrect).length;

        // Save to Backend with detailed attempt data
        let dbSessionId = null;
        console.log("Saving sprint results...", { correctCount, totalTimeSpent, attempts: Object.keys(storedAttempts).length });
        try {
            const res = await fetch('/api/sprint/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sprintId: sprintSession.sprintId,
                    subject: sprintSession.subject,
                    difficulty: sprintSession.difficulty,
                    topics: sprintSession.topics || [],
                    totalQuestions: sprintSession.questionIds.length,
                    correctCount,
                    timeSpent: totalTimeSpent,
                    status: timedOut ? 'COMPLETED' : 'ABANDONED',
                    questionIds: sprintSession.questionIds,
                    attempts: storedAttempts // Send all attempt details
                })
            });
            const data = await res.json();
            console.log("Save response:", data);
            if (data.success && data.sessionId) {
                dbSessionId = data.sessionId;
                console.log("Sprint saved with ID:", dbSessionId);
            } else {
                console.error("Save failed or no sessionId returned", data);
            }
        } catch (err) {
            console.error("Failed to save sprint", err);
        }

        // Save results for summary page - ONLY if we got a valid DB session ID
        if (dbSessionId) {
            sessionStorage.setItem('sprintResults', JSON.stringify({
                sprintId: dbSessionId, // Use MongoDB ID
                totalTimeSpent,
                timedOut,
                correctCount,
                totalQuestions: sprintSession.questionIds.length
            }));
        } else {
            // Fallback: save minimal data without sprintId
            console.warn("No DB session ID, saving minimal results");
            sessionStorage.setItem('sprintResults', JSON.stringify({
                sprintId: null,
                totalTimeSpent,
                timedOut,
                correctCount,
                totalQuestions: sprintSession.questionIds.length,
                subject: sprintSession.subject,
                difficulty: sprintSession.difficulty,
                topics: sprintSession.topics || []
            }));
        }

        router.push('/sprint/summary');
    };

    const handleEndSprint = () => {
        // User manually ended
        finishSprint(false); // Should we mark as ABANDONED? 
        // For now, let's treat manual end as 'Submitted what I have'.
    };

    const handleSkip = () => {
        // In sprint mode, record skip with 'SKIPPED' as selectedOption
        if (isSprintMode && sprintSession && question) {
            const currentAttempts = JSON.parse(sessionStorage.getItem('sprintAttempts') || '{}');
            currentAttempts[questionId] = {
                questionId: questionId,
                selectedOption: 'SKIPPED',
                isCorrect: false,
                timeMs: elapsedTime * 1000,
                topic: question.pattern || 'Unknown',
                difficulty: question.difficulty
            };
            sessionStorage.setItem('sprintAttempts', JSON.stringify(currentAttempts));
            notifyInfo('Question Skipped');
        }
        goToNext();
    };

    const goToNext = () => {
        if (isPracticeMode && practiceSession) {
            const nextIndex = practiceSession.currentIndex + 1;
            // Check if we've completed all 5 questions - only show modal if current question was submitted
            if (nextIndex >= practiceSession.questionIds.length) {
                if (isSubmitted) {
                    setShowPracticeCompleteModal(true);
                } else {
                    notifyWarning('Please submit your answer before finishing!');
                }
                // Don't navigate if on last question (whether submitted or not)
                return;
            }
            // Save current question time before navigating
            if (isTimerEnabled && !isSubmitted) {
                const newTimes = { ...questionTimes, [questionId]: elapsedTime };
                setQuestionTimes(newTimes);
                sessionStorage.setItem('questionTimes', JSON.stringify(newTimes));
            }
            const nextId = practiceSession.questionIds[nextIndex];
            router.push(`/problems/${nextId}?section=${practiceSession.section}&practice=true`);
        } else if (isSprintMode && sprintSession) {
            // Save Sprint Attempt locally with complete data
            if (selectedOption && question) {
                const currentAttempts = JSON.parse(sessionStorage.getItem('sprintAttempts') || '{}');
                currentAttempts[questionId] = {
                    questionId: questionId,
                    selectedOption: selectedOption,
                    isCorrect: selectedOption === question.correct_option,
                    timeMs: elapsedTime * 1000,
                    topic: question.pattern || 'Unknown',
                    difficulty: question.difficulty
                };
                sessionStorage.setItem('sprintAttempts', JSON.stringify(currentAttempts));
            }

            const nextIndex = sprintSession.currentIndex + 1;
            // Finish Sprint logic
            if (nextIndex >= sprintSession.questionIds.length) {
                finishSprint();
                return;
            }

            const nextId = sprintSession.questionIds[nextIndex];
            router.push(`/problems/${nextId}?section=${sprintSession.subject}&sprint=true`);
        } else if (navigation?.nextId) {
            // Save current question time before navigating
            if (isTimerEnabled && !isSubmitted) {
                setQuestionTimes(prev => ({ ...prev, [questionId]: elapsedTime }));
            }
            const params = new URLSearchParams(searchParams.toString());
            // Ensure section is preserved or updated if changed
            params.set('section', section);
            router.push(`/problems/${navigation.nextId}?${params.toString()}`);
        }
    };

    const handleContinuePractice = async () => {
        setShowPracticeCompleteModal(false);
        // Fetch new set of questions and continue
        try {
            const res = await fetch(`/api/quick-practice?section=${practiceSession?.section || section}&topic=${practiceSession?.topic || 'All'}&limit=5`);
            const data = await res.json();
            if (data.success && data.questionIds.length > 0) {
                sessionStorage.setItem('practiceSession', JSON.stringify({
                    questionIds: data.questionIds,
                    currentIndex: 0,
                    section: practiceSession?.section || section,
                    topic: practiceSession?.topic || 'All'
                }));
                router.push(`/problems/${data.questionIds[0]}?section=${practiceSession?.section || section}&practice=true`);
            } else {
                notifyInfo('No more unattempted questions found!');
                handleExitPractice();
            }
        } catch (error) {
            console.error('Failed to continue practice:', error);
            handleExitPractice();
        }
    };

    const handleExitPractice = () => {
        setShowPracticeCompleteModal(false);
        sessionStorage.removeItem('practiceSession');
        setIsPracticeMode(false);
        setPracticeSession(null);
        router.push('/problems');
    };

    const handleOptionSelect = (optionId: string) => {
        if (!isSubmitted) setSelectedOption(optionId);
    };

    const handleSubmit = async () => {
        if (selectedOption && question) {
            // Only track time if timer is enabled
            const timeMs = isTimerEnabled ? elapsedTime * 1000 : 0;
            const timeSeconds = Math.floor(timeMs / 1000);

            // Store submitted time for display (only if timer enabled)
            if (isTimerEnabled) {
                setSubmittedTime(timeSeconds);
            }

            // In Sprint Mode: Don't show result, navigate immediately
            if (isSprintMode && sprintSession) {
                // Save locally for Sprint Summary
                const currentAttempts = JSON.parse(sessionStorage.getItem('sprintAttempts') || '{}');
                currentAttempts[sprintSession.currentIndex] = {
                    questionId: question.id,
                    selectedOption: selectedOption,
                    isCorrect: selectedOption === question.correct_option,
                    timeSpent: timeMs
                };
                sessionStorage.setItem('sprintAttempts', JSON.stringify(currentAttempts));

                // Record attempt in background (for global stats)
                // We keep this to track question difficulty stats over time
                fetch('/api/attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        questionId: question.id,
                        optionSelected: selectedOption,
                        timeMs,
                        isSprint: true,
                        localDate: new Date().toLocaleDateString('en-CA')
                    }),
                }).catch(err => console.error('Failed to record attempt:', err));

                // Hand off to navigation logic (which now handles finishing sprint)
                // calls finishSprint() if last question
                goToNext();
                return;
            }

            // Normal mode: Show result
            setIsSubmitted(true);

            // Stop the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Auto-show solution if answer is wrong
            const isAnswerCorrect = selectedOption === question.correct_option;
            if (!isAnswerCorrect) {
                setShowSolution(true);
            }

            try {
                // Record the attempt
                // Send local date to ensure streak updates correctly for user's timezone
                const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

                await fetch('/api/attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        questionId: question.id,
                        optionSelected: selectedOption,
                        timeMs,
                        localDate
                    }),
                });

                // If in practice mode, mark question as answered in DB session
                if (isPracticeMode && practiceSession) {
                    const practiceRes = await fetch('/api/quick-practice', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            questionId: question.id,
                            section: practiceSession.section
                        }),
                    });
                    const practiceData = await practiceRes.json();

                    // Check if practice session is now complete
                    if (practiceData.isComplete) {
                        setShowPracticeCompleteModal(true);
                    }
                }

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
        setSubmittedTime(0);

        // Reset elapsed time based on timer mode
        if (isTimerEnabled) {
            setElapsedTime(0);
            // Clear saved time for this question
            const newTimes = { ...questionTimes };
            delete newTimes[questionId];
            setQuestionTimes(newTimes);
            sessionStorage.setItem('questionTimes', JSON.stringify(newTimes));
        }
    };

    const handleClearSelection = () => {
        if (!isSubmitted) setSelectedOption(null);
    };

    const handleBookmarkToggle = async () => {
        try {
            const res = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId }),
            });
            const data = await res.json();
            setIsBookmarked(data.bookmarked);
            refreshUser();
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        }
    };

    // Keyboard shortcuts for option selection and submit
    useEffect(() => {


        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if focus is on an input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            // --- SIDEBAR NAVIGATION (When Open) ---
            if (showSidebar) {
                const totalQuestions = isSprintMode && sprintSession ? sprintSession.questionIds.length : (isPracticeMode && practiceSession ? practiceSession.questionIds.length : 0);

                if (totalQuestions > 0) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setFocusedSidebarIndex(prev => (prev + 1) % totalQuestions);
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setFocusedSidebarIndex(prev => (prev - 1 + totalQuestions) % totalQuestions);
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        // Navigate to focused question
                        const ids = isSprintMode ? sprintSession!.questionIds : practiceSession!.questionIds;
                        if (ids[focusedSidebarIndex]) {
                            const sec = isSprintMode ? sprintSession!.subject : practiceSession!.section;
                            router.push(`/problems/${ids[focusedSidebarIndex]}?section=${sec}&${isSprintMode ? 'sprint' : 'practice'}=true`);
                            // Keep sidebar open or close? User usually wants to see the question now.
                            // Let's keep it open for now as per "navigate between them" request, 
                            // but usually selecting implies "I want to solve this now".
                            // Let's NOT close it automatically, or make it optional.
                            // Actually, let's close it so they can see the question full screen.
                            // But wait, request said: "The questions should not appearing... we should prioritize how question appearing in sidebar... to switch between questions... navigate between these questions..."
                            // It sounds like they want to preview/select.
                            // Let's close it on Enter.
                            setShowSidebar(false);
                        }
                    }
                }
                return; // Stop other handlers when sidebar is open
            }

            // --- NORMAL NAVIGATION (Sidebar Closed) ---
            // Arrow keys for navigation (Sprint & Practice mode)
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevious();
            }

            // Number keys 1-4 for option selection
            if (!isSubmitted && question?.options) {
                const keyNum = parseInt(e.key);
                if (keyNum >= 1 && keyNum <= question.options.length) {
                    const option = question.options[keyNum - 1];
                    setSelectedOption(option.id);
                }
            }

            // Enter to submit (only if sidebar closed)
            if (e.key === 'Enter' && selectedOption && !isSubmitted) {
                handleSubmit();
            }

            // Backspace to clear selection
            if (e.key === 'Backspace' && !isSubmitted) {
                setSelectedOption(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [question, selectedOption, isSubmitted, goToNext, goToPrevious, showSidebar, sprintSession, practiceSession, focusedSidebarIndex]);

    // Helper function to convert snake_case or SCREAMING_SNAKE_CASE to Title Case
    const formatLabel = (text: string) => {
        return text
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getDifficultyBadge = (difficulty: string) => {
        const styles = {
            EASY: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            HARD: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        };
        return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${styles[difficulty as keyof typeof styles] || styles.MEDIUM}`}>
                {formatLabel(difficulty)}
            </span>
        );
    };

    const getOptionStyle = (option: QuestionOption) => {
        const baseStyle = "p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-4";

        if (!isSubmitted) {
            if (selectedOption === option.id) {
                return `${baseStyle} border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20`;
            }
            return `${baseStyle} border-neutral-700 bg-neutral-800/50 hover:border-amber-500/40 hover:bg-amber-500/5 hover:translate-x-1 hover:shadow-md hover:shadow-amber-500/5`;
        }

        // In Sprint Mode: Don't reveal correct/incorrect - just show submitted state
        if (isSprintMode) {
            if (selectedOption === option.id) {
                return `${baseStyle} border-blue-500/50 bg-blue-500/10`; // Neutral "submitted" styling
            }
            return `${baseStyle} border-neutral-800 bg-neutral-900/50 opacity-50`;
        }

        // Normal mode: Show correct/incorrect feedback
        if (option.id === question?.correct_option) {
            return `${baseStyle} border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10`;
        }
        if (selectedOption === option.id && option.id !== question?.correct_option) {
            return `${baseStyle} border-rose-500/50 bg-rose-500/10 shadow-lg shadow-rose-500/10`;
        }
        return `${baseStyle} border-neutral-800 bg-neutral-900/50 opacity-40`;
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

    const isCorrect = isSubmitted && selectedOption === question.correct_option;
    const hasPrevious = !!navigation?.prevId;
    const hasNext = !!navigation?.nextId;
    const isQuant = section === 'QUANT';

    // Conditional Render: Sprint Mode
    if (isSprintMode && sprintSession && question) {
        // Calculate remaining time for the specific sprint timer prop format
        const totalTimeAllowedSec = Math.floor(sprintSession.totalTimeAllowed / 1000);
        const remaining = Math.max(0, totalTimeAllowedSec - elapsedTime);

        return (
            <SprintSessionLayout
                question={question}
                session={sprintSession}
                questionElapsed={questionElapsed}
                timer={{
                    elapsed: elapsedTime,
                    totalAllowed: totalTimeAllowedSec,
                    remaining: remaining
                }}
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
                onSubmit={() => {
                    // Basic check if correct option is selected (sprint mode usually auto-submits or just records)
                    // Here we just mark submitted and record attempt?
                    // Verify if we should save attempt here
                    setIsSubmitted(true);
                    // If we want to record the attempt:
                    // saveAttempt(question.id, selectedOption); 
                    // But for sprint speed, maybe we just wait for 'Next'? 
                    // The UI calls onSubmit, then usually we go Next.
                    // Let's call goToNext() which handles logic?
                    // Wait, SprintSessionLayout has explicit "Submit" button which triggers onSubmit.
                    // Logic:
                    if (selectedOption) {
                        goToNext();
                    }
                }}
                onSkip={handleSkip}
                onEndSprint={handleEndSprint}
                currentQuestionIndex={sprintSession.currentIndex}
                totalQuestions={sprintSession.questionIds.length}
                zoomedImage={zoomedImage}
                setZoomedImage={setZoomedImage}
                setZoomLevel={setZoomLevel}
                zoomLevel={zoomLevel}
            />
        );
    }

    return (
        <div className="h-screen bg-[#0f0f0f] flex flex-col relative overflow-hidden">
            {/* Sidebar Toggle Button - Only show in Practice/Sprint mode */}
            {(isPracticeMode || isSprintMode) && (
                <Tooltip text={showSidebar ? 'Hide List' : 'Show List'} position="right">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 p-2 rounded-xl transition-all duration-300 shadow-lg ${showSidebar
                            ? 'bg-amber-500 text-white translate-x-[520px] shadow-amber-500/20'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white hover:shadow-neutral-700/30'}`}
                    >
                        <SplitscreenIcon sx={{ fontSize: '1.5rem' }} />
                    </button>
                </Tooltip>
            )}

            {/* Question Navigation Sidebar - Only render in Practice/Sprint mode */}
            {(isPracticeMode || isSprintMode) && (
                <div className={`fixed left-0 top-0 h-full w-[520px] bg-[#1a1a1a] border-r border-neutral-800 z-40 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">
                                {isSprintMode ? 'Sprint Questions' : (isPracticeMode ? 'Practice Questions' : 'Problem List')}
                            </h3>
                            <ChevronRightIcon sx={{ fontSize: '1.25rem' }} className="text-neutral-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-400">
                                {isSprintMode && sprintSession
                                    ? `${sprintSession.currentIndex + 1}/${sprintSession.questionIds.length}`
                                    : (isPracticeMode && practiceSession
                                        ? `${practiceSession.currentIndex + 1}/${practiceSession.questionIds.length}`
                                        : navigation ? `${navigation.currentPosition}/${navigation.totalCount}` : '')
                                }
                            </span>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            >
                                <CloseIcon sx={{ fontSize: '1.25rem' }} />
                            </button>
                        </div>
                    </div>

                    {/* Question List */}
                    <div ref={sidebarListRef} className="overflow-y-auto max-h-[calc(100vh-80px)]">
                        {(isPracticeMode && practiceSession) || (isSprintMode && sprintSession) ? (
                            <div className="divide-y divide-neutral-800">
                                {(isSprintMode ? sprintSession!.questionIds : practiceSession!.questionIds).map((qId, idx) => {
                                    const isCurrent = qId === questionId;
                                    const isFocused = idx === focusedSidebarIndex;
                                    const qDetails = sidebarQuestions.find(q => q.id === qId);
                                    const diffStyles: Record<string, string> = {
                                        'EASY': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                                        'MEDIUM': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                                        'HARD': 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                    };
                                    const diffLabels: Record<string, string> = { 'EASY': 'Easy', 'MEDIUM': 'Med.', 'HARD': 'Hard' };

                                    return (
                                        <button
                                            id={`sidebar-item-${idx}`}
                                            key={qId}
                                            onClick={() => {
                                                const sec = isSprintMode ? sprintSession!.subject : practiceSession!.section;
                                                router.push(`/problems/${qId}?section=${sec}&${isSprintMode ? 'sprint' : 'practice'}=true`);
                                                // Close sidebar on mobile/smaller screens if needed, but keeping open for quick nav is good
                                                // setShowSidebar(false); 
                                            }}
                                            className={`w-full p-4 text-left transition-all flex items-start gap-4 hover:bg-neutral-800/80 group ${isCurrent
                                                ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                                                : 'border-l-4 border-l-transparent'
                                                } ${isFocused && !isCurrent ? 'ring-2 ring-amber-500/50 bg-neutral-800/60' : ''}`}
                                        >
                                            {/* Number Badge */}
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-transform group-hover:scale-110 ${isCurrent ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                                }`}>
                                                {idx + 1}
                                            </div>

                                            {/* Question Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`text-sm font-semibold tracking-wide ${isCurrent ? 'text-amber-400' : 'text-neutral-300'}`}>
                                                        Question {idx + 1}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${diffStyles[qDetails?.difficulty || 'MEDIUM']}`}>
                                                        {diffLabels[qDetails?.difficulty || 'MEDIUM']}
                                                    </span>
                                                </div>
                                                <p className={`text-sm line-clamp-2 leading-relaxed ${isCurrent ? 'text-neutral-200' : 'text-neutral-300'}`}>
                                                    {qDetails?.text?.replace(/\[IMAGE\]/g, '📷 ').substring(0, 150) || 'Loading question...'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-800">
                                {/* Show current question in normal mode */}
                                {question && (
                                    <div className="p-4 bg-amber-500/10 border-l-2 border-l-amber-500">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-amber-500 text-white">
                                                <span className="text-xs font-bold">{navigation?.currentPosition || 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-amber-400">
                                                        Current Question
                                                    </span>
                                                    {getDifficultyBadge(question.difficulty)}
                                                </div>
                                                <p className="text-xs text-neutral-400 line-clamp-3">
                                                    {question.text.replace(/\[IMAGE\]/g, '').substring(0, 150)}
                                                    {question.text.length > 150 ? '...' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="p-4 text-center text-neutral-500 text-sm">
                                    <p>Question {navigation?.currentPosition} of {navigation?.totalCount}</p>
                                    <p className="text-xs mt-1">Use ← Previous / Next → to navigate</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Top Bar - FIXED LAYOUT */}
            <header className="bg-[#1a1a1a] border-b border-neutral-800 h-14 flex items-center px-4 lg:px-6 shrink-0">
                {/* Left: Back + Timer */}
                <div className="flex items-center gap-4">
                    <Link
                        href={
                            searchParams.get('from') === 'sprint-review' && searchParams.get('sprintId')
                                ? `/sprint/${searchParams.get('sprintId')}/review`
                                : isSprintMode
                                    ? "/sprint"
                                    : "/problems"
                        }
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                        <span className="font-medium text-sm hidden sm:inline">Back</span>
                    </Link>

                    {/* Timer - Moved to Left */}
                    {isSprintMode && sprintSession ? (() => {
                        const totalTimeAllowedSec = Math.floor(sprintSession.totalTimeAllowed / 1000);
                        const remainingTime = Math.max(0, totalTimeAllowedSec - elapsedTime);
                        return (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border text-sm ${remainingTime < 60
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                                : 'bg-neutral-800/50 text-neutral-300 border-neutral-700'
                                }`}>
                                <TimerIcon sx={{ fontSize: '1rem' }} />
                                <span className="font-mono font-bold">
                                    {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        );
                    })() : isTimerEnabled ? (
                        <button
                            onClick={() => {
                                setIsTimerEnabled(false);
                                sessionStorage.setItem('timerEnabled', 'false');
                                setQuestionTimes({});
                                sessionStorage.removeItem('questionTimes');
                                setElapsedTime(0);
                                if (timerRef.current) {
                                    clearInterval(timerRef.current);
                                    timerRef.current = null;
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-sm hover:bg-amber-500/20 transition-colors"
                            title="Click to stop timer"
                        >
                            <TimerIcon sx={{ fontSize: '1rem' }} />
                            <span className={`font-mono font-bold ${elapsedTime >= 120 ? 'text-rose-400 animate-pulse' : elapsedTime >= 60 ? 'text-orange-400' : ''}`}>
                                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                            </span>
                        </button>
                    ) : (
                        <Tooltip text="Enable Timer">
                            <button
                                onClick={() => setShowTimerPrompt(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 transition-colors text-sm"
                            >
                                <TimerIcon sx={{ fontSize: '1rem' }} />
                                <span className="text-xs hidden sm:inline">Timer</span>
                            </button>
                        </Tooltip>
                    )}
                </div>

                {/* Center: Empty for now - will add progress in sprint mode later */}
                <div className="flex-1"></div>

                {/* Right: Navigation */}
                <div className="flex items-center gap-1">
                    <Tooltip text={isSprintMode || isPracticeMode ? 'Previous Question' : hasPrevious ? 'Previous Question' : 'No Previous'}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            disabled={isSprintMode ? (sprintSession?.currentIndex === 0) : (isPracticeMode ? (practiceSession?.currentIndex === 0) : !hasPrevious)}
                            className="p-2 rounded-xl border border-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-neutral-400 hover:text-white hover:bg-neutral-800"
                            style={{ position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
                        >
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                        </button>
                    </Tooltip>
                    <Tooltip text={!isPracticeMode && !isSprintMode && !hasNext ? 'End of List' : 'Next Question'}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                goToNext();
                            }}
                            disabled={!isPracticeMode && !isSprintMode && !hasNext}
                            className="p-2 rounded-xl border border-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-neutral-400 hover:text-white hover:bg-neutral-800"
                            style={{ position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
                        >
                            <ChevronRightIcon sx={{ fontSize: '1.25rem' }} />
                        </button>
                    </Tooltip>
                </div>
            </header>

            {/* Main Content - 2 COLUMN GRID */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">
                {/* LEFT COLUMN - Question + Solution (SCROLLABLE) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#525252 transparent' }}>
                    <div className="p-6 lg:p-8 max-w-4xl">
                        {/* Question Number */}
                        {question.question_number && (
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-white">
                                    Question #{question.question_number}
                                </span>
                            </div>
                        )}

                        {/* Metadata Tags - CLEANED UP */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            {getDifficultyBadge(question.difficulty)}
                            <span className="text-neutral-400 text-sm">•</span>
                            <span className="text-neutral-300 text-sm font-medium">
                                {question.source.exam.includes(question.source.year.toString())
                                    ? question.source.exam
                                    : `${question.source.exam} ${question.source.year}`}
                            </span>
                            {question.source.shift && (
                                <>
                                    <span className="text-neutral-400 text-sm">•</span>
                                    <span className="text-neutral-400 text-sm">{question.source.shift.split(' - ')[0]}</span>
                                </>
                            )}
                            {question.pattern && (
                                <>
                                    <span className="text-neutral-400 text-sm">•</span>
                                    <span className="px-3 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-full text-xs font-semibold">
                                        {formatLabel(question.pattern)}
                                    </span>
                                </>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                                <AuthActionGuard>
                                    <Tooltip text={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}>
                                        <button
                                            onClick={handleBookmarkToggle}
                                            className={`p-2 rounded-xl border border-neutral-800/50 transition-all duration-200 ${isBookmarked
                                                ? 'text-yellow-500 bg-yellow-500/10 scale-110 shadow-lg shadow-yellow-500/20'
                                                : 'text-neutral-500 hover:text-yellow-500 hover:bg-neutral-800 hover:scale-105'}`}
                                        >
                                            <BookmarkIcon sx={{ fontSize: '1.25rem' }} />
                                        </button>
                                    </Tooltip>
                                </AuthActionGuard>
                                <Tooltip text="Report Question">
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="p-2 rounded-xl border border-neutral-800/50 text-neutral-500 hover:text-rose-500 hover:bg-neutral-800 hover:scale-105 transition-all duration-200"
                                    >
                                        <WarningIcon sx={{ fontSize: '1.25rem' }} />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="mb-8">
                            <QuestionContent
                                text={question.text}
                                imageUrl={question.image}
                                onImageClick={setZoomedImage}
                            />
                        </div>

                        {/* Solution Panel - ENHANCED PARSING */}
                        {showSolution && (
                            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                                        <span>💡</span> Solution
                                    </h3>
                                    <Tooltip text="Hide Solution">
                                        <button
                                            onClick={() => setShowSolution(false)}
                                            className="text-neutral-500 hover:text-neutral-300 transition-colors"
                                        >
                                            <CloseIcon sx={{ fontSize: '1rem' }} />
                                        </button>
                                    </Tooltip>
                                </div>
                                <div className="mb-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                                    <CheckCircleOutlinedIcon className="text-emerald-400" sx={{ fontSize: '1rem' }} />
                                    <span className="text-xs text-neutral-400">Correct:</span>
                                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                                        Option {question.correct_option}
                                    </span>
                                </div>
                                {question.solution ? (
                                    <div>
                                        <SolutionContent solution={question.solution} />
                                    </div>
                                ) : (
                                    <div className="text-neutral-500 text-sm italic py-2">
                                        Detailed explanation is currently being reviewed.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - Answer UI (FIXED WIDTH, NO SCROLL) */}
                <div className="bg-[#1a1a1a] border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col fixed bottom-0 left-0 right-0 z-20 lg:relative lg:w-[420px] max-h-[40vh] lg:max-h-full lg:h-full shadow-2xl lg:shadow-none flex-shrink-0">

                    {/* Result & Stats - AT TOP */}
                    {isSubmitted && (
                        <div className="p-4 border-b border-neutral-800 space-y-3 shrink-0">
                            <div className={`text-center py-3 rounded-xl font-bold text-sm ${isCorrect
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}>
                                {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
                            </div>
                            {isTimerEnabled && (
                                <div className="grid grid-cols-1 gap-2 text-xs text-neutral-400">
                                    <div className="bg-neutral-800/50 rounded-lg p-2 text-center border border-neutral-800">
                                        <span className="block text-neutral-500 mb-0.5">Time Taken</span>
                                        <span className="font-mono text-neutral-200 font-medium">
                                            {Math.floor(submittedTime / 60)}:{(submittedTime % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Options - SCROLLABLE */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#525252 transparent' }}>
                        {question.options.map((option, index) => (
                            <div
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={getOptionStyle(option)}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0
                                    ${isSubmitted && option.id === question.correct_option
                                        ? 'bg-emerald-500 text-white'
                                        : isSubmitted && selectedOption === option.id && option.id !== question.correct_option
                                            ? 'bg-rose-500 text-white'
                                            : selectedOption === option.id
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                                : 'bg-neutral-700 text-neutral-300'
                                    }`}
                                >
                                    {isSubmitted && option.id === question.correct_option ? (
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
                                            className="mt-3 max-w-full rounded-lg border border-neutral-700 bg-white p-1 cursor-zoom-in hover:opacity-90 transition-opacity"
                                            style={{ minWidth: '180px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomedImage(option.image!);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-neutral-900/50 border-t border-neutral-800 space-y-3 shrink-0">
                        {/* Buttons */}
                        <div className="flex gap-2">
                            {!isSubmitted ? (
                                <>
                                    <AuthActionGuard>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!selectedOption}
                                            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                                            title={!selectedOption ? 'Select an answer first' : undefined}
                                        >
                                            Submit Answer
                                        </button>
                                    </AuthActionGuard>
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
                                        onClick={goToNext}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
                                    >
                                        Next Question →
                                    </button>
                                    <button
                                        onClick={() => setShowSolution(!showSolution)}
                                        className="px-4 py-3 border border-violet-500/50 text-violet-400 font-bold rounded-xl hover:bg-violet-500/10 transition-colors"
                                    >
                                        {showSolution ? 'Hide' : 'Solution'}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Keyboard Hints */}
                        <div className="text-center text-xs text-neutral-600">
                            <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">1</kbd>-<kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">4</kbd> select • <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">Enter</kbd> submit • <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">⌫</kbd> clear
                        </div>
                    </div>
                </div>
            </div>

            {/* Practice Complete Modal */}
            {showPracticeCompleteModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-neutral-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleOutlinedIcon sx={{ fontSize: '2rem' }} className="text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Practice Complete! 🎉</h2>
                            <p className="text-neutral-400 mb-6">
                                You've completed 5 questions. Would you like to continue practicing?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleExitPractice}
                                    className="flex-1 py-3 px-4 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Exit to Problems
                                </button>
                                <button
                                    onClick={handleContinuePractice}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all"
                                >
                                    Continue Practice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Timer Enable Prompt Modal - IMPROVED COPY */}
            {showTimerPrompt && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-neutral-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TimerIcon sx={{ fontSize: '2rem' }} className="text-amber-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">⏱️ Enable Practice Timer?</h2>
                            <p className="text-neutral-300 mb-2 leading-relaxed">
                                Track your speed on each question to improve time management.
                            </p>
                            <p className="text-neutral-500 text-sm mb-6">
                                Timer is for your reference only and doesn't affect your score.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowTimerPrompt(false)}
                                    className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium rounded-xl transition-colors border border-neutral-700"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={() => {
                                        setIsTimerEnabled(true);
                                        sessionStorage.setItem('timerEnabled', 'true');
                                        setShowTimerPrompt(false);
                                        setElapsedTime(questionTimes[questionId] || 0);
                                    }}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                                >
                                    Enable Timer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Zoom Modal */}
            {zoomedImage && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] overflow-hidden"
                    onClick={() => {
                        setZoomedImage(null);
                        setZoomLevel(1);
                    }}
                >
                    {/* Controls */}
                    <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
                        <div className="bg-neutral-800/80 backdrop-blur rounded-full p-1.5 flex items-center gap-1 border border-neutral-700" onClick={e => e.stopPropagation()}>
                            <button
                                className="p-2 hover:bg-neutral-700 rounded-full text-white transition-colors disabled:opacity-50"
                                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                                disabled={zoomLevel <= 0.5}
                                title="Zoom Out (-)"
                            >
                                <ZoomOutOutlinedIcon sx={{ fontSize: '1.25rem' }} />
                            </button>
                            <span className="min-w-[3rem] text-center text-sm font-mono text-neutral-300">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                className="p-2 hover:bg-neutral-700 rounded-full text-white transition-colors disabled:opacity-50"
                                onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                                disabled={zoomLevel >= 3}
                                title="Zoom In (+)"
                            >
                                <ZoomInOutlinedIcon sx={{ fontSize: '1.25rem' }} />
                            </button>
                        </div>
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

                    <div
                        className="fixed inset-0 flex items-center justify-center overflow-auto p-4"
                        onClick={() => {
                            setZoomedImage(null);
                            setZoomLevel(1);
                        }}
                    >
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

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                questionId={questionId}
                questionDisplayId={navigation?.currentPosition ? `${navigation.currentPosition}` : undefined}
                questionTitle={question?.text?.replace(/\[IMAGE\]/g, '').substring(0, 100)}
            />
        </div>
    );
}

