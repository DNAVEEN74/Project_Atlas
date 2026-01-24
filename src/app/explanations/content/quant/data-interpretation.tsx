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
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">📊</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Data Interpretation</h1>
                    <p className="text-neutral-400 text-lg">Calculation is silver, approximation is gold.</p>
                </div>
            </div>

            {/* CONCEPT 1: CALCULATION HACKS */}
            <ConceptSection id="hacks" title="Calculation Speed Hacks" icon="⚡">
                <p>DI is not about finding the exact answer; it's about picking the right option.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-cyan-500/30">
                        <h4 className="text-cyan-400 font-bold mb-3">Hack 1: The 1% and 10% Rule</h4>
                        <p className="text-sm text-neutral-300">To find any percentage, break it down:</p>
                        <div className="bg-black/50 p-3 rounded mt-2 text-sm font-mono">
                            Number: 450<br />
                            100% = 450<br />
                            10% = 45<br />
                            1% = 4.5<br />
                            So, 12% = 45 + 4.5 + 4.5 = 54
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-cyan-500/30">
                        <h4 className="text-cyan-400 font-bold mb-3">Hack 2: Degree ↔ Percent</h4>
                        <p className="text-sm text-neutral-300">Pie charts use 360° or 100%.</p>
                        <div className="bg-black/50 p-3 rounded mt-2 text-sm font-mono text-center">
                            100% = 360°<br />
                            10% = 36°<br />
                            1% = 3.6°<br />
                            <span className="text-cyan-400">Value = (Degree/360) × Total</span>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: COMMON QUESTIONS */}
            <ConceptSection id="patterns" title="Standard Question Patterns" icon="📝">
                <div className="space-y-6 my-6">
                    {/* Pattern 1 */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">1. Percentage Change (Growth)</h4>
                        <MathText>{`\\% \\text{ Change} = \\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100`}</MathText>
                    </div>

                    {/* Pattern 2 */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">2. A is what % of B?</h4>
                        <MathText>{`\\frac{A}{B} \\times 100`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Example: "Sales in 2020 is what % of 2018?" &rarr; (2020/2018)*100</p>
                    </div>

                    {/* Pattern 3 */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">3. A is what % MORE than B?</h4>
                        <MathText>{`\\frac{A - B}{B} \\times 100`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Base 'B' comes in denominator (comes after 'than').</p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Sales in 2023: 120cr. Sales in 2024: 150cr. Find growth percentage."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Diff:</strong> 150 - 120 = 30</p>
                            <p><strong>Base (Old):</strong> 120</p>
                            <p>Growth = (30 / 120) × 100</p>
                            <p>= (1/4) × 100 = <strong>25%</strong></p>
                        </div>
                    }
                    answer="25%"
                />
            </ConceptSection>

            {/* CONCEPT 3: PIE CHART LOGIC */}
            <ConceptSection id="pie" title="Pie Chart Secrets" icon="🥧">
                <p>
                    Usually comes as 2 Pie Charts or Pie + Table.
                </p>

                <TipBox variant="note" title="Double Pie Chart Trick">
                    If Total A = 10,000 and Total B = 10,000 (Same totals):
                    <br />You can simply add/subtract % degrees directly!
                    <br />If totals are different, convert % to Ratio of Totals first.
                </TipBox>

                <CheckUnderstanding
                    question="In a pie chart, Food is 90°. What percent of total is spent on food?"
                    options={["20%", "25%", "30%", "15%"]}
                    correctIndex={1}
                    explanation="Percentage = (90° / 360°) × 100% = (1/4) × 100% = 25%."
                />
            </ConceptSection>

            {/* CONCEPT 4: MISSING DI */}
            <ConceptSection id="missing" title="Missing Data DI" icon="🧩">
                <p>
                    A table with missing values. The strategy:
                </p>
                <div className="my-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300 text-sm">
                        <li>Don't panic! Missing data is usually found using the first question's info.</li>
                        <li>Use "Total" column/row first.</li>
                        <li>Sometimes data found in Q1 is needed for Q3. Keep your rough sheet organized!</li>
                    </ol>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="DI Master Reference"
                    rows={[
                        { concept: '% Growth', formula: '(Diff / Old) × 100' },
                        { concept: 'Degrees → %', formula: 'Deg / 3.6' },
                        { concept: '% → Degrees', formula: '% × 3.6' },
                        { concept: 'Average', formula: 'Sum / N' },
                        { concept: 'Ratio A:B', formula: 'Simplify fraction A/B' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
