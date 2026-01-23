"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function CountingFiguresContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🔺🔹</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2 border border-indigo-500/20">
                        Phase 02: Visual Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Counting Figures</h1>
                    <p className="text-neutral-400 text-lg">Triangles, Squares, and more.</p>
                </div>
            </div>

            <ConceptSection id="triangles" title="Counting Triangles" icon="🔺">
                <p>There are formulas for standard figures!</p>

                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-2">Triangle divided by lines from one vertex</h4>
                        <p className="text-sm text-neutral-400">If n lines from one vertex: Total triangles = n(n+1)/2</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-2">Triangle with horizontal parallels</h4>
                        <p className="text-sm text-neutral-400">n horizontal lines: Triangles = n(n+2)(2n+1)/8</p>
                    </div>
                </div>

                <TipBox title="Quick Tip">
                    For complex figures, count triangles of each size separately: smallest first, then combinations.
                </TipBox>
            </ConceptSection>

            <ConceptSection id="rectangles" title="Counting Rectangles" icon="⬜">
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-indigo-400 font-bold mb-2">Grid of m × n lines</h4>
                    <p className="text-sm text-neutral-400">Rectangles = ᵐC₂ × ⁿC₂ = [m(m-1)/2] × [n(n-1)/2]</p>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Formulas"
                    rows={[
                        { concept: 'Triangles (vertex)', formula: 'n(n+1)/2' },
                        { concept: 'Rectangles (grid)', formula: 'ᵐC₂ × ⁿC₂' },
                        { concept: 'Squares (n×n)', formula: '1² + 2² + ... + n²' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
