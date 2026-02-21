"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { AuthActionGuard } from '@/components/auth/AuthActionGuard';

interface Topic {
    id: string;
    name: string;
    code: string;
    questionCount: number;
}

type Subject = 'QUANT' | 'REASONING';
import { DIFFICULTY_CONFIG, Difficulty } from '../../lib/sprint-config';

function SprintSetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading, logout } = useAuth();

    const [subject, setSubject] = useState<Subject>('QUANT');
    // derived 'topics' variable is defined below
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
    const [questionCount, setQuestionCount] = useState<number>(10);
    const [isStarting, setIsStarting] = useState(false);
    const [showAllTopics, setShowAllTopics] = useState(true); // Default show all as requested
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Saved Configurations
    const [savedConfigs, setSavedConfigs] = useState<any[]>([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [configName, setConfigName] = useState('');
    const [saveError, setSaveError] = useState<string | null>(null);

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

    const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

    // Fetch topic statistics on mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats/topics');
                if (res.ok) {
                    const json = await res.json();
                    if (json.data) {
                        setTopicCounts(json.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch topic stats", err);
            }
        };
        fetchStats();
    }, []);

    // Derived state with counts
    const topics = (subject === 'QUANT' ? quantTopics : reasoningTopics).map(t => {
        // Map topic name to DB pattern key (DB likely has "Percentage", "Algebra" etc or lower/mixed)
        // We try exact match first, then lowercase match
        const count = topicCounts[t] || topicCounts[t.toLowerCase()] || 0;
        return {
            id: t,
            name: t,
            code: t,
            questionCount: count
        };
    });

    useEffect(() => {
        // Reset selection and search when subject changes
        setSelectedTopics([]);
        setSearchTerm('');

        // Fetch Recent History
        const fetchRecentHistory = async () => {
            if (!user) {
                setHistory([]);
                return;
            }
            try {
                const res = await fetch('/api/sprint/history?limit=3');
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data.sessions || (Array.isArray(data) ? data : []));
                }
            } catch (err) {
                console.error("Failed to fetch recent history", err);
            }
        };
        fetchRecentHistory();

        // Fetch saved configurations
        const fetchSavedConfigs = async () => {
            if (!user) {
                setSavedConfigs([]);
                return;
            }
            try {
                const res = await fetch(`/api/sprint/configs?subject=${subject}`);
                if (res.ok) {
                    const data = await res.json();
                    setSavedConfigs(data.configs || []);
                }
            } catch (err) {
                console.error("Failed to fetch saved configs", err);
            }
        };
        fetchSavedConfigs();

        // 1. Try to load from URL Search Params first
        const urlSubject = searchParams?.get('subject') as Subject;
        const urlTopics = searchParams?.get('topics');
        const urlDifficulty = searchParams?.get('difficulty') as Difficulty;
        const urlCount = searchParams?.get('count');

        // Only override if the URL subject matches the current selected subject tab
        // Or if this is the initial load and subject might be default 'QUANT'
        if (urlSubject === subject) {
            if (urlTopics) {
                const availableTopics = subject === 'QUANT' ? quantTopics : reasoningTopics;
                // Normalizes by removing spaces, &, and converting to lowercase
                const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

                const topicArr = urlTopics.split(',').map(t => {
                    const trimmed = t.trim();
                    if (trimmed.toUpperCase() === 'ALL') return 'ALL';
                    const normalizedIncoming = normalize(trimmed);
                    const matched = availableTopics.find(at => normalize(at) === normalizedIncoming);
                    return matched || trimmed;
                });

                setSelectedTopics(topicArr.includes('ALL') ? ['ALL'] : topicArr);
            }
            if (urlDifficulty) setDifficulty(urlDifficulty);
            if (urlCount) setQuestionCount(parseInt(urlCount, 10) || 10);

            // If URL params exist and matched subject, don't load from localStorage
            if (urlTopics || urlDifficulty || urlCount) return;
        }

        // 2. Load saved config if exists for this subject (localStorage fallback)
        const savedConfig = localStorage.getItem(`sprintConfig_${subject}`);
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                if (config.difficulty) setDifficulty(config.difficulty);
                if (config.questionCount) setQuestionCount(config.questionCount);
                if (config.topics && Array.isArray(config.topics)) setSelectedTopics(config.topics);
            } catch (e) {
                console.error("Failed to parse saved config", e);
            }
        } else {
            setDifficulty('MEDIUM');
            setQuestionCount(10);
            setSelectedTopics([]);
        }
    }, [subject, user, searchParams]);

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



    const handleSaveConfig = async () => {
        if (!configName.trim()) {
            setSaveError('Please enter a configuration name');
            return;
        }

        if (selectedTopics.length === 0) {
            setSaveError('Please select at least one topic');
            return;
        }

        try {
            const res = await fetch('/api/sprint/configs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: configName,
                    subject,
                    topics: selectedTopics,
                    difficulty,
                    question_count: questionCount
                })
            });

            const data = await res.json();

            if (data.success) {
                setSavedConfigs([...savedConfigs, data.config]);
                setShowSaveModal(false);
                setConfigName('');
                setSaveError(null);
            } else {
                setSaveError(data.error || 'Failed to save configuration');
            }
        } catch (err) {
            setSaveError('Failed to save configuration');
        }
    };

    const handleLoadConfig = async (config: any) => {
        setSubject(config.subject);
        setSelectedTopics(config.topics);
        setDifficulty(config.difficulty);
        setQuestionCount(config.question_count);

        // Update last_used timestamp
        try {
            await fetch('/api/sprint/configs', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: config.name })
            });
        } catch (err) {
            console.error('Failed to update last_used', err);
        }
    };

    const handleDeleteConfig = async (configName: string) => {
        if (!confirm(`Delete configuration "${configName}"?`)) return;

        try {
            const res = await fetch(`/api/sprint/configs?name=${encodeURIComponent(configName)}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setSavedConfigs(savedConfigs.filter(c => c.name !== configName));
            }
        } catch (err) {
            console.error('Failed to delete configuration', err);
        }
    };

    const handleStartSprint = async () => {
        if (selectedTopics.length === 0) return;

        setIsStarting(true);
        setError(null);

        try {
            const res = await fetch('/api/sprint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    topics: selectedTopics,
                    difficulty,
                    questionCount
                })
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(`Sprint creation failed (${res.status}):`, text);
                try {
                    const json = JSON.parse(text);
                    setError(json.error || 'Failed to start sprint');
                } catch {
                    setError(`Failed to start sprint (Server Error ${res.status})`);
                }
                return;
            }

            const data = await res.json();

            if (data.success && data.sessionId) {
                // Redirect to the new dedicated Sprint Session page
                router.push(`/sprint/${data.sessionId}`);
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

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    // if (!user) return null; // Removed for public access

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
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                            Sprint Mode
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">High-intensity practice sessions to build speed and accuracy.</p>
                    </div>

                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <div className="flex p-1 bg-[#1a1a1a] rounded-[20px] border border-neutral-800">
                            <button
                                onClick={() => { setSubject('QUANT'); setSelectedTopics([]); setSearchTerm(''); }}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${subject === 'QUANT'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                <CalculateOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                                Quantitative
                            </button>
                            <button
                                onClick={() => { setSubject('REASONING'); setSelectedTopics([]); setSearchTerm(''); }}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${subject === 'REASONING'
                                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                <PsychologyOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                                Reasoning
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Grid Order Shift: On XL screens right col is 2nd. On small screens we want right col above left col. */}
                <div className="flex flex-col xl:grid xl:grid-cols-[1fr_380px] gap-8">
                    {/* LEFT COLUMN (Topics & History) */}
                    {/* On Default/Mobile: Order 2. On XL: Order 1 */}
                    <div className="space-y-8 order-2 xl:order-1">



                        {/* 2. Topic Selection (Matched to Problems Page) */}
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Select Topics to Practice</h2>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="🔍 Search topics..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full md:w-48 bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {selectedTopics.length > 0 && (
                                        <button
                                            onClick={() => setSelectedTopics([])}
                                            className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1 whitespace-nowrap"
                                        >
                                            ✕ Clear Selection
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6 min-h-[200px]">
                                {topics.length > 0 ? (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {topics
                                                .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.code === 'All') // Only filter visible pills by search
                                                .slice(0, showAllTopics || searchTerm ? undefined : 16) // If searching or "showAll", show all the filtered
                                                .map(topic => {
                                                    // When filtering by search, we may not want "All" to show unless they type "All"
                                                    if (searchTerm && topic.code === 'All' && !'all'.includes(searchTerm.toLowerCase())) return null;

                                                    const isSelected = topic.code === 'All'
                                                        ? selectedTopics.includes('ALL')
                                                        : (selectedTopics.includes('ALL') || selectedTopics.includes(topic.code));

                                                    return (
                                                        <button
                                                            key={topic.code}
                                                            onClick={() => toggleTopic(topic.code)}
                                                            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all flex items-center gap-2 ${isSelected
                                                                ? subject === 'QUANT'
                                                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                                    : 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                                                                : 'bg-neutral-800/50 text-neutral-400 border-transparent hover:bg-neutral-800 hover:text-neutral-200'
                                                                }`}
                                                        >
                                                            {topic.code === 'All' && isSelected && selectedTopics.includes('ALL') ? `All Topics (${topics.length - 1})` : topic.name}
                                                            {isSelected && <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} />}

                                                            {topic.questionCount > 0 && topic.code !== 'All' && (
                                                                <span
                                                                    title={`${topic.questionCount} questions available`}
                                                                    className={`text-sm font-bold px-2 py-0.5 rounded-full ${isSelected
                                                                        ? 'bg-black/20 text-current'
                                                                        : 'bg-neutral-900/50 text-neutral-500'
                                                                        }`}>
                                                                    {topic.questionCount}
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            {topics.length > 16 && !searchTerm && (
                                                <button
                                                    onClick={() => setShowAllTopics(!showAllTopics)}
                                                    className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1 transition-colors ${subject === 'QUANT' ? 'text-amber-500 hover:text-amber-400' : 'text-violet-500 hover:text-violet-400'}`}
                                                >
                                                    {showAllTopics ? <>Show Less <ExpandLessIcon sx={{ fontSize: '1rem' }} /></> : <>Show All ({topics.length}) <ExpandMoreIcon sx={{ fontSize: '1rem' }} /></>}
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

                            <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden">
                                {history.length === 0 ? (
                                    <div className="p-8 text-center text-neutral-500">
                                        <p className="text-sm">No recent sprints found. Start your first sprint!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-800/50">
                                        {history.map((h, i) => (
                                            <div key={h.id || i} className="p-5 grid grid-cols-12 gap-4 items-center hover:bg-neutral-800/30 transition-colors group">
                                                <div className="col-span-4">
                                                    <p className="text-sm font-medium text-neutral-200">{formatDate(h.createdAt)}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${h.subject === 'QUANT'
                                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                            : 'bg-violet-500/10 text-violet-500 border-violet-500/20'}`}>
                                                            {h.subject}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-500 font-medium">#{h.id?.slice(-4).toUpperCase() || (1000 + i)}</span>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 hidden sm:block">
                                                    <p className="text-[10px] text-neutral-500 mb-0.5 uppercase tracking-wide">Score</p>
                                                    <div className="flex items-baseline gap-0.5">
                                                        <span className="text-sm font-bold text-white">{h.score}</span>
                                                        <span className="text-[10px] text-neutral-600">/{h.totalQuestions}</span>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 hidden sm:block">
                                                    <p className="text-[10px] text-neutral-500 mb-0.5 uppercase tracking-wide">Accuracy</p>
                                                    <p className={`text-sm font-bold ${h.accuracy >= 70 ? 'text-emerald-400' : h.accuracy >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {h.accuracy}%
                                                    </p>
                                                </div>

                                                <div className="col-span-2 hidden md:block">
                                                    <p className="text-[10px] text-neutral-500 mb-0.5 uppercase tracking-wide">Time</p>
                                                    <p className="text-sm font-mono text-neutral-300">{formatTime(h.timeTaken)}</p>
                                                </div>

                                                <div className="col-span-2 flex justify-end">
                                                    <Link
                                                        href={`/sprint/${h.id}/review`}
                                                        className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-all"
                                                    >
                                                        Review
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Configuration) */}
                    {/* On Default/Mobile: Order 1. On XL: Order 2 */}
                    <div className="space-y-6 order-1 xl:order-2">
                        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 xl:sticky xl:top-24 shadow-2xl shadow-black/50">
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
                                <div className="grid grid-cols-4 gap-2">
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
                            <div className="bg-black/40 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-neutral-400 text-sm">Est. Duration</span>
                                    <span className="text-white font-mono font-bold">
                                        {Math.floor((questionCount * DIFFICULTY_CONFIG[difficulty].timePerQ) / 60)}m {(questionCount * DIFFICULTY_CONFIG[difficulty].timePerQ) % 60}s
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-500 text-right">
                                    ({questionCount} questions × {DIFFICULTY_CONFIG[difficulty].timePerQ}s)
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-neutral-500 italic">
                                    💡 Tip: Accuracy matters more than speed!
                                </div>
                            </div>


                            {/* Saved Configurations */}
                            {user && (
                                <div className="mb-6 space-y-3">
                                    {/* Load Configuration Dropdown */}
                                    {savedConfigs.length > 0 && (
                                        <div>
                                            <label className="text-xs text-neutral-500 block mb-2 uppercase tracking-wide font-medium">Load Saved Preset</label>
                                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                                {savedConfigs.map((config: any) => (
                                                    <div key={config.name} className="flex items-center gap-2 bg-neutral-800/30 p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                                                        <button
                                                            onClick={() => handleLoadConfig(config)}
                                                            className="flex-1 text-left text-xs text-neutral-300 hover:text-white transition-colors"
                                                        >
                                                            <div className="font-medium">{config.name}</div>
                                                            <div className="text-[10px] text-neutral-500">
                                                                {config.subject} • {config.difficulty} • {config.question_count}Q • {config.topics.length} topics
                                                            </div>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteConfig(config.name)}
                                                            className="text-rose-500 hover:text-rose-400 transition-colors p-1"
                                                            title="Delete configuration"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Configuration Button */}
                                    <button
                                        onClick={() => {
                                            if (selectedTopics.length === 0) {
                                                setError('Please select at least one topic before saving');
                                                return;
                                            }
                                            setShowSaveModal(true);
                                            setSaveError(null);
                                        }}
                                        disabled={savedConfigs.length >= 5}
                                        className={`w-full text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all border ${savedConfigs.length >= 5
                                            ? 'bg-neutral-800/30 text-neutral-600 border-neutral-800 cursor-not-allowed'
                                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border-neutral-700'
                                            }`}
                                        title={savedConfigs.length >= 5 ? 'Maximum 5 configurations allowed' : 'Save current settings as a preset'}
                                    >
                                        {savedConfigs.length >= 5 ? 'Max Presets Reached (5/5)' : `💾 Save as Preset (${savedConfigs.length}/5)`}
                                    </button>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            {/* Start Button */}
                            <AuthActionGuard>
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
                                            {selectedTopics.length === 0 ? 'Select Topics to Start' : 'Start Sprint'}
                                        </>
                                    )}
                                </button>
                            </AuthActionGuard>
                            <div className="text-center mt-3">
                                {selectedTopics.length === 0 ? (
                                    <p className="text-xs text-amber-500 font-medium flex items-center justify-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        Select at least one topic
                                    </p>
                                ) : (
                                    <p className="text-xs text-emerald-500 font-medium flex items-center justify-center gap-1">
                                        <CheckCircleOutlinedIcon sx={{ fontSize: '0.9rem' }} />
                                        Ready! {selectedTopics.includes('ALL') ? `All ${topics.length - 1} topics` : `${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''}`} selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            {/* Mobile Sticky Action Bar */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#1a1a1a]/90 backdrop-blur-md border-t border-neutral-800 z-40">
                <AuthActionGuard>
                    <button
                        onClick={handleStartSprint}
                        disabled={selectedTopics.length === 0 || isStarting}
                        className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${subject === 'QUANT'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/25'
                            : 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-violet-500/25'
                            }`}
                    >
                        {isStarting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
                                {selectedTopics.length === 0 ? 'Select Topics to Start' : 'Start Sprint'}
                            </>
                        )}
                    </button>
                </AuthActionGuard>
            </div>
            {/* Spacer for mobile action bar */}
            <div className="h-24 xl:hidden"></div>

            {/* Save Configuration Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Save Sprint Configuration</h3>

                        <div className="mb-4">
                            <label className="text-xs text-neutral-400 block mb-2">Configuration Name</label>
                            <input
                                type="text"
                                value={configName}
                                onChange={(e) => setConfigName(e.target.value)}
                                placeholder="e.g., My Daily Practice"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveConfig();
                                    if (e.key === 'Escape') {
                                        setShowSaveModal(false);
                                        setConfigName('');
                                        setSaveError(null);
                                    }
                                }}
                            />
                        </div>

                        <div className="mb-4 p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                            <div className="text-xs text-neutral-500 space-y-1">
                                <div><span className="text-neutral-400 font-medium">Subject:</span> {subject}</div>
                                <div><span className="text-neutral-400 font-medium">Difficulty:</span> {difficulty}</div>
                                <div><span className="text-neutral-400 font-medium">Questions:</span> {questionCount}</div>
                                <div><span className="text-neutral-400 font-medium">Topics:</span> {selectedTopics.includes('ALL') ? 'All' : selectedTopics.length}</div>
                            </div>
                        </div>

                        {saveError && (
                            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
                                {saveError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowSaveModal(false);
                                    setConfigName('');
                                    setSaveError(null);
                                }}
                                className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveConfig}
                                disabled={!configName.trim()}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${configName.trim()
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/25'
                                    : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                    }`}
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
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
