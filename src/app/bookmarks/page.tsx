"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    BookmarkIcon,
    DeleteIcon,
} from '@/components/icons';

interface Question {
    _id: string;
    text: string;
    difficulty: string;
    subject: string;
    pattern: string;
    source: {
        exam: string;
        year: number;
    };
}

export default function BookmarksPage() {
    const router = useRouter();
    const { user, loading, refreshUser } = useAuth();
    const [bookmarks, setBookmarks] = useState<Question[]>([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState<Question[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [removingId, setRemovingId] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            setPageLoading(true);
            try {
                const res = await fetch('/api/bookmarks?limit=200');
                const data = await res.json();
                if (data.data) {
                    setBookmarks(data.data.map((b: any) => b.question).filter(Boolean));
                }
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
            }
            setPageLoading(false);
        };

        if (user) fetchBookmarks();
    }, [user]);

    // Apply filters and pagination
    useEffect(() => {
        let result = bookmarks;

        if (difficultyFilter !== 'all') {
            result = result.filter(q => q.difficulty === difficultyFilter);
        }

        const total = result.length;
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
        const startIndex = (pagination.page - 1) * ITEMS_PER_PAGE;
        const currentSlice = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        setFilteredBookmarks(currentSlice);
        setPagination(prev => ({ ...prev, total, totalPages }));

        // Reset to page 1 if current page is out of bounds
        if (pagination.page > totalPages && totalPages > 0) {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [bookmarks, difficultyFilter, pagination.page]);

    const updatePage = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleRemoveBookmark = async (e: React.MouseEvent, questionId: string) => {
        e.preventDefault(); // Prevent navigation
        if (confirm('Are you sure you want to remove this bookmark?')) {
            setRemovingId(questionId);
            try {
                const res = await fetch('/api/bookmarks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ questionId }),
                });
                const data = await res.json();
                if (data.bookmarked === false) {
                    setBookmarks(prev => prev.filter(q => q._id !== questionId));
                    refreshUser();
                }
            } catch (error) {
                console.error('Failed to remove bookmark:', error);
            }
            setRemovingId(null);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-neutral-800 h-16 flex items-center px-6 lg:px-12">
                <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                    <span className="font-medium text-sm">Back to Dashboard</span>
                </Link>
                <h1 className="text-xl font-bold text-white ml-8">Saved Bookmarks</h1>
            </header>

            {/* Main Content */}
            <main className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Filters */}
                    <div className="mb-6 flex gap-4">
                        <CustomSelect
                            value={difficultyFilter}
                            onChange={(val) => { setDifficultyFilter(val); updatePage(1); }}
                            options={[
                                { value: 'all', label: 'All Difficulties' },
                                { value: 'EASY', label: 'Easy' },
                                { value: 'MEDIUM', label: 'Medium' },
                                { value: 'HARD', label: 'Hard' },
                            ]}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden">
                        <div className="divide-y divide-neutral-800/50">
                            {pageLoading ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent mx-auto"></div>
                                </div>
                            ) : filteredBookmarks.length === 0 ? (
                                <div className="p-12 text-center text-neutral-500">
                                    {bookmarks.length === 0 ? "You haven't bookmarked any questions yet." : "No bookmarks match the current filter."}
                                </div>
                            ) : (
                                filteredBookmarks.map((question) => (
                                    <Link
                                        key={question._id}
                                        href={`/problems/${question._id}?section=${question.subject}`}
                                        className="block px-6 py-4 hover:bg-neutral-800/30 transition-colors group relative"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <BookmarkIcon className="text-amber-500" sx={{ fontSize: '1.2rem' }} />
                                                    <span className="text-sm font-medium text-amber-500">
                                                        Saved
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${question.difficulty === 'EASY' ? 'bg-emerald-500/15 text-emerald-400' :
                                                        question.difficulty === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400' :
                                                            'bg-rose-500/15 text-rose-400'
                                                        }`}>
                                                        {question.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-neutral-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                                                    <MathText>{question.text}</MathText>
                                                </p>
                                                <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                                                    <span>{question.pattern || 'General'}</span>
                                                    <span>•</span>
                                                    <span>{question.source.exam} {question.source.year}</span>
                                                    <span>•</span>
                                                    <span>{question.subject}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleRemoveBookmark(e, question._id)}
                                                disabled={removingId === question._id}
                                                className="p-2 text-neutral-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors z-10"
                                                title="Remove bookmark"
                                            >
                                                {removingId === question._id ? (
                                                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <DeleteIcon sx={{ fontSize: '1.25rem' }} />
                                                )}
                                            </button>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination.total > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/50 border-t border-neutral-800">
                                <p className="text-sm text-neutral-500">
                                    <span className="text-neutral-300">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-neutral-300">{pagination.total}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updatePage(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                    <span className="px-4 py-2 text-sm text-neutral-300">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => updatePage(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRightIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
