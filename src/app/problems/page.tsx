"use client"

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthActionGuard } from '@/components/auth/AuthActionGuard';
import { MathText } from '@/components/ui/MathText';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
    CalculateOutlinedIcon,
    PsychologyOutlinedIcon,
    TrackChangesOutlinedIcon,
    AccessTimeOutlinedIcon,
    MenuBookOutlinedIcon,
    RadioButtonUncheckedOutlinedIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchIcon,
    DocumentIcon,
    CheckCircleOutlinedIcon,
    BookmarkIcon,
    TrendingUpIcon,
    ExpandMoreIcon,
} from '@/components/icons';
import Header from '@/components/layout/Header';
import { useToast } from '@/contexts/ToastContext';

interface QuestionItem {
    id: string;
    title: string;
    pattern_code: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    status: string;
    acceptance: string;
    source: string;
}

interface PaginationInfo {
    total: number;
    page: number;
    totalPages: number;
}

function ProblemsPageContent() {
    const { error: notifyError, info: notifyInfo } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, logout } = useAuth();

    const [questions, setQuestions] = useState<QuestionItem[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'QUANT' | 'REASONING'>('QUANT');
    const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
    const topicDropdownRef = React.useRef<HTMLDivElement>(null);

    const [solvedCorrect, setSolvedCorrect] = useState<string[]>([]);
    const [solvedWrong, setSolvedWrong] = useState<string[]>([]);
    const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
    const [userStats, setUserStats] = useState({
        totalAttempted: 0,
        totalCorrect: 0,
        totalWrong: 0,
        accuracy: 0,
        bookmarkedCount: 0,
    });

    const quantTopicGroups = [
        {
            label: 'Arithmetic',
            topics: ['Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Ratio & Proportion', 'Mixtures & Alligation', 'Partnership', 'Average'],
        },
        {
            label: 'Time & Work',
            topics: ['Time & Work', 'Pipe & Cistern'],
        },
        {
            label: 'Speed & Distance',
            topics: ['Time Speed Distance', 'Boat & Stream'],
        },
        {
            label: 'Number System',
            topics: ['Number System', 'HCF & LCM', 'Simplification', 'Power Indices Surds'],
        },
        {
            label: 'Algebra & Trigonometry',
            topics: ['Algebra', 'Trigonometry', 'Height & Distance'],
        },
        {
            label: 'Geometry & Mensuration',
            topics: ['Geometry', 'Mensuration 2D', 'Mensuration 3D', 'Coordinate Geometry'],
        },
        {
            label: 'Data',
            topics: ['Data Interpretation'],
        },
    ];

    const reasoningTopicGroups = [
        {
            label: 'Verbal Reasoning',
            topics: ['Analogy', 'Classification', 'Coding-Decoding', 'Series', 'Missing Number'],
        },
        {
            label: 'Logical Reasoning',
            topics: ['Blood Relations', 'Direction Sense', 'Order & Ranking', 'Sitting Arrangement', 'Syllogism', 'Venn Diagram'],
        },
        {
            label: 'Non-Verbal Reasoning',
            topics: ['Dice & Cube', 'Clock & Calendar', 'Counting Figures', 'Mirror & Water Image', 'Paper Cutting', 'Embedded Figures', 'Matrix'],
        },
        {
            label: 'Analytical',
            topics: ['Statement & Conclusion'],
        },
    ];

    const topicGroups = activeSection === 'QUANT' ? quantTopicGroups : reasoningTopicGroups;
    const topics = ['All', ...topicGroups.flatMap(g => g.topics)];

    const [activeTopic, setActiveTopic] = useState('All');
    const [difficulty, setDifficulty] = useState('All');
    const [extraFilter, setExtraFilter] = useState('all'); // 'all', 'bookmarked', 'wrong'
    const [yearFilter, setYearFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const ITEMS_PER_PAGE = 20;

    // Close topic dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (topicDropdownRef.current && !topicDropdownRef.current.contains(e.target as Node)) {
                setTopicDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updatePage = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    }, [searchParams, router, pathname]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                let url = `/api/questions?page=${pagination.page}&limit=${ITEMS_PER_PAGE}&section=${activeSection}&topic=${activeTopic === 'All' ? '' : activeTopic}&difficulty=${difficulty === 'All' ? '' : difficulty.toUpperCase()}`;
                if (extraFilter !== 'all') {
                    url += `&filter=${extraFilter}`;
                }
                if (yearFilter !== 'All') {
                    url += `&year=${yearFilter}`;
                }
                if (searchQuery) {
                    url += `&query=${encodeURIComponent(searchQuery)}`;
                }
                const res = await fetch(url);
                const data = await res.json();
                setQuestions(data.data || []);
                setPagination(data.pagination);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [pagination.page, activeSection, activeTopic, difficulty, extraFilter, yearFilter, searchQuery]);

    const fetchProgress = useCallback(async () => {
        try {
            const res = await fetch(`/api/user/progress?section=${activeSection}`);
            if (res.ok) {
                const { data } = await res.json();
                setSolvedCorrect(data.solvedCorrect);
                setSolvedWrong(data.solvedWrong);
                setUserBookmarks(data.bookmarks);
                setUserStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch progress:', error);
        }
    }, [activeSection]);

    useEffect(() => {
        fetchProgress();
        const onFocus = () => fetchProgress();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [fetchProgress]);

    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY':
                return <span className="px-4 py-2 text-base font-medium text-emerald-400 bg-emerald-400/10 rounded-full">Easy</span>;
            case 'MEDIUM':
                return <span className="px-4 py-2 text-base font-medium text-amber-400 bg-amber-400/10 rounded-full">Medium</span>;
            case 'HARD':
                return <span className="px-4 py-2 text-base font-medium text-rose-400 bg-rose-400/10 rounded-full">Hard</span>;
            default:
                return <span className="px-4 py-2 text-base font-medium text-neutral-500 bg-neutral-500/10 rounded-full">-</span>;
        }
    };


    const getPageNumbers = () => {
        const totalPages = pagination.totalPages;
        const current = pagination.page;
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (current <= 3) pages.push(1, 2, 3, 4, '...', totalPages);
            else if (current >= totalPages - 2) pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            else pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
        }
        return pages;
    };

    const startItem = (pagination.page - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total);

    const accentColor = activeSection === 'QUANT' ? 'amber' : 'violet';

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* HEADER */}
            <Header activePage="problems" />

            {/* Main Content */}
            <div className="w-full px-6 lg:px-12 py-8">

                {/* Section Switcher */}
                <div className="mb-8">
                    <div className="inline-flex p-1.5 bg-[#1a1a1a] rounded-[20px] border border-neutral-800">
                        <button
                            onClick={() => { setActiveSection('QUANT'); setActiveTopic('All'); updatePage(1); }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-base font-medium transition-all ${activeSection === 'QUANT'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <CalculateOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                            Quantitative Aptitude
                        </button>
                        <button
                            onClick={() => { setActiveSection('REASONING'); setActiveTopic('All'); updatePage(1); }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-base font-medium transition-all ${activeSection === 'REASONING'
                                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <PsychologyOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                            Reasoning
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Content */}
                    <div className="space-y-4">
                        {/* Topic Dropdown Filter */}
                        <div className="relative" ref={topicDropdownRef}>
                            <button
                                onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
                                className={`flex items-center justify-between w-full sm:w-auto sm:min-w-[280px] px-5 py-3 bg-[#1a1a1a] border rounded-xl transition-all text-sm font-medium ${topicDropdownOpen
                                    ? accentColor === 'amber'
                                        ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                                        : 'border-violet-500/50 ring-1 ring-violet-500/20'
                                    : 'border-neutral-800 hover:border-neutral-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MenuBookOutlinedIcon sx={{ fontSize: '1.1rem' }} className="text-neutral-500" />
                                    <span className="text-neutral-400">Topic:</span>
                                    <span className={`font-semibold ${activeTopic === 'All'
                                        ? 'text-neutral-200'
                                        : accentColor === 'amber'
                                            ? 'text-amber-400'
                                            : 'text-violet-400'
                                        }`}>
                                        {activeTopic}
                                    </span>
                                </div>
                                <ExpandMoreIcon
                                    sx={{ fontSize: '1.2rem' }}
                                    className={`text-neutral-500 transition-transform duration-200 ml-3 ${topicDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown Panel */}
                            {topicDropdownOpen && (
                                <div className="absolute z-50 top-full left-0 right-0 sm:right-auto sm:min-w-[620px] mt-2 bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                                    <div className="p-3 max-h-[420px] overflow-y-auto">
                                        {/* All Topics Button */}
                                        <button
                                            onClick={() => {
                                                setActiveTopic('All');
                                                setTopicDropdownOpen(false);
                                                updatePage(1);
                                            }}
                                            className={`w-full px-4 py-2.5 mb-2 text-sm text-left rounded-xl transition-all font-medium ${activeTopic === 'All'
                                                ? accentColor === 'amber'
                                                    ? 'bg-amber-500/15 text-amber-400'
                                                    : 'bg-violet-500/15 text-violet-400'
                                                : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-100'
                                                }`}
                                        >
                                            All Topics
                                        </button>

                                        <div className="h-px bg-neutral-800 mb-3" />

                                        {/* Categorized Groups */}
                                        <div className="space-y-4">
                                            {topicGroups.map((group) => (
                                                <div key={group.label}>
                                                    <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                                                        {group.label}
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5">
                                                        {group.topics.map((topic) => (
                                                            <button
                                                                key={topic}
                                                                onClick={() => {
                                                                    setActiveTopic(topic);
                                                                    setTopicDropdownOpen(false);
                                                                    updatePage(1);
                                                                }}
                                                                className={`px-3 py-2 text-sm text-left rounded-lg transition-all ${activeTopic === topic
                                                                    ? accentColor === 'amber'
                                                                        ? 'bg-amber-500/15 text-amber-400 font-semibold'
                                                                        : 'bg-violet-500/15 text-violet-400 font-semibold'
                                                                    : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                                                                    }`}
                                                            >
                                                                {topic}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <SearchIcon sx={{ fontSize: '1.2rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search questions..."
                                    className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
                                />
                            </div>
                            <div className="w-full sm:w-[160px]">
                                <CustomSelect
                                    value={difficulty}
                                    onChange={(val) => { setDifficulty(val); updatePage(1); }}
                                    options={[
                                        { value: 'All', label: 'Difficulty' },
                                        { value: 'EASY', label: 'Easy' },
                                        { value: 'MEDIUM', label: 'Medium' },
                                        { value: 'HARD', label: 'Hard' },
                                    ]}
                                />
                            </div>
                            <div className="w-full sm:w-[140px]">
                                <CustomSelect
                                    value={yearFilter}
                                    onChange={(val) => { setYearFilter(val); updatePage(1); }}
                                    options={[
                                        { value: 'All', label: 'Year' },
                                        { value: '2024', label: '2024' },
                                        { value: '2023', label: '2023' },
                                        { value: '2022', label: '2022' },
                                        { value: '2021', label: '2021' },
                                        { value: '2020', label: '2020' },
                                    ]}
                                />
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <CustomSelect
                                    value={extraFilter}
                                    onChange={(val) => { setExtraFilter(val); updatePage(1); }}
                                    options={[
                                        { value: 'all', label: 'All Questions' },
                                        { value: 'unattempted', label: 'Unattempted' },
                                        { value: 'bookmarked', label: 'Bookmarked' },
                                        { value: 'wrong', label: 'Incorrect' },
                                        { value: 'correct', label: 'Solved' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden">
                            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-5 text-base font-medium text-neutral-300 uppercase tracking-wide bg-neutral-900/50 border-b border-neutral-800">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-7">Question</div>
                                <div className="col-span-2 text-center">Level</div>
                                <div className="col-span-1 text-center">Year</div>
                            </div>

                            <div className="divide-y divide-neutral-800/50">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-3 px-5 py-4 animate-pulse">
                                            <div className="col-span-1 flex justify-center"><div className="w-5 h-5 bg-neutral-800 rounded-full"></div></div>
                                            <div className="col-span-1 flex justify-center"><div className="w-5 h-5 bg-neutral-800 rounded-full"></div></div>
                                            <div className="col-span-7"><div className="h-4 bg-neutral-800 rounded w-3/4"></div></div>
                                            <div className="col-span-2 flex justify-center"><div className="h-5 bg-neutral-800 rounded w-14"></div></div>
                                            <div className="col-span-1 flex justify-center"><div className="h-4 bg-neutral-800 rounded w-10"></div></div>
                                        </div>
                                    ))
                                ) : questions.length === 0 ? (
                                    <div className="px-8 py-16 text-center">
                                        <div className="w-14 h-14 mx-auto mb-4 bg-neutral-800 rounded-2xl flex items-center justify-center">
                                            <DocumentIcon sx={{ fontSize: '1.5rem' }} className="text-neutral-600" />
                                        </div>
                                        <p className="text-neutral-300 font-medium mb-1">No Questions Found</p>
                                        <p className="text-neutral-600 text-sm">Try selecting a different topic</p>
                                    </div>
                                ) : (
                                    questions.map((q, index) => {
                                        const globalIndex = startItem + index;
                                        return (
                                            <Link
                                                href={`/problems/${q.id}?section=${activeSection}`}
                                                key={q.id}
                                                className="flex flex-col gap-3 p-4 md:grid md:grid-cols-12 md:gap-4 md:px-6 md:py-4 md:items-center hover:bg-neutral-800/30 transition-colors group border-b border-neutral-800/50 md:border-none"
                                            >
                                                <div className="flex items-center gap-3 md:contents">
                                                    <div className="text-sm font-mono text-neutral-500 md:col-span-1 md:text-center min-w-[24px]">
                                                        {globalIndex}
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-center">
                                                        {solvedCorrect.includes(q.id) ? (
                                                            <div className="w-7 h-7 bg-emerald-500/15 rounded-full flex items-center justify-center">
                                                                <CheckCircleOutlinedIcon sx={{ fontSize: '1.1rem' }} className="text-emerald-400" />
                                                            </div>
                                                        ) : solvedWrong.includes(q.id) ? (
                                                            <div className="w-7 h-7 bg-amber-500/15 rounded-full flex items-center justify-center">
                                                                <AccessTimeOutlinedIcon sx={{ fontSize: '1.1rem' }} className="text-amber-400" />
                                                            </div>
                                                        ) : userBookmarks.includes(q.id) ? (
                                                            <div className="w-7 h-7 bg-violet-500/15 rounded-full flex items-center justify-center">
                                                                <BookmarkIcon sx={{ fontSize: '1rem' }} className="text-violet-400" />
                                                            </div>
                                                        ) : (
                                                            <RadioButtonUncheckedOutlinedIcon sx={{ fontSize: '1.4rem' }} className="text-neutral-700" />
                                                        )}
                                                    </div>

                                                    {/* Mobile Badges */}
                                                    <div className="flex-1 md:hidden"></div>
                                                    <div className="md:hidden flex items-center gap-2">
                                                        {getDifficultyBadge(q.difficulty)}
                                                        <span className="px-2 py-1 text-xs font-medium text-neutral-400 bg-neutral-800/50 rounded-md">
                                                            {q.source?.split(' ').pop() || ''}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="md:col-span-7 overflow-hidden">
                                                    <div className="text-neutral-100 group-hover:text-amber-400 transition-colors text-base md:text-lg line-clamp-3 md:line-clamp-2 leading-relaxed">
                                                        <MathText>{q.title}</MathText>
                                                    </div>
                                                </div>

                                                {/* Desktop Badges */}
                                                <div className="hidden md:flex md:col-span-2 md:justify-center">{getDifficultyBadge(q.difficulty)}</div>
                                                <div className="hidden md:block md:col-span-1 md:text-center">
                                                    <span className="px-2 py-1 text-xs font-medium text-neutral-400 bg-neutral-800/50 rounded-md">
                                                        {q.source?.split(' ').pop() || ''}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-5 py-3 bg-neutral-900/50 border-t border-neutral-800">
                                <p className="text-sm text-neutral-500">
                                    Showing <span className="text-neutral-300">{pagination.total > 0 ? startItem : 0}-{endItem}</span> of <span className="text-neutral-300">{pagination.total}</span> questions
                                </p>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => updatePage(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                    {getPageNumbers().map((pageNum, idx) => (
                                        pageNum === '...' ? (
                                            <span key={`e-${idx}`} className="px-3 py-2 text-neutral-600">...</span>
                                        ) : (
                                            <button
                                                key={pageNum}
                                                onClick={() => updatePage(pageNum as number)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${pageNum === pagination.page
                                                    ? 'bg-amber-500/20 text-amber-400'
                                                    : 'text-neutral-500 hover:bg-neutral-800 hover:text-white'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    ))}
                                    <button
                                        onClick={() => updatePage(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRightIcon sx={{ fontSize: '1.2rem' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default function ProblemsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-neutral-400">Loading...</div>
            </div>
        }>
            <ProblemsPageContent />
        </Suspense>
    );
}
