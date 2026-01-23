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
    QuizOutlinedIcon,
    FormatListBulletedIcon
} from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// LESSON LAYOUT - Sticky Sidebar + Content
// ============================================
export function LessonLayout({ children }: { children: React.ReactNode }) {
    const [activeSection, setActiveSection] = useState<string>('');

    // Auto-detect sections for TOC
    const [sections, setSections] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        const headers = document.querySelectorAll('section[id] h2');
        const secs = Array.from(headers).map(h => ({
            id: h.parentElement?.id || '',
            title: h.textContent || ''
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 relative">
            {/* Main Content */}
            <div className="min-w-0 space-y-16">
                {children}
            </div>

            {/* Sidebar TOC (Desktop) */}
            <div className="hidden lg:block relative">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-4 text-neutral-400 uppercase tracking-widest text-xs font-bold">
                            <FormatListBulletedIcon sx={{ fontSize: '1rem' }} />
                            On this page
                        </div>
                        <nav className="space-y-1 relative">
                            {/* Running Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neutral-800 rounded-full ml-1" />

                            {sections.map(section => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className={`block pl-4 py-1.5 text-sm transition-all duration-300 border-l-2 -ml-[1px] ${activeSection === section.id
                                            ? 'border-amber-500 text-amber-500 font-medium translate-x-1'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                                        }`}
                                >
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Quick Stats or Promo could go here */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-2xl p-6">
                        <h4 className="text-amber-500 font-bold mb-2">Mastery Check</h4>
                        <p className="text-xs text-neutral-400 mb-4">Complete this lesson to unlock practice problems.</p>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[0%]" /> {/* Dynamic later */}
                        </div>
                    </div>
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
        <section id={id} className="scroll-mt-32">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-8 pb-4 border-b border-neutral-800">
                {icon && <span className="text-amber-500">{icon}</span>}
                {title}
            </h2>
            <div className="text-neutral-300 text-lg leading-relaxed space-y-6">
                {children}
            </div>
        </section>
    );
}

// ============================================
// FORMULA BOX
// ============================================
export function FormulaBox({ title, children, variant = 'primary' }: { title?: string, children: React.ReactNode, variant?: 'primary' | 'secondary' }) {
    const isPrimary = variant === 'primary';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden rounded-2xl border p-6 my-8 ${isPrimary
                    ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]'
                    : 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.1)]'
                }`}
        >
            {/* Glass Shine Effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />

            {title && (
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${isPrimary ? 'text-amber-500' : 'text-blue-400'}`}>
                    {title}
                </div>
            )}
            <div className="text-xl md:text-2xl text-white font-serif italic text-center py-4">
                {children}
            </div>
        </motion.div>
    );
}

// ============================================
// TIP BOX
// ============================================
export function TipBox({ title, children, variant = 'tip' }: { title?: string, children: React.ReactNode, variant?: 'tip' | 'warning' | 'note' }) {
    const styles = {
        tip: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400', icon: <LightbulbOutlinedIcon /> },
        warning: { border: 'border-rose-500/20', bg: 'bg-rose-500/5', text: 'text-rose-400', icon: <WarningAmberOutlinedIcon /> },
        note: { border: 'border-blue-500/20', bg: 'bg-blue-500/5', text: 'text-blue-400', icon: <MenuBookOutlinedIcon /> },
    };
    const s = styles[variant];

    return (
        <div className={`flex gap-4 p-5 rounded-xl border ${s.border} ${s.bg} my-6 backdrop-blur-sm`}>
            <div className={`shrink-0 mt-0.5 ${s.text}`}>{s.icon}</div>
            <div>
                <h4 className={`font-bold text-sm uppercase tracking-wide mb-1 ${s.text}`}>{title || variant}</h4>
                <div className="text-neutral-300 text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

// ============================================
// EXAMPLE CARD
// ============================================
export function ExampleCard({ number, question, solution, answer, difficulty = 'medium' }: { number: number, question: string, solution: React.ReactNode, answer?: string, difficulty?: 'easy' | 'medium' | 'hard' }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group border border-neutral-800 bg-[#151515] rounded-2xl overflow-hidden my-8 transition-all hover:border-neutral-700">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="p-6 cursor-pointer flex items-start gap-4"
            >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                    {number}
                </div>
                <div className="grow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Example Problem</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${difficulty === 'easy' ? 'border-emerald-500/30 text-emerald-500' :
                                difficulty === 'medium' ? 'border-amber-500/30 text-amber-500' :
                                    'border-rose-500/30 text-rose-500'
                            }`}>{difficulty}</span>
                    </div>
                    <div className="text-lg text-white font-medium mb-1">
                        <MathText>{question}</MathText>
                    </div>
                </div>
                <div className="shrink-0 pt-1 text-neutral-500">
                    {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-neutral-900/50 border-t border-neutral-800"
                    >
                        <div className="p-6 pl-16 space-y-4">
                            <div className="text-sm text-neutral-300 space-y-4 leading-relaxed relative">
                                <div className="absolute left-[-26px] top-0 bottom-0 w-[2px] bg-neutral-800" />
                                {solution}
                            </div>

                            {answer && (
                                <div className="flex items-center gap-3 pt-4">
                                    <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-bold flex items-center gap-2">
                                        <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} />
                                        Answer: <MathText>{answer}</MathText>
                                    </div>
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
