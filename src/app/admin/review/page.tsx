'use client';

import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    CancelIcon,
    EditIcon,
    SaveIcon,
    CloseIcon
} from '@/components/icons';

interface QuestionOption {
    id: string;
    text: string;
    is_correct: boolean;
    image?: string;
}

interface Question {
    _id: string;
    content: {
        text: string;
        options: QuestionOption[];
        correct_option_id: string;
        image?: string;
    };
    source: {
        exam: string;
        year: number;
        paper: string;
        section: string;  // REASONING or QUANT
        question_number: number;
        file_name: string;
    };
    is_verified: boolean;
    needs_image_review: boolean;
}

export default function AdminReviewPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'needs_review'>('unverified');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, [filter]);

    const fetchQuestions = async () => {
        setLoading(true);
        const params = new URLSearchParams();

        if (filter === 'verified') {
            params.append('verified', 'true');
        } else if (filter === 'unverified') {
            params.append('verified', 'false');
        } else if (filter === 'needs_review') {
            params.append('needs_review', 'true');
        }

        try {
            const res = await fetch(`/api/admin/questions?${params}`);
            const data = await res.json();
            setQuestions(data.questions || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setQuestions([]);
        }
        setLoading(false);
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

    const updateQuestionText = (newText: string) => {
        if (!editedQuestion) return;
        setEditedQuestion({
            ...editedQuestion,
            content: { ...editedQuestion.content, text: newText }
        });
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

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Question Review</h1>
                    <p className="text-gray-400">Review and verify extracted questions</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-2xl font-bold">{questions.length}</div>
                        <div className="text-gray-400 text-sm">Showing</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">
                            {questions.filter(q => q.is_verified).length}
                        </div>
                        <div className="text-gray-400 text-sm">Verified</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-400">
                            {questions.filter(q => !q.is_verified).length}
                        </div>
                        <div className="text-gray-400 text-sm">Unverified</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-400">
                            {questions.filter(q => q.needs_image_review).length}
                        </div>
                        <div className="text-gray-400 text-sm">Need Images</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'unverified', 'verified', 'needs_review'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg transition ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f === 'needs_review' ? 'Need Images' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-8 text-gray-400">Loading questions...</div>
                )}

                {/* Questions List */}
                {!loading && questions.length === 0 && (
                    <div className="text-center py-8 text-gray-400">No questions found</div>
                )}

                <div className="space-y-4">
                    {questions.map((question) => (
                        <div
                            key={question._id}
                            className={`bg-gray-800 rounded-xl p-6 border-l-4 ${question.is_verified ? 'border-green-500' :
                                question.needs_image_review ? 'border-orange-500' : 'border-yellow-500'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-blue-400 font-medium">
                                        Q.{question.source.question_number}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                        {question.source.paper}
                                    </span>
                                    {question.needs_image_review && (
                                        <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                                            Needs Image
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {editingId === question._id ? (
                                        <>
                                            <button
                                                onClick={saveEdit}
                                                className="p-2 bg-green-600 rounded-lg hover:bg-green-700"
                                            >
                                                <SaveIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEdit(question)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleVerify(question._id, question.is_verified)}
                                                className={`p-2 rounded-lg ${question.is_verified
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {question.is_verified ? (
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                ) : (
                                                    <CancelIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Source File */}
                            <div className="text-xs text-gray-500 mb-3">
                                📄 {question.source.file_name}
                            </div>

                            {/* Question Text */}
                            <div className="mb-4">
                                {editingId === question._id ? (
                                    <textarea
                                        value={editedQuestion?.content.text || ''}
                                        onChange={(e) => updateQuestionText(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-200 whitespace-pre-wrap">
                                        {question.content.text}
                                    </p>
                                )}
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-3">
                                {question.content.options.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`p-3 rounded-lg border ${option.is_correct
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-gray-700 bg-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 font-medium">
                                                {option.id.replace('opt_', '')}
                                            </span>
                                            {option.is_correct && (
                                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                        {editingId === question._id ? (
                                            <input
                                                type="text"
                                                value={
                                                    editedQuestion?.content.options.find(o => o.id === option.id)?.text || ''
                                                }
                                                onChange={(e) => updateOptionText(option.id, e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
                                            />
                                        ) : (
                                            <p className="text-gray-300 text-sm mt-1">{option.text}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
