"use client"

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
    DashboardIcon,
    LogoutIcon,
    TrendingUpIcon,
    ExpandMoreIcon,
    ExpandLessIcon,
} from '@/components/icons';
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
    const [showAllTopics, setShowAllTopics] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

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

    const quantTopics = [
        'All', 'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Ratio & Proportion',
        'Mixtures & Alligation', 'Partnership', 'Average', 'Time & Work', 'Pipe & Cistern',
        'Time Speed Distance', 'Boat & Stream', 'Number System', 'HCF & LCM', 'Simplification',
        'Power Indices Surds', 'Algebra', 'Trigonometry', 'Height & Distance', 'Geometry',
        'Mensuration 2D', 'Mensuration 3D', 'Coordinate Geometry', 'Data Interpretation'
    ];

    const reasoningTopics = [
        'All', 'Analogy', 'Classification', 'Coding-Decoding', 'Series', 'Missing Number',
        'Blood Relations', 'Direction Sense', 'Order & Ranking', 'Sitting Arrangement',
        'Syllogism', 'Venn Diagram', 'Dice & Cube', 'Clock & Calendar', 'Counting Figures',
        'Mirror & Water Image', 'Paper Cutting', 'Embedded Figures', 'Matrix', 'Statement & Conclusion'
    ];

    const [activeTopic, setActiveTopic] = useState('All');
    const [difficulty, setDifficulty] = useState('All');
    const [extraFilter, setExtraFilter] = useState('all'); // 'all', 'bookmarked', 'wrong'
    const [searchQuery, setSearchQuery] = useState('');
    const ITEMS_PER_PAGE = 20;

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
    }, [pagination.page, activeSection, activeTopic, difficulty, extraFilter, searchQuery]); // Added deps

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

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

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

    const topics = activeSection === 'QUANT' ? quantTopics : reasoningTopics;
    const visibleTopics = showAllTopics ? topics : topics.slice(0, 12);

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

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    };

    // Soft dark palette - easy on eyes
    // Background: #0f0f0f (near black)
    // Cards: #1a1a1a (soft dark)
    // Borders: #2a2a2a (subtle)
    // Text: #e5e5e5 (soft white)
    // Muted: #737373 (neutral gray)

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* HEADER */}
            <header className="bg-[#1a1a1a]/90 backdrop-blur-md border-b border-neutral-800/50 sticky top-0 z-50">
                <div className="w-full px-6 lg:px-12">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Nav */}
                        <div className="flex items-center gap-10">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative w-10 h-10">
                                    <Image
                                        src="/logo-final.png"
                                        alt="Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold text-white">PrepLeague</span>
                                    <p className="text-[10px] text-neutral-500 font-medium -mt-0.5">SSC CGL Preparation</p>
                                </div>
                            </Link>

                            <nav className="hidden lg:flex items-center gap-1">
                                <Link href="/problems" className="px-5 py-2 text-sm font-semibold text-amber-500 bg-amber-500/10 rounded-full">
                                    Problems
                                </Link>
                                <Link href="/games" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Games
                                </Link>
                                <Link href="/mock-test" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Sprint Mode
                                </Link>
                                <Link href="/dashboard" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Dashboard
                                </Link>
                            </nav>
                        </div>

                        {/* Stats & User */}
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                    <span className="text-xs font-medium text-emerald-400">{userStats.totalCorrect} Solved</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                                    <span className="text-sm">🔥</span>
                                    <span className="text-xs font-medium text-orange-400">{user?.streak || 0} Days</span>
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 p-1.5 hover:bg-neutral-800 rounded-xl transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            getUserInitials()
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-neutral-200 leading-tight">{user?.name || 'Guest'}</p>
                                        <p className="text-[11px] text-neutral-500">{user?.targetExam?.replace('_', ' ') || 'SSC CGL'}</p>
                                    </div>
                                    <ExpandMoreIcon sx={{ fontSize: '1.1rem' }} className="text-neutral-500 hidden sm:block" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                                        <div className="absolute right-0 top-full mt-2 w-60 bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                            <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-800">
                                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                                <p className="text-xs text-neutral-500">{user?.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <DashboardIcon sx={{ fontSize: '1.1rem' }} />
                                                    Dashboard
                                                </Link>
                                                <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                                    <BookmarkIcon sx={{ fontSize: '1.1rem' }} />
                                                    Bookmarks
                                                </Link>
                                            </div>
                                            <div className="border-t border-neutral-800 py-1">
                                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-neutral-800 transition-colors w-full">
                                                    <LogoutIcon sx={{ fontSize: '1.1rem' }} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

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

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                    {/* LEFT */}
                    <div className="space-y-4">
                        {/* Topic Filters */}
                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-4">
                            <div className="flex flex-wrap gap-2">
                                {visibleTopics.map((topic) => (
                                    <button
                                        key={topic}
                                        onClick={() => setActiveTopic(topic)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTopic === topic
                                            ? activeSection === 'QUANT'
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                            : 'bg-neutral-800/50 text-neutral-400 border border-transparent hover:bg-neutral-800 hover:text-neutral-200'
                                            }`}
                                    >
                                        {topic}
                                    </button>
                                ))}
                                {topics.length > 12 && (
                                    <button
                                        onClick={() => setShowAllTopics(!showAllTopics)}
                                        className="px-3 py-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                                    >
                                        {showAllTopics ? <>Less <ExpandLessIcon sx={{ fontSize: '1rem' }} /></> : <>+{topics.length - 12} more <ExpandMoreIcon sx={{ fontSize: '1rem' }} /></>}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search */}
                        {/* Search and Filter */}
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
                            <div className="grid grid-cols-12 gap-4 px-6 py-5 text-base font-medium text-neutral-300 uppercase tracking-wide bg-neutral-900/50 border-b border-neutral-800">
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-8">Question</div>
                                <div className="col-span-2 text-center">Level</div>
                                <div className="col-span-1 text-center">Source</div>
                            </div>

                            <div className="divide-y divide-neutral-800/50">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-3 px-5 py-4 animate-pulse">
                                            <div className="col-span-1 flex justify-center"><div className="w-5 h-5 bg-neutral-800 rounded-full"></div></div>
                                            <div className="col-span-7"><div className="h-4 bg-neutral-800 rounded w-3/4"></div></div>
                                            <div className="col-span-2 flex justify-center"><div className="h-5 bg-neutral-800 rounded w-14"></div></div>
                                            <div className="col-span-2 flex justify-center"><div className="h-4 bg-neutral-800 rounded w-20"></div></div>
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
                                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-neutral-800/30 transition-colors group"
                                            >
                                                <div className="col-span-1 flex justify-center">
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
                                                <div className="col-span-8 overflow-hidden">
                                                    <div className="text-neutral-100 group-hover:text-amber-400 transition-colors text-lg line-clamp-2">
                                                        <MathText>{q.title}</MathText>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex justify-center">{getDifficultyBadge(q.difficulty)}</div>
                                                <div className="col-span-1 text-center text-base text-neutral-400">{q.source}</div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-5 py-3 bg-neutral-900/50 border-t border-neutral-800">
                                <p className="text-sm text-neutral-500">
                                    <span className="text-neutral-300">{pagination.total > 0 ? startItem : 0}-{endItem}</span> of <span className="text-neutral-300">{pagination.total}</span>
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

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-4">
                        {/* Progress */}
                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden">
                            <div className="px-5 py-4 border-b border-neutral-800 flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center">
                                    <TrendingUpIcon sx={{ fontSize: '1rem' }} className="text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-neutral-200">Your Progress</h3>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-emerald-400">{userStats.totalCorrect}</p>
                                    <p className="text-[11px] text-emerald-400/70 font-medium mt-1">Solved</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-blue-400">{userStats.accuracy}%</p>
                                    <p className="text-[11px] text-blue-400/70 font-medium mt-1">Accuracy</p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-orange-400">{user?.streak || 0}</p>
                                    <p className="text-[11px] text-orange-400/70 font-medium mt-1">Day Streak</p>
                                </div>
                                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-violet-400">{userStats.bookmarkedCount}</p>
                                    <p className="text-[11px] text-violet-400/70 font-medium mt-1">Bookmarked</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Practice */}
                        <div className={`border rounded-2xl p-5 transition-all duration-300 ${activeSection === 'QUANT'
                            ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/20'
                            : 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-violet-500/20'
                            }`}>
                            <div className="flex items-center gap-2 mb-3">
                                <TrackChangesOutlinedIcon sx={{ fontSize: '1.2rem' }} className={activeSection === 'QUANT' ? 'text-amber-400' : 'text-violet-400'} />
                                <h3 className="text-sm font-semibold text-white">Daily Practice</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeSection === 'QUANT'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-violet-500/20 text-violet-400'
                                    }`}>
                                    {activeSection === 'QUANT' ? 'Quant' : 'Reasoning'}
                                </span>
                            </div>

                            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                                Complete your daily target of <strong className="text-white">{activeSection === 'QUANT' ? (user?.dailyQuantGoal || 5) : (user?.dailyReasoningGoal || 5)} questions</strong>. Resume where you left off!
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`/api/quick-practice?section=${activeSection}&topic=All`);
                                        const data = await res.json();

                                        if (data.completed) {
                                            // Already completed today
                                            notifyInfo("🎉 You've completed today's practice! Select questions from the list.");
                                            return;
                                        }

                                        if (data.success && data.questionIds?.length > 0) {
                                            // Store practice session in sessionStorage for tracking
                                            sessionStorage.setItem('practiceSession', JSON.stringify({
                                                questionIds: data.questionIds,
                                                currentIndex: data.currentIndex || 0,
                                                section: activeSection,
                                                topic: 'All',
                                                resuming: data.resuming
                                            }));

                                            const nextId = data.nextQuestionId || data.questionIds[0];
                                            if (data.resuming) {
                                                notifyInfo(`Resuming practice: ${data.answered}/${data.total} completed`);
                                            }
                                            router.push(`/problems/${nextId}?section=${activeSection}&practice=true`);
                                        } else if (data.questionIds?.length === 0) {
                                            notifyInfo('No unattempted questions found in this category!');
                                        } else {
                                            notifyError('Failed to start practice session');
                                        }
                                    } catch (error) {
                                        console.error('Quick practice failed:', error);
                                        notifyError('Failed to start practice session');
                                    }
                                }}
                                className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-all shadow-lg ${activeSection === 'QUANT'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20'
                                    : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 shadow-violet-500/20'
                                    }`}
                            >
                                Start Practice
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-5">
                            <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-4">Status Legend</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-emerald-500/15 rounded-full flex items-center justify-center">
                                        <CheckCircleOutlinedIcon sx={{ fontSize: '0.9rem' }} className="text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-neutral-400">Solved</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-amber-500/15 rounded-full flex items-center justify-center">
                                        <AccessTimeOutlinedIcon sx={{ fontSize: '0.9rem' }} className="text-amber-400" />
                                    </div>
                                    <span className="text-sm text-neutral-400">Attempted</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-violet-500/15 rounded-full flex items-center justify-center">
                                        <BookmarkIcon sx={{ fontSize: '0.8rem' }} className="text-violet-400" />
                                    </div>
                                    <span className="text-sm text-neutral-400">Bookmarked</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioButtonUncheckedOutlinedIcon sx={{ fontSize: '1.2rem' }} className="text-neutral-700 ml-0.5" />
                                    <span className="text-sm text-neutral-400">Not Attempted</span>
                                </div>
                            </div>
                        </div>

                        {/* Exam */}
                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Target</h3>
                                <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">SSC CGL 2025</span>
                            </div>
                            <div className="text-center py-2">
                                <p className="text-4xl font-bold text-white">145</p>
                                <p className="text-sm text-neutral-500 mt-1">Days Left</p>
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
