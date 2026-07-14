'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import DailyProgressHero from '@/components/dashboard/DailyProgressHero';
import Statistics from '@/components/dashboard/Statistics';
import Heatmap from '@/components/dashboard/Heatmap';
import TopicPerformance from '@/components/dashboard/TopicPerformance';
import RecentActivity from '@/components/dashboard/RecentActivity';


interface DashboardData {
    user: any;
    daily_progress: any;
    heatmap: any[];
    topic_stats: any[];
    recent_attempts: any[];
    difficulty_stats: any;
    difficulty_stats_raw?: any[];
    advanced_insights?: any;
    overall_stats?: any;
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    // State for global filter
    const [selectedSubject, setSelectedSubject] = useState<'ALL' | 'QUANT' | 'REASONING'>('ALL');

    const fetchDashboardData = React.useCallback(async () => {
        try {
            const res = await fetch('/api/user/dashboard');
            const result = await res.json();
            if (result.success) {
                setData(result.dashboard);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }, [setData, setLoading]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }
        if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading, router, fetchDashboardData]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <Header activePage="dashboard" />
                <main className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
                </main>
            </div>
        );
    }

    if (!user || !data) return null;

    // Empty state for brand-new users who have no activity yet
    const isNewUser = (data.recent_attempts?.length ?? 0) === 0 && (data.heatmap?.length ?? 0) === 0;

    // --- FILTERING LOGIC ---

    // Helper to normalize subject
    const normalizeSubject = (sub?: string) => {
        if (!sub) return 'UNKNOWN';
        const s = sub.toUpperCase();
        if (s.includes('QUANT') || s.includes('MATH') || s.includes('APTITUDE')) return 'QUANT';
        if (s.includes('REASON') || s.includes('LOGIC')) return 'REASONING';
        return 'UNKNOWN';
    };

    // 1. Filter Heatmap Data & Calculate Streak
    // We utilize the same calculation for ALL to ensure consistency with the heatmap visual
    const calculateStreak = (subject: 'ALL' | 'QUANT' | 'REASONING') => {
        if (!data.heatmap || data.heatmap.length === 0) return 0;

        // Sort by date descending
        const sorted = [...data.heatmap].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Find most recent active day
        // If today has data, start from today. If today 0, check yesterday.
        // If yesterday 0, streak is 0 (unless we allow gaps, but standard practice is strict).

        let currentStreak = 0;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Helper to get count from entry
        const getCount = (entry: any) => {
            if (subject === 'ALL') return entry.questions_solved;
            if (subject === 'QUANT') return entry.quant_solved;
            return entry.reasoning_solved;
        };

        // Check if we have an entry for today or yesterday to start the chain
        const todayEntry = sorted.find(d => d.date === todayStr);
        const yesterdayEntry = sorted.find(d => d.date === yesterdayStr);

        const hasToday = todayEntry && getCount(todayEntry) > 0;
        const hasYesterday = yesterdayEntry && getCount(yesterdayEntry) > 0;

        if (!hasToday && !hasYesterday) {
            return 0;
        }

        // Start counting
        // We iterate through sorted dates. 
        // We need them to be consecutive.

        // Create a map for O(1) lookup
        const dateMap = new Map(sorted.map(d => [d.date, d]));

        // Determine start date for check
        // If today active, start today. Else yesterday.
        let checkDate = new Date(hasToday ? today : yesterday);

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const entry = dateMap.get(dateStr);

            if (entry && getCount(entry) > 0) {
                currentStreak++;
                // Move to previous day
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return currentStreak;
    };

    const streak = calculateStreak(selectedSubject);
    const maxStreak = data.user.stats?.max_streak || 0;


    // 2. Filter Topic Stats
    // "Quant" in DB might be "Quantitative Aptitude" etc.
    const filteredTopicStats = data.topic_stats.filter((t: any) => {
        if (selectedSubject === 'ALL') return true;
        const normalized = normalizeSubject(t.subject);
        return normalized === selectedSubject;
    });

    // 3. Stats Calculation (remains same logic, just using robust filtered list)
    const filteredTotalSolved = filteredTopicStats.reduce((acc: any, t: any) => acc + t.correct, 0);
    const filteredTotalQuestions = filteredTopicStats.reduce((acc: any, t: any) => acc + t.total, 0);
    const filteredAccuracy = filteredTotalQuestions > 0 ? filteredTotalSolved / filteredTotalQuestions : 0;


    // 4. Filter Recent Activity
    const filteredRecentAttempts = data.recent_attempts.filter((attempt: any) => {
        if (selectedSubject === 'ALL') return true;

        // Check topic/subject from question data if available
        const qData = typeof attempt.question_id === 'object' ? attempt.question_id : null;
        const section = qData?.source?.section || '';
        const subject = attempt.subject || ''; // Fallback if API provides it flattened

        const normalizedSection = normalizeSubject(section);
        const normalizedSubject = normalizeSubject(subject);

        return normalizedSection === selectedSubject || normalizedSubject === selectedSubject;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header activePage="dashboard" />

            {/* Empty state for new users */}
            {isNewUser ? (
                <main className="max-w-3xl mx-auto px-4 md:px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🚀</div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#E6E1E5] mb-4">Welcome to your Dashboard!</h1>
                    <p className="text-[#938F99] mb-10 text-lg leading-relaxed">
                        Your stats, streaks, and analytics will appear here once you start solving questions.<br />
                        Go solve your first problem to get started!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/problems" className="px-8 py-4 bg-[#FFB951] text-[#452B00] font-medium rounded-full hover:bg-[#FFB951]/90 transition-colors shadow-sm">
                            Browse Problems
                        </a>
                        <a href="/sprint" className="px-8 py-4 bg-[#36343B] text-[#E6E1E5] font-medium rounded-full hover:bg-[#4A4458] transition-colors border border-transparent">
                            Try Sprint Mode
                        </a>
                    </div>
                </main>
            ) : (

                <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">

                    {/* 1. Hero Section */}
                    <DailyProgressHero
                        dailyGoal={data.daily_progress?.daily_goal || (data.user?.preferences?.daily_quant_goal || 0) + (data.user?.preferences?.daily_reasoning_goal || 0) || 20}
                        dailySolved={data.daily_progress?.questions_solved || 0}
                        quantGoal={data.daily_progress?.quant_goal || data.user?.preferences?.daily_quant_goal || 10}
                        quantSolved={data.daily_progress?.quant_solved || 0}
                        reasoningGoal={data.daily_progress?.reasoning_goal || data.user?.preferences?.daily_reasoning_goal || 10}
                        reasoningSolved={data.daily_progress?.reasoning_solved || 0}
                        streak={streak}
                        maxStreak={maxStreak}
                        weakTopicsQuant={data.topic_stats
                            .filter((t: any) => t.accuracy < 0.6 && t.total > 0 && normalizeSubject(t.subject) === 'QUANT')
                            .slice(0, 3)
                            .map((t: any) => ({
                                topic: t.display_name,
                                accuracy: t.accuracy,
                                questionCount: t.total
                            }))}
                        weakTopicsReasoning={data.topic_stats
                            .filter((t: any) => t.accuracy < 0.6 && t.total > 0 && normalizeSubject(t.subject) === 'REASONING')
                            .slice(0, 3)
                            .map((t: any) => ({
                                topic: t.display_name,
                                accuracy: t.accuracy,
                                questionCount: t.total
                            }))}
                    />

                    {/* Row 2: Stats + Heatmap */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <Statistics
                                className="h-full"
                                accuracy={filteredAccuracy}
                                total_solved={filteredTotalSolved}
                                streak={streak}
                                max_streak={maxStreak}
                                sprint_discipline={data.advanced_insights?.sprint_discipline || 0}
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <Heatmap
                                data={data.heatmap}
                                active_days={data.heatmap.length}
                                max_streak={maxStreak}
                                selectedSubject={selectedSubject}
                                onSubjectChange={setSelectedSubject}
                            />
                        </div>
                    </div>

                    {/* Row 3: Topic Performance + Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-1">
                            <TopicPerformance stats={filteredTopicStats} selectedSubject={selectedSubject} className="h-full" />
                        </div>
                        <div className="lg:col-span-1">
                            <RecentActivity attempts={filteredRecentAttempts} className="h-full" />
                        </div>
                    </div>

                </main>
            )}
        </div>
    );
}
