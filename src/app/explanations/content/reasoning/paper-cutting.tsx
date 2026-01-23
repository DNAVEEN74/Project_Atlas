"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function PaperCuttingContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">✂️</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-2 border border-pink-500/20">
                        Phase 02: Visual Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Paper Cutting</h1>
                    <p className="text-neutral-400 text-lg">Fold, cut, unfold.</p>
                </div>
            </div>

            <ConceptSection id="method" title="The Method" icon="📄">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-2">Step 1: Track the Folds</h4>
                        <p className="text-sm text-neutral-400">Note how many times and in which direction paper is folded.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-2">Step 2: Locate the Cut</h4>
                        <p className="text-sm text-neutral-400">Identify where and what shape is cut.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-2">Step 3: Unfold in Reverse</h4>
                        <p className="text-sm text-neutral-400">Each unfold doubles the cut pattern symmetrically.</p>
                    </div>
                </div>

                <TipBox title="Key Insight">
                    Number of holes = 2^(number of folds) per cut.
                </TipBox>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Paper Rules"
                    rows={[
                        { concept: '1 Fold', formula: '2 holes per cut' },
                        { concept: '2 Folds', formula: '4 holes per cut' },
                        { concept: 'Pattern', formula: 'Mirror across fold line' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
