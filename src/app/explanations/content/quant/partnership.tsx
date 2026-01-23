"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    LessonLayout,
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function PartnershipContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🤝</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2 border border-emerald-500/20">
                        Phase 03: Ratio Family
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Partnership</h1>
                    <p className="text-neutral-400 text-lg">Sharing profits fairly.</p>
                </div>
            </div>

            <ConceptSection id="basics" title="The Core Concept" icon="💰">
                <p>Profit is shared in the ratio of <strong>Capital × Time</strong>.</p>

                <FormulaBox>
                    <MathText>{`\\text{Share Ratio} = C_1 \\times T_1 : C_2 \\times T_2`}</MathText>
                </FormulaBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A invests ₹5000 for 12 months, B invests ₹6000 for 10 months. Profit ratio?"
                    solution={
                        <div>
                            <p>A's share = 5000 × 12 = 60000</p>
                            <p>B's share = 6000 × 10 = 60000</p>
                            <p>Ratio = 60000 : 60000 = 1 : 1</p>
                        </div>
                    }
                    answer="1:1"
                />
            </ConceptSection>

            <ConceptSection id="types" title="Types of Partners" icon="👥">
                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-emerald-400 font-bold">Working Partner</h4>
                        <p className="text-sm text-neutral-400">Gets salary + profit share.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-emerald-400 font-bold">Sleeping Partner</h4>
                        <p className="text-sm text-neutral-400">Gets only profit share.</p>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Partnership Rules"
                    rows={[
                        { concept: 'Profit Ratio', formula: 'C₁T₁ : C₂T₂' },
                        { concept: 'Equal Time', formula: 'Ratio = C₁ : C₂' },
                        { concept: 'Equal Capital', formula: 'Ratio = T₁ : T₂' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
