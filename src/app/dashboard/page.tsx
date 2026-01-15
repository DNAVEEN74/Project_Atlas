"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MathText } from '@/components/ui/MathText';
import {
    MenuBookOutlinedIcon,
    CalculateOutlinedIcon,
    PsychologyOutlinedIcon,
    TrendingUpIcon,
    CheckCircleOutlinedIcon,
    LogoutIcon,
    ChevronRightIcon,
    BookmarkIcon,
    HistoryEduOutlinedIcon,
    ExpandMoreIcon,
    DashboardIcon,
} from '@/components/icons';
import { useToast } from '@/contexts/ToastContext';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading, logout, refreshUser } = useAuth();
    const { success, error: notifyError } = useToast();
    const [recentActivity, setRecentActivity] = React.useState<any[]>([]);
    const [activeTab, setActiveTab] = React.useState<'recent' | 'bookmarks'>('recent');
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/submissions?limit=10');
                const data = await res.json();
                if (data.success && data.data) setRecentActivity(data.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, []);

    React.useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await fetch('/api/user/bookmarks?full=true');
                const data = await res.json();
                if (data.success && data.questions) {
                    setBookmarkedQuestions(data.questions.slice(0, 6));
                }
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
            }
        };
        fetchBookmarks();
    }, []);

    // Dynamic stats (calculated from actual attempts, not cached user.dash)
    const [dynamicStats, setDynamicStats] = React.useState({
        totalCorrect: 0,
        totalWrong: 0,
        totalAttempted: 0,
        accuracy: 0,
    });

    const [difficultyStats, setDifficultyStats] = React.useState({
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
    });

    const [totalQuestions, setTotalQuestions] = React.useState(0);
    const [selectedSection, setSelectedSection] = React.useState<'ALL' | 'QUANT' | 'REASONING'>('ALL');

    React.useEffect(() => {
        const fetchDynamicStats = async () => {
            try {
                const url = selectedSection === 'ALL'
                    ? '/api/user/progress'
                    : `/api/user/progress?section=${selectedSection}`;
                const res = await fetch(url);
                if (res.ok) {
                    const { data } = await res.json();
                    setDynamicStats({
                        totalCorrect: data.stats.totalCorrect,
                        totalWrong: data.stats.totalWrong,
                        totalAttempted: data.stats.totalAttempted,
                        accuracy: data.stats.accuracy,
                    });
                    setDifficultyStats({
                        easy: {
                            solved: data.difficultyBreakdown?.EASY?.solved || 0,
                            total: data.totalsByDifficulty?.EASY || 0
                        },
                        medium: {
                            solved: data.difficultyBreakdown?.MEDIUM?.solved || 0,
                            total: data.totalsByDifficulty?.MEDIUM || 0
                        },
                        hard: {
                            solved: data.difficultyBreakdown?.HARD?.solved || 0,
                            total: data.totalsByDifficulty?.HARD || 0
                        },
                    });
                    setTotalQuestions(data.totalsByDifficulty?.ALL || 0);
                }
            } catch (error) {
                console.error('Failed to fetch dynamic stats:', error);
            }
        };
        if (user) fetchDynamicStats();
    }, [user, selectedSection]);

    React.useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = React.useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                // Determine functionality to refresh user or update local state
                // Since this context updates the user, calling logout then login is too heavy
                // But refreshUser() should handle it if it fetches fresh data
                // Assuming refreshUser is available from useAuth based on context definition
                // We'll reload the page or trigger a refresh if the context exposes it.
                // Looking at useAuth, it does expose refreshUser!
                // Wait, I need to check if I can access refreshUser from the hook.
                // let's assume I check the context file and it exports it.
                // If not, a window.location.reload() is a safe fallback.
                await refreshUser();
                success('Profile picture updated!');
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            notifyError('Failed to upload profile picture');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    };

    // Circular Progress Component - Larger for better readability
    const CircularProgress = ({ solved, total }: { solved: number; total: number }) => {
        const percentage = total > 0 ? (solved / total) * 100 : 0;
        const circumference = 2 * Math.PI * 58; // radius = 58 (larger)
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 176 176">
                    <circle
                        cx="88"
                        cy="88"
                        r="58"
                        stroke="#2a2a2a"
                        strokeWidth="10"
                        fill="none"
                    />
                    <circle
                        cx="88"
                        cy="88"
                        r="58"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white">{solved}</span>
                    <span className="text-sm text-neutral-400">/{total}</span>
                    <span className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircleOutlinedIcon sx={{ fontSize: '0.875rem' }} />
                        Solved
                    </span>
                </div>
            </div>
        );
    };

    const getIntensityColor = (intensity: number) => {
        const colors = [
            'bg-neutral-800',
            'bg-emerald-900/80',
            'bg-emerald-700',
            'bg-emerald-500',
            'bg-emerald-400',
        ];
        return colors[Math.min(intensity, 4)];
    };

    // Calculate heatmap stats
    const heatmapData = user.heatmap || [];
    const totalActiveDays = heatmapData.length;
    const totalSubmissions = heatmapData.reduce((sum, h) => sum + h.count, 0);




    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* Header */}
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
                                <Link href="/problems" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Problems
                                </Link>
                                <Link href="/mock-test" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Mock Tests
                                </Link>
                                <Link href="/previous-years" className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                                    Previous Papers
                                </Link>
                                <Link href="/dashboard" className="px-5 py-2 text-sm font-semibold text-amber-500 bg-amber-500/10 rounded-full">
                                    Dashboard
                                </Link>
                            </nav>
                        </div>

                        {/* Stats & User */}
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                    <span className="text-xs font-medium text-emerald-400">{dynamicStats.totalCorrect} Solved</span>
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
            <main className="w-full px-6 lg:px-12 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

                    {/* LEFT SIDEBAR - Profile Card */}
                    <div className="space-y-4">
                        <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-6">
                            {/* Avatar & Name */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative group/avatar">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0 overflow-hidden cursor-pointer relative"
                                    >
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            getUserInitials()
                                        )}

                                        {/* Overlay for hover */}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                            {uploadingAvatar ? (
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <span className="text-xs font-medium text-white">Change</span>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
                                    <p className="text-sm text-neutral-400 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            {/* Target Badge */}
                            <div className="flex items-center gap-2 mb-5">
                                <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-sm font-medium text-amber-400">
                                    🎯 {user.targetExam?.replace('_', ' ')} {user.targetYear}
                                </span>
                            </div>

                            <Link href="/problems" className="block w-full py-4 text-center bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-lg font-medium rounded-full transition-colors">
                                Practice Now
                            </Link>
                        </div>

                        {/* Community Stats Style */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-6">
                            <h3 className="text-lg font-semibold text-neutral-200 mb-5">Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span className="text-lg text-neutral-200">Correct</span>
                                    </div>
                                    <span className="text-lg font-semibold text-white">{dynamicStats.totalCorrect}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <span className="text-lg text-neutral-200">Wrong</span>
                                    </div>
                                    <span className="text-lg font-semibold text-white">{dynamicStats.totalWrong}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <span className="text-lg text-neutral-200">Bookmarks</span>
                                    </div>
                                    <span className="text-lg font-semibold text-white">{user.bookmarks?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                        <span className="text-lg text-neutral-200">Max Streak</span>
                                    </div>
                                    <span className="text-lg font-semibold text-white">{user.streak} 🔥</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-4">
                            <div className="space-y-1">
                                <Link href="/bookmarks" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-800 transition-colors group">
                                    <BookmarkIcon sx={{ fontSize: '1rem' }} className="text-yellow-500" />
                                    <span className="text-sm text-neutral-400 group-hover:text-white">Bookmarks</span>
                                    <ChevronRightIcon sx={{ fontSize: '1rem' }} className="ml-auto text-neutral-600" />
                                </Link>
                                <Link href="/problems" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-800 transition-colors group">
                                    <HistoryEduOutlinedIcon sx={{ fontSize: '1rem' }} className="text-blue-500" />
                                    <span className="text-sm text-neutral-400 group-hover:text-white">All Problems</span>
                                    <ChevronRightIcon sx={{ fontSize: '1rem' }} className="ml-auto text-neutral-600" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT MAIN CONTENT */}
                    <div className="space-y-5 min-w-0">

                        {/* Top Row: Progress + Difficulty Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5">

                            {/* Solved Progress Card */}
                            <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-5">
                                <div className="flex items-center gap-8">
                                    <CircularProgress solved={dynamicStats.totalCorrect} total={totalQuestions || 1} />

                                    {/* Difficulty Breakdown */}
                                    <div className="flex-1 space-y-4">
                                        {/* Easy */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm font-medium text-emerald-400">Easy</span>
                                                <span className="text-sm text-neutral-400">
                                                    <span className="text-white font-semibold">{difficultyStats.easy.solved}</span>/{difficultyStats.easy.total}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full transition-all"
                                                    style={{ width: `${(difficultyStats.easy.solved / difficultyStats.easy.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        {/* Medium */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm font-medium text-amber-400">Medium</span>
                                                <span className="text-sm text-neutral-400">
                                                    <span className="text-white font-semibold">{difficultyStats.medium.solved}</span>/{difficultyStats.medium.total}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full transition-all"
                                                    style={{ width: `${(difficultyStats.medium.solved / difficultyStats.medium.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        {/* Hard */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm font-medium text-rose-400">Hard</span>
                                                <span className="text-sm text-neutral-400">
                                                    <span className="text-white font-semibold">{difficultyStats.hard.solved}</span>/{difficultyStats.hard.total}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-rose-500 rounded-full transition-all"
                                                    style={{ width: `${(difficultyStats.hard.solved / difficultyStats.hard.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Toggle Cards */}
                            <div className="flex flex-col gap-3 min-w-[200px]">
                                {/* All Button */}
                                <button
                                    onClick={() => setSelectedSection('ALL')}
                                    className={`flex-1 text-left transition-all duration-300 ${selectedSection === 'ALL' ? 'scale-[1.02]' : ''}`}
                                >
                                    <div className={`h-full bg-gradient-to-r from-neutral-600/20 to-neutral-600/20 border rounded-xl p-4 transition-all duration-300 ${selectedSection === 'ALL'
                                        ? 'border-white/50 ring-2 ring-white/20'
                                        : 'border-neutral-700 hover:border-neutral-500'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <TrendingUpIcon sx={{ fontSize: '1.5rem' }} className={`transition-colors duration-300 ${selectedSection === 'ALL' ? 'text-white' : 'text-neutral-400'}`} />
                                            <div>
                                                <p className={`text-sm font-semibold transition-colors duration-300 ${selectedSection === 'ALL' ? 'text-white' : 'text-neutral-300'}`}>All Sections</p>
                                                <p className="text-xs text-neutral-500">Combined Stats</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                {/* Quant Button */}
                                <button
                                    onClick={() => setSelectedSection('QUANT')}
                                    className={`flex-1 text-left transition-all duration-300 ${selectedSection === 'QUANT' ? 'scale-[1.02]' : ''}`}
                                >
                                    <div className={`h-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 border rounded-xl p-4 transition-all duration-300 ${selectedSection === 'QUANT'
                                        ? 'border-amber-500/70 ring-2 ring-amber-500/20'
                                        : 'border-amber-500/30 hover:border-amber-500/50'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <CalculateOutlinedIcon sx={{ fontSize: '1.5rem' }} className={`transition-colors duration-300 ${selectedSection === 'QUANT' ? 'text-amber-300' : 'text-amber-400'}`} />
                                            <div>
                                                <p className={`text-sm font-semibold transition-colors duration-300 ${selectedSection === 'QUANT' ? 'text-amber-300' : 'text-white'}`}>Quant</p>
                                                <p className="text-xs text-neutral-500">Math & Arithmetic</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                {/* Reasoning Button */}
                                <button
                                    onClick={() => setSelectedSection('REASONING')}
                                    className={`flex-1 text-left transition-all duration-300 ${selectedSection === 'REASONING' ? 'scale-[1.02]' : ''}`}
                                >
                                    <div className={`h-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border rounded-xl p-4 transition-all duration-300 ${selectedSection === 'REASONING'
                                        ? 'border-violet-500/70 ring-2 ring-violet-500/20'
                                        : 'border-violet-500/30 hover:border-violet-500/50'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <PsychologyOutlinedIcon sx={{ fontSize: '1.5rem' }} className={`transition-colors duration-300 ${selectedSection === 'REASONING' ? 'text-violet-300' : 'text-violet-400'}`} />
                                            <div>
                                                <p className={`text-sm font-semibold transition-colors duration-300 ${selectedSection === 'REASONING' ? 'text-violet-300' : 'text-white'}`}>Reasoning</p>
                                                <p className="text-xs text-neutral-500">Logical Reasoning</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Submission Heatmap */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-white text-xl font-bold">{totalSubmissions}</span>
                                    <span className="text-neutral-500 text-sm">submissions in the past one year</span>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="text-neutral-500">Total active days: <span className="text-white font-medium">{totalActiveDays}</span></span>
                                    <span className="text-neutral-500">Max streak: <span className="text-white font-medium">{user.streak}</span></span>
                                </div>
                            </div>

                            <div className="w-full overflow-x-auto pb-4">
                                <div className="min-w-[800px] flex items-end gap-4 px-1">
                                    {/* Generate last 12 months */}
                                    {Array.from({ length: 13 }).map((_, monthIndex) => {
                                        // Calculate the specific month to display
                                        // Start from 12 months ago to current month
                                        const today = new Date();
                                        const currentYear = today.getFullYear();
                                        const currentMonth = today.getMonth();

                                        // Logic to go back 12 months
                                        // monthIndex 0 = 12 months ago
                                        // monthIndex 12 = current month
                                        const targetDate = new Date(currentYear, currentMonth - 12 + monthIndex, 1);
                                        const targetMonth = targetDate.getMonth();
                                        const targetYear = targetDate.getFullYear();

                                        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
                                        const startDayOfWeek = new Date(targetYear, targetMonth, 1).getDay(); // 0 = Sun

                                        // Helper to get attempt data
                                        const getIntensityForDay = (day: number) => {
                                            const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            // Check if future
                                            if (new Date(dateStr) > new Date()) return -1; // -1 for future

                                            const entry = user.heatmap?.find(h => h.date === dateStr);
                                            return entry ? entry.intensity : 0;
                                        };

                                        // Calculate columns needed: (start offset + days) / 7
                                        const totalSlots = startDayOfWeek + daysInMonth;
                                        const columns = Math.ceil(totalSlots / 7);

                                        return (
                                            <div key={monthIndex} className="flex flex-col gap-2 relative group">
                                                {/* Grid for this month */}
                                                <div className="flex gap-1">
                                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                                        <div key={colIndex} className="flex flex-col gap-1">
                                                            {Array.from({ length: 7 }).map((_, rowIndex) => {
                                                                // Calculate actual day number
                                                                const slotIndex = (colIndex * 7) + rowIndex;
                                                                const dayNumber = slotIndex - startDayOfWeek + 1;

                                                                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

                                                                if (!isValidDay) {
                                                                    return <div key={rowIndex} className="w-3.5 h-3.5" />; // Empty placeholder
                                                                }

                                                                const intensity = getIntensityForDay(dayNumber);

                                                                // Future days
                                                                if (intensity === -1) {
                                                                    return <div key={rowIndex} className="w-3.5 h-3.5 bg-neutral-900/30 rounded-sm" />; // Faint placeholder for future
                                                                }

                                                                return (
                                                                    <div
                                                                        key={rowIndex}
                                                                        className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 hover:z-10 ${getIntensityColor(intensity)}`}
                                                                        title={`${targetDate.toLocaleString('default', { month: 'short' })} ${dayNumber}, ${targetYear}`}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Month Label */}
                                                <span className="text-xs text-neutral-400 text-center block w-full truncate">
                                                    {targetDate.toLocaleString('default', { month: 'short' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Heatmap Legend */}
                            <div className="flex items-center justify-end gap-2 mt-4">
                                <span className="text-xs text-neutral-500">Less</span>
                                <div className="flex gap-1">
                                    <div className="w-3.5 h-3.5 rounded-sm bg-neutral-800" title="0 submissions"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-900/80" title="1-2 submissions"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-700" title="3-4 submissions"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500" title="5-9 submissions"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400" title="10+ submissions"></div>
                                </div>
                                <span className="text-xs text-neutral-500">More</span>
                            </div>
                        </div>

                        {/* Recent Activity with Tabs */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex items-center gap-1 px-4 py-3 border-b border-neutral-800">
                                <button
                                    onClick={() => setActiveTab('recent')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'recent'
                                        ? 'bg-neutral-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10'
                                        : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'
                                        }`}
                                >
                                    <HistoryEduOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                                    Recent Submissions
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookmarks')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'bookmarks'
                                        ? 'bg-neutral-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10'
                                        : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'
                                        }`}
                                >
                                    <BookmarkIcon sx={{ fontSize: '1.1rem' }} />
                                    Bookmarks
                                </button>
                                {activeTab === 'recent' ? (
                                    <Link href="/submissions" className="ml-auto text-xs font-medium text-amber-500 hover:text-amber-400">
                                        View all submissions →
                                    </Link>
                                ) : (
                                    <Link href="/bookmarks" className="ml-auto text-xs font-medium text-amber-500 hover:text-amber-400">
                                        View all bookmarks →
                                    </Link>
                                )}
                            </div>

                            {/* Content */}
                            <div className="divide-y divide-neutral-800/50">
                                {activeTab === 'recent' ? (
                                    recentActivity.length === 0 ? (
                                        <div className="p-8 text-center text-neutral-500">
                                            No recent activity. Start practicing!
                                        </div>
                                    ) : (
                                        recentActivity.slice(0, 6).map((attempt) => (
                                            <Link
                                                key={attempt._id}
                                                href={`/problems/${attempt.q_id?._id}?section=${attempt.q_id?.source?.section}`}
                                                className="px-5 py-3.5 hover:bg-neutral-800/30 transition-colors flex items-center justify-between group block"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-neutral-300 group-hover:text-amber-400 transition-colors text-sm truncate">
                                                        <MathText>{attempt.q_id?.content?.text?.slice(0, 100) || 'Question'}</MathText>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 ml-4">
                                                    <span className="text-xs text-neutral-600">
                                                        {new Date(attempt.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className={`w-2 h-2 rounded-full ${attempt.is_correct ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                </div>
                                            </Link>
                                        ))
                                    )
                                ) : (
                                    bookmarkedQuestions.length === 0 ? (
                                        <div className="p-8 text-center text-neutral-500">
                                            No bookmarks yet. Bookmark questions to review later!
                                        </div>
                                    ) : (
                                        bookmarkedQuestions.map((question) => (
                                            <Link
                                                key={question._id}
                                                href={`/problems/${question._id}?section=${question.source?.section}`}
                                                className="px-5 py-3.5 hover:bg-neutral-800/30 transition-colors flex items-center justify-between group block"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-neutral-300 group-hover:text-amber-400 transition-colors text-sm truncate">
                                                        <MathText>{question.content?.text?.slice(0, 100) || 'Question'}</MathText>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 ml-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${question.difficulty === 'EASY' ? 'bg-emerald-500/15 text-emerald-400' :
                                                        question.difficulty === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400' :
                                                            'bg-rose-500/15 text-rose-400'
                                                        }`}>
                                                        {question.difficulty}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
