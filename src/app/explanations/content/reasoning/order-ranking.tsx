"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function OrderRankingContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🏆</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 border border-orange-500/20">
                        Phase 04: Real World Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Order & Ranking</h1>
                    <p className="text-neutral-400 text-lg">Position from top and bottom.</p>
                </div>
            </div>

            <ConceptSection id="formula" title="The Key Formula" icon="📊">
                <div className="p-6 bg-neutral-900 rounded-xl border border-orange-500/30 text-center my-6">
                    <p className="text-lg text-white font-bold">Total = Top Rank + Bottom Rank - 1</p>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="In a row, Ram is 15th from left and 10th from right. Total students?"
                    solution={
                        <div>
                            <p>Total = 15 + 10 - 1 = 24</p>
                        </div>
                    }
                    answer="24"
                />
            </ConceptSection>

            <ConceptSection id="interchange" title="After Interchange" icon="🔄">
                <p>If two people swap positions:</p>

                <TipBox title="Swap Formula">
                    If A and B swap, the DIFFERENCE in their ranks stays the same.
                    Use: New Rank of A = Old Rank of B.
                </TipBox>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Ranking Rules"
                    rows={[
                        { concept: 'Total', formula: 'Top + Bottom - 1' },
                        { concept: 'Middle', formula: '(Total + 1) / 2' },
                        { concept: 'Between A & B', formula: '|Rank_A - Rank_B| - 1' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
