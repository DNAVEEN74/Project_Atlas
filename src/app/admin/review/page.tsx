'use client';

import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    CancelIcon,
    EditIcon,
    UploadIcon,
    SaveIcon,
    CloseIcon
} from '@/components/icons';

interface QuestionOption {
    id: string;
    text: string;
    is_correct: boolean;
    media_id?: string;
}

interface Question {
    _id: string;
    content: {
        text: string;
        options: QuestionOption[];
    };
    metadata: {
        source_exam: string;
        year: number;
        original_paper: string;
        question_number: number;
    };
    is_verified: boolean;
    media_ids?: string[];
}

export default function AdminReviewPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('unverified');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

    // Fetch questions
    useEffect(() => {
        fetchQuestions();
    }, [filter]);

    const fetchQuestions = async () => {
        const params = new URLSearchParams();
        if (filter !== 'all') {
            params.append('verified', filter === 'verified' ? 'true' : 'false');
        }

        const res = await fetch(`/api/admin/questions?${params}`);
        const data = await res.json();
        setQuestions(data.questions);
    };

    const toggleVerify = async (questionId: string, currentStatus: boolean) => {
        await fetch(`/api/admin/questions/${questionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_verified: !currentStatus }),
        });
        fetchQuestions();
    };

    const startEdit = (question: Question) => {
        setEditingId(question._id);
        setEditedQuestion({ ...question });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditedQuestion(null);
    };

    const saveEdit = async () => {
        if (!editedQuestion) return;

        await fetch(`/api/admin/questions/${editedQuestion._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: editedQuestion.content,
            }),
        });

        setEditingId(null);
        setEditedQuestion(null);
        fetchQuestions();
    };

    const updateOptionText = (optionId: string, newText: string) => {
        if (!editedQuestion) return;
        setEditedQuestion({
            ...editedQuestion,
            content: {
                ...editedQuestion.content,
                options: editedQuestion.content.options.map(opt =>
                    opt.id === optionId ? { ...opt, text: newText } : opt
                ),
            },
        });
    };

    const toggleCorrectAnswer = (optionId: string) => {
        if (!editedQuestion) return;
        setEditedQuestion({
            ...editedQuestion,
            content: {
                ...editedQuestion.content,
                options: editedQuestion.content.options.map(opt => ({
                    ...opt,
                    is_correct: opt.id === optionId,
                })),
            },
        });
    };

    const stats = {
        total: questions.length,
        verified: questions.filter(q => q.is_verified).length,
        unverified: questions.filter(q => !q.is_verified).length,
    };

    return (
        <div className="min-h-screen bg-background p-space-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-space-8">
                    <h1 className="text-4xl font-bold text-primary mb-space-2">
                        Question Review
                    </h1>
                    <p className="text-secondary">
                        Review and verify extracted questions before publishing
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-space-4 mb-space-6">
                    <div className="bg-surface p-space-4 radius-lg border border-border">
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <div className="text-sm text-secondary">Total Questions</div>
                    </div>
                    <div className="bg-surface p-space-4 radius-lg border border-border">
                        <div className="text-2xl font-bold text-accent-green">{stats.verified}</div>
                        <div className="text-sm text-secondary">Verified</div>
                    </div>
                    <div className="bg-surface p-space-4 radius-lg border border-border">
                        <div className="text-2xl font-bold text-accent-yellow">{stats.unverified}</div>
                        <div className="text-sm text-secondary">Pending Review</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-space-2 mb-space-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-space-4 py-space-2 radius-md transition-smooth ${filter === 'all'
                            ? 'bg-accent-blue text-white'
                            : 'bg-surface text-secondary hover:bg-surface-hover'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unverified')}
                        className={`px-space-4 py-space-2 radius-md transition-smooth ${filter === 'unverified'
                            ? 'bg-accent-yellow text-background'
                            : 'bg-surface text-secondary hover:bg-surface-hover'
                            }`}
                    >
                        Unverified
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-space-4 py-space-2 radius-md transition-smooth ${filter === 'verified'
                            ? 'bg-accent-green text-white'
                            : 'bg-surface text-secondary hover:bg-surface-hover'
                            }`}
                    >
                        Verified
                    </button>
                </div>

                {/* Questions List */}
                <div className="space-y-space-4">
                    {questions.map((question) => {
                        const isEditing = editingId === question._id;
                        const displayQuestion = isEditing ? editedQuestion! : question;

                        return (
                            <div
                                key={question._id}
                                className="bg-surface border border-border radius-lg p-space-6"
                            >
                                {/* Source Info */}
                                <div className="flex items-center justify-between mb-space-4 pb-space-4 border-b border-border">
                                    <div className="text-sm text-secondary">
                                        <span className="font-medium text-primary">
                                            {question.metadata.source_exam}
                                        </span>
                                        {' • '}
                                        <span>{question.metadata.year}</span>
                                        {' • '}
                                        <span>{question.metadata.original_paper}</span>
                                        {' • '}
                                        <span>Q.{question.metadata.question_number}</span>
                                    </div>
                                    <div className="flex items-center gap-space-2">
                                        {!isEditing && (
                                            <>
                                                <button
                                                    onClick={() => startEdit(question)}
                                                    className="p-space-2 hover:bg-surface-hover radius-md transition-smooth"
                                                    title="Edit"
                                                >
                                                    <EditIcon sx={{ fontSize: 18 }} className="text-secondary" />
                                                </button>
                                                <button
                                                    onClick={() => toggleVerify(question._id, question.is_verified)}
                                                    className={`flex items-center gap-space-2 px-space-3 py-space-2 radius-md transition-smooth ${question.is_verified
                                                        ? 'bg-accent-green text-white'
                                                        : 'bg-accent-yellow text-background'
                                                        }`}
                                                >
                                                    {question.is_verified ? (
                                                        <>
                                                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                                                            <span className="text-sm font-medium">Verified</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CancelIcon sx={{ fontSize: 16 }} />
                                                            <span className="text-sm font-medium">Unverified</span>
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                        {isEditing && (
                                            <>
                                                <button
                                                    onClick={saveEdit}
                                                    className="flex items-center gap-space-2 px-space-3 py-space-2 bg-accent-green text-white radius-md hover:opacity-90 transition-smooth"
                                                >
                                                    <SaveIcon sx={{ fontSize: 16 }} />
                                                    <span className="text-sm font-medium">Save</span>
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex items-center gap-space-2 px-space-3 py-space-2 bg-surface-hover text-secondary radius-md hover:bg-border transition-smooth"
                                                >
                                                    <CloseIcon sx={{ fontSize: 16 }} />
                                                    <span className="text-sm font-medium">Cancel</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div className="mb-space-4">
                                    {isEditing ? (
                                        <textarea
                                            value={displayQuestion.content.text}
                                            onChange={(e) =>
                                                setEditedQuestion({
                                                    ...editedQuestion!,
                                                    content: {
                                                        ...editedQuestion!.content,
                                                        text: e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-full bg-background border border-border radius-md p-space-3 text-primary font-medium resize-none"
                                            rows={3}
                                        />
                                    ) : (
                                        <div className="text-primary font-medium text-lg">
                                            {displayQuestion.content.text}
                                        </div>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="space-y-space-2">
                                    {displayQuestion.content.options.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`flex items-start gap-space-3 p-space-3 radius-md border ${option.is_correct
                                                ? 'border-accent-green bg-accent-green/10'
                                                : 'border-border bg-background'
                                                }`}
                                        >
                                            {isEditing && (
                                                <input
                                                    type="radio"
                                                    name={`correct-${question._id}`}
                                                    checked={option.is_correct}
                                                    onChange={() => toggleCorrectAnswer(option.id)}
                                                    className="mt-1"
                                                />
                                            )}
                                            <div className="flex-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => updateOptionText(option.id, e.target.value)}
                                                        className="w-full bg-transparent border-none text-primary focus:outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-primary">{option.text}</span>
                                                )}
                                            </div>
                                            {option.is_correct && !isEditing && (
                                                <CheckCircleIcon sx={{ fontSize: 20 }} className="text-accent-green flex-shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Images */}
                                {question.media_ids && question.media_ids.length > 0 && (
                                    <div className="mt-space-4 pt-space-4 border-t border-border">
                                        <div className="text-sm text-secondary mb-space-2">
                                            {question.media_ids.length} image(s)
                                        </div>
                                        <div className="flex gap-space-2">
                                            {question.media_ids.map((mediaId) => (
                                                <img
                                                    key={mediaId}
                                                    src={`/api/media/${mediaId}`}
                                                    alt="Question media"
                                                    className="h-24 radius-md border border-border object-contain"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {questions.length === 0 && (
                    <div className="text-center py-space-12 text-secondary">
                        No questions found
                    </div>
                )}
            </div>
        </div>
    );
}
