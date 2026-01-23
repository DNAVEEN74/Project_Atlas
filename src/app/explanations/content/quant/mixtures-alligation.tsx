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

export default function MixturesAlligationContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🧪</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest mb-2 border border-purple-500/20">
                        Phase 03: Ratio Family
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mixtures & Alligation</h1>
                    <p className="text-neutral-400 text-lg">The art of blending.</p>
                </div>
            </div>

            <ConceptSection id="alligation" title="The Alligation Cross" icon="✖️">
                <p>A visual method to find the mixing ratio when combining two items at different prices/concentrations.</p>

                <div className="flex justify-center my-8">
                    <div className="relative p-8 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-purple-400 font-bold">Cheaper (C)</div>
                                <div className="text-2xl text-white mt-2">₹40</div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-neutral-500 text-4xl">✕</div>
                            </div>
                            <div>
                                <div className="text-purple-400 font-bold">Dearer (D)</div>
                                <div className="text-2xl text-white mt-2">₹60</div>
                            </div>
                        </div>
                        <div className="text-center my-4">
                            <div className="text-amber-400 font-bold">Mean (M)</div>
                            <div className="text-xl text-white">₹45</div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div className="text-emerald-400 font-bold">|D - M| = 15</div>
                            <div className="text-neutral-500">:</div>
                            <div className="text-emerald-400 font-bold">|M - C| = 5</div>
                        </div>
                        <div className="text-center mt-4 text-lg text-white font-bold">
                            Ratio = 15 : 5 = 3 : 1
                        </div>
                    </div>
                </div>

                <FormulaBox title="Alligation Formula">
                    <MathText>{`\\frac{C}{D} = \\frac{|D - M|}{|M - C|}`}</MathText>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="replacement" title="Replacement Formula" icon="🔄">
                <p>When a liquid is partially removed and replaced with another:</p>
                <FormulaBox>
                    <MathText>{`\\text{Final Conc.} = \\text{Initial} \\times \\left(1 - \\frac{\\text{Removed}}{\\text{Total}}\\right)^n`}</MathText>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Mixture Rules"
                    rows={[
                        { concept: 'Alligation Ratio', formula: '(D-M) : (M-C)' },
                        { concept: 'Replacement (n times)', formula: 'I(1 - R/T)^n' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
