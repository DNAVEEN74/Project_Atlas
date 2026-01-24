'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    CalculateOutlinedIcon,
    PsychologyOutlinedIcon,
    CheckCircleOutlinedIcon,
    DashboardIcon,
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
import Header from '@/components/layout/Header';
import { QUANT_GAMES, REASONING_GAMES, GameConfig } from '@/components/games/games-config';
import { GameModal } from '@/components/games/GameModal';

export default function GamesPage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
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
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* HEADER */}
            <Header activePage="games" />

            {/* Main Content */}
            <div className="w-full px-6 lg:px-12 py-8">
                <div className="max-w-7xl mx-auto">

                    {/* Section Switcher (New Segmented Control Style) */}
                    <div className="flex justify-start mb-10">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-full p-1.5 inline-flex items-center gap-1">
                            <button
                                onClick={() => setActiveTab('DASHBOARD')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'DASHBOARD'
                                    ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-white/5'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                                    }`}
                            >
                                <DashboardIcon sx={{ fontSize: '1.1rem' }} />
                                Stats
                            </button>
                            <button
                                onClick={() => setActiveTab('QUANT')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'QUANT'
                                    ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-white/5'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                                    }`}
                            >
                                <CalculateOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                                Quantitative
                            </button>
                            <button
                                onClick={() => setActiveTab('REASONING')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'REASONING'
                                    ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-white/5'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                                    }`}
                            >
                                <PsychologyOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                                Reasoning
                            </button>
                        </div>
                    </div>

                    {/* Stats Dashboard View */}
                    {activeTab === 'DASHBOARD' && dashStats ? (
                        <div className="mb-16 animate-fade-in-up space-y-6">

                            {/* 1. TOP ROW: Key Metrics & Trend */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Key Metrics Grid */}
                                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {/* Card 1: Total Drills */}
                                    <div className="bg-[#1a1a1a] border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between hover:border-neutral-700 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Sessions</p>
                                            <TrophyIcon className="text-neutral-700 text-lg group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white tracking-tight">{dashStats!.totalGamesPlayed}</h3>
                                            <p className="text-[11px] text-neutral-500 mt-1 font-medium">Total Drills Completed</p>
                                        </div>
                                    </div>

                                    {/* Card 2: Accuracy */}
                                    <div className="bg-[#1a1a1a] border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between hover:border-neutral-700 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Precision</p>
                                            <CheckCircleOutlinedIcon className="text-neutral-700 text-lg group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white tracking-tight">{dashStats!.accuracy}%</h3>
                                            <p className="text-[11px] text-neutral-500 mt-1 font-medium">Avg. Correct Answers</p>
                                        </div>
                                    </div>

                                    {/* Card 3: Top Score */}
                                    <div className="bg-[#1a1a1a] border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between hover:border-neutral-700 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Record</p>
                                            <StarIcon className="text-neutral-700 text-lg group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white tracking-tight">{dashStats!.highestScore}</h3>
                                            <p className="text-[11px] text-neutral-500 mt-1 font-medium">All-Time Best Score</p>
                                        </div>
                                    </div>

                                    {/* Card 4: Focus Time */}
                                    <div className="bg-[#1a1a1a] border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between hover:border-neutral-700 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Volume</p>
                                            <HistoryIcon className="text-neutral-700 text-lg group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white tracking-tight">{Math.round(dashStats!.totalTime / 60)}<span className="text-sm font-medium text-neutral-500 ml-0.5">min</span></h3>
                                            <p className="text-[11px] text-neutral-500 mt-1 font-medium">Total Practice Time</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Weekly Trend Chart */}
                                <div className="bg-[#1a1a1a] border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-4 z-10">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Trend Analysis</h4>
                                            <p className="text-[10px] text-neutral-500 mt-0.5 font-medium uppercase tracking-wide">Last 7 Days Performance</p>
                                        </div>
                                        {dashStats!.weeklyTrend.length > 0 && (
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-emerald-400">
                                                    {dashStats!.weeklyTrend[dashStats!.weeklyTrend.length - 1]?.avgScore || 0} pts
                                                </span>
                                                <p className="text-[10px] text-neutral-500">Current Avg</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex items-end gap-2 min-h-[100px] z-10">
                                        {dashStats!.weeklyTrend.length > 0 ? (
                                            dashStats!.weeklyTrend.map((day, i) => {
                                                const maxScore = Math.max(...dashStats!.weeklyTrend.map(d => d.avgScore), 100);
                                                const height = Math.max((day.avgScore / maxScore) * 100, 10); // Min height 10%
                                                return (
                                                    <div key={day.date} className="flex-1 flex flex-col justify-end group/bar h-full">
                                                        <div className="relative w-full flex flex-col items-center">
                                                            <div className="peer w-full bg-neutral-800 rounded-sm hover:bg-emerald-500/80 transition-all duration-300 relative" style={{ height: `${height}%` }}></div>
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full mb-2 opacity-0 peer-hover:opacity-100 transition-opacity bg-black text-[10px] text-white px-2 py-1 rounded border border-neutral-800 whitespace-nowrap pointer-events-none z-20">
                                                                {day.avgScore} pts
                                                            </div>
                                                        </div>
                                                        <div className="h-1 w-full bg-transparent mt-1"></div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
                                                No recent trend data
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtle Overlay Grid */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px)', backgroundSize: '100% 20px' }}>
                                    </div>
                                </div>
                            </div>

                            {/* 2. SKILL BREAKDOWN ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Quant Card */}
                                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <CalculateIcon className="text-6xl text-amber-500" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                <CalculateIcon fontSize="small" />
                                            </div>
                                            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wide">Quantitative</h4>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Games Played</p>
                                                    <p className="text-2xl font-bold text-white">{dashStats!.sectionStats.QUANT.totalPlays}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Best Session</p>
                                                    <p className="text-2xl font-bold text-amber-500">{dashStats!.sectionStats.QUANT.bestScore}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-xs font-medium text-neutral-400">Coverage</span>
                                                    <span className="text-xs font-bold text-white">{Math.round((dashStats!.sectionStats.QUANT.uniqueGames / QUANT_GAMES.length) * 100)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(dashStats!.sectionStats.QUANT.uniqueGames / QUANT_GAMES.length) * 100}%` }} />
                                                </div>
                                                <p className="text-[10px] text-neutral-600 mt-1.5">{dashStats!.sectionStats.QUANT.uniqueGames} of {QUANT_GAMES.length} variations explored</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reasoning Card */}
                                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <PsychologyOutlinedIcon className="text-6xl text-violet-500" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500">
                                                <PsychologyOutlinedIcon fontSize="small" />
                                            </div>
                                            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wide">Reasoning</h4>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Games Played</p>
                                                    <p className="text-2xl font-bold text-white">{dashStats!.sectionStats.REASONING.totalPlays}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Best Session</p>
                                                    <p className="text-2xl font-bold text-violet-500">{dashStats!.sectionStats.REASONING.bestScore}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-xs font-medium text-neutral-400">Coverage</span>
                                                    <span className="text-xs font-bold text-white">{Math.round((dashStats!.sectionStats.REASONING.uniqueGames / REASONING_GAMES.length) * 100)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(dashStats!.sectionStats.REASONING.uniqueGames / REASONING_GAMES.length) * 100}%` }} />
                                                </div>
                                                <p className="text-[10px] text-neutral-600 mt-1.5">{dashStats!.sectionStats.REASONING.uniqueGames} of {REASONING_GAMES.length} variations explored</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Difficulty Breakdown (New Visualization) */}
                                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                                            <TrendingUpIcon fontSize="small" />
                                        </div>
                                        <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wide">Intensity</h4>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center space-y-5">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-bold text-rose-500">HARD</span>
                                                <span className="text-neutral-400">{dashStats!.difficultyBreakdown.hard}</span>
                                            </div>
                                            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                                                <div className="h-full bg-rose-500" style={{ width: `${(dashStats!.difficultyBreakdown.hard / (dashStats!.totalGamesPlayed || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-bold text-amber-500">MEDIUM</span>
                                                <span className="text-neutral-400">{dashStats!.difficultyBreakdown.medium}</span>
                                            </div>
                                            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500" style={{ width: `${(dashStats!.difficultyBreakdown.medium / (dashStats!.totalGamesPlayed || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-bold text-emerald-500">EASY</span>
                                                <span className="text-neutral-400">{dashStats!.difficultyBreakdown.easy}</span>
                                            </div>
                                            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${(dashStats!.difficultyBreakdown.easy / (dashStats!.totalGamesPlayed || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. RECENT SESSIONS TABLE (Clean List) */}
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wide">Recent Activity</h4>
                                    <Link href="/games/history" className="text-xs font-bold text-neutral-500 hover:text-white transition-colors">
                                        VIEW HISTORY
                                    </Link>
                                </div>
                                <div className="divide-y divide-neutral-800">
                                    {dashStats!.recentGames.length > 0 ? (
                                        dashStats!.recentGames.map((session, i) => (
                                            <div key={`${session.gameId}-${i}`} className="px-6 py-3.5 flex items-center justify-between hover:bg-neutral-800/40 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${session.category === 'QUANT' ? 'bg-amber-500/10 text-amber-500' : 'bg-violet-500/10 text-violet-500'}`}>
                                                        {session.category === 'QUANT' ? <CalculateIcon fontSize="inherit" /> : <PsychologyOutlinedIcon fontSize="inherit" />}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-medium text-white group-hover:text-amber-500 transition-colors">{session.gameName}</h5>
                                                        <p className="text-[10px] text-neutral-500">{new Date(session.lastPlayed).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <span className="block text-sm font-bold text-white">{session.bestScore}</span>
                                                        <span className="block text-[9px] text-neutral-600 uppercase">Score</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-neutral-500 text-sm">
                                            No recent sessions recorded.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : activeTab === 'DASHBOARD' && (
                        <div className="text-center py-20 animate-pulse">
                            <p className="text-neutral-500 font-medium">Loading statistics...</p>
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

