
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SprintSessionLayout } from '../../problems/[id]/SprintSessionLayout';
import { useToast } from '@/contexts/ToastContext';

interface SprintClientProps {
    session: any;
    questions: any[];
    initialAttempts: any[];
    userId: string;
}

export default function SprintClient({ session, questions, initialAttempts, userId }: SprintClientProps) {
    const router = useRouter();
    const { error: showError } = useToast();

    // State
    const [currentIndex, setCurrentIndex] = useState<number>(session.current_index || 0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer State
    // Calculate remaining time based on started_at and time_limit_ms
    const calculateTimeState = () => {
        const now = Date.now();
        const startTime = new Date(session.started_at).getTime();
        const elapsed = Math.floor((now - startTime) / 1000); // seconds
        const totalAllowed = Math.floor(session.config.time_limit_ms / 1000); // seconds
        const remaining = Math.max(0, totalAllowed - elapsed);
        return { elapsed, totalAllowed, remaining };
    };

    const [timer, setTimer] = useState(calculateTimeState());
    const [questionElapsed, setQuestionElapsed] = useState(0);

    // Zoom State
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    // Per-question timer
    const questionStartTime = useRef<number>(Date.now());

    // Reset start time on index change
    useEffect(() => {
        questionStartTime.current = Date.now();
        setQuestionElapsed(0); // Reset visual timer immediately
        setSelectedOption(null);
    }, [currentIndex]);

    // Timer Effect
    useEffect(() => {
        const interval = setInterval(() => {
            const nextTimer = calculateTimeState();
            setTimer(nextTimer);

            // Update question elapsed time
            setQuestionElapsed(Math.floor((Date.now() - questionStartTime.current) / 1000));

            if (nextTimer.remaining <= 0 && !session.expired) {
                // Timeout logic handled by API call in handleTimeout
                clearInterval(interval);
                handleTimeout();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const currentQuestion = questions[currentIndex];

    // Handlers
    const handleSelectOption = (optionId: string) => {
        if (isSubmitting) return;
        setSelectedOption(optionId);
    };

    const handleAttempt = async () => {
        if (!selectedOption || isSubmitting) return;
        setIsSubmitting(true);

        const timeSpent = Date.now() - questionStartTime.current;

        try {
            const res = await fetch(`/api/sprint/${session._id}/attempt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_id: currentQuestion._id || currentQuestion.id,
                    question_order: currentIndex + 1,
                    selected_option: selectedOption,
                    time_ms: timeSpent
                })
            });

            if (!res.ok) throw new Error('Failed to submit attempt');

            // Move next
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev: number) => prev + 1);
            } else {
                handleComplete();
            }

        } catch (error) {
            console.error(error);
            showError('Failed to submit answer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const timeSpent = Date.now() - questionStartTime.current;

        try {
            const res = await fetch(`/api/sprint/${session._id}/skip`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_id: currentQuestion._id || currentQuestion.id,
                    question_order: currentIndex + 1,
                    time_ms: timeSpent
                })
            });

            if (!res.ok) throw new Error('Failed to skip');

            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev: number) => prev + 1);
            } else {
                handleComplete();
            }

        } catch (error) {
            console.error(error);
            showError('Failed to skip question.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComplete = async () => {
        try {
            await fetch(`/api/sprint/${session._id}/complete`, { method: 'PUT' });
            router.replace(`/sprint/${session._id}/summary`);
        } catch (error) {
            console.error("Completion error", error);
        }
    };

    const handleAbandon = async () => {
        try {
            await fetch(`/api/sprint/${session._id}/abandon`, { method: 'PUT' });
            router.replace('/sprint');
        } catch (error) {
            console.error("Abandon error", error);
        }
    };


    const handleTimeout = async () => {
        try {
            await fetch(`/api/sprint/${session._id}/timeout`, { method: 'PUT' });
            router.replace(`/sprint/${session._id}/summary`);
        } catch (error) {
            console.error("Timeout error", error);
        }
    };

    // Transform question for Layout
    const formattedQuestion = {
        id: currentQuestion._id || currentQuestion.id,
        text: currentQuestion.text,
        image: currentQuestion.image,
        options: currentQuestion.options || [],
        correct_option: currentQuestion.correct_option,
        subject: currentQuestion.subject || session.config.subject,
        difficulty: currentQuestion.difficulty || session.config.difficulty,
        pattern: currentQuestion.pattern,
        question_number: currentIndex + 1
    };

    return (
        <SprintSessionLayout
            question={formattedQuestion}
            session={session}
            timer={timer}
            questionElapsed={questionElapsed}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            onSubmit={handleAttempt}
            onSkip={handleSkip}
            onEndSprint={handleAbandon}
            currentQuestionIndex={currentIndex}
            totalQuestions={questions.length}
            zoomedImage={zoomedImage}
            setZoomedImage={setZoomedImage}
            setZoomLevel={setZoomLevel}
            zoomLevel={zoomLevel}
        />
    );
}
