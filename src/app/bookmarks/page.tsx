"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    BookmarkIcon,
    DeleteIcon,
} from '@/components/icons';
import Header from '@/components/layout/Header';
import { formatTopicName } from '@/utils/format';

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
            result = result.filter((q: Question) => q.difficulty === difficultyFilter);
        }

        const total = result.length;
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
        const startIndex = (pagination.page - 1) * ITEMS_PER_PAGE;
        const currentSlice = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        setFilteredBookmarks(currentSlice);
        setPagination((prev: any) => ({ ...prev, total, totalPages }));

        // Reset to page 1 if current page is out of bounds
        if (pagination.page > totalPages && totalPages > 0) {
            setPagination((prev: any) => ({ ...prev, page: 1 }));
        }
    }, [bookmarks, difficultyFilter, pagination.page]);

    const updatePage = (page: number) => {
        setPagination((prev: any) => ({ ...prev, page }));
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
                    setBookmarks((prev: Question[]) => prev.filter((q: Question) => q._id !== questionId));
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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FFB951] border-t-transparent"></div>
            </div>
        );
    }

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'EASY', label: 'Easy' },
        { id: 'MEDIUM', label: 'Medium' },
        { id: 'HARD', label: 'Hard' }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header activePage="bookmarks" />

            {/* Main Content */}
            <main className="w-full px-6 lg:px-12 py-10">
                <div className="max-w-5xl mx-auto">
                    {/* Top App Bar & Navigation */}
                    <div className="mb-10">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors mb-4 rounded-full px-3 py-1.5 hover:bg-[#1f1f1f] -ml-3">
                            <ChevronLeftIcon sx={{ fontSize: '1.25rem' }} />
                            <span className="font-medium text-sm tracking-wide">Back to Dashboard</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#E6E1E5] flex items-center gap-4">
                            <BookmarkIcon className="text-[#FFB951] w-10 h-10" />
                            Saved Bookmarks
                        </h1>
                    </div>

                    {/* Filter Chips - Material Design 3 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                        <div className="flex flex-wrap items-center gap-3">
                            {filters.map((filter) => {
                                const isSelected = difficultyFilter === filter.id;
                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => { setDifficultyFilter(filter.id); updatePage(1); }}
                                        className={`h-8 px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                            ${isSelected 
                                                ? 'bg-[#4A4458] text-[#E8DEF8] border border-transparent' // M3 Secondary Container style for dark mode
                                                : 'bg-transparent border border-[#938F99] text-[#CAC4D0] hover:bg-[#1f1f1f] hover:border-[#CAC4D0]'
                                            }`}
                                    >
                                        {isSelected && (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="text-sm font-medium text-[#CAC4D0] bg-[#141414] px-4 py-2 rounded-full">
                            {pagination.total} total
                        </div>
                    </div>

                    {/* MD3 Elevated Cards List */}
                    <div className="space-y-4">
                        {pageLoading ? (
                            <div className="p-16 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FFB951] border-t-transparent mx-auto"></div>
                            </div>
                        ) : filteredBookmarks.length === 0 ? (
                            <div className="py-20 px-8 text-center bg-[#141414] rounded-[24px]">
                                <BookmarkIcon className="text-[#938F99] w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-medium text-[#E6E1E5] mb-2">
                                    {bookmarks.length === 0 ? "No saved bookmarks" : "No matches found"}
                                </h3>
                                <p className="text-[#CAC4D0]">
                                    {bookmarks.length === 0 ? "Questions you bookmark will appear here." : "Try selecting a different difficulty filter."}
                                </p>
                            </div>
                        ) : (
                            filteredBookmarks.map((question: Question) => (
                                <Link
                                    key={question._id}
                                    href={`/problems/${question._id}?section=${question.subject}`}
                                    className="block group"
                                >
                                    <div className="bg-[#141414] hover:bg-[#1f1f1f] rounded-[24px] p-6 transition-all duration-200">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1 min-w-0">
                                                {/* Meta Row */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full border 
                                                        ${question.difficulty === 'EASY' ? 'bg-[#143224] text-[#6DD58C] border-transparent' :
                                                          question.difficulty === 'MEDIUM' ? 'bg-[#594100] text-[#FFB951] border-transparent' :
                                                          'bg-[#4B191D] text-[#FFB4AB] border-transparent'
                                                        }`}>
                                                        {question.difficulty.charAt(0) + question.difficulty.slice(1).toLowerCase()}
                                                    </span>
                                                    <span className="px-3 py-1.5 text-xs font-medium bg-[#2b2b2b] text-[#CAC4D0] rounded-full">
                                                        {question.subject.charAt(0) + question.subject.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                                
                                                {/* Title */}
                                                <p className="text-[#E6E1E5] group-hover:text-[#FFB951] transition-colors line-clamp-2 font-medium text-[18px] leading-relaxed mb-4">
                                                    <MathText>{question.text}</MathText>
                                                </p>
                                                
                                                {/* Bottom Metadata */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#938F99] font-medium">
                                                    <span className="bg-[#0a0a0a] border border-[#2b2b2b] px-3 py-1 rounded-full">
                                                        {formatTopicName(question.pattern) || 'General'}
                                                    </span>
                                                    <span className="bg-[#0a0a0a] border border-[#2b2b2b] px-3 py-1 rounded-full">
                                                        {question.source.exam} {question.source.year}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* MD3 Icon Button */}
                                            <button
                                                onClick={(e: any) => handleRemoveBookmark(e, question._id)}
                                                disabled={removingId === question._id}
                                                className="p-3 text-[#CAC4D0] hover:text-[#FFB4AB] hover:bg-[#36343B] rounded-full transition-colors relative z-10 -mt-2 -mr-2"
                                                title="Remove bookmark"
                                                aria-label="Remove bookmark"
                                            >
                                                {removingId === question._id ? (
                                                    <div className="h-6 w-6 border-2 border-[#FFB951] border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <DeleteIcon sx={{ fontSize: '1.5rem' }} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* MD3 Pagination */}
                    {pagination.total > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
                            <p className="text-sm font-medium text-[#CAC4D0]">
                                Showing <span className="text-[#E6E1E5]">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[#E6E1E5]">{Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-[#E6E1E5]">{pagination.total}</span>
                            </p>
                            <div className="flex items-center gap-2 bg-[#141414] p-1 rounded-full">
                                <button
                                    onClick={() => updatePage(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="p-2 text-[#CAC4D0] hover:text-[#FFB951] hover:bg-[#1f1f1f] rounded-full disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
                                </button>
                                <span className="px-4 text-sm font-medium text-[#E6E1E5]">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => updatePage(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="p-2 text-[#CAC4D0] hover:text-[#FFB951] hover:bg-[#1f1f1f] rounded-full disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Next page"
                                >
                                    <ChevronRightIcon sx={{ fontSize: '1.5rem' }} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
