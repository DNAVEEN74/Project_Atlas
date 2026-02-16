"use client"

import React, { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthActionGuard } from '@/components/auth/AuthActionGuard';
import { MathText } from '@/components/ui/MathText';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { ActiveFilters } from './ActiveFilters';
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
    CloseIcon,
    FilterIcon,
    GridIcon
} from '@/components/icons';
import Header from '@/components/layout/Header';
import { getTopicName, getPatternCode } from '@/lib/topicMapping';
import { useToast } from '@/contexts/ToastContext';

interface QuestionItem {
    id: string;
    title: string;
    pattern: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    status: string;
    acceptance: string;
    source: string;
    questionNumber?: number;
}

interface PaginationInfo {
    total: number;
    page: number;
    totalPages: number;
}


function ProblemsPageContent() {
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    // Removed unused router, pathname, toast

    // State
    const [questions, setQuestions] = useState<QuestionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: parseInt(searchParams.get('page') || '1'),
        totalPages: 1
    });

    // Filters from URL or default
    const [activeSection, setActiveSection] = useState<'QUANT' | 'REASONING'>(
        (searchParams.get('section') as 'QUANT' | 'REASONING') || 'QUANT'
    );

    // Stats state
    const [solvedCorrect, setSolvedCorrect] = useState<string[]>([]);
    const [solvedWrong, setSolvedWrong] = useState<string[]>([]);
    const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
    const [userStats, setUserStats] = useState({
        totalSolved: 0,
        totalAttempted: 0,
        totalCorrect: 0,
        accuracy: 0
    });

    const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
    const topicDropdownRef = useRef<HTMLDivElement>(null);
    const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

    // Fetch topic counts
    useEffect(() => {
        fetch('/api/stats/topics')
            .then(res => res.json())
            .then(data => {
                if (data.data) setTopicCounts(data.data);
            })
            .catch(err => console.error('Failed to fetch topic stats:', err));
    }, []);


    // Constants
    const quantTopicGroups = [
        {
            label: 'Arithmetic',
            topics: ['Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Ratio & Proportion', 'Mixture & Alligation', 'Average', 'Time & Work', 'Pipe & Cistern', 'Time Speed & Distance', 'Train', 'Boat & Stream'],
        },
        {
            label: 'Number System',
            topics: ['Number System', 'HCF & LCM', 'Simplification', 'Power Indices & Surds'],
        },
        {
            label: 'Advanced Maths',
            topics: ['Algebra', 'Trigonometry', 'Geometry', 'Mensuration 2D', 'Mensuration 3D', 'Coordinate Geometry', 'Height & Distance'],
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
    // const topics = ['All', ...topicGroups.flatMap(g => g.topics)]; // Removed unused 'topics' array if not needed or kept for reference

    // State for filters
    const [activeTopic, setActiveTopic] = useState(() => {
        const p = searchParams.get('pattern');
        return p ? getTopicName(p) : 'All';
    });
    const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
    const [yearFilter, setYearFilter] = useState(searchParams.get('year') || 'All');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
    const [topicSearchQuery, setTopicSearchQuery] = useState('');

    const ITEMS_PER_PAGE = 20;

    // Derived state for Active Filters
    const activeFilters = [
        ...(activeTopic !== 'All' ? [{ type: 'Topic', value: activeTopic, label: activeTopic, onRemove: () => setActiveTopic('All') }] : []),
        ...(difficulty !== 'All' ? [{ type: 'Difficulty', value: difficulty, label: difficulty === 'EASY' ? 'Easy' : difficulty === 'MEDIUM' ? 'Medium' : 'Hard', onRemove: () => setDifficulty('All') }] : []),
        ...(yearFilter !== 'All' ? [{ type: 'Year', value: yearFilter, label: yearFilter, onRemove: () => setYearFilter('All') }] : []),
        ...(statusFilter !== 'all' ? [{ type: 'Status', value: statusFilter, label: statusFilter === 'unattempted' ? 'Unattempted' : statusFilter === 'bookmarked' ? 'Bookmarked' : statusFilter === 'wrong' ? 'Incorrect' : 'Solved', onRemove: () => setStatusFilter('all') }] : []),
        ...(searchQuery ? [{ type: 'Search', value: searchQuery, label: `"${searchQuery}"`, onRemove: () => setSearchQuery('') }] : [])
    ] as any[]; // eslint-disable-line @typescript-eslint/no-explicit-any

    const clearAllFilters = () => {
        setActiveTopic('All');
        setDifficulty('All');
        setYearFilter('All');
        setStatusFilter('all');
        setSearchQuery('');
        updatePage(1);
    };

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

    const updatePage = useCallback((newPage: number, resetFilters = false) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        if (resetFilters) {
            // Logic to clear params if needed, but we rely on state
        }
        // We push state changes which trigger fetch, URL sync is optional for now or can be added
        // For now, just updating state is enough as logic relies on state
        setPagination(prev => ({ ...prev, page: newPage }));
    }, [searchParams]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const apiParams = new URLSearchParams();
                apiParams.set('page', pagination.page.toString());
                apiParams.set('limit', ITEMS_PER_PAGE.toString());
                apiParams.set('section', activeSection);

                // URL Display Params
                const urlParams = new URLSearchParams();
                urlParams.set('page', pagination.page.toString());
                urlParams.set('section', activeSection);

                if (activeTopic !== 'All') {
                    const patternCode = getPatternCode(activeTopic);
                    // console.log(`Filtering by topic: ${activeTopic} -> ${patternCode}`);
                    apiParams.set('pattern', patternCode);
                    urlParams.set('pattern', patternCode);
                }

                if (difficulty !== 'All') {
                    apiParams.set('difficulty', difficulty.toUpperCase());
                    urlParams.set('difficulty', difficulty);
                }

                if (statusFilter !== 'all') {
                    apiParams.set('filter', statusFilter);
                    urlParams.set('status', statusFilter);
                }

                if (yearFilter !== 'All') {
                    apiParams.set('year', yearFilter);
                    urlParams.set('year', yearFilter);
                }

                if (searchQuery) {
                    apiParams.set('query', searchQuery);
                    urlParams.set('query', searchQuery);
                }

                // Sync to browser URL silently
                window.history.replaceState(null, '', `?${urlParams.toString()}`);

                const res = await fetch(`/api/questions?${apiParams.toString()}`);
                const data = await res.json();
                setQuestions(data.data || []);
                setPagination(data.pagination);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            } finally {
                setLoading(false);
            }
        };
        // Debounce search
        const timeoutId = setTimeout(() => fetchQuestions(), 300);
        return () => clearTimeout(timeoutId);
    }, [pagination.page, activeSection, activeTopic, difficulty, statusFilter, yearFilter, searchQuery]);

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
                return <span className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">Easy</span>;
            case 'MEDIUM':
                return <span className="px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full">Medium</span>;
            case 'HARD':
                return <span className="px-3 py-1 text-xs font-semibold text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-full">Hard</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold text-neutral-500 bg-neutral-500/10 border border-neutral-500/20 rounded-full">-</span>;
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

    // Filter topics based on search
    const filteredTopicGroups = topicGroups.map(group => ({
        ...group,
        topics: group.topics.filter(t => t.toLowerCase().includes(topicSearchQuery.toLowerCase()))
    })).filter(group => group.topics.length > 0);

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* HEADER */}
            <Header activePage="problems" />

            {/* Main Content */}
            <div className="w-full px-6 lg:px-12 py-8">

                {/* Section Switcher & Status */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                    <div className="inline-flex p-1.5 bg-[#1a1a1a] rounded-[22px] border border-neutral-800 self-start relative">
                        {['QUANT', 'REASONING'].map((section) => (
                            <button
                                key={section}
                                onClick={() => { setActiveSection(section as 'QUANT' | 'REASONING'); setActiveTopic('All'); updatePage(1); }}
                                className={`relative flex items-center gap-3 px-6 py-3 rounded-[16px] text-base font-medium transition-colors z-10 ${activeSection === section ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                                    }`}
                            >
                                {section === 'QUANT' ? (
                                    <>
                                        <CalculateOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                                        Quantitative Aptitude
                                    </>
                                ) : (
                                    <>
                                        <PsychologyOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                                        Reasoning
                                    </>
                                )}

                                {activeSection === section && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className={`absolute inset-0 rounded-[16px] -z-10 ${section === 'QUANT'
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25'
                                            : 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/25'
                                            }`}
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Stats Display - Only show if user has activity */}
                    {!authLoading && user && userStats.totalAttempted > 0 && (
                        <div className="flex items-center gap-3 sm:gap-6 bg-[#1a1a1a] p-2 pr-6 rounded-[20px] border border-neutral-800 self-start xl:self-auto">
                            <div className="hidden sm:flex items-center gap-3 pl-4 border-r border-neutral-800 pr-6">
                                <div className="text-right">
                                    <p className="text-xs text-neutral-500 font-medium">Accuracy</p>
                                    <p className={`text-sm font-bold ${userStats.accuracy >= 80 ? 'text-emerald-400' : userStats.accuracy >= 50 ? 'text-amber-400' : 'text-neutral-300'}`}>
                                        {userStats.accuracy}%
                                    </p>
                                </div>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative ${userStats.accuracy >= 80 ? 'border-emerald-500/20' : userStats.accuracy >= 50 ? 'border-amber-500/20' : 'border-neutral-800'}`}>
                                    <TrackChangesOutlinedIcon sx={{ fontSize: '1rem' }} className={userStats.accuracy >= 80 ? 'text-emerald-400' : userStats.accuracy >= 50 ? 'text-amber-400' : 'text-neutral-500'} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pl-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                                        <TrendingUpIcon sx={{ fontSize: '1rem' }} className={activeSection === 'QUANT' ? 'text-amber-400' : 'text-violet-400'} />
                                        <span>Solved</span>
                                        <span className={activeSection === 'QUANT' ? 'text-amber-400 font-bold' : 'text-violet-400 font-bold'}>
                                            {userStats.totalCorrect}
                                        </span>
                                        <span className="text-neutral-600">/</span>
                                        <span className="text-neutral-500">{userStats.totalAttempted} attempted</span>
                                    </div>
                                    <div className="w-32 sm:w-40 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${activeSection === 'QUANT' ? 'bg-amber-500' : 'bg-violet-500'}`}
                                            style={{ width: `${userStats.totalAttempted > 0 ? (userStats.totalCorrect / userStats.totalAttempted) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Content */}
                    <div className="space-y-4">
                        {/* Filters Row */}
                        {/* Unified Filter Bar Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                            {/* 1. Topic Dropdown (2 cols) */}
                            <div className="xl:col-span-2 relative z-50" ref={topicDropdownRef}>
                                <button
                                    onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
                                    className={`flex items-center justify-between w-full h-[48px] px-3 bg-[#1a1a1a] border rounded-xl transition-all text-sm font-medium ${topicDropdownOpen
                                        ? accentColor === 'amber'
                                            ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                                            : 'border-violet-500/50 ring-1 ring-violet-500/20'
                                        : 'border-neutral-800 hover:border-neutral-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <MenuBookOutlinedIcon sx={{ fontSize: '1.1rem' }} className="text-neutral-500 shrink-0" />
                                        <span className={`font-semibold truncate ${activeTopic === 'All'
                                            ? 'text-neutral-200'
                                            : accentColor === 'amber'
                                                ? 'text-amber-400'
                                                : 'text-violet-400'
                                            }`}>
                                            {activeTopic === 'All' ? 'Topic: All' : activeTopic}
                                        </span>
                                    </div>
                                    <ExpandMoreIcon
                                        sx={{ fontSize: '1.2rem' }}
                                        className={`text-neutral-500 transition-transform duration-200 ml-1 shrink-0 ${topicDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Panel */}
                                {topicDropdownOpen && (
                                    <div className="absolute z-50 top-full left-0 min-w-[320px] sm:min-w-[500px] mt-2 bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-3 border-b border-neutral-800/50">
                                            <div className="relative">
                                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Search topics..."
                                                    value={topicSearchQuery}
                                                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {/* All Topics Button */}
                                            {!topicSearchQuery && (
                                                <button
                                                    onClick={() => {
                                                        setActiveTopic('All');
                                                        setTopicDropdownOpen(false);
                                                        setPagination(prev => ({ ...prev, page: 1 }));
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-sm text-left rounded-xl transition-all font-medium ${activeTopic === 'All'
                                                        ? accentColor === 'amber'
                                                            ? 'bg-amber-500/15 text-amber-400'
                                                            : 'bg-violet-500/15 text-violet-400'
                                                        : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-100'
                                                        }`}
                                                >
                                                    <GridIcon className="w-4 h-4" />
                                                    All Topics
                                                </button>
                                            )}

                                            {!topicSearchQuery && <div className="h-px bg-neutral-800 mb-3" />}

                                            {/* Categorized Groups */}
                                            <div className="space-y-5">
                                                {filteredTopicGroups.map((group) => (
                                                    <div key={group.label}>
                                                        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600/80">
                                                            {group.label}
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                            {group.topics.map((topic) => {
                                                                const count = topicCounts[getPatternCode(topic)] || 0;
                                                                return (
                                                                    <button
                                                                        key={topic}
                                                                        onClick={() => {
                                                                            setActiveTopic(topic);
                                                                            setTopicDropdownOpen(false);
                                                                            setPagination(prev => ({ ...prev, page: 1 }));
                                                                        }}
                                                                        className={`px-3 py-2 text-sm text-left rounded-lg transition-all truncate flex items-center justify-between group/item ${activeTopic === topic
                                                                            ? accentColor === 'amber'
                                                                                ? 'bg-amber-500/15 text-amber-400 font-semibold'
                                                                                : 'bg-violet-500/15 text-violet-400 font-semibold'
                                                                            : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                                                                            }`}
                                                                    >
                                                                        <span>{topic}</span>
                                                                        {count > 0 && (
                                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTopic === topic
                                                                                ? accentColor === 'amber' ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'
                                                                                : 'bg-neutral-800 text-neutral-500 group-hover/item:text-neutral-400'
                                                                                }`}>
                                                                                {count}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                                {filteredTopicGroups.length === 0 && (
                                                    <div className="py-8 text-center text-neutral-500 text-sm">
                                                        No topics found matching &quot;{topicSearchQuery}&quot;
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Search Bar (3 cols) */}
                            <div className="xl:col-span-3 relative group">
                                <SearchIcon sx={{ fontSize: '1.2rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 z-10" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full h-[48px] pl-10 pr-10 bg-[#1a1a1a] border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors z-10"
                                    >
                                        <CloseIcon sx={{ fontSize: '1.1rem' }} />
                                    </button>
                                )}
                            </div>

                            {/* 3. Difficulty (3 cols) */}
                            <div className="xl:col-span-3">
                                <CustomSelect
                                    value={difficulty}
                                    onChange={(val) => { setDifficulty(val); setPagination(prev => ({ ...prev, page: 1 })); }}
                                    options={[
                                        { value: 'All', label: 'All Difficulties' },
                                        { value: 'EASY', label: 'Easy' },
                                        { value: 'MEDIUM', label: 'Medium' },
                                        { value: 'HARD', label: 'Hard' },
                                    ]}
                                    prefix="Difficulty: "
                                />
                            </div>

                            {/* 4. Year (2 cols) */}
                            <div className="xl:col-span-2">
                                <CustomSelect
                                    value={yearFilter}
                                    onChange={(val) => { setYearFilter(val); setPagination(prev => ({ ...prev, page: 1 })); }}
                                    options={[
                                        { value: 'All', label: 'All Years' },
                                        { value: '2024', label: '2024' },
                                        { value: '2023', label: '2023' },
                                        { value: '2022', label: '2022' },
                                        { value: '2021', label: '2021' },
                                        { value: '2020', label: '2020' },
                                    ]}
                                    prefix="Year: "
                                />
                            </div>

                            {/* 5. Status (2 cols) */}
                            <div className="xl:col-span-2">
                                <CustomSelect
                                    value={statusFilter}
                                    onChange={(val) => { setStatusFilter(val); setPagination(prev => ({ ...prev, page: 1 })); }}
                                    options={[
                                        { value: 'all', label: 'All Questions' },
                                        { value: 'unattempted', label: 'Unattempted' },
                                        { value: 'bookmarked', label: 'Bookmarked' },
                                        { value: 'wrong', label: 'Incorrect' },
                                        { value: 'correct', label: 'Solved' },
                                    ]}
                                    prefix="Status: "
                                />
                            </div>
                        </div>

                        {/* Active Filters */}
                        <div className="flex items-center justify-between gap-4 mt-6">
                            <ActiveFilters filters={activeFilters} onClearAll={clearAllFilters} />
                        </div>

                        {/* Table */}
                        <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden mt-6">
                            <div className="hidden md:grid md:grid-cols-[50px_50px_1fr_160px_110px_70px] gap-4 px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/50 border-b border-neutral-800">
                                <div className="text-center">#</div>
                                <div className="text-center flex items-center justify-center gap-1 group/status">
                                    Status
                                    <div className="relative cursor-help">
                                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-500 text-neutral-500 flex items-center justify-center text-[8px] font-bold opacity-60 hover:opacity-100 transition-opacity">?</div>

                                        {/* Status Guide Tooltip */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-xs lowercase tracking-normal space-y-3 opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none z-50">
                                            <p className="text-neutral-400 uppercase font-bold tracking-widest text-[10px] border-b border-neutral-800 pb-2 mb-2">Status Guide</p>
                                            <div className="flex items-center gap-3 text-neutral-300">
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full border border-neutral-600 bg-neutral-600/20"></div>
                                                </div>
                                                <span className="font-medium">Unattempted</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-emerald-400">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <CheckCircleOutlinedIcon sx={{ fontSize: '0.9rem' }} />
                                                </div>
                                                <span className="font-medium">Solved</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-rose-400">
                                                <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                                                    <CloseIcon sx={{ fontSize: '0.9rem' }} />
                                                </div>
                                                <span className="font-medium">Wrong</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-violet-400">
                                                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                    <BookmarkIcon sx={{ fontSize: '0.8rem' }} />
                                                </div>
                                                <span className="font-medium">Saved</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>Question</div>
                                <div className="hidden md:block text-center">Topic</div>
                                <div className="text-center">Difficulty</div>
                                <div className="text-center">Year</div>
                            </div>

                            <div className="divide-y divide-neutral-800/50">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-[50px_50px_1fr_160px_110px_70px] gap-3 px-5 py-4 animate-pulse">
                                            <div className="hidden md:flex justify-center"><div className="w-5 h-5 bg-neutral-800 rounded-full"></div></div>
                                            <div className="hidden md:flex justify-center"><div className="w-5 h-5 bg-neutral-800 rounded-full"></div></div>
                                            <div><div className="h-4 bg-neutral-800 rounded w-3/4"></div></div>
                                            <div className="hidden md:block justify-center"><div className="h-4 bg-neutral-800 rounded w-1/2"></div></div>
                                            <div className="hidden md:flex justify-center"><div className="h-5 bg-neutral-800 rounded w-14"></div></div>
                                            <div className="hidden md:flex justify-center"><div className="h-4 bg-neutral-800 rounded w-10"></div></div>
                                        </div>
                                    ))
                                ) : questions.length === 0 ? (
                                    <div className="px-8 py-20 text-center">
                                        <div className="w-16 h-16 mx-auto mb-6 bg-neutral-800/50 rounded-2xl flex items-center justify-center border border-neutral-700/50">
                                            <DocumentIcon sx={{ fontSize: '2rem' }} className="text-neutral-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-200 mb-2">No Questions Found</h3>

                                        <div className="max-w-md mx-auto mt-6 bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 text-left">
                                            <p className="text-neutral-400 text-sm mb-4 font-medium">Current Filters:</p>
                                            <ul className="space-y-2 mb-6">
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-neutral-500">Section</span>
                                                    <span className="text-neutral-300 font-medium">{activeSection === 'QUANT' ? 'Quantitative Aptitude' : 'Reasoning'}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-neutral-500">Topic</span>
                                                    <span className="text-neutral-300 font-medium">{activeTopic}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-neutral-500">Difficulty</span>
                                                    <span className="text-neutral-300 font-medium">{difficulty}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-neutral-500">Year</span>
                                                    <span className="text-neutral-300 font-medium">{yearFilter}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-neutral-500">Status</span>
                                                    <span className="text-neutral-300 font-medium">{statusFilter}</span>
                                                </li>
                                            </ul>

                                            <div className="space-y-3">
                                                <p className="text-neutral-400 text-sm font-medium">Suggestions:</p>
                                                <button
                                                    onClick={() => setActiveSection(activeSection === 'QUANT' ? 'REASONING' : 'QUANT')}
                                                    className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    Switch to {activeSection === 'QUANT' ? 'Reasoning' : 'Quantitative Aptitude'}
                                                </button>
                                                <button
                                                    onClick={() => { setActiveTopic('All'); setTopicDropdownOpen(true); }}
                                                    className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Select a different topic
                                                </button>
                                            </div>

                                            <button
                                                onClick={clearAllFilters}
                                                className="w-full mt-6 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm rounded-lg transition-colors shadow-lg shadow-amber-500/10"
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    questions.map((q, index) => {
                                        const globalIndex = startItem + index;
                                        const isCorrect = solvedCorrect.includes(q.id);
                                        const isWrong = solvedWrong.includes(q.id) && !isCorrect;
                                        const isBookmarked = userBookmarks.includes(q.id);

                                        return (
                                            <Link
                                                href={`/problems/${q.questionNumber || q.id}?section=${activeSection}${activeTopic !== 'All' ? `&pattern=${getPatternCode(activeTopic)}` : ''}${difficulty !== 'All' ? `&difficulty=${difficulty}` : ''}${yearFilter !== 'All' ? `&year=${yearFilter}` : ''}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : ''}`}
                                                key={q.id}
                                                className="block hover:bg-neutral-800/30 transition-colors group border-b border-neutral-800/50 md:border-none"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-[50px_50px_1fr_160px_110px_70px] gap-3 md:gap-4 px-5 py-4 items-center">
                                                    {/* Index - Desktop */}
                                                    <div className="hidden md:block text-center text-base text-neutral-500 font-mono">
                                                        {q.questionNumber ?? globalIndex}
                                                    </div>

                                                    {/* Status/Icon */}
                                                    <div className="flex items-center gap-2 md:justify-center">
                                                        <div className="hidden md:flex">
                                                            {isCorrect ? (
                                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                                    <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} />
                                                                </div>
                                                            ) : isWrong ? (
                                                                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
                                                                    <CloseIcon sx={{ fontSize: '1rem' }} />
                                                                </div>
                                                            ) : userBookmarks.includes(q.id) ? (
                                                                <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center">
                                                                    <BookmarkIcon sx={{ fontSize: '0.9rem' }} />
                                                                </div>
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full border-2 border-neutral-700 text-neutral-700 flex items-center justify-center">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Mobile Status Header */}
                                                        <div className="md:hidden flex items-center justify-between w-full mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-neutral-500 font-mono text-sm font-medium">#{q.questionNumber ?? globalIndex}</span>
                                                                {isCorrect ? (
                                                                    <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                                                                        <CheckCircleOutlinedIcon sx={{ fontSize: '0.9rem' }} /> Solved
                                                                    </span>
                                                                ) : isWrong ? (
                                                                    <span className="text-xs text-rose-500 font-medium flex items-center gap-1">
                                                                        <CloseIcon sx={{ fontSize: '0.9rem' }} /> Attempted
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs text-neutral-500 font-medium">Unattempted</span>
                                                                )}
                                                            </div>
                                                            {isBookmarked && <BookmarkIcon sx={{ fontSize: '1rem' }} className="text-amber-500" />}
                                                        </div>
                                                    </div>

                                                    {/* Question Title */}
                                                    <div className="relative group/title min-w-0">
                                                        <div className="flex flex-col">
                                                            <div className="md:hidden mb-2">
                                                                {/* Spacer for mobile layout if needed or just use gap */}
                                                            </div>
                                                            <div className="text-base font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                                                                <MathText>{q.title}</MathText>
                                                            </div>
                                                            {/* Mobile-only additional info */}
                                                            <div className="flex items-center gap-2 mt-2 md:hidden">
                                                                <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                                                                    {getTopicName(q.pattern)}
                                                                </span>
                                                                <span className={`text-[11px] px-2 py-0.5 rounded uppercase font-bold ${q.difficulty === 'EASY' ? 'text-emerald-500 bg-emerald-500/10' : q.difficulty === 'MEDIUM' ? 'text-amber-500 bg-amber-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                                                    {q.difficulty}
                                                                </span>
                                                                <span className="text-[10px] text-neutral-500">
                                                                    {q.source?.split(' ').pop()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Desktop Bookmark Indicator */}
                                                        {isBookmarked && (
                                                            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-amber-500 md:block hidden">
                                                                <BookmarkIcon sx={{ fontSize: '0.9rem' }} />
                                                            </div>
                                                        )}
                                                        {/* Tooltip for full text - Improved Readability & Dynamic Positioning */}
                                                        <div className={`absolute left-0 ${index < 3 ? 'top-full mt-2' : 'bottom-full mb-2'} hidden md:group-hover/title:block w-[500px] lg:w-[700px] p-5 bg-neutral-900/95 backdrop-blur-sm text-base font-medium text-neutral-200 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] ring-1 ring-white/10 border border-neutral-700/50 z-50 pointer-events-none whitespace-normal leading-relaxed`}>
                                                            <MathText>{q.title}</MathText>
                                                        </div>
                                                    </div>

                                                    {/* Topic Column */}
                                                    <div className="hidden md:flex items-center justify-center">
                                                        <span className="text-sm text-neutral-400 truncate">
                                                            {getTopicName(q.pattern)}
                                                        </span>
                                                    </div>

                                                    {/* Desktop Difficulty */}
                                                    <div className="hidden md:flex justify-center">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs uppercase font-bold tracking-wide
                                                            ${q.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                                q.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                            {q.difficulty}
                                                        </span>
                                                    </div>

                                                    {/* Desktop Year */}
                                                    <div className="hidden md:flex justify-center">
                                                        <span className="text-sm text-neutral-400 font-medium bg-neutral-800/50 px-2.5 py-1 rounded">
                                                            {q.source?.split(' ').pop() || ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination with Context */}
                            {questions.length > 0 && pagination.totalPages > 1 && (
                                <div className="p-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-neutral-500 font-medium">
                                        Showing <span className="text-neutral-300 font-bold">{startItem}</span> to <span className="text-neutral-300 font-bold">{endItem}</span> of <span className="text-neutral-300 font-bold">{pagination.total}</span> questions
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updatePage(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {getPageNumbers().map((p, i) => (
                                                p === '...' ? (
                                                    <span key={i} className="px-2 text-neutral-600 text-sm">...</span>
                                                ) : (
                                                    <button
                                                        key={i}
                                                        onClick={() => updatePage(p as number)}
                                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${pagination.page === p
                                                            ? accentColor === 'amber'
                                                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                                                : 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                                                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-transparent hover:border-neutral-800'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                )
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => updatePage(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRightIcon sx={{ fontSize: '1.2rem' }} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
