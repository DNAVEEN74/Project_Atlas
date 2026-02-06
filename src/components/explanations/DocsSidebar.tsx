'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { quantPatterns, reasoningPatterns, PatternInfo } from '@/data/explanations-data';
import {
    SearchIcon,
    MenuIcon,
    CloseIcon
} from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// COLOR SCHEMES - Unified per category
// ============================================
const colorSchemes = {
    quant: {
        primary: 'text-amber-500',
        primaryBg: 'bg-amber-500',
        primaryBgSubtle: 'bg-amber-500/10',
        primaryBorder: 'border-amber-500/20',
        primaryHover: 'hover:bg-amber-500/10',
        activeBg: 'bg-amber-500/15',
        activeBorder: 'border-amber-500',
        activeText: 'text-amber-400',
        switchActive: 'bg-amber-500 text-black',
        switchInactive: 'text-neutral-400 hover:text-neutral-200',
    },
    reasoning: {
        primary: 'text-violet-500',
        primaryBg: 'bg-violet-500',
        primaryBgSubtle: 'bg-violet-500/10',
        primaryBorder: 'border-violet-500/20',
        primaryHover: 'hover:bg-violet-500/10',
        activeBg: 'bg-violet-500/15',
        activeBorder: 'border-violet-500',
        activeText: 'text-violet-400',
        switchActive: 'bg-violet-500 text-white',
        switchInactive: 'text-neutral-400 hover:text-neutral-200',
    }
};

// Phase groupings
const quantPhases = [
    { id: 1, title: 'Foundation', desc: 'Core calculation skills' },
    { id: 2, title: 'Percentage Family', desc: 'Profit, loss, interest' },
    { id: 3, title: 'Ratio Family', desc: 'Work, speed, mixtures' },
    { id: 4, title: 'Advanced Maths', desc: 'Algebra, geometry, trig' },
    { id: 5, title: 'Data Interpretation', desc: 'Charts and tables' },
];

const reasoningPhases = [
    { id: 1, title: 'Alphabet & Coding', desc: 'Letter and number patterns' },
    { id: 2, title: 'Visual Reasoning', desc: 'Figures and shapes' },
    { id: 3, title: 'Analytical Logic', desc: 'Syllogism and statements' },
    { id: 4, title: 'Real-world Logic', desc: 'Direction, relations, time' },
];

// ============================================
// SIDEBAR COMPONENT
// ============================================
interface DocsSidebarProps {
    activeCategory: 'quant' | 'reasoning';
    onCategoryChange: (category: 'quant' | 'reasoning') => void;
    currentSlug?: string;
}

