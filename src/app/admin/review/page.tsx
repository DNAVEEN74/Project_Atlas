'use client';

import { useState, useEffect, useRef } from 'react';
import {
    CheckCircleIcon,
    CancelIcon,
    EditIcon,
    SaveIcon,
    CloseIcon
} from '@/components/icons';
import { MathText } from '@/components/ui/MathText';
import { compressImage } from '@/lib/imageCompression';
import OCRModal from '@/components/ui/OCRModal';

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
        section: string;
        question_number: number;
        file_name: string;
    };
    is_verified: boolean;
    needs_image_review: boolean;
}

// Image Upload Component
function ImageUpload({
    questionId,
    type,
    optionId,
    currentImage,
    onUpload
}: {
    questionId: string;
    type: 'question' | 'option';
    optionId?: string;
    currentImage?: string;
    onUpload: (url: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { error: notifyError } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Reject files larger than 5MB before processing
            if (file.size > 5 * 1024 * 1024) {
                notifyError('File too large! Max size is 5MB.');
                setUploading(false);
                return;
            }

            // Compress image before upload (WebP, max 800px, 75% quality)
            const compressedFile = await compressImage(file, {
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.75,
                format: 'webp'
            });

            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('questionId', questionId);
            formData.append('type', type);
            if (optionId) formData.append('optionId', optionId);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                onUpload(data.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
        setUploading(false);
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
            />
            {currentImage ? (
                <div className="relative group">
                    <img
                        src={currentImage}
                        alt="Uploaded"
                        className="w-full max-h-32 object-contain rounded-lg border border-gray-600"
                    />
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                   transition flex items-center justify-center text-white text-sm rounded-lg"
                    >
                        Change Image
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg
                               text-gray-400 hover:border-blue-500 hover:text-blue-400 transition
                               flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <span className="animate-pulse">Uploading...</span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upload Image
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

import { useToast } from '@/contexts/ToastContext';

export default function AdminReviewPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const { error: notifyError } = useToast();
    const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'needs_review'>('needs_review');
    const [sectionFilter, setSectionFilter] = useState<'all' | 'REASONING' | 'QUANT'>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [collectionStats, setCollectionStats] = useState({ total: 0, verified: 0, unverified: 0, needImages: 0 });

    // OCR State
    const [ocrModalOpen, setOcrModalOpen] = useState(false);
    const [ocrTarget, setOcrTarget] = useState<'question' | 'option' | null>(null);
    const [ocrOptionId, setOcrOptionId] = useState<string | null>(null);

    useEffect(() => {
        fetchCollectionStats();
        fetchQuestions();
    }, [filter]);

    const fetchCollectionStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setCollectionStats({
                total: data.total || 0,
                verified: data.verified || 0,
                unverified: data.unverified || 0,
                needImages: data.needImages || 0,
            });
        } catch (error) {
            console.error('Error fetching collection stats:', error);
        }
    };

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
            let filteredQuestions = data.questions || [];

            // Client-side section filter
            if (sectionFilter !== 'all') {
                filteredQuestions = filteredQuestions.filter(
                    (q: Question) => q.source.section === sectionFilter
                );
            }

            setQuestions(filteredQuestions);
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

    const updateQuestionImage = async (questionId: string, imageUrl: string) => {
        await fetch(`/api/admin/questions/${questionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'content.image': imageUrl }),
        });
        // Update local state instead of full refresh
        setQuestions(prev => prev.map(q =>
            q._id === questionId
                ? { ...q, content: { ...q.content, image: imageUrl } }
                : q
        ));
    };

    const updateOptionImage = async (questionId: string, optionId: string, imageUrl: string) => {
        const question = questions.find(q => q._id === questionId);
        if (!question) return;

        const updatedOptions = question.content.options.map(opt =>
            opt.id === optionId ? { ...opt, image: imageUrl } : opt
        );

        await fetch(`/api/admin/questions/${questionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'content.options': updatedOptions }),
        });
        // Update local state instead of full refresh
        setQuestions(prev => prev.map(q =>
            q._id === questionId
                ? { ...q, content: { ...q.content, options: updatedOptions } }
                : q
        ));
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

    const setCorrectOption = (optionId: string) => {
        if (!editedQuestion) return;
        setEditedQuestion({
            ...editedQuestion,
            content: {
                ...editedQuestion.content,
                correct_option_id: optionId,
                options: editedQuestion.content.options.map(opt => ({
                    ...opt,
                    is_correct: opt.id === optionId
                })),
            },
        });
    };

    const openOCR = (target: 'question' | 'option', optionId?: string) => {
        setOcrTarget(target);
        setOcrOptionId(optionId || null);
        setOcrModalOpen(true);
    };

    const handleOCRExtracted = (text: string) => {
        if (!editedQuestion) return;

        if (ocrTarget === 'question') {
            updateQuestionText(text);
        } else if (ocrTarget === 'option' && ocrOptionId) {
            updateOptionText(ocrOptionId, text);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
            {/* Header */}
            <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Question Review
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Review, edit, and upload images for extracted questions
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* Section Filter */}
                            <select
                                value={sectionFilter}
                                onChange={(e) => {
                                    setSectionFilter(e.target.value as 'all' | 'REASONING' | 'QUANT');
                                    fetchQuestions();
                                }}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="all">All Sections</option>
                                <option value="REASONING">Reasoning</option>
                                <option value="QUANT">Quant</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                        <div className="text-3xl font-bold">{collectionStats.total}</div>
                        <div className="text-gray-400 text-sm">Total in Collection</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/50 to-gray-900 rounded-xl p-4 border border-green-800/50">
                        <div className="text-3xl font-bold text-green-400">{collectionStats.verified}</div>
                        <div className="text-gray-400 text-sm">Verified ✓</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-900/50 to-gray-900 rounded-xl p-4 border border-yellow-800/50">
                        <div className="text-3xl font-bold text-yellow-400">{collectionStats.unverified}</div>
                        <div className="text-gray-400 text-sm">Pending Review</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-900/50 to-gray-900 rounded-xl p-4 border border-orange-800/50">
                        <div className="text-3xl font-bold text-orange-400">{collectionStats.needImages}</div>
                        <div className="text-gray-400 text-sm">Need Images 📷</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'needs_review', 'unverified', 'verified'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg transition font-medium ${filter === f
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            {f === 'needs_review' ? '📷 Need Images' :
                                f === 'verified' ? '✓ Verified' :
                                    f === 'unverified' ? '⏳ Pending' : '📋 All'}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="text-gray-400 mt-3">Loading questions...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && questions.length === 0 && (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-400">No questions found for this filter</p>
                    </div>
                )}

                {/* Questions List */}
                <div className="space-y-6">
                    {questions.map((question) => (
                        <div
                            key={question._id}
                            className={`bg-gray-800/80 rounded-2xl overflow-hidden border transition-all hover:shadow-xl ${question.is_verified
                                ? 'border-green-500/30 hover:border-green-500/50'
                                : question.needs_image_review
                                    ? 'border-orange-500/30 hover:border-orange-500/50'
                                    : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            {/* Question Header */}
                            <div className="bg-gray-900/50 px-6 py-4 flex justify-between items-center border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        Q.{question.source.question_number}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${question.source.section === 'REASONING'
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'bg-cyan-500/20 text-cyan-400'
                                        }`}>
                                        {question.source.section}
                                    </span>
                                    {question.needs_image_review && (
                                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded font-medium animate-pulse">
                                            📷 Needs Image
                                        </span>
                                    )}
                                    {question.is_verified && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-medium">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {editingId === question._id ? (
                                        <>
                                            <button
                                                onClick={saveEdit}
                                                className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                                                title="Save"
                                            >
                                                <SaveIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                                                title="Cancel"
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEdit(question)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                                title="Edit"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleVerify(question._id, question.is_verified)}
                                                className={`p-2 rounded-lg transition ${question.is_verified
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                                    }`}
                                                title={question.is_verified ? 'Unverify' : 'Verify'}
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

                            {/* Question Body */}
                            <div className="p-6">
                                {/* Source Info */}
                                <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                                    <span>📄</span>
                                    <span className="truncate">{question.source.file_name}</span>
                                </div>

                                {/* Question Text & Image */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                    <div className="lg:col-span-2">
                                        {editingId === question._id ? (
                                            <div className="relative">
                                                <textarea
                                                    value={editedQuestion?.content.text || ''}
                                                    onChange={(e) => updateQuestionText(e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                    rows={4}
                                                />
                                                <button
                                                    onClick={() => openOCR('question')}
                                                    className="absolute top-2 right-2 p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition opacity-50 hover:opacity-100"
                                                    title="Extract text from image (OCR)"
                                                >
                                                    <span className="text-xs font-bold">OCR</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <MathText className="text-gray-200 leading-relaxed block whitespace-pre-line">
                                                {question.content.text}
                                            </MathText>
                                        )}
                                    </div>

                                    {/* Question Image Upload - Always show for flexibility */}
                                    <div>
                                        <label className="text-xs text-gray-400 mb-2 block">Question Image (optional)</label>
                                        <ImageUpload
                                            questionId={question._id}
                                            type="question"
                                            currentImage={question.content.image}
                                            onUpload={(url) => updateQuestionImage(question._id, url)}
                                        />
                                    </div>
                                </div>

                                {/* Options Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {question.content.options.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`rounded-xl p-4 transition ${option.is_correct
                                                ? 'bg-gradient-to-br from-green-900/30 to-green-900/10 border-2 border-green-500/50'
                                                : 'bg-gray-900/50 border border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                {/* Option number - clickable in edit mode to set as correct */}
                                                {editingId === question._id ? (
                                                    <button
                                                        onClick={() => setCorrectOption(option.id)}
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${editedQuestion?.content.options.find(o => o.id === option.id)?.is_correct
                                                            ? 'bg-green-500 text-white ring-2 ring-green-300'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white'
                                                            }`}
                                                        title="Click to set as correct answer"
                                                    >
                                                        {option.id.replace('opt_', '')}
                                                    </button>
                                                ) : (
                                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${option.is_correct
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-700 text-gray-300'
                                                        }`}>
                                                        {option.id.replace('opt_', '')}
                                                    </span>
                                                )}
                                                {(editingId === question._id
                                                    ? editedQuestion?.content.options.find(o => o.id === option.id)?.is_correct
                                                    : option.is_correct) && (
                                                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                                    )}
                                            </div>

                                            {/* Option Text */}
                                            {editingId === question._id ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editedQuestion?.content.options.find(o => o.id === option.id)?.text || ''}
                                                        onChange={(e) => updateOptionText(option.id, e.target.value)}
                                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                                                    />
                                                    <button
                                                        onClick={() => openOCR('option', option.id)}
                                                        className="px-2 bg-gray-700 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition text-xs font-bold"
                                                        title="OCR"
                                                    >
                                                        OCR
                                                    </button>
                                                </div>
                                            ) : (
                                                <MathText className="text-gray-300 text-sm block">
                                                    {option.text}
                                                </MathText>
                                            )}

                                            {/* Option Image Upload - Always show for flexibility */}
                                            <div className="mt-3">
                                                <ImageUpload
                                                    questionId={question._id}
                                                    type="option"
                                                    optionId={option.id}
                                                    currentImage={option.image}
                                                    onUpload={(url) => updateOptionImage(question._id, option.id, url)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Load More Trigger */}
            {!loading && questions.length > 0 && (
                <div className="h-10 w-full" />
            )}

            {/* OCR Modal */}
            <OCRModal
                isOpen={ocrModalOpen}
                onClose={() => setOcrModalOpen(false)}
                onTextExtracted={handleOCRExtracted}
                title={ocrTarget === 'question' ? 'Extract Question Text' : 'Extract Option Text'}
            />
        </div>
    );
}
