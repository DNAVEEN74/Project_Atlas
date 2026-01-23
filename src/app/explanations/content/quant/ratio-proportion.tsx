"use client";

import React from 'react';
import Image from 'next/image';
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

export default function RatioProportionContent() {
    return (
        <LessonLayout>
            {/* HERO IMAGE */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/ratio_hero.png"
                        alt="Ratio Balance"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 border border-amber-500/20">
                        Phase 01: Foundation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Ratio & Proportion</h1>
                    <p className="text-neutral-400 text-lg">The art of comparison without calculation.</p>
                </div>
            </div>

            {/* 1. MENTAL MODEL */}
            <ConceptSection id="intro" title="The Tug of War" icon="⚖️">
                <p>
                    A Ratio is not a division. It is a <strong>Comparison</strong> or a <strong>Share</strong>.
                    If A:B is 3:2, imagine a Tug of War.
                </p>
                <div className="flex justify-center my-8">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white">3x</div>
                            <div className="text-sm text-neutral-500">Player A</div>
                        </div>
                        <div className="h-1 w-24 bg-neutral-700 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white">2x</div>
                            <div className="text-sm text-neutral-500">Player B</div>
                        </div>
                    </div>
                </div>
                <p>
                    The total strength is <MathText>{`3+2 = 5`}</MathText> parts.
                    A holds <MathText>{`3/5`}</MathText> of the rope. B holds <MathText>{`2/5`}</MathText>.
                </p>
            </ConceptSection>

            {/* 2. COMBINING RATIOS */}
            <ConceptSection id="combining" title="The Zig-Zag Method (Plotting)" icon="⚡">
                <p>
                    If <MathText>{`A:B = 2:3`}</MathText> and <MathText>{`B:C = 4:5`}</MathText>, how do you find <MathText>{`A:B:C`}</MathText>?
                    Use the <strong>Plotting / Neighbor Method</strong>.
                </p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-lg text-center">
                    <div className="grid grid-cols-3 gap-4 mb-2 opacity-50 text-sm">
                        <div>A</div><div>B</div><div>C</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className="text-white">2</div><div className="text-white">3</div><div className="text-neutral-600">_</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-neutral-600">_</div><div className="text-white">4</div><div className="text-white">5</div>
                    </div>
                    <div className="my-4 border-t border-dashed border-neutral-700" />
                    <p className="text-sm text-amber-500 mb-2">Fill empty spots with neighbor!</p>
                    <div className="grid grid-cols-3 gap-4">
                        <div>2</div><div>3 → <span className="text-amber-500">3</span></div><div><span className="text-transparent">0</span></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div><span className="text-amber-500">4</span> ← 4</div><div>5</div>
                    </div>
                    <div className="mt-4 font-bold text-xl text-white">
                        <MathText>{`8 : 12 : 15`}</MathText>
                    </div>
                </div>

                <CheckUnderstanding
                    question="If A:B = 1:2 and B:C = 3:4, find A:B:C."
                    options={["1:2:4", "3:6:8", "1:6:8", "3:2:4"]}
                    correctIndex={1}
                    explanation="Plot: 1-2-_ and _-3-4. Fill: 1-2-(2) and (3)-3-4. Multiply down: 1*3=3, 2*3=6, 2*4=8. Ans: 3:6:8."
                />
            </ConceptSection>

            {/* 3. PROPORTION */}
            <ConceptSection id="proportion" title="Proportion & Cross Product" icon="✖️">
                <p>Proportion means equality of two ratios.</p>
                <FormulaBox>
                    <MathText>{`A:B :: C:D \\implies \\frac{A}{B} = \\frac{C}{D} \\implies A \\times D = B \\times C`}</MathText>
                </FormulaBox>
                <div className="text-center italic text-neutral-400 my-4">Product of Extremes = Product of Means</div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Ratio Rules"
                    rows={[
                        { concept: 'Combining Ratio', formula: '\\text{Neighbor Method}' },
                        { concept: 'Mean Proportional', formula: '\\sqrt{ab}' },
                        { concept: 'Third Proportional', formula: 'b^2/a' },
                        { concept: 'Fourth Proportional', formula: 'bc/a' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
