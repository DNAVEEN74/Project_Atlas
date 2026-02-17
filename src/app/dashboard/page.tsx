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
import DifficultyBreakdown from '@/components/dashboard/DifficultyBreakdown';

interface DashboardData {
    user: any;
    daily_progress: any;
    heatmap: any[];
    topic_stats: any[];
    recent_attempts: any[];
    difficulty_stats: any;
    difficulty_stats_raw?: any[];
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    // State for global filter
    const [selectedSubject, setSelectedSubject] = useState<'ALL' | 'QUANT' | 'REASONING'>('ALL');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading, router]);

    const fetchDashboardData = async () => {
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
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user || !data) return null;



    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user || !data) return null;

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
        let checkDate = hasToday ? today : yesterday;

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
    const filteredTotalSolved = filteredTopicStats.reduce((acc, t) => acc + t.correct, 0);
    const filteredTotalQuestions = filteredTopicStats.reduce((acc, t) => acc + t.total, 0);
    const filteredAccuracy = filteredTotalQuestions > 0 ? filteredTotalSolved / filteredTotalQuestions : 0;

    const filteredTimeWeight = filteredTopicStats.reduce((acc, t: any) => acc + ((t.avg_time_ms || 0) * t.total), 0);
    const filteredAvgTime = filteredTotalQuestions > 0 ? filteredTimeWeight / filteredTotalQuestions : 0;


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


    // 5. Filter Difficulty Stats
    // Aggregate from raw subject-wise stats if available, otherwise fallback to global
    // Data structure: Array of { _id: { difficulty, subject }, total, correct }
    const difficultyRaw = data.difficulty_stats_raw || [];

    const filteredDifficultyStats = ['EASY', 'MEDIUM', 'HARD'].reduce((acc, level) => {
        // Find all entries matching level and subject
        const matches = difficultyRaw.filter((d: any) => {
            const isLevel = d._id.difficulty === level;
            if (!isLevel) return false;

            if (selectedSubject === 'ALL') return true;
            return normalizeSubject(d._id.subject) === selectedSubject;
        });

        const total = matches.reduce((sum: number, d: any) => sum + d.total, 0);
        const correct = matches.reduce((sum: number, d: any) => sum + d.correct, 0);
        // Avoid NaN
        const accuracy = total > 0 ? correct / total : 0;

        acc[level] = { total, correct, accuracy };
        return acc;
    }, {} as Record<string, { total: number, correct: number, accuracy: number }>);


    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            <Header activePage="dashboard" />

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">

                {/* 1. Hero Section */}
                <DailyProgressHero
                    dailyGoal={data.daily_progress?.daily_goal || (data.user?.preferences?.daily_quant_goal || 0) + (data.user?.preferences?.daily_reasoning_goal || 0) || 20}
                    dailySolved={data.daily_progress?.questions_solved || 0}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Main Stats) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 2. Key Statistics Grid - UPDATED with filtered stats */}
                        <Statistics
                            accuracy={filteredAccuracy}
                            avg_time_ms={filteredAvgTime}
                            total_solved={filteredTotalSolved}
                            streak={streak}
                            max_streak={maxStreak}
                        />

                        {/* 3. Heatmap - Controlled Component */}
                        <Heatmap
                            data={data.heatmap}
                            active_days={data.heatmap.length}
                            max_streak={maxStreak}
                            selectedSubject={selectedSubject}
                            onSubjectChange={setSelectedSubject}
                        />


                        {/* 4. Recent Activity - Filtered */}
                        <RecentActivity attempts={filteredRecentAttempts} />

                    </div>

                    {/* Right Column (Actions & Details) */}
                    <div className="space-y-6">

                        {/* 5. Topic Performance - Filtered */}
                        <TopicPerformance stats={filteredTopicStats} selectedSubject={selectedSubject} />

                        {/* 6. Difficulty Breakdown */}
                        {/* Now correctly filtered using raw data aggregation */}
                        <DifficultyBreakdown stats={filteredDifficultyStats} isGlobal={false} />

                    </div>
                </div>

            </main>
        </div>
    );
}
