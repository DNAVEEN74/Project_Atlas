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

export default function PercentageContent() {
    return (
        <LessonLayout>

            {/* HER0 IMAGE - Visual Anchor */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                {/* Fallback to CSS gradient if image fails/loads */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />

                {/* Use the generated image if available, else CSS art */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/percentage_lesson_hero.png" // We will need to move the artifact here or use a placeholder
                        alt="Percentage Concept Art"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            // Fallback abstract art if image missing
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    {/* CSS Fallback Art - Glowing Percent */}
                    <div className="absolute text-[15rem] font-bold text-amber-500/5 select-none animate-pulse">
                        %
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 border border-amber-500/20">
                        Phase 01: The Foundation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">The Percentage Model</h1>
                    <p className="text-neutral-400 text-lg">Mastering the 'Per 100' mindset to unlock all of Arithmetic.</p>
                </div>
            </div>

            {/* 1. THE MENTAL MODEL */}
            <ConceptSection id="intro" title="The Battery Mental Model" icon="🔋">
                <p>
                    Most students treat Percentages as "just calculation". They calculate <MathText>{`\\frac{20}{100} \\times 500`}</MathText> mechanically.
                    But to be fast, you need a different mental model.
                </p>
                <p>
                    Think of a <strong>Smartphone Battery</strong>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
                    <div className="bg-[#0a0a0a] rounded-xl p-8 border border-neutral-800 flex flex-col items-center justify-center text-center">
                        {/* CSS Battery Visual */}
                        <div className="relative w-32 h-64 border-4 border-neutral-700 rounded-2xl p-2 mb-4">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-neutral-700 rounded-t-sm" />
                            <div className="w-full h-full bg-neutral-900 rounded-lg overflow-hidden flex flex-col-reverse relative">
                                <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-3xl text-white mix-blend-difference">
                                    50%
                                </div>
                                <div className="h-[50%] bg-emerald-500 w-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                        <p className="text-neutral-400 text-sm">Half Tank = 50% = 1/2</p>
                    </div>

                    <div className="space-y-4">
                        <p>
                            The word <strong>"Cent"</strong> comes from the Latin <em>Centum</em> (100).
                            Think of "Century" (100 years) or "Centurion" (commander of 100).
                        </p>
                        <p>
                            So <strong>Per-Cent</strong> literally means <strong>"For every 100"</strong>.
                        </p>
                        <FormulaBox title="The Golden Rule">
                            <MathText>{`x\\% = \\frac{x}{100}`}</MathText>
                        </FormulaBox>
                        <p>
                            That is the only definition you need. 50% is not a magic number; it is literally the fraction <MathText>{`\\frac{50}{100}`}</MathText> or <MathText>{`\\frac{1}{2}`}</MathText>.
                        </p>
                    </div>
                </div>

                <CheckUnderstanding
                    question="If your battery is at 75%, what fraction of the full charge do you have?"
                    options={["1/4 (One Quarter)", "3/4 (Three Quarters)", "2/3 (Two Thirds)"]}
                    correctIndex={1}
                    explanation="75% means 75 per 100. Simplifying 75/100 gives 3/4. Visualizing this: You have 3 parts out of 4."
                />
            </ConceptSection>

            {/* 2. THE FRACTIONS SHORTCUT */}
            <ConceptSection id="fractions" title="The Fraction Shortcut" icon="⚡">
                <p>
                    In exams like SSC CGL, calculating <MathText>{`\\frac{16.66}{100} \\times 36`}</MathText> is too slow.
                    Top rankers don't calculate percentages; they <strong>convert them to fractions</strong>.
                </p>
                <p>
                    This is your primary weapon. You must memorize these "Standard Fractions" just like you memorized tables in school.
                </p>

                {/* VISUAL FRACTION GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8">
                    {[
                        { f: '1/2', p: '50%' },
                        { f: '1/3', p: '33.33%' },
                        { f: '1/4', p: '25%' },
                        { f: '1/5', p: '20%' },
                        { f: '1/6', p: '16.66%' },
                        { f: '1/7', p: '14.28%' },
                        { f: '1/8', p: '12.5%' },
                        { f: '1/9', p: '11.11%' },
                        { f: '1/10', p: '10%' },
                        { f: '1/11', p: '09.09%' },
                        { f: '1/12', p: '8.33%' },
                        { f: '1/15', p: '6.66%' },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1a1a1a] border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800 rounded-xl p-4 text-center transition-all group cursor-default">
                            <div className="text-neutral-500 text-sm mb-1 group-hover:text-white transition-colors">
                                <MathText>{item.f}</MathText>
                            </div>
                            <div className="text-xl font-bold text-white group-hover:text-amber-400 group-hover:scale-110 transition-all">
                                {item.p}
                            </div>
                        </div>
                    ))}
                </div>

                <TipBox variant="note" title="Memory Hack: The 9/11 Rule">
                    <p>There is a beautiful symmetry between <MathText>{`\\frac{1}{9}`}</MathText> and <MathText>{`\\frac{1}{11}`}</MathText>:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><MathText>{`\\frac{1}{9} = 11.11\\%`}</MathText> (Focus on 11)</li>
                        <li><MathText>{`\\frac{1}{11} = 09.09\\%`}</MathText> (Focus on 09)</li>
                    </ul>
                </TipBox>
            </ConceptSection>

            {/* 3. MULTIPLYING FACTOR */}
            <ConceptSection id="mf" title="The Multiplying Factor (MF)" icon="🚀">
                <p>
                    This is the single most powerful concept for Data Interpretation (DI) and Compound Interest.
                </p>
                <div className="my-6 p-6 bg-gradient-to-r from-violet-900/20 to-transparent border-l-4 border-violet-500 rounded-r-xl">
                    <h3 className="text-lg font-bold text-white mb-2">The Concept</h3>
                    <p>
                        Instead of finding 10% and adding it, we multiply directly.
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li>Increase by 10% <span className="text-neutral-500">→</span> Multiply by <strong>1.1</strong></li>
                        <li>Increase by 20% <span className="text-neutral-500">→</span> Multiply by <strong>1.2</strong></li>
                        <li>Decrease by 10% <span className="text-neutral-500">→</span> Multiply by <strong>0.9</strong></li>
                    </ul>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A mobile phone price increased by 20%. If the new price is ₹24,000, what was the original price?"
                    solution={
                        <div>
                            <p><strong>Method 1: The School Way (Slow)</strong></p>
                            <p className="pl-4 text-neutral-400 text-sm mb-4">
                                <MathText>{`x + 20\\% \\text{ of } x = 24000 \\Rightarrow x + 0.2x = 24000 \\Rightarrow 1.2x = 24000`}</MathText>
                            </p>

                            <p><strong>Method 2: The MF Way (Fast)</strong></p>
                            <p>
                                20% increase means the number becomes <strong>120%</strong> of itself.
                                In fraction terms, <MathText>{`120\\% = \\frac{6}{5}`}</MathText>.
                            </p>
                            <p className="mt-2">
                                So, <MathText>{`\\text{Original} \\times \\frac{6}{5} = 24000`}</MathText>
                            </p>
                            <p>
                                <MathText>{`\\text{Original} = 24000 \\times \\frac{5}{6} = 4000 \\times 5 = 20000`}</MathText>
                            </p>
                        </div>
                    }
                    answer="₹20,000"
                />
            </ConceptSection>

            {/* 4. SUCCESSIVE PERCENTAGE */}
            <ConceptSection id="successive" title="Successive Changes (AB Rule)" icon="🔄">
                <p>
                    What happens if a price increases by 10%, and then again by 10%?
                    Is the total increase 20%? <strong>NO.</strong>
                </p>

                <div className="flex flex-col md:flex-row gap-4 my-8 items-center justify-center text-center">
                    <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold text-xl border border-neutral-700">100</div>
                    <div className="text-emerald-500 font-bold text-sm">+10%<br />(+10)</div>
                    <div className="text-neutral-500">→</div>
                    <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold text-xl border border-neutral-700">110</div>
                    <div className="text-emerald-500 font-bold text-sm">+10%<br />(+11)</div>
                    <div className="text-neutral-500">→</div>
                    <div className="w-24 h-24 bg-emerald-900/50 rounded-full flex items-center justify-center text-white font-bold text-xl border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">121</div>
                </div>

                <p>
                    The second 10% is calculated on the <em>new</em> base (110), not the original 100. So it adds 11, not 10.
                    Total change = 21%.
                </p>

                <FormulaBox title="The AB Formula" variant="secondary">
                    <p>For two successive changes of <MathText>{`a\\%`}</MathText> and <MathText>{`b\\%`}</MathText>:</p>
                    <MathText className="text-2xl mt-2 block">{`\\text{Net Change} = a + b + \\frac{a \\times b}{100}`}</MathText>
                </FormulaBox>

                <CheckUnderstanding
                    question="A shopkeeper marks up price by 20% and then gives a discount of 10%. What is his profit %?"
                    options={["10%", "8%", "12%"]}
                    correctIndex={1}
                    explanation="Using AB Formula: a = +20, b = -10. Net = 20 + (-10) + (20*-10)/100 = 10 - 2 = 8%."
                />
            </ConceptSection>

            {/* 5. SUMMARY */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Percentage Basics"
                    rows={[
                        { concept: 'Percent to Fraction', formula: '\\text{Divide by } 100' },
                        { concept: 'Fraction to Percent', formula: '\\text{Multiply by } 100' },
                        { concept: 'Percentage Change', formula: '\\frac{\\text{Final} - \\text{Initial}}{\\text{Initial}} \\times 100' },
                        { concept: 'A is what % of B?', formula: '\\frac{A}{B} \\times 100' },
                        { concept: 'Successive Change', formula: 'A + B + \\frac{AB}{100}' },
                    ]}
                />
            </ConceptSection>

        </LessonLayout>
    );
}