export function DocsSidebar({ activeCategory, onCategoryChange, currentSlug }: DocsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const colors = colorSchemes[activeCategory];
    const patterns = activeCategory === 'quant' ? quantPatterns : reasoningPatterns;
    const phases = activeCategory === 'quant' ? quantPhases : reasoningPhases;

    // Filter patterns based on search
    const filteredPatterns = useMemo(() => {
        if (!searchQuery.trim()) return patterns;
        const query = searchQuery.toLowerCase();
        return patterns.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    }, [patterns, searchQuery]);

    // Group filtered patterns by phase
    const patternsByPhase = useMemo(() => {
        const grouped: Record<number, PatternInfo[]> = {};
        filteredPatterns.forEach(p => {
            if (!grouped[p.phase]) grouped[p.phase] = [];
            grouped[p.phase].push(p);
        });
        return grouped;
    }, [filteredPatterns]);

    const sidebarContent = (
        <>
            {/* Header / Logo Area */}


            {/* Switch Bar - Stedi Style (Text Tabs) */}
            <div className="flex items-center px-6 border-b border-neutral-800">
                <button
                    onClick={() => onCategoryChange('quant')}
                    className={`relative py-4 text-sm font-medium transition-colors mr-6 ${activeCategory === 'quant'
                        ? 'text-white'
                        : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                >
                    Quant
                    {activeCategory === 'quant' && (
                        <motion.div
                            layoutId="activeTab"
                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.primaryBg}`}
                        />
                    )}
                </button>
                <button
                    onClick={() => onCategoryChange('reasoning')}
                    className={`relative py-4 text-sm font-medium transition-colors ${activeCategory === 'reasoning'
                        ? 'text-white'
                        : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                >
                    Reasoning
                    {activeCategory === 'reasoning' && (
                        <motion.div
                            layoutId="activeTab"
                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.primaryBg}`}
                        />
                    )}
                </button>
            </div>

            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative group">
                    <SearchIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-neutral-300 transition-colors"
                        sx={{ fontSize: '1rem' }}
                    />
                    <input
                        id="sidebar-search-input"
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="w-full bg-[#1A1A1A] border border-neutral-800/50 rounded-md pl-9 pr-4 py-2 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 focus:bg-[#222] transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-600 font-mono hidden sm:block border border-neutral-800 rounded px-1">
                        /
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                {/* Get Started */}
                <div>
                    <Link
                        href="/explanations/get-started"
                        onClick={() => setIsMobileOpen(false)}
                        className={`block text-sm font-medium transition-colors ${currentSlug === 'get-started' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                            }`}
                    >
                        Get Started
                    </Link>
                </div>

                {phases.map(phase => {
                    const phasePatterns = patternsByPhase[phase.id] || [];
                    if (searchQuery && phasePatterns.length === 0) return null;

                    return (
                        <div key={phase.id}>
                            <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 pl-3">
                                {phase.title}
                            </h4>

                            <div className="space-y-0.5 border-l border-neutral-800 ml-3">
                                {phasePatterns.map(pattern => {
                                    const isActive = currentSlug === pattern.slug;
                                    return (
                                        <Link
                                            key={pattern.slug}
                                            href={`/explanations/${pattern.slug}`}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`block pl-4 py-1.5 text-sm border-l -ml-px transition-colors ${isActive
                                                ? `${colors.activeBorder} ${colors.activeText} font-medium`
                                                : 'border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-700'
                                                }`}
                                        >
                                            {pattern.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* No results */}
                {searchQuery && filteredPatterns.length === 0 && (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                        No topics found
                    </div>
                )}
            </nav>

            {/* Footer Stats */}
            <div className={`p-4 border-t border-neutral-800 ${colors.primaryBgSubtle}`}>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">
                        {patterns.length} topics
                    </span>
                    <span className={colors.primary}>
                        {phases.length} phases
                    </span>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg"
            >
                <MenuIcon className="text-neutral-300" />
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-background border-r border-neutral-800 h-[calc(100vh-64px)] sticky top-16">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-neutral-800 z-50 flex flex-col"
                        >
                            {/* Close Button */}
                            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                                <span className="text-lg font-bold text-white">Explanations</span>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-1 text-neutral-400 hover:text-white"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {sidebarContent}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// ============================================
// BREADCRUMB COMPONENT
// ============================================
interface DocsBreadcrumbProps {
    category?: 'quant' | 'reasoning';
    topicName?: string;
}

export function DocsBreadcrumb({ category, topicName }: DocsBreadcrumbProps) {
    const colors = category ? colorSchemes[category] : null;

    return (
        <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-neutral-500 hover:text-neutral-300 transition-colors">
                Home
            </Link>
            <span className="text-neutral-600">/</span>
            <Link href="/explanations" className="text-neutral-500 hover:text-neutral-300 transition-colors">
                Explanations
            </Link>
            {category && (
                <>
                    <span className="text-neutral-600">/</span>
                    <span className={colors?.primary || 'text-neutral-400'}>
                        {category === 'quant' ? 'Quantitative Aptitude' : 'Reasoning'}
                    </span>
                </>
            )}
            {topicName && (
                <>
                    <span className="text-neutral-600">/</span>
                    <span className="text-neutral-200 font-medium">{topicName}</span>
                </>
            )}
        </nav>
    );
}

// ============================================
// TOPIC NAV (Prev/Next)
// ============================================
interface TopicNavProps {
    currentSlug: string;
    category: 'quant' | 'reasoning';
}

export function TopicNav({ currentSlug, category }: TopicNavProps) {
    const patterns = category === 'quant' ? quantPatterns : reasoningPatterns;
    const colors = colorSchemes[category];

    const currentIndex = patterns.findIndex(p => p.slug === currentSlug);
    const prevTopic = currentIndex > 0 ? patterns[currentIndex - 1] : null;
    const nextTopic = currentIndex < patterns.length - 1 ? patterns[currentIndex + 1] : null;

    if (!prevTopic && !nextTopic) return null;

    return (
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-neutral-800">
            {prevTopic ? (
                <Link
                    href={`/explanations/${prevTopic.slug}`}
                    className="group flex flex-col items-start p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all max-w-[45%]"
                >
                    <span className="text-xs text-neutral-500 mb-1">← Previous</span>
                    <span className={`text-sm font-medium text-neutral-300 group-hover:${colors.activeText} transition-colors truncate max-w-full`}>
                        {prevTopic.name}
                    </span>
                </Link>
            ) : <div />}

            {nextTopic ? (
                <Link
                    href={`/explanations/${nextTopic.slug}`}
                    className="group flex flex-col items-end p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all max-w-[45%]"
                >
                    <span className="text-xs text-neutral-500 mb-1">Next →</span>
                    <span className={`text-sm font-medium text-neutral-300 group-hover:${colors.activeText} transition-colors truncate max-w-full`}>
                        {nextTopic.name}
                    </span>
                </Link>
            ) : <div />}
        </div>
    );
}

// Export color schemes for use in other components
export { colorSchemes };
