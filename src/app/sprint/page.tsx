"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    CalculateOutlinedIcon,
    PsychologyOutlinedIcon,
    BoltIcon,
    CheckCircleOutlinedIcon,
    PlayArrowIcon,
    TrendingUpIcon,
    TuneIcon,
    ExpandLessIcon,
    ExpandMoreIcon,
} from '@/components/icons';
import Header from '@/components/layout/Header';

interface Topic {
    id: string;
    name: string;
    code: string;
    questionCount: number;
}

type Subject = 'QUANT' | 'REASONING';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const DIFFICULTY_CONFIG = {
    EASY: { label: 'Easy', timePerQ: 40 },
    MEDIUM: { label: 'Medium', timePerQ: 30 },
    HARD: { label: 'Hard', timePerQ: 25 }
};

function SprintSetupContent() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    const [subject, setSubject] = useState<Subject>('QUANT');
    // derived 'topics' variable is defined below
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
    const [questionCount, setQuestionCount] = useState<number>(10);
    const [isStarting, setIsStarting] = useState(false);
    const [showAllTopics, setShowAllTopics] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock history data (replace with API call later)
    const [history, setHistory] = useState<any[]>([]);

    // Hardcoded topics to match Problems Page exactly
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

    // Derived state
    const topics = subject === 'QUANT'
        ? quantTopics.map(t => ({ id: t, name: t, code: t, questionCount: 0 }))
        : reasoningTopics.map(t => ({ id: t, name: t, code: t, questionCount: 0 }));

    useEffect(() => {
        // Reset selection when subject changes
        setSelectedTopics([]);

        // Fetch Recent History
        const fetchRecentHistory = async () => {
            try {
                const res = await fetch('/api/sprint/history?limit=3');
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (err) {
                console.error("Failed to fetch recent history", err);
            }
        };
        fetchRecentHistory();
    }, [subject]);

    // Removed fetchTopics as we use static lists now


    const toggleTopic = (topicCode: string) => {
        if (topicCode === 'All') {
            // Toggle between ALL marker and empty selection
            if (selectedTopics.includes('ALL')) {
                setSelectedTopics([]);
            } else {
                // Set special 'ALL' marker that tells API to skip pattern filtering
                setSelectedTopics(['ALL']);
            }
            return;
        }

        setSelectedTopics(prev => {
            // If coming from ALL state, start fresh with this topic
            if (prev.includes('ALL')) {
                return [topicCode];
            }

            const newSelection = prev.includes(topicCode)
                ? prev.filter(t => t !== topicCode)
                : [...prev, topicCode];

            return newSelection;
        });
    };



    const handleStartSprint = async () => {
        if (selectedTopics.length === 0) return;

        setIsStarting(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                subject,
                topics: selectedTopics.join(','),
                difficulty,
                count: questionCount.toString()
            });

            const res = await fetch(`/api/sprint?${params.toString()}`);
            const data = await res.json();

            if (data.success && data.questions && data.questions.length > 0) {
                sessionStorage.setItem('sprintSession', JSON.stringify({
                    sprintId: data.sprintId,
                    questionIds: data.questions.map((q: any) => q._id),
                    questions: data.questions,
                    currentIndex: 0,
                    subject: data.subject,
                    difficulty: data.difficulty,
                    totalTimeAllowed: data.totalTimeAllowed,
                    timePerQuestion: DIFFICULTY_CONFIG[difficulty].timePerQ,
                    startTime: Date.now()
                }));

                router.push(`/problems/${data.questions[0]._id}?section=${subject}&sprint=true`);
            } else {
                setError(data.error || 'Failed to start sprint - No questions found');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to start sprint');
        } finally {
            setIsStarting(false);
        }
    };




    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    const visibleTopics = showAllTopics ? topics : topics.slice(0, 16); // Show more initially

    // Style constants reused from Problems Page
    const isQuant = subject === 'QUANT';

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans selection:bg-amber-500/30">
            {/* Header */}
            <Header activePage="sprint" />

            <main className="w-full px-6 lg:px-12 py-8">
                {/* Section Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <BoltIcon sx={{ fontSize: '2.5rem' }} className="text-amber-500" />
                            Sprint Mode
                        </h1>
                        <p className="text-neutral-400 text-lg">High-intensity practice sessions to build speed and accuracy.</p>
                    </div>

                    {/* Subject Selection Moved Here */}
                    <div className="inline-flex p-1.5 bg-[#1a1a1a] rounded-[20px] border border-neutral-800 self-start md:self-center">
                        <button
                            onClick={() => { setSubject('QUANT'); setSelectedTopics([]); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${subject === 'QUANT'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <CalculateOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                            Quantitative
                        </button>
                        <button
                            onClick={() => { setSubject('REASONING'); setSelectedTopics([]); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${subject === 'REASONING'
                                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <PsychologyOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                            Reasoning
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                    {/* LEFT COLUMN */}
                    <div className="space-y-8">



                        {/* 2. Topic Selection (Matched to Problems Page) */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Select Topics to Practice</h2>

                            </div>

                            <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6 min-h-[200px]">
                                {topics.length > 0 ? (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {visibleTopics.map(topic => (
                                                <button
                                                    key={topic.code}
                                                    onClick={() => toggleTopic(topic.code)}
                                                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${(topic.code === 'All' ? selectedTopics.includes('ALL') : selectedTopics.includes(topic.code))
                                                        ? subject === 'QUANT'
                                                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                            : 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                                                        : 'bg-neutral-800/50 text-neutral-400 border-transparent hover:bg-neutral-800 hover:text-neutral-200'
                                                        }`}
                                                >
                                                    {topic.name}
                                                </button>
                                            ))}
                                            {topics.length > 16 && (
                                                <button
                                                    onClick={() => setShowAllTopics(!showAllTopics)}
                                                    className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1 transition-colors ${subject === 'QUANT' ? 'text-amber-500 hover:text-amber-400' : 'text-violet-500 hover:text-violet-400'}`}
                                                >
                                                    {showAllTopics ? <>Less <ExpandLessIcon sx={{ fontSize: '1rem' }} /></> : <>+{topics.length - 16} more <ExpandMoreIcon sx={{ fontSize: '1rem' }} /></>}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-neutral-500 py-10">
                                        <p>No topics available for this subject.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Sprint History (New Section) */}
                        <div className="pt-4 border-t border-neutral-800">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Recent Sprint History</h2>
                                <Link
                                    href="/sprint/history"
                                    className="text-xs font-medium text-neutral-500 hover:text-white transition-colors"
                                >
                                    View All Submissions
                                </Link>
                            </div>

                            {/* Placeholder for History List - Will implement full fetching in History page, simple preview here */}
                            <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden">
                                {history.length === 0 ? (
                                    <div className="p-8 text-center text-neutral-500">
                                        <p className="text-sm">No recent sprints found. Start your first sprint!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-800">
                                        {history.map((h, i) => (
                                            <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-800/30">
                                                <div>
                                                    <p className="text-sm font-medium text-white">Sprint #{1000 + i}</p>
                                                    <p className="text-xs text-neutral-500">{formatDate(h.createdAt)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-emerald-400">{h.accuracy}%</p>
                                                    <p className="text-xs text-neutral-500">Accuracy</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Configuration) */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 sticky top-24 shadow-2xl shadow-black/50">
                            <div className="flex items-center gap-2 mb-4 text-white pb-3 border-b border-neutral-800">
                                <TuneIcon sx={{ fontSize: '1.2rem' }} className="text-neutral-400" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">Configuration</h3>
                            </div>

                            {/* Questions Count */}
                            <div className="mb-6">
                                <label className="text-xs text-neutral-500 block mb-2 uppercase tracking-wide font-medium">Number of Questions</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[5, 10, 15, 20].map(count => (
                                        <button
                                            key={count}
                                            onClick={() => setQuestionCount(count)}
                                            className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${questionCount === count
                                                ? subject === 'QUANT'
                                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/50'
                                                    : 'bg-violet-500/10 text-violet-500 border-violet-500/50'
                                                : 'bg-neutral-800/50 text-neutral-500 border-transparent hover:bg-neutral-800'
                                                }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty - Compact Horizontal Grid */}
                            <div className="mb-6">
                                <label className="text-xs text-neutral-500 block mb-2 uppercase tracking-wide font-medium">Difficulty Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(diff => (
                                        <button
                                            key={diff}
                                            onClick={() => setDifficulty(diff)}
                                            className={`py-2 rounded-xl flex flex-col items-center justify-center border transition-all ${difficulty === diff
                                                ? subject === 'QUANT'
                                                    ? 'bg-amber-500/10 border-amber-500/50'
                                                    : 'bg-violet-500/10 border-violet-500/50'
                                                : 'bg-neutral-800/50 border-transparent hover:bg-neutral-800'
                                                }`}
                                        >
                                            <span className={`text-xs font-bold ${difficulty === diff ? 'text-white' : 'text-neutral-400'}`}>
                                                {DIFFICULTY_CONFIG[diff].label}
                                            </span>
                                            <span className={`text-[10px] ${difficulty === diff
                                                ? subject === 'QUANT' ? 'text-amber-400' : 'text-violet-400'
                                                : 'text-neutral-600'
                                                }`}>
                                                {DIFFICULTY_CONFIG[diff].timePerQ}s
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Estimated Time */}
                            <div className="bg-black/40 rounded-xl p-4 mb-6 flex items-center justify-between">
                                <span className="text-neutral-400 text-sm">Est. Duration</span>
                                <span className="text-white font-mono font-bold">
                                    {Math.floor((questionCount * DIFFICULTY_CONFIG[difficulty].timePerQ) / 60)}m {(questionCount * DIFFICULTY_CONFIG[difficulty].timePerQ) % 60}s
                                </span>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            {/* Start Button */}
                            <button
                                onClick={handleStartSprint}
                                disabled={selectedTopics.length === 0 || isStarting}
                                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${subject === 'QUANT'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25'
                                    : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-violet-500/25'
                                    }`}
                            >
                                {isStarting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
                                        Start Sprint
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-neutral-600 mt-3">
                                {selectedTopics.length === 0 ? 'Select at least one topic' : (selectedTopics.includes('ALL') ? 'All topics selected' : `${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''} selected`)}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SprintSetupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-neutral-500">Loading PrepLeague...</div>
            </div>
        }>
            <SprintSetupContent />
        </Suspense>
    );
}
