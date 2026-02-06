'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { DocsSidebar, TopicNav, colorSchemes } from '@/components/explanations/DocsSidebar';
import { PatternContent } from './content-loader';
import { PatternInfo } from '@/data/explanations-data';
import { LessonLayout } from '@/components/explanations';

interface PatternContentWrapperProps {
    slug: string;
    pattern: PatternInfo;
}

export function PatternContentWrapper({ slug, pattern }: PatternContentWrapperProps) {
    const [activeCategory, setActiveCategory] = useState<'quant' | 'reasoning'>(pattern.category);
    const colors = colorSchemes[pattern.category];

    const difficultyColors = {
        beginner: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        intermediate: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        advanced: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    };

    return (
        <div className="min-h-screen bg-background">
            <Header activePage="explanations" />

            <div className="flex">
                {/* Sidebar */}
                <DocsSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    currentSlug={slug}
                />

                {/* Main Content */}
                <main className="flex-1 min-w-0 px-6 lg:px-12 py-8 pb-20">
                    <LessonLayout>
                        {/* Topic Header - Minimal */}
                        <div className="">
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                                {pattern.name}
                            </h1>
                            <p className="text-lg text-neutral-400 leading-relaxed max-w-3xl">
                                {pattern.description}
                            </p>

                            {/* Prerequisites */}
                            {pattern.prerequisites.length > 0 && (
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <span className="text-neutral-500">Prerequisites:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {pattern.prerequisites.map(prereq => (
                                            <a
                                                key={prereq}
                                                href={`/explanations/${prereq}`}
                                                className={`px-2 py-0.5 rounded ${colors.primaryBgSubtle} ${colors.primary} hover:opacity-80 transition-opacity`}
                                            >
                                                {prereq.replace(/-/g, ' ')}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <PatternContent slug={slug} />

                        {/* Previous/Next Navigation */}
                        <TopicNav currentSlug={slug} category={pattern.category} />
                    </LessonLayout>
                </main >
            </div >
        </div >
    );
}
