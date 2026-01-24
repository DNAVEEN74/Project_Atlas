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
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🧪</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest mb-2 border border-purple-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mixtures & Alligation</h1>
                    <p className="text-neutral-400 text-lg">Master the "Cross Method" — the most powerful shortcut in arithmetic!</p>
                </div>
            </div>

            {/* CONCEPT 1: RULE OF ALLIGATION */}
            <ConceptSection id="alligation" title="The Rule of Alligation (Cross Method)" icon="✖️">
                <p>
                    Use this when mixing two ingredients to get a mean price/value.
                </p>

                <div className="flex justify-center my-8">
                    <div className="relative p-6 bg-neutral-900 rounded-xl border border-neutral-800 shadow-xl">
                        <div className="grid grid-cols-3 gap-8 text-center items-center">
                            {/* Cheaper */}
                            <div className="flex flex-col items-center">
                                <div className="text-purple-400 font-bold mb-1">Cheaper (C)</div>
                                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 text-white font-bold">C</div>
                            </div>

                            {/* Mean */}
                            <div className="flex flex-col items-center relative">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                    <div className="w-32 h-0.5 bg-white rotate-45 transform origin-center"></div>
                                    <div className="w-32 h-0.5 bg-white -rotate-45 transform origin-center absolute"></div>
                                </div>
                                <div className="text-amber-400 font-bold mb-1">Mean (M)</div>
                                <div className="w-16 h-16 rounded-full bg-amber-900/50 flex items-center justify-center border border-amber-500/30 text-white font-bold text-xl z-10">M</div>
                            </div>

                            {/* Dearer */}
                            <div className="flex flex-col items-center">
                                <div className="text-purple-400 font-bold mb-1">Dearer (D)</div>
                                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 text-white font-bold">D</div>
                            </div>
                        </div>

                        {/* Result Row */}
                        <div className="grid grid-cols-3 gap-8 text-center items-center mt-6">
                            <div className="text-emerald-400 font-mono font-bold">D - M</div>
                            <div className="text-neutral-500 font-bold">:</div>
                            <div className="text-emerald-400 font-mono font-bold">M - C</div>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm font-mono border border-emerald-500/20">
                                Ratio = (Dearer - Mean) : (Mean - Cheaper)
                            </span>
                        </div>
                    </div>
                </div>

                <TipBox title="Golden Rule">
                    Values must be in same units! (e.g., all CP, or all SP, or all % Profit).
                    Never mix CP with SP.
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="In what ratio must rice at ₹40/kg be mixed with rice at ₹60/kg to get a mixture worth ₹45/kg?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Cheaper (C):</strong> 40</p>
                            <p><strong>Dearer (D):</strong> 60</p>
                            <p><strong>Mean (M):</strong> 45</p>
                            <p>Ratio = (D − M) : (M − C)</p>
                            <p>= (60 − 45) : (45 − 40)</p>
                            <p>= 15 : 5</p>
                            <p>= <strong>3 : 1</strong></p>
                        </div>
                    }
                    answer="3 : 1"
                />
            </ConceptSection>

            {/* CONCEPT 2: MIXTURE OF TWO MIXTURES */}
            <ConceptSection id="two-mixtures" title="Mixing Two Mixtures" icon="⚗️">
                <p>
                    When mixing two alloys/vessels, focus on <strong>ONE component</strong> (e.g., Milk ONLY or Water ONLY).
                </p>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Vessel A has Milk:Water 4:1. Vessel B has 3:2. In what ratio mix them to get 1:1?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Focus on Milk Fraction:</strong></p>
                            <p>Vessel A: 4/(4+1) = 4/5</p>
                            <p>Vessel B: 3/(3+2) = 3/5</p>
                            <p>Target: 1/(1+1) = 1/2</p>
                            <p><strong>Apply Alligation on Fractions:</strong></p>
                            <p>Left: |3/5 − 1/2| = |6/10 − 5/10| = 1/10</p>
                            <p>Right: |1/2 − 4/5| = |5/10 − 8/10| = 3/10</p>
                            <p>Ratio = (1/10) : (3/10) = <strong>1 : 3</strong></p>
                        </div>
                    }
                    answer="1 : 3"
                />
            </ConceptSection>

            {/* CONCEPT 3: REPLACEMENT / DILUTION */}
            <ConceptSection id="replacement" title="Repeated Dilution Formula" icon="🔄">
                <p>
                    Used when finding remaining pure quantity after "x" liters are taken out and replaced with water "n" times.
                </p>

                <FormulaBox title="The Master Formula" variant="secondary">
                    <MathText>{`\\text{Final Qty} = \\text{Initial Qty} \\left( 1 - \\frac{x}{C} \\right)^n`}</MathText>
                    <p className="text-center text-neutral-400 text-sm mt-2">x = removed amount, C = total capacity, n = number of operations</p>
                </FormulaBox>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="A 40L container of milk. 4L is removed and replaced with water. This is done 2 more times (total 3). Find final milk."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Given:</strong> Initial=40, x=4, n=3</p>
                            <p>Ratio removed = 4/40 = 1/10</p>
                            <p>Multiplying Factor = (1 − 1/10) = 9/10</p>
                            <p>Final Milk = 40 × (9/10)³</p>
                            <p>= 40 × (729/1000) = 4 × 7.29 = <strong>29.16 Liters</strong></p>
                        </div>
                    }
                    answer="29.16 L"
                />

                <CheckUnderstanding
                    question="From 50L pure milk, 5L replaced with water once. What is the ratio of Milk:Water?"
                    options={["9:1", "10:1", "45:5", "4:1"]}
                    correctIndex={0}
                    explanation="Removed 5L (10%). Remaining Milk = 45L. Water = 5L. Ratio = 45:5 = 9:1."
                />
            </ConceptSection>

            {/* CONCEPT 4: DISHONEST MILKMAN */}
            <ConceptSection id="percent" title="Profit by Dilution" icon="💰">
                <p>
                    If a milkman sells mixture at Cost Price but gains profit by adding water:
                </p>
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center my-4">
                    <p className="text-lg font-bold text-emerald-400">
                        <MathText>{`\\text{Water} : \\text{Milk} = \\text{Profit \\%}`}</MathText>
                    </p>
                </div>
                <p className="text-sm text-neutral-400 text-center">
                    Example: To gain 25% profit by selling at CP.<br />
                    Water : Milk = 25 : 100 = 1 : 4.
                </p>
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Mixing CP with SP</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Don't put Selling Price in the middle if the components are Cost Prices.
                            First convert Profit% to find CP of mixture!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Reverse Ratio</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Alligation result order matters. If you write Cheaper first, the ratio is (Mean-Cheaper) part below Cheaper.
                            Always verify: (D-M) corresponds to Cheaper quantity.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Incorrect n in Dilution</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Done 2 MORE times" means total n=3. Read carefully!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Mixtures Master Reference"
                    rows={[
                        { concept: 'Alligation', formula: '(D-M)/(M-C) = Qty_C/Qty_D' },
                        { concept: 'Dilution', formula: 'Initial(1 - x/C)^n' },
                        { concept: 'Profit by Water', formula: 'Water/Milk = Profit%' },
                        { concept: 'Mean Price', formula: '(n1x1 + n2x2)/(n1+n2)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
