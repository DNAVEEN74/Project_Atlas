"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { PatternInfo, quantPatterns, reasoningPatterns } from '@/data/explanations-data';
import {
    SchoolOutlinedIcon,
    ArrowForwardIcon,
    EmojiEventsOutlinedIcon,
    LightbulbOutlinedIcon,
    LockOutlinedIcon,
    CheckCircleOutlinedIcon
} from '@/components/icons';
import Header from '@/components/layout/Header';

// ==========================================
// FEATURED HERO COMPONENT
// ==========================================
function ExplanationsHero({ activeTab, setActiveTab }: { activeTab: 'quant' | 'reasoning', setActiveTab: (tab: 'quant' | 'reasoning') => void }) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-neutral-800 mb-12 shadow-2xl">
            {/* Ambient Background - Dynamic Colors */}
            <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none transition-colors duration-700 ${activeTab === 'quant' ? 'bg-amber-500/10' : 'bg-violet-600/10'}`} />
            <div className={`absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none transition-colors duration-700 ${activeTab === 'quant' ? 'bg-orange-600/10' : 'bg-purple-600/10'}`} />

            <div className="relative z-10 px-8 py-12 lg:py-16 text-center max-w-5xl mx-auto">
                <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full mb-8 backdrop-blur-md transition-colors duration-500 ${activeTab === 'quant' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-violet-500/10 border-violet-500/20 text-violet-400'}`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${activeTab === 'quant' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                    <span className="text-xs font-semibold tracking-wide uppercase">New Curriculum 2025</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                    Conceptual <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-700 ${activeTab === 'quant' ? 'from-amber-400 to-orange-600' : 'from-violet-400 to-purple-600'}`}>Deep Dives</span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
                    Build intuitive mental models through our visual, story-first explanations. <br />
                    Select a track below to start your journey.
                </p>

                {/* Tab Switcher */}
                <div className="inline-flex p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-xl">
                    {/* Sliding Background */}
                    <div
                        className={`absolute top-1.5 bottom-1.5 rounded-xl bg-neutral-800 transition-all duration-300 shadow-md ${activeTab === 'quant' ? 'left-1.5 w-[160px]' : 'left-[170px] w-[170px]'}`}
                    />

                    <button
                        onClick={() => setActiveTab('quant')}
                        className={`relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-[160px] justify-center ${activeTab === 'quant' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        <EmojiEventsOutlinedIcon sx={{ fontSize: '1.2rem' }} className={`transition-colors duration-300 ${activeTab === 'quant' ? 'text-amber-500' : 'text-neutral-600'}`} />
                        Quant
                    </button>
                    <button
                        onClick={() => setActiveTab('reasoning')}
                        className={`relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-[170px] justify-center ${activeTab === 'reasoning' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        <LightbulbOutlinedIcon sx={{ fontSize: '1.2rem' }} className={`transition-colors duration-300 ${activeTab === 'reasoning' ? 'text-violet-500' : 'text-neutral-600'}`} />
                        Reasoning
                    </button>
                </div>
            </div>

            {/* Stats Footer */}
            <div className="border-t border-neutral-800/50 bg-black/20 backdrop-blur-sm grid grid-cols-3 divide-x divide-neutral-800/50">
                <div className="py-4 text-center group">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${activeTab === 'quant' ? 'group-hover:text-amber-500' : 'group-hover:text-violet-500'} text-white`}>
                        {activeTab === 'quant' ? quantPatterns.length : reasoningPatterns.length}
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">Concepts</div>
                </div>
                <div className="py-4 text-center group">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${activeTab === 'quant' ? 'group-hover:text-amber-500' : 'group-hover:text-violet-500'} text-white`}>
                        {activeTab === 'quant' ? '5' : '4'}
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">Phases</div>
                </div>
                <div className="py-4 text-center group">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${activeTab === 'quant' ? 'group-hover:text-amber-500' : 'group-hover:text-violet-500'} text-white`}>
                        Free
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">Access</div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// TOPIC CARD COMPONENT
// ==========================================
function TopicCard({ pattern, index, category }: { pattern: PatternInfo, index: number, category: 'quant' | 'reasoning' }) {
    const isQuant = category === 'quant';
    const bgHover = isQuant ? 'group-hover:border-amber-500/50' : 'group-hover:border-violet-500/50';
    const iconColor = isQuant ? 'text-amber-400' : 'text-violet-400';
    const glowColor = isQuant ? 'group-hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' : 'group-hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]';

    // Future: Check locked state here
    const isLocked = false;

    return (
        <Link
            href={isLocked ? '#' : `/explanations/${pattern.slug}`}
            className={`group relative flex flex-col p-5 bg-[#181818] border border-neutral-800 hover:border-neutral-700/80 rounded-2xl transition-all duration-300 ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : `${bgHover} ${glowColor} hover:-translate-y-1`}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center border border-neutral-800 group-hover:bg-[#252525] transition-colors ${iconColor}`}>
                    {isLocked
                        ? <LockOutlinedIcon sx={{ fontSize: '1.2rem' }} className="text-neutral-500" />
                        : (category === 'quant'
                            ? <EmojiEventsOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                            : <LightbulbOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                        )
                    }
                </div>
                {pattern.prerequisites.length > 0 && (
                    <span className="px-2 py-1 rounded bg-[#222] border border-neutral-800 text-[10px] font-mono text-neutral-500">
                        {String(pattern.order).padStart(2, '0')}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neutral-100 transition-colors">
                {pattern.name}
            </h3>

            <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                {pattern.description}
            </p>

            <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="w-0 h-full bg-neutral-600" /> {/* Mock progress for now */}
                    </div>
                    <span className="text-[10px] text-neutral-500">0%</span>
                </div>

                <span className={`text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ${iconColor} -translate-x-2 group-hover:translate-x-0`}>
                    Start <ArrowForwardIcon sx={{ fontSize: '0.8rem' }} />
                </span>
            </div>
        </Link>
    );
}

// ==========================================
// PHASE SECTION COMPONENT
// ==========================================
function PhaseSection({
    title,
    description,
    patterns,
    phaseNumber,
    category
}: {
    title: string,
    description: string,
    patterns: PatternInfo[],
    phaseNumber: number,
    category: 'quant' | 'reasoning'
}) {
    const isQuant = category === 'quant';
    const lineColor = isQuant ? 'bg-amber-500' : 'bg-violet-500';
    const textColor = isQuant ? 'text-amber-500' : 'text-violet-500';
    const borderColor = isQuant ? 'border-amber-500' : 'border-violet-500';

    return (
        <div className="relative pl-0 md:pl-8 lg:pl-0 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: `${phaseNumber * 100}ms` }}>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Visual Timeline (Desktop) */}
                <div className="hidden lg:block w-px bg-neutral-800 absolute left-[300px] top-0 bottom-0" />

                {/* Phase Header */}
                <div className="lg:w-[300px] shrink-0 relative lg:pr-8 py-4">
                    <div className={`hidden lg:block absolute right-[-5px] top-8 w-2.5 h-2.5 rounded-full ${lineColor} shadow-[0_0_10px_2px_rgba(0,0,0,0.5)] z-10 transition-colors duration-500`} />

                    <div className="sticky top-28">
                        <div className={`inline-block px-2 py-0.5 rounded border ${borderColor} ${textColor} bg-neutral-900 text-[10px] font-bold uppercase tracking-widest mb-3`}>
                            Phase 0{phaseNumber}
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                            {description}
                        </p>
                        <div className="text-xs font-mono text-neutral-600">
                            {patterns.length} Modules
                        </div>
                    </div>
                </div>

                {/* Topics Grid */}
                <div className="lg:flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 z-10">
                    {patterns.map((pattern, idx) => (
                        <TopicCard key={pattern.slug} pattern={pattern} index={idx} category={category} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function ExplanationsPage() {
    const [activeTab, setActiveTab] = useState<'quant' | 'reasoning'>('quant');

    // Group patterns based on active tab
    const quantPhases = [
        { id: 1, title: "The Foundation", desc: "Absolute prerequisites. Mastery of these calculation techniques is mandatory before proceeding.", patterns: quantPatterns.filter(p => p.phase === 1) },
        { id: 2, title: "Percentage Family", desc: "The 'Heart of Arithmetic'. Learn to view the world through percentages and parts.", patterns: quantPatterns.filter(p => p.phase === 2) },
        { id: 3, title: "Ratio Family", desc: "The 'Art of Comparison'. Solving complex work, mixture, and distance problems using ratios.", patterns: quantPatterns.filter(p => p.phase === 3) },
        { id: 4, title: "Advanced Maths", desc: "Pure mathematics. Geometry, Algebra, and Trigonometry require visualization and formula mastery.", patterns: quantPatterns.filter(p => p.phase === 4) },
        { id: 5, title: "Data Interpretation", desc: "The final boss. Applying all your arithmetic skills to analyze charts and tables.", patterns: quantPatterns.filter(p => p.phase === 5) },
    ];

    const reasoningPhases = [
        { id: 1, title: "Alphabet & Coding", desc: "Logic based on letter positions and number series.", patterns: reasoningPatterns.filter(p => p.phase === 1) },
        { id: 2, title: "Visual Reasoning", desc: "Non-verbal logic. Testing your ability to visualize shapes and patterns.", patterns: reasoningPatterns.filter(p => p.phase === 2) },
        { id: 3, title: "Analytical Logic", desc: "Critical thinking. Deductive reasoning using Syllogisms and Statements.", patterns: reasoningPatterns.filter(p => p.phase === 3) },
        { id: 4, title: "Real-world Logic", desc: "Everyday logical problems involving blood relations, direction, and time.", patterns: reasoningPatterns.filter(p => p.phase === 4) },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Reusing Global Header */}
            <Header activePage="explanations" />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 pb-32">
                <ExplanationsHero activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* QUANT TRACK */}
                {activeTab === 'quant' && (
                    <section id="quant-track" className="mb-32 animate-in fade-in duration-500">
                        {quantPhases.map(phase => (
                            <PhaseSection
                                key={phase.id}
                                title={phase.title}
                                description={phase.desc}
                                patterns={phase.patterns}
                                phaseNumber={phase.id}
                                category="quant"
                            />
                        ))}
                    </section>
                )}

                {/* REASONING TRACK */}
                {activeTab === 'reasoning' && (
                    <section id="reasoning-track" className="mb-32 animate-in fade-in duration-500">
                        {reasoningPhases.map(phase => (
                            <PhaseSection
                                key={phase.id}
                                title={phase.title}
                                description={phase.desc}
                                patterns={phase.patterns}
                                phaseNumber={phase.id}
                                category="reasoning"
                            />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
