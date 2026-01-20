'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    CalculateOutlinedIcon,
    PsychologyOutlinedIcon,
    CheckCircleOutlinedIcon,
    BookmarkIcon,
    DashboardIcon,
    LogoutIcon,
    ExpandMoreIcon,
    CalculateIcon,
    SpeedIcon,
    FunctionsIcon,
    TrendingUpIcon,
    CodeIcon,
    ExtensionIcon,
    QuizIcon,
    PieChartIcon,
    BoltIcon,
    StarIcon,
    TrophyIcon,
    BarChartIcon,
    WidgetsIcon,
    HistoryIcon,
    ArrowForwardIcon,
} from '@/components/icons';
import { QUANT_GAMES, REASONING_GAMES, GameConfig } from '@/components/games/games-config';
import { GameModal } from '@/components/games/GameModal';

export default function GamesPage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'QUANT' | 'REASONING'>('DASHBOARD');
    const [gameScores, setGameScores] = useState<Record<string, number>>({});
    const [dashStats, setDashStats] = useState<{
        totalGamesPlayed: number;
        uniqueGamesPlayed: number;
        totalGamesAvailable: number;
        highestScore: number;
        averageScore: number;
        accuracy: number;
        totalTime: number;
        totalCorrect: number;
        totalQuestions: number;
        difficultyBreakdown: { easy: number; medium: number; hard: number };
        sectionStats: {
            QUANT: { totalPlays: number; uniqueGames: number; avgScore: number; bestScore: number };
            REASONING: { totalPlays: number; uniqueGames: number; avgScore: number; bestScore: number };
        };
        recentGames: { gameId: string; gameName: string; bestScore: number; attempts: number; lastPlayed: Date; category: string }[];
        weeklyTrend: { date: string; avgScore: number; count: number }[];
    } | null>(null);

    const fetchScores = async () => {
        try {
            const [scoresRes, statsRes] = await Promise.all([
                fetch('/api/games/scores'),
                fetch('/api/games/stats')
            ]);
            const scoresData = await scoresRes.json();
            const statsData = await statsRes.json();

            if (scoresData.success) setGameScores(scoresData.data);
            if (statsData.success) setDashStats(statsData.data);
        } catch (error) {
            console.error('Failed to fetch game data:', error);
        }
    };

    React.useEffect(() => {
        if (user) {
            fetchScores();
        }
    }, [user]);

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);
    // ... (rest of code)


    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    const currentGames = activeTab === 'QUANT' ? QUANT_GAMES : REASONING_GAMES;

    const getGameTheme = (colorString: string) => {
        // Extract primary color name to map to hex values for specific consistency
        // Colors used in config: amber, emerald, violet, rose, blue, indigo, fuchsia, orange, green
        if (colorString.includes('amber') || colorString.includes('orange')) return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', hoverBg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.3)' };
        if (colorString.includes('emerald') || colorString.includes('green') || colorString.includes('teal')) return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', hoverBg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.3)' };
        if (colorString.includes('violet') || colorString.includes('purple')) return { text: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', hoverBg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.3)' };
        if (colorString.includes('rose') || colorString.includes('pink') || colorString.includes('fuchsia')) return { text: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', hoverBg: 'rgba(244, 63, 94, 0.2)', border: 'rgba(244, 63, 94, 0.3)' };
        if (colorString.includes('blue') || colorString.includes('cyan') || colorString.includes('sky')) return { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', hoverBg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.3)' };
        if (colorString.includes('indigo')) return { text: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', hoverBg: 'rgba(99, 102, 241, 0.2)', border: 'rgba(99, 102, 241, 0.3)' };

        return { text: '#e5e5e5', bg: 'rgba(229, 229, 229, 0.1)', hoverBg: 'rgba(229, 229, 229, 0.2)', border: 'rgba(229, 229, 229, 0.3)' };
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden selection:bg-amber-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Subtle Grid */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem',
                        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)'
                    }}
                />

                {/* Dynamic Glow - Changes based on tab */}
                <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ease-in-out ${activeTab === 'DASHBOARD' ? 'bg-amber-500/10' :
                        activeTab === 'QUANT' ? 'bg-amber-500/10' : 'bg-violet-500/10'
                        }`}
                />

                {/* Floating Background Icons - Decorative */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-[10%] left-[5%] text-white/5 transform -rotate-12 transition-all duration-1000 ${activeTab === 'QUANT' ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`}>
                        <FunctionsIcon sx={{ fontSize: '20rem' }} />
                    </div>
                    <div className={`absolute bottom-[10%] right-[5%] text-white/5 transform rotate-12 transition-all duration-1000 ${activeTab === 'REASONING' ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`}>
                        <ExtensionIcon sx={{ fontSize: '24rem' }} />
                    </div>
                    <div className={`absolute top-[15%] right-[5%] text-white/5 transform rotate-6 transition-all duration-1000 ${activeTab === 'DASHBOARD' ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`}>
                        <DashboardIcon sx={{ fontSize: '22rem' }} />
                    </div>
                    <div className="absolute top-[20%] right-[10%] text-white/5 transform rotate-45 opacity-20">
                        <BoltIcon sx={{ fontSize: '12rem' }} />
                    </div>
                    <div className="absolute bottom-[20%] left-[10%] text-white/5 transform -rotate-6 opacity-20">
                        <TrendingUpIcon sx={{ fontSize: '16rem' }} />
                    </div>
                </div>
            </div>

            {/* HEADER */}
            <header className="bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-neutral-800/50 sticky top-0 z-50">
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
                                <Link href="/problems" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Problems
                                </Link>
                                <Link href="/games" className="px-5 py-2 text-sm font-semibold text-amber-500 bg-amber-500/10 rounded-full">
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

                        {/* User Menu */}
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
            </header>

            {/* Main Content */}
            <div className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Text */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                            SPEED <span className={`transition-colors duration-1000 ${activeTab === 'REASONING' ? 'text-violet-500' : 'text-amber-500'}`}>DRILLS</span>
                        </h1>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed font-medium">
                            Master your speed with focus-driven mini games. 10 questions, 10 seconds each.
                        </p>
                    </div>

                    {/* Section Switcher (Consistent with Problems Page) */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-1.5 bg-[#1a1a1a] rounded-[20px] border border-neutral-800 shadow-2xl">
                            <button
                                onClick={() => setActiveTab('DASHBOARD')}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-base font-medium transition-all ${activeTab === 'DASHBOARD'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                <DashboardIcon sx={{ fontSize: '1.4rem' }} />
                                Stats
                            </button>
                            <button
                                onClick={() => setActiveTab('QUANT')}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-base font-medium transition-all ${activeTab === 'QUANT'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                <CalculateOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                                Quantitative
                            </button>
                            <button
                                onClick={() => setActiveTab('REASONING')}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-base font-medium transition-all ${activeTab === 'REASONING'
                                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                <PsychologyOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                                Reasoning
                            </button>
                        </div>
                    </div>

                    {/* Stats Dashboard View */}
                    {activeTab === 'DASHBOARD' && dashStats ? (
                        <div className="mb-16 animate-fade-in-up space-y-10">

                            {/* 1. SECTION MASTERY (Quant vs Reasoning) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Quant Mastery */}
                                <div className="bg-[#111]/80 backdrop-blur-2xl border border-amber-500/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
                                    <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-110">
                                        <CalculateIcon sx={{ fontSize: '15rem' }} className="text-amber-500" />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                                                <CalculateIcon sx={{ fontSize: '1.2rem' }} className="text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-wider">Quant Mastery</h4>
                                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Mathematical Speed</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Drills Done</p>
                                                <h3 className="text-3xl font-black text-white">{dashStats.sectionStats.QUANT.totalPlays}</h3>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Unique Games</p>
                                                <h3 className="text-3xl font-black text-white">
                                                    {dashStats.sectionStats.QUANT.uniqueGames}
                                                    <span className="text-sm text-neutral-600 ml-1">/{QUANT_GAMES.length}</span>
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Overall Proficiency</span>
                                                <span className="text-sm font-black text-amber-500">{Math.round((dashStats.sectionStats.QUANT.uniqueGames / QUANT_GAMES.length) * 100)}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                                    style={{ width: `${(dashStats.sectionStats.QUANT.uniqueGames / QUANT_GAMES.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reasoning Mastery */}
                                <div className="bg-[#111]/80 backdrop-blur-2xl border border-violet-500/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-500">
                                    <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-110">
                                        <PsychologyOutlinedIcon sx={{ fontSize: '15rem' }} className="text-violet-500" />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/20">
                                                <PsychologyOutlinedIcon sx={{ fontSize: '1.2rem' }} className="text-violet-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-wider">Reasoning Logic</h4>
                                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Cognitive Agility</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Drills Done</p>
                                                <h3 className="text-3xl font-black text-white">{dashStats.sectionStats.REASONING.totalPlays}</h3>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Unique Games</p>
                                                <h3 className="text-3xl font-black text-white">
                                                    {dashStats.sectionStats.REASONING.uniqueGames}
                                                    <span className="text-sm text-neutral-600 ml-1">/{REASONING_GAMES.length}</span>
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Overall Proficiency</span>
                                                <span className="text-sm font-black text-violet-500">{Math.round((dashStats.sectionStats.REASONING.uniqueGames / REASONING_GAMES.length) * 100)}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                                    style={{ width: `${(dashStats.sectionStats.REASONING.uniqueGames / REASONING_GAMES.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. PERFORMANCE TREND & GLOBAL STATS */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Global Stats Circle Cards */}
                                <div className="grid grid-cols-2 gap-4 lg:col-span-1">
                                    <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] p-6 rounded-[2rem] text-center group hover:bg-neutral-800/40 transition-colors">
                                        <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-2">Accuracy</p>
                                        <div className="relative inline-flex items-center justify-center mb-2">
                                            <svg className="w-16 h-16 transform -rotate-90">
                                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-neutral-900" />
                                                <circle
                                                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                    strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - dashStats.accuracy / 100)}
                                                    className="text-amber-500 transition-all duration-1000" strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute text-sm font-black text-white">{dashStats.accuracy}%</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-600 font-bold uppercase">{dashStats.totalCorrect} Correct</p>
                                    </div>

                                    <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] p-6 rounded-[2rem] text-center group hover:bg-neutral-800/40 transition-colors">
                                        <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-2">Best Score</p>
                                        <div className="h-16 flex items-center justify-center">
                                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-600">{dashStats.highestScore}</h3>
                                        </div>
                                        <p className="text-[10px] text-neutral-600 font-bold uppercase">All-Time Peak</p>
                                    </div>

                                    <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] p-6 rounded-[2rem] text-center group hover:bg-neutral-800/40 transition-colors">
                                        <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-2">Total Plays</p>
                                        <div className="h-16 flex items-center justify-center">
                                            <h3 className="text-3xl font-black text-white">{dashStats.totalGamesPlayed}</h3>
                                        </div>
                                        <p className="text-[10px] text-neutral-600 font-bold uppercase">Drills Completed</p>
                                    </div>

                                    <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] p-6 rounded-[2rem] text-center group hover:bg-neutral-800/40 transition-colors">
                                        <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-2">Drill Time</p>
                                        <div className="h-16 flex items-center justify-center">
                                            <h3 className="text-3xl font-black text-white">{Math.round(dashStats.totalTime / 60)}<span className="text-sm">m</span></h3>
                                        </div>
                                        <p className="text-[10px] text-neutral-600 font-bold uppercase">Active Focus</p>
                                    </div>
                                </div>

                                {/* Performance Trend Sparkline */}
                                <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] p-8 rounded-[3rem] lg:col-span-1">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                                                <BarChartIcon sx={{ fontSize: '1.2rem' }} className="text-emerald-500" />
                                            </div>
                                            <h4 className="text-base font-black text-white uppercase tracking-wider">Performance Trend</h4>
                                        </div>
                                    </div>

                                    {dashStats.weeklyTrend.length > 1 ? (
                                        <div className="h-40 flex items-end gap-2 group/spark">
                                            {dashStats.weeklyTrend.map((day, i) => {
                                                const maxScore = Math.max(...dashStats.weeklyTrend.map(d => d.avgScore), 100);
                                                const height = (day.avgScore / maxScore) * 100;
                                                return (
                                                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                                        <div className="relative w-full flex items-end justify-center h-full">
                                                            <div
                                                                className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-500/80 rounded-t-lg transition-all duration-500 group-hover/bar:brightness-125"
                                                                style={{ height: `${height}%` }}
                                                            />
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-neutral-800 text-[9px] font-black text-white px-2 py-1 rounded-md border border-white/10 z-20">
                                                                {day.avgScore} pts
                                                            </div>
                                                        </div>
                                                        <span className="text-[8px] text-neutral-600 font-black uppercase tracking-tighter">
                                                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-40 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/[0.01]">
                                            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest text-center px-6">Play more for trend analytics</p>
                                        </div>
                                    )}
                                </div>

                                {/* Difficulty Breakdown Card */}
                                <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] p-8 rounded-[3rem] lg:col-span-2">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/10">
                                                <TrendingUpIcon sx={{ fontSize: '1.2rem' }} className="text-orange-500" />
                                            </div>
                                            <h4 className="text-base font-black text-white uppercase tracking-wider">Difficulty Focus</h4>
                                        </div>
                                        <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Session counts</span>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Easy */}
                                        <div className="group">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Beginner Drills (Easy)</span>
                                                <span className="text-sm font-black text-white">{dashStats.difficultyBreakdown.easy}</span>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                    style={{ width: `${(dashStats.difficultyBreakdown.easy / (dashStats.totalGamesPlayed || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        {/* Medium */}
                                        <div className="group">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Standard Drills (Medium)</span>
                                                <span className="text-sm font-black text-white">{dashStats.difficultyBreakdown.medium}</span>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                                    style={{ width: `${(dashStats.difficultyBreakdown.medium / (dashStats.totalGamesPlayed || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        {/* Hard */}
                                        <div className="group">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Pro Drills (Hard)</span>
                                                <span className="text-sm font-black text-white">{dashStats.difficultyBreakdown.hard}</span>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-rose-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                                                    style={{ width: `${(dashStats.difficultyBreakdown.hard / (dashStats.totalGamesPlayed || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. RECENT ACTIVITY TABLE (Detailed) */}
                            <div className="bg-[#111]/40 backdrop-blur-md border border-white/[0.03] rounded-[3rem] p-10 relative overflow-hidden">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                                            <HistoryIcon sx={{ fontSize: '1.5rem' }} className="text-neutral-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-wider">Session Timeline</h4>
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Your journey of improvement</p>
                                        </div>
                                    </div>
                                    <Link href="/games/history" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] text-neutral-400 font-black uppercase tracking-widest transition-all">
                                        View All Activity
                                    </Link>
                                </div>

                                {dashStats.recentGames.length > 0 ? (
                                    <div className="space-y-4">
                                        {dashStats.recentGames.map((session, i) => (
                                            <div
                                                key={`${session.gameId}-${i}`}
                                                className="bg-[#1a1a1a]/40 border border-white/[0.02] p-5 rounded-3xl flex flex-wrap items-center justify-between gap-6 hover:border-white/10 transition-all duration-300 group"
                                            >
                                                <div className="flex items-center gap-5 flex-1 min-w-[200px]">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${session.category === 'QUANT' ? 'bg-amber-500/10 border-amber-500/10' : 'bg-violet-500/10 border-violet-500/10'
                                                        }`}>
                                                        {session.category === 'QUANT' ? (
                                                            <CalculateIcon sx={{ fontSize: '1.2rem' }} className="text-amber-500" />
                                                        ) : (
                                                            <PsychologyOutlinedIcon sx={{ fontSize: '1.2rem' }} className="text-violet-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-wide">{session.gameName}</h5>
                                                        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                                                            {new Date(session.lastPlayed).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-12">
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1">Score</p>
                                                        <p className="text-xl font-black text-white tracking-tight">{session.bestScore}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1">Drills</p>
                                                        <p className="text-xl font-black text-neutral-400 tracking-tight">{session.attempts}</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5">
                                        <p className="text-neutral-500 text-sm font-medium italic">No game sessions logged yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'DASHBOARD' && (
                        <div className="text-center py-20 animate-pulse">
                            <p className="text-neutral-500 font-medium">Analyzing your drill history...</p>
                        </div>
                    )}

                    {/* Games Grid View */}
                    {(activeTab === 'QUANT' || activeTab === 'REASONING') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                            {currentGames.map((game) => {
                                const theme = getGameTheme(game.color);

                                return (
                                    <button
                                        key={game.id}
                                        onClick={() => setSelectedGame(game)}
                                        className="group bg-[#111] rounded-[2.5rem] p-10 border border-white/[0.05] transition-all duration-500 hover:bg-neutral-900/40 hover:-translate-y-2 relative overflow-hidden text-left w-full h-auto shadow-2xl hover:border-white/10"
                                    >
                                        {/* Glass reflection effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Best Score Badge */}
                                        <div className="absolute top-8 right-8 px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full z-10 transition-all group-hover:bg-amber-500/10 group-hover:border-amber-500/30">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-500 group-hover:text-amber-500/80 transition-colors">Best</span>
                                                <span className="text-xs font-black text-white" style={{ color: theme.text === '#e5e5e5' ? 'white' : theme.text }}>
                                                    {gameScores[game.id] !== undefined ? gameScores[game.id] : '--'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Background Decor Icon */}
                                        <div className="absolute -top-10 -right-10 p-8 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
                                            <div className="text-[14rem] leading-none">
                                                {game.icon}
                                            </div>
                                        </div>

                                        {/* Icon Container with multi-layered shadow */}
                                        <div
                                            className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl"
                                            style={{
                                                backgroundColor: `${theme.bg}44`,
                                                border: `1px solid ${theme.bg}88`
                                            }}
                                        >
                                            <div className="text-4xl drop-shadow-2xl" style={{ color: theme.text }}>
                                                {game.icon}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-amber-500 transition-colors">
                                            {game.name}
                                        </h3>
                                        <p className="text-neutral-500 leading-relaxed text-sm h-12 line-clamp-2 font-medium group-hover:text-neutral-400 transition-colors">
                                            {game.description}
                                        </p>

                                        {/* Action indicator */}
                                        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 group-hover:text-amber-500 transition-all">
                                            <span>Start Drill</span>
                                            <ArrowForwardIcon sx={{ fontSize: '1rem' }} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Game Modal */}
            {selectedGame && (
                <GameModal
                    game={selectedGame as GameConfig}
                    isOpen={!!selectedGame}
                    onClose={() => setSelectedGame(null)}
                    onScoreUpdate={fetchScores}
                />
            )}
        </div>
    );
}

