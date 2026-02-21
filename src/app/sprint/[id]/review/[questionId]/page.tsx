'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SprintReviewSessionLayout } from '@/components/ui/SprintReviewSessionLayout';

export default function SprintDetailedReviewPage({
    params
}: {
    params: Promise<{ id: string, questionId: string }>
}) {
    const router = useRouter();
    const { user, loading } = useAuth();

    const [sprintId, setSprintId] = useState<string | null>(null);
    const [questionId, setQuestionId] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Zoom State
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        params.then(unwrappedParams => {
            setSprintId(unwrappedParams.id);
            setQuestionId(unwrappedParams.questionId);

            const fetchReviewData = async () => {
                try {
                    const res = await fetch(`/api/sprint/${unwrappedParams.id}/review`);
                    if (res.ok) {
                        const apiRes = await res.json();

                        if (apiRes.success && apiRes.review) {
                            const { review } = apiRes;

                            // Find the specific question and its index
                            const qIndex = review.questions.findIndex((q: any) => q.question_id === unwrappedParams.questionId);
                            if (qIndex === -1) {
                                router.push(`/sprint/${unwrappedParams.id}/review`);
                                return;
                            }

                            const q = review.questions[qIndex];

                            const mappedData = {
                                session: review,
                                currentQuestionIndex: qIndex,
                                totalQuestions: review.questions.length,
                                question: {
                                    id: q.question_id,
                                    text: q.text || 'Question',
                                    image: q.image,
                                    options: q.options || [],
                                    correct_option: q.correct_option,
                                    solution: q.solution,
                                    subject: review.config?.subject || 'QUANT',
                                    difficulty: q.difficulty || 'MEDIUM',
                                    pattern: q.pattern || 'Topic',
                                },
                                userAttempt: q.status === 'NOT_ATTEMPTED' ? null : {
                                    isCorrect: q.status === 'CORRECT',
                                    selectedOption: q.selected_option || 'SKIPPED',
                                    timeMs: q.time_ms || 0
                                }
                            };
                            setData(mappedData);
                        } else {
                            console.error("Failed to fetch review data", apiRes.error);
                            router.push('/sprint/history');
                        }
                    } else {
                        console.error("Failed to fetch review data");
                        router.push('/sprint/history');
                    }
                } catch (err) {
                    console.error(err);
                    router.push('/sprint/history');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReviewData();
        });
    }, [params, router]);

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <SprintReviewSessionLayout
            question={data.question}
            userAttempt={data.userAttempt}
            onBack={() => router.push(`/sprint/${sprintId}/review`)}
            currentQuestionIndex={data.currentQuestionIndex}
            totalQuestions={data.totalQuestions}
            zoomedImage={zoomedImage}
            setZoomedImage={setZoomedImage}
            setZoomLevel={setZoomLevel}
            zoomLevel={zoomLevel}
        />
    );
}
