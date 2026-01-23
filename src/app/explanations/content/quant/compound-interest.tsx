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

export default function CompoundInterestContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/interest_hero.png"
                        alt="Time Value"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 border border-amber-500/20">
                        Phase 02: Interest
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Compound Interest</h1>
                    <p className="text-neutral-400 text-lg">The eighth wonder of the world.</p>
                </div>
            </div>

            <ConceptSection id="intro" title="Interest on Interest" icon="📈">
                <p>
                    Simple Interest gives money only on the Principal. <br />
                    Compound Interest gives money on the Principal <strong>AND</strong> the past Interest.
                </p>

                <div className="my-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 text-xs uppercase mb-2">Year 1</div>
                        <div className="text-2xl text-white font-mono">100 → 110</div>
                        <div className="text-xs text-emerald-500 mt-1">+10 Interest</div>
                    </div>
                    <div className="p-4 bg-neutral-800/50 rounded-xl border border-amber-500/30">
                        <div className="text-neutral-500 text-xs uppercase mb-2">Year 2</div>
                        <div className="text-2xl text-white font-mono">110 → 121</div>
                        <div className="text-xs text-emerald-500 mt-1">+11 Interest!</div>
                    </div>
                </div>

                <FormulaBox>
                    <MathText>{`A = P(1 + \\frac{R}{100})^n`}</MathText>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="tree" title="The Tree Method" icon="🌳">
                <p>
                    Instead of the formula, use the Tree Method for calculations.
                    For 2 years at 10% on 1000:
                </p>
                <div className="my-6 text-center font-mono">
                    <div className="inline-block p-2 bg-neutral-800 rounded">1000</div>
                    <div className="flex justify-center gap-10 text-neutral-600 my-1">
                        <span>↙</span><span>↘</span>
                    </div>
                    <div className="flex justify-center gap-8">
                        <div>
                            <div className="text-white">100</div>
                            <div className="text-xs text-neutral-500">(1st Yr)</div>
                        </div>
                        <div>
                            <div className="text-white">100</div>
                            <div className="text-xs text-neutral-500">(2nd Yr)</div>
                            <div className="text-neutral-600">↓</div>
                            <div className="text-amber-500">10</div>
                            <div className="text-[10px] text-neutral-500">(Interest on 100)</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-dashed border-neutral-700">
                        Total CI = 100 + 100 + 10 = 210
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="CI Formulas"
                    rows={[
                        { concept: 'Amount', formula: 'P(1+R/100)^n' },
                        { concept: 'CI 2 Years', formula: '2A + B (Tree)' },
                        { concept: 'CI 3 Years', formula: '3A + 3B + C' },
                        { concept: 'Diff (2 yrs)', formula: 'P(R/100)^2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
