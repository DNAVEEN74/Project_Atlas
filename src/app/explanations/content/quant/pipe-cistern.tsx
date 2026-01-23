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

export default function PipeCisternContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🚿</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        Phase 03: Ratio Family
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Pipe & Cistern</h1>
                    <p className="text-neutral-400 text-lg">Time & Work with water.</p>
                </div>
            </div>

            <ConceptSection id="concept" title="The Core Concept" icon="💧">
                <p>This is exactly like Time & Work, but with pipes.</p>

                <div className="grid grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold">Inlet Pipe</h4>
                        <p className="text-sm text-neutral-400">Fills the tank. <strong>Positive</strong> work.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-red-500/30">
                        <h4 className="text-red-400 font-bold">Outlet/Leak</h4>
                        <p className="text-sm text-neutral-400">Empties the tank. <strong>Negative</strong> work.</p>
                    </div>
                </div>

                <TipBox title="The LCM Method">
                    Assume tank capacity = LCM(all times). Then calculate fill/empty rate for each pipe.
                </TipBox>
            </ConceptSection>

            <ConceptSection id="example" title="Solved Example" icon="📝">
                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Pipe A fills in 10 hours, Pipe B empties in 15 hours. Both open, how long to fill?"
                    solution={
                        <div>
                            <p>LCM(10, 15) = 30 units (Tank capacity)</p>
                            <p>A fills = 30/10 = +3 units/hour</p>
                            <p>B empties = 30/15 = -2 units/hour</p>
                            <p>Net = 3 - 2 = +1 unit/hour</p>
                            <p>Time = 30/1 = 30 hours</p>
                        </div>
                    }
                    answer="30 hours"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Pipe Rules"
                    rows={[
                        { concept: 'Inlet Rate', formula: 'Positive (+)' },
                        { concept: 'Outlet Rate', formula: 'Negative (-)' },
                        { concept: 'Net Rate', formula: 'Sum of all rates' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
