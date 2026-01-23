"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
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
    TimerIcon,
    CloseIcon,
    ZoomInOutlinedIcon,
    ZoomOutOutlinedIcon,
    SplitscreenIcon,
    WarningIcon,
} from '@/components/icons';
import { ReportModal } from '@/components/ui/ReportModal';

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
    status: string;
    acceptance: string;
    is_verified: boolean;
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

function formatPaperInfo(paper: string): { tier: string; date: string } {
    const dateMatch = paper.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    let formattedDate = '';
    if (dateMatch) {
        const [, day, month, year] = dateMatch;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[parseInt(month) - 1];
        formattedDate = `${day} ${monthName} ${year}`;
    }

    // Extract tier from paper name (e.g., "Tier 1" or "Tier I")
    const tierMatch = paper.match(/Tier\s*([1I]|[2II])/i);
    const tier = tierMatch ? `Tier ${tierMatch[1].toUpperCase() === 'I' || tierMatch[1] === '1' ? '1' : '2'}` : 'Tier 1';

    return { tier, date: formattedDate };
}

function QuestionContent({ text, image, onImageClick }: { text: string; image?: string; onImageClick?: (url: string) => void }) {
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
                                    className="rounded-xl border border-neutral-700 shadow-lg bg-white p-2 cursor-zoom-in hover:opacity-90 transition-opacity"
                                    style={{ minWidth: '500px', maxWidth: '100%' }}
                                    onClick={() => image && onImageClick?.(image)}
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
                        className="rounded-xl border border-neutral-700 shadow-lg bg-white p-2 cursor-zoom-in hover:opacity-90 transition-opacity"
                        style={{ minWidth: '500px', maxWidth: '100%' }}
                        onClick={() => image && onImageClick?.(image)}
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
    const [elapsedTime, setElapsedTime] = useState(0); // Current question elapsed time in seconds
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
                                    text: data.question.content.text,
                                    difficulty: data.question.difficulty,
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
                        id: q._id,
                        text: q.content.text,
                        difficulty: q.difficulty,
                        isAttempted: false // We could track this if needed
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

                // Pre-populate previous attempt if exists (but NOT in sprint mode - each sprint is independent)
                const isInSprintMode = searchParams.get('sprint') === 'true';
                if (!isInSprintMode && attemptData.data && attemptData.data.length > 0) {
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
            }
        } else {
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
            }
        } else {
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

                // Update general elapsed time for display if needed, 
                // but we mostly care about question-specific time or remaining time
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
            router.push(`/problems/${navigation.prevId}?section=${section}`);
        }
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
            const nextIndex = sprintSession.currentIndex + 1;
            // Finish Sprint logic
            if (nextIndex >= sprintSession.questionIds.length) {
                // Submit final stats logic could go here, or just redirect
                // We'll redirect to summary which handles "completing" the sprint based on session data?
                // Actually summary page expects 'sprintResults' and 'currentSprint'.
                // 'currentSprint' logic in summary page seems to expect data there.
                // But wait, setup page set 'sprintSession'.
                // I need to align the storage keys. The new Setup used 'sprintSession'.
                // The OLD summary page used 'sprintResults' and 'currentSprint'.
                // I need to REFACTOR Summary page to use 'sprintSession' or convert here.

                // Let's assume I will refactor Summary page to look for 'completedSprint' or just read 'sprintSession'.
                // For now, let's redirect to summary.

                // Calculate total time
                const totalTimeSpent = Date.now() - sprintSession.startTime;

                // Save results for summary page
                sessionStorage.setItem('sprintResults', JSON.stringify({
                    sprintId: sprintSession.sprintId,
                    totalTimeSpent,
                    timedOut: false
                }));
                // We also leave 'sprintSession' there so Summary can read question count etc if needed

                router.push('/sprint/summary');
                return;
            }

            const nextId = sprintSession.questionIds[nextIndex];
            router.push(`/problems/${nextId}?section=${sprintSession.subject}&sprint=true`);
        } else if (navigation?.nextId) {
            // Save current question time before navigating
            if (isTimerEnabled && !isSubmitted) {
                setQuestionTimes(prev => ({ ...prev, [questionId]: elapsedTime }));
            }
            router.push(`/problems/${navigation.nextId}?section=${section}`);
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
            // Use tracked time if timer is enabled, otherwise use basic time
            const timeMs = isTimerEnabled ? elapsedTime * 1000 : Date.now() - startTime;

            // In Sprint Mode: Don't show result, navigate immediately
            if (isSprintMode && sprintSession) {
                // Record attempt in background (don't await)
                fetch('/api/sprint', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sprintId: sprintSession.sprintId,
                        questionId: question.id,
                        selectedOption: selectedOption,
                        timeTaken: timeMs
                    })
                }).catch(err => console.error('Failed to record sprint attempt:', err));

                // Also record as regular attempt in background
                fetch('/api/attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        questionId: question.id,
                        optionSelected: selectedOption,
                        timeMs,
                        isSprint: true,
                    }),
                }).catch(err => console.error('Failed to record attempt:', err));

                // Navigate immediately - no delay, no visual feedback
                const nextIndex = sprintSession.currentIndex + 1;
                if (nextIndex >= sprintSession.questionIds.length) {
                    // Sprint complete - go to summary
                    const totalTimeSpent = Date.now() - sprintSession.startTime;
                    sessionStorage.setItem('sprintResults', JSON.stringify({
                        sprintId: sprintSession.sprintId,
                        totalTimeSpent,
                        timedOut: false
                    }));
                    router.push('/sprint/summary');
                } else {
                    // Go to next question
                    const nextId = sprintSession.questionIds[nextIndex];
                    router.push(`/problems/${nextId}?section=${sprintSession.subject}&sprint=true`);
                }
                return; // Exit early - don't set isSubmitted
            }

            // Normal mode: Show result
            setIsSubmitted(true);

            // Stop the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            try {
                // Record the attempt
                await fetch('/api/attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        questionId: question.id,
                        optionSelected: selectedOption,
                        timeMs,
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
            if (!isSubmitted && question?.content.options) {
                const keyNum = parseInt(e.key);
                if (keyNum >= 1 && keyNum <= question.content.options.length) {
                    const option = question.content.options[keyNum - 1];
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
        const baseStyle = "p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4";

        if (!isSubmitted) {
            if (selectedOption === option.id) {
                return `${baseStyle} border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10`;
            }
            return `${baseStyle} border-neutral-700 bg-neutral-800/50 hover:border-amber-500/30 hover:bg-neutral-800`;
        }

        // In Sprint Mode: Don't reveal correct/incorrect - just show submitted state
        if (isSprintMode) {
            if (selectedOption === option.id) {
                return `${baseStyle} border-blue-500/50 bg-blue-500/10`; // Neutral "submitted" styling
            }
            return `${baseStyle} border-neutral-800 bg-neutral-900/50 opacity-50`;
        }

        // Normal mode: Show correct/incorrect feedback
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
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col relative">
            {/* Sidebar Toggle Button */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 p-2 rounded-r-xl transition-all duration-300 ${showSidebar ? 'bg-amber-500 text-white translate-x-[520px]' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'}`}
                title="Toggle Question List"
            >
                <SplitscreenIcon sx={{ fontSize: '1.5rem' }} />
            </button>

            {/* Question Navigation Sidebar */}
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
                                                {question.content.text.replace(/\[IMAGE\]/g, '').substring(0, 150)}
                                                {question.content.text.length > 150 ? '...' : ''}
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

            {/* Top Bar */}
            <header className="bg-[#1a1a1a] border-b border-neutral-800 h-14 flex items-center px-4 lg:px-6 justify-between shrink-0">
                <Link href={isSprintMode ? "/sprint" : "/problems"} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                    <span className="font-medium text-sm">Back to {isSprintMode ? 'Sprint Setup' : 'Problems'}</span>
                </Link>

                {/* Timer Display (center) */}
                {/* Timer Display (center) */}
                <div className="flex items-center gap-2">
                    {/* Sprint Timer Display */}
                    {isSprintMode && sprintSession ? (() => {
                        const totalTimeAllowedSec = Math.floor(sprintSession.totalTimeAllowed / 1000);
                        const remainingTime = Math.max(0, totalTimeAllowedSec - elapsedTime);
                        return (
                            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all border shadow-lg ${remainingTime < 60
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-rose-500/10 animate-pulse'
                                : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                                }`}>
                                <TimerIcon sx={{ fontSize: '1.25rem' }} />
                                <div className="flex items-center gap-1 font-mono font-bold tracking-wider text-base">
                                    <span>{Math.floor(remainingTime / 60).toString().padStart(2, '0')}</span>
                                    <span className="opacity-50">:</span>
                                    <span>{(remainingTime % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                        );
                    })() : (
                        /* Standard Timer Button */
                        <button
                            onClick={() => {
                                if (!isTimerEnabled) {
                                    setShowTimerPrompt(true);
                                } else {
                                    setIsTimerEnabled(false);
                                    sessionStorage.setItem('timerEnabled', 'false');
                                    setQuestionTimes({});
                                    sessionStorage.removeItem('questionTimes');
                                    setElapsedTime(0);
                                    if (timerRef.current) {
                                        clearInterval(timerRef.current);
                                        timerRef.current = null;
                                    }
                                }
                            }}
                            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 ${isTimerEnabled
                                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                                : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 border border-transparent'
                                }`}
                            title={isTimerEnabled ? 'Click to stop tracking time' : 'Click to track time'}
                        >
                            <TimerIcon sx={{ fontSize: '1.25rem' }} />
                            {isTimerEnabled ? (
                                <div className="flex items-center gap-1">
                                    <span className="text-base font-mono font-bold tracking-wider">
                                        {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-amber-500">:</span>
                                    <span className="text-base font-mono font-bold tracking-wider">
                                        {(elapsedTime % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm font-medium">Timer</span>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevious}
                        disabled={isSprintMode ? (sprintSession?.currentIndex === 0) : (isPracticeMode ? (practiceSession?.currentIndex === 0) : !hasPrevious)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400 hover:text-white"
                    >
                        <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
                        <span className="text-sm font-medium">Previous</span>
                    </button>
                    {isSprintMode && sprintSession && (
                        <span className="text-sm font-medium text-amber-400 px-2">
                            {sprintSession.currentIndex + 1} / {sprintSession.questionIds.length}
                        </span>
                    )}
                    {isPracticeMode && practiceSession && (
                        <span className="text-sm font-medium text-amber-400 px-2">
                            {practiceSession.currentIndex + 1} / {practiceSession.questionIds.length}
                        </span>
                    )}
                    <button
                        onClick={goToNext}
                        disabled={!isPracticeMode && !isSprintMode && !hasNext}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-neutral-400 hover:text-white"
                    >
                        <span className="text-sm font-medium">
                            {isSprintMode && sprintSession?.currentIndex === (sprintSession?.questionIds?.length ?? 0) - 1
                                ? 'Finish Sprint'
                                : (isPracticeMode && practiceSession?.currentIndex === (practiceSession?.questionIds?.length ?? 0) - 1
                                    ? 'Finish'
                                    : 'Next')}
                        </span>
                        <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
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
                            {getDifficultyBadge(question.difficulty)}
                            <div className="w-px h-5 bg-neutral-700"></div>
                            <span className="text-neutral-300 text-sm font-medium">SSC CGL {question.source.year}</span>
                            <div className="w-px h-5 bg-neutral-700"></div>
                            <span className="text-neutral-400 text-sm">
                                {formatPaperInfo(question.source.paper).tier} · {formatPaperInfo(question.source.paper).date} · Q.{question.source.question_number}
                            </span>
                            {question.pattern && (
                                <>
                                    <div className="w-px h-5 bg-neutral-700"></div>
                                    <span className="px-3 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-lg text-sm font-medium">
                                        {question.pattern.name}
                                    </span>
                                </>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    onClick={handleBookmarkToggle}
                                    className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-500 bg-yellow-500/10' : 'text-neutral-500 hover:text-yellow-500 hover:bg-neutral-800'}`}
                                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                                >
                                    <BookmarkIcon sx={{ fontSize: '1.25rem' }} />
                                </button>
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-500 hover:bg-neutral-800 transition-colors"
                                    title="Report Issue"
                                >
                                    <WarningIcon sx={{ fontSize: '1.25rem' }} />
                                </button>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="mb-8">
                            <QuestionContent
                                text={question.content.text}
                                image={question.content.image}
                                onImageClick={setZoomedImage}
                            />
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

            {/* Timer Enable Prompt Modal */}
            {showTimerPrompt && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-neutral-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TimerIcon sx={{ fontSize: '2rem' }} className="text-amber-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Track Your Time?</h2>
                            <p className="text-neutral-400 mb-6">
                                Would you like to track how long you spend on each question? The timer will persist as you navigate between questions.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowTimerPrompt(false)}
                                    className="flex-1 py-3 px-4 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    No Thanks
                                </button>
                                <button
                                    onClick={() => {
                                        setIsTimerEnabled(true);
                                        sessionStorage.setItem('timerEnabled', 'true');
                                        setShowTimerPrompt(false);
                                        setElapsedTime(questionTimes[questionId] || 0);
                                    }}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all"
                                >
                                    Start Timer
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
                questionTitle={question?.content?.text?.replace(/\[IMAGE\]/g, '').substring(0, 100)}
            />
        </div>
    );
}

