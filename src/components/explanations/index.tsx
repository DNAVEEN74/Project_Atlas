'use client';

import React, { useState, useEffect } from 'react';
import { MathText, MathBlock } from '@/components/ui/MathText';
import {
    LightbulbOutlinedIcon,
    CheckCircleOutlinedIcon,
    WarningAmberOutlinedIcon,
    MenuBookOutlinedIcon,
    SpeedIcon,
    ExpandMoreIcon,
    ExpandLessIcon,
    QuizOutlinedIcon
} from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// LESSON LAYOUT - Sticky Sidebar + Content
// ============================================
export function LessonLayout({ children }: { children: React.ReactNode }) {
    const [activeSection, setActiveSection] = useState<string>('');
    const [sections, setSections] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        const headers = document.querySelectorAll('section[id] h2');
        const secs = Array.from(headers).map(h => ({
            id: h.parentElement?.id || '',
            // Strip emojis and trim whitespace
            title: (h.textContent || '')
                .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu, '')
                .trim()
        }));
        setSections(secs);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0px -50% 0px' });

        document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 relative">
            {/* Main Content - Constrained Width for Readability */}
            <div className="min-w-0 space-y-12 max-w-[65ch] lg:max-w-[75ch] mx-auto">
                {children}
            </div>

            {/* Sidebar TOC (Desktop) - Minimal Stedi Style */}
            <div className="hidden lg:block relative pl-6 border-l border-neutral-800">
                <div className="sticky top-8 space-y-4">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-3 pl-3">
                        On this page
                    </div>
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={`block text-xs py-1 leading-relaxed transition-all duration-200 border-l-2 pl-3 -ml-[26px] ${activeSection === section.id
                                    ? 'border-neutral-200 text-white font-medium'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                {section.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

// ============================================
// CONCEPT SECTION
// ============================================
interface ConceptSectionProps {
    id: string;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export function ConceptSection({ id, title, icon, children }: ConceptSectionProps) {
    return (
        <section id={id} className="scroll-mt-32 mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">
                {title}
            </h2>
            <div className="text-neutral-300 text-lg leading-8 space-y-6">
                {children}
            </div>
        </section>
    );
}

// ============================================
// FORMULA BOX - Clean Callout Style
// ============================================
export function FormulaBox({ title, children, variant = 'primary' }: { title?: string, children: React.ReactNode, variant?: 'primary' | 'secondary' }) {
    return (
        <div className="my-8 rounded-lg border border-neutral-800 bg-neutral-900/20 p-6 pl-6 border-l-2 border-l-amber-500">
            {title && (
                <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
                    {title}
                </div>
            )}
            <div className="text-lg text-white font-medium font-serif italic leading-relaxed">
                {children}
            </div>
        </div>
    );
}

// ============================================
// TIP BOX - Minimal Stedi Card Style
// ============================================
export function TipBox({ title, children, variant = 'tip' }: { title?: string, children: React.ReactNode, variant?: 'tip' | 'warning' | 'note' }) {
    const styles = {
        tip: { border: 'border-emerald-900/50 hover:border-emerald-800', bg: 'bg-transparent', text: 'text-emerald-400', icon: <LightbulbOutlinedIcon fontSize="small" /> },
        warning: { border: 'border-rose-900/50 hover:border-rose-800', bg: 'bg-transparent', text: 'text-rose-400', icon: <WarningAmberOutlinedIcon fontSize="small" /> },
        note: { border: 'border-neutral-800 hover:border-neutral-700', bg: 'bg-transparent', text: 'text-blue-400', icon: <MenuBookOutlinedIcon fontSize="small" /> },
    };
    const s = styles[variant];

    return (
        <div className={`flex items-start gap-4 p-5 rounded-xl my-8 ${s.bg} border ${s.border} transition-colors duration-200 group`}>
            <div className={`shrink-0 mt-0.5 ${s.text} opacity-90 group-hover:opacity-100 transition-opacity`}>{s.icon}</div>
            <div className="space-y-1.5">
                {title && <h4 className="font-semibold text-sm text-white tracking-tight">{title}</h4>}
                <div className="text-neutral-400 text-sm leading-7 group-hover:text-neutral-300 transition-colors">{children}</div>
            </div>
        </div>
    );
}

// ============================================
// EXAMPLE CARD - Minimal Accordion
// ============================================
export function ExampleCard({ number, question, solution, answer, difficulty = 'medium' }: { number: number, question: string, solution: React.ReactNode, answer?: string, difficulty?: 'easy' | 'medium' | 'hard' }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-neutral-800 rounded-lg overflow-hidden my-8 transition-colors hover:border-neutral-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex items-start gap-3 bg-neutral-900/30 hover:bg-neutral-900/50 transition-colors"
            >
                <div className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-neutral-800 text-neutral-400 mt-0.5">
                    {number}
                </div>
                <div className="grow">
                    <div className="text-neutral-200 font-medium leading-relaxed">
                        <MathText>{question}</MathText>
                    </div>
                </div>
                <div className="shrink-0 text-neutral-500">
                    {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-black/20 border-t border-neutral-800"
                    >
                        <div className="p-4 pl-[3.25rem] space-y-3">
                            <div className="text-sm text-neutral-400 space-y-3 leading-relaxed">
                                {solution}
                            </div>

                            {answer && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-500 text-sm font-medium">
                                    <CheckCircleOutlinedIcon sx={{ fontSize: '0.9rem' }} />
                                    <span>Answer: <MathText>{answer ?? ''}</MathText></span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// CHECK UNDERSTANDING (Interactive Widget)
// ============================================
export function CheckUnderstanding({ question, options, correctIndex, explanation }: { question: string, options: string[], correctIndex: number, explanation: string }) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleSelect = (idx: number) => {
        if (selected !== null) return; // Prevent changing after selection
        setSelected(idx);
        setIsCorrect(idx === correctIndex);
    };

    return (
        <div className="my-8 p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                <QuizOutlinedIcon sx={{ fontSize: '1rem' }} />
                Quick Check
            </div>

            <p className="text-white font-medium mb-6 text-lg">{question}</p>

            <div className="space-y-2">
                {options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={selected !== null}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selected === null
                            ? 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700'
                            : selected === idx
                                ? idx === correctIndex
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100' // Correct selection
                                    : 'border-rose-500/50 bg-rose-500/10 text-rose-100' // Wrong selection
                                : idx === correctIndex
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100' // Show correct if wrong selected
                                    : 'border-neutral-800 bg-neutral-900/50 opacity-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${selected === idx
                                ? idx === correctIndex ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-rose-500 bg-rose-500 text-white'
                                : 'border-neutral-600'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span>{opt}</span>
                        </div>
                    </button>
                ))}
            </div>

            {selected !== null && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-neutral-800"
                >
                    <div className={`text-sm ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-bold mb-2`}>
                        {isCorrect ? 'Correct!' : 'Not quite.'}
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed">{explanation}</p>
                </motion.div>
            )}
        </div>
    );
}

// Re-exports
export const CheatSheet = ({ title, rows }: any) => (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden my-6">
        <div className="px-5 py-3 border-b border-neutral-800 bg-neutral-950 font-bold text-neutral-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <SpeedIcon sx={{ fontSize: '1rem' }} /> {title}
        </div>
        <div className="divide-y divide-neutral-800">
            {rows.map((r: any, i: number) => (
                <div key={i} className="grid grid-cols-2 p-4 text-sm">
                    <div className="text-neutral-400">{r.concept}</div>
                    <div className="text-white font-medium text-right"><MathText>{r.formula}</MathText></div>
                </div>
            ))}
        </div>
    </div>
);

export { MathText, MathBlock };
