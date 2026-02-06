"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { DocsSidebar } from '@/components/explanations/DocsSidebar';
import { ArrowForwardIcon } from '@/components/icons';

// ============================================
// GET STARTED PAGE
// ============================================
export default function GetStartedPage() {
    const [activeCategory, setActiveCategory] = useState<'quant' | 'reasoning'>('quant');

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header activePage="explanations" />

            <div className="flex">
                {/* Sidebar */}
                <DocsSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    currentSlug="get-started"
                />

                {/* Main Content */}
                <main className="flex-1 min-w-0 px-6 lg:px-12 py-8 pb-20 lg:max-w-[80ch]">
                    {/* Title */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-semibold text-white mb-6 tracking-tight">
                            Getting Started
                        </h1>
                        <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                            PrepLeague Explanations is designed to help you build intuition for Quantitative Aptitude and Reasoning. While tailored for <strong className="text-neutral-200 font-medium">SSC CGL</strong>, these mental models and visual concepts are universal and helpful for any competitive exam.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Section 1: Philosophy */}
                        <section>
                            <h2 className="text-2xl font-medium text-white mb-4 tracking-tight">How it works</h2>
                            <div className="space-y-4 text-neutral-400 text-base leading-relaxed">
                                <p>
                                    Each topic is broken down into small, digestible concepts. We allow you to verify your understanding immediately with interactive checkpoints.
                                </p>
                                <ul className="space-y-3 list-disc pl-5">
                                    <li className="pl-1">
                                        <span className="text-neutral-200 font-medium">Structured Phases:</span> Topics are organized by difficulty. You should master Phase 1 (Foundation) before moving to advanced topics.
                                    </li>
                                    <li className="pl-1">
                                        <span className="text-neutral-200 font-medium">Visual First:</span> We use colors and diagrams to represent numbers and logic, making abstract concepts concrete.
                                    </li>
                                    <li className="pl-1">
                                        <span className="text-neutral-200 font-medium">Exam Focused:</span> Every explanation connects back to how SSC CGL asks questions.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 2: Tracks */}
                        <section>
                            <h2 className="text-2xl font-medium text-white mb-6 tracking-tight">Choose a Track</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Quant */}
                                <Link href="/explanations/number-system" className="group block p-5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-900/50">
                                    <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2 group-hover:text-amber-500 transition-colors">
                                        Quantitative Aptitude
                                        <ArrowForwardIcon className="text-neutral-600 group-hover:text-amber-500 transition-colors opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transform duration-200" sx={{ fontSize: '1rem' }} />
                                    </h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed">
                                        Covers Number System, Arithmetic, Algebra, Geometry, and Data Interpretation.
                                    </p>
                                </Link>

                                {/* Reasoning */}
                                <Link href="/explanations/coding-decoding" className="group block p-5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-900/50">
                                    <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2 group-hover:text-violet-500 transition-colors">
                                        Reasoning
                                        <ArrowForwardIcon className="text-neutral-600 group-hover:text-violet-500 transition-colors opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transform duration-200" sx={{ fontSize: '1rem' }} />
                                    </h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed">
                                        Covers Verbal Reasoning, Visual Patterns, and Logical Analysis.
                                    </p>
                                </Link>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
