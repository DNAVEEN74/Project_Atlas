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

export default function DataInterpretationContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">📊</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        Phase 05: Data
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Data Interpretation</h1>
                    <p className="text-neutral-400 text-lg">Reading graphs and tables.</p>
                </div>
            </div>

            <ConceptSection id="types" title="Types of DI" icon="📈">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-cyan-400 font-bold">Bar Graph</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <div className="text-3xl mb-2">🥧</div>
                        <div className="text-cyan-400 font-bold">Pie Chart</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <div className="text-3xl mb-2">📈</div>
                        <div className="text-cyan-400 font-bold">Line Graph</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <div className="text-3xl mb-2">📋</div>
                        <div className="text-cyan-400 font-bold">Table</div>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="pie" title="Pie Chart Formulas" icon="🥧">
                <FormulaBox title="Degree to Value">
                    <MathText>{`\\text{Value} = \\frac{\\text{Degree}}{360°} \\times \\text{Total}`}</MathText>
                </FormulaBox>

                <TipBox title="Quick Conversion">
                    <p>1% = 3.6°, so 25% = 90°, 50% = 180°.</p>
                </TipBox>
            </ConceptSection>

            <ConceptSection id="tips" title="Speed Tips" icon="⚡">
                <div className="space-y-3">
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                        <span className="text-cyan-400 font-bold">1.</span> Read the question FIRST, then the data.
                    </div>
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                        <span className="text-cyan-400 font-bold">2.</span> Approximate when possible. Don't over-calculate.
                    </div>
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                        <span className="text-cyan-400 font-bold">3.</span> Look for patterns and trends, not exact numbers.
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="DI Formulas"
                    rows={[
                        { concept: '% Change', formula: '(New - Old)/Old × 100' },
                        { concept: 'Ratio', formula: 'Part : Total' },
                        { concept: 'Average', formula: 'Sum / Count' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
