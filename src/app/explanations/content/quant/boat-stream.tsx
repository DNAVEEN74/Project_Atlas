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

export default function BoatStreamContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">⛵</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/20">
                        Phase 03: Motion
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Boat & Stream</h1>
                    <p className="text-neutral-400 text-lg">Motion in water.</p>
                </div>
            </div>

            <ConceptSection id="basics" title="Upstream vs Downstream" icon="🌊">
                <div className="grid grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold">Downstream ↓</h4>
                        <p className="text-sm text-neutral-400">With the flow. Speed = B + S</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold">Upstream ↑</h4>
                        <p className="text-sm text-neutral-400">Against the flow. Speed = B - S</p>
                    </div>
                </div>

                <FormulaBox>
                    <div className="space-y-2">
                        <MathText>{`\\text{Speed in Still Water (B)} = \\frac{D + U}{2}`}</MathText>
                        <MathText>{`\\text{Speed of Stream (S)} = \\frac{D - U}{2}`}</MathText>
                    </div>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="example" title="Solved Example" icon="📝">
                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A boat goes 20 km downstream in 2 hours and returns in 4 hours. Find boat speed and stream speed."
                    solution={
                        <div>
                            <p>Downstream speed = 20/2 = 10 km/h</p>
                            <p>Upstream speed = 20/4 = 5 km/h</p>
                            <p>Boat speed = (10+5)/2 = 7.5 km/h</p>
                            <p>Stream speed = (10-5)/2 = 2.5 km/h</p>
                        </div>
                    }
                    answer="B=7.5, S=2.5"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Boat Formulas"
                    rows={[
                        { concept: 'Downstream', formula: 'B + S' },
                        { concept: 'Upstream', formula: 'B - S' },
                        { concept: 'Still Water', formula: '(D+U)/2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
