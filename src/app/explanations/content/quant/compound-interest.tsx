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

export default function CompoundInterestContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">📈</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2 border border-emerald-500/20">
                        Financial Mathematics
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Compound Interest</h1>
                    <p className="text-neutral-400 text-lg">"The eighth wonder of the world" — Albert Einstein</p>
                </div>
            </div>

            {/* WHY CI MATTERS */}
            <ConceptSection id="why" title="SI vs CI — The Big Difference" icon="💡">
                <div className="bg-gradient-to-r from-emerald-900/20 to-transparent p-6 rounded-xl border-l-4 border-emerald-500 mb-6">
                    <p className="text-lg">
                        <strong>SI:</strong> Interest only on original Principal.<br />
                        <strong>CI:</strong> Interest on Principal <span className="text-emerald-400">+ Interest earned so far!</span>
                    </p>
                </div>

                {/* Visual comparison */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-emerald-400 font-bold mb-4 text-center">₹1000 at 10% for 3 years</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SI Column */}
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <h5 className="text-blue-400 font-bold text-center mb-4">Simple Interest</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Year 1:</span>
                                    <span className="text-white">1000 → 1100 (+100)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Year 2:</span>
                                    <span className="text-white">1100 → 1200 (+100)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Year 3:</span>
                                    <span className="text-white">1200 → 1300 (+100)</span>
                                </div>
                                <div className="border-t border-blue-500/30 pt-2 mt-2">
                                    <p className="text-center text-blue-400 font-bold">Total SI = ₹300</p>
                                    <p className="text-center text-xs text-neutral-500">Same ₹100 every year</p>
                                </div>
                            </div>
                        </div>

                        {/* CI Column */}
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                            <h5 className="text-emerald-400 font-bold text-center mb-4">Compound Interest</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Year 1:</span>
                                    <span className="text-white">1000 → 1100 (+100)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Year 2:</span>
                                    <span className="text-white">1100 → 1210 (+<span className="text-emerald-400">110</span>)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Year 3:</span>
                                    <span className="text-white">1210 → 1331 (+<span className="text-emerald-400">121</span>)</span>
                                </div>
                                <div className="border-t border-emerald-500/30 pt-2 mt-2">
                                    <p className="text-center text-emerald-400 font-bold">Total CI = ₹331</p>
                                    <p className="text-center text-xs text-neutral-500">Interest grows each year!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-4 text-amber-400 text-sm">
                        <strong>Extra ₹31</strong> just from "interest on interest"!
                    </p>
                </div>
            </ConceptSection>

            {/* THE FORMULA */}
            <ConceptSection id="formula" title="The CI Formula" icon="📐">
                <FormulaBox title="Compound Interest Formula" variant="primary">
                    <div className="text-center">
                        <MathText className="text-2xl">{`A = P \\left(1 + \\frac{R}{100}\\right)^n`}</MathText>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs text-neutral-400">
                            <div><strong className="text-white">A</strong> = Amount (final)</div>
                            <div><strong className="text-white">P</strong> = Principal</div>
                            <div><strong className="text-white">R</strong> = Rate %</div>
                            <div><strong className="text-white">n</strong> = Years</div>
                        </div>
                        <p className="text-sm text-neutral-500 mt-3">CI = A − P</p>
                    </div>
                </FormulaBox>

                <TipBox title="The Multiplying Factor (MF)">
                    <p className="text-sm">
                        <MathText>{`\\left(1 + \\frac{R}{100}\\right)`}</MathText> is the <strong>Multiplying Factor</strong>.
                        At 10%, MF = 1.1. Each year, multiply by 1.1!
                    </p>
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Find CI on ₹2000 at 10% for 2 years."
                    solution={
                        <div className="space-y-2">
                            <p><strong>MF = 1 + 10/100 = 1.1</strong></p>
                            <p>A = 2000 × (1.1)² = 2000 × 1.21 = ₹2420</p>
                            <p>CI = 2420 − 2000 = <strong>₹420</strong></p>
                        </div>
                    }
                    answer="₹420"
                />
            </ConceptSection>

            {/* CI-SI DIFFERENCE */}
            <ConceptSection id="diff" title="CI − SI Difference (Shortcut!)" icon="⚡">
                <p className="mb-4">
                    Many questions ask: "Find the difference between CI and SI". Use these shortcuts!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <FormulaBox title="For 2 Years">
                        <div className="text-center">
                            <MathText className="text-xl">{`CI - SI = P \\times \\left(\\frac{R}{100}\\right)^2`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="For 3 Years">
                        <div className="text-center">
                            <MathText className="text-lg">{`CI - SI = P \\times \\left(\\frac{R}{100}\\right)^2 \\times \\left(3 + \\frac{R}{100}\\right)`}</MathText>
                        </div>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Find CI − SI for ₹5000 at 10% for 2 years."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using shortcut:</strong> CI − SI = P × (R/100)²</p>
                            <p>= 5000 × (10/100)²</p>
                            <p>= 5000 × (1/10)² = 5000 × 1/100 = <strong>₹50</strong></p>
                        </div>
                    }
                    answer="₹50"
                />

                <CheckUnderstanding
                    question="CI − SI for ₹1000 at 20% for 2 years = ?"
                    options={["₹20", "₹40", "₹50", "₹60"]}
                    correctIndex={1}
                    explanation="CI − SI = 1000 × (20/100)² = 1000 × 0.04 = ₹40"
                />
            </ConceptSection>

            {/* HALF-YEARLY / QUARTERLY */}
            <ConceptSection id="frequency" title="Compounding Frequency" icon="📅">
                <p className="mb-4">
                    Interest can compound more than once a year. This increases the effective amount!
                </p>

                <div className="overflow-x-auto my-8">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-neutral-400">Compounding</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Rate per period</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Time periods</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4 text-white">Annually</td>
                                <td className="px-4 py-4">R%</td>
                                <td className="px-4 py-4">n years</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4 text-white">Half-yearly</td>
                                <td className="px-4 py-4 text-emerald-400">(R/2)%</td>
                                <td className="px-4 py-4 text-emerald-400">2n periods</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 text-white">Quarterly</td>
                                <td className="px-4 py-4 text-emerald-400">(R/4)%</td>
                                <td className="px-4 py-4 text-emerald-400">4n periods</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <FormulaBox title="Half-Yearly Compounding">
                    <div className="text-center">
                        <MathText className="text-xl">{`A = P \\left(1 + \\frac{R}{200}\\right)^{2n}`}</MathText>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="Find CI on ₹10000 at 10% for 1 year, compounded half-yearly."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Half-yearly:</strong> Rate = 10/2 = 5%, Time = 2 periods</p>
                            <p>A = 10000 × (1.05)² = 10000 × 1.1025 = ₹11025</p>
                            <p>CI = 11025 − 10000 = <strong>₹1025</strong></p>
                            <p className="text-neutral-500 text-xs">(If annual: CI would be only ₹1000)</p>
                        </div>
                    }
                    answer="₹1025"
                />
            </ConceptSection>

            {/* DIFFERENT RATES */}
            <ConceptSection id="different" title="Different Rates for Different Years" icon="🔢">
                <p className="mb-4">
                    When rate changes each year, multiply the factors!
                </p>

                <FormulaBox title="Variable Rate Formula">
                    <div className="text-center">
                        <MathText className="text-lg">{`A = P \\times \\left(1+\\frac{R_1}{100}\\right) \\times \\left(1+\\frac{R_2}{100}\\right) \\times ...`}</MathText>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="Find CI on ₹10000 at 10% for first year and 20% for second year."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Year 1:</strong> MF₁ = 1.1</p>
                            <p><strong>Year 2:</strong> MF₂ = 1.2</p>
                            <p>A = 10000 × 1.1 × 1.2 = 10000 × 1.32 = ₹13200</p>
                            <p>CI = 13200 − 10000 = <strong>₹3200</strong></p>
                        </div>
                    }
                    answer="₹3200"
                />
            </ConceptSection>

            {/* POPULATION PROBLEMS */}
            <ConceptSection id="population" title="Population Growth & Depreciation" icon="📊">
                <p className="mb-4">
                    CI formula applies to anything that grows/decreases by a percentage each year!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <h4 className="text-emerald-400 font-bold mb-3">📈 Growth</h4>
                        <MathText>{`P_{final} = P_{initial} \\left(1 + \\frac{R}{100}\\right)^n`}</MathText>
                        <p className="text-sm text-neutral-400 mt-2">Population, Bacteria, Investment</p>
                    </div>
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold mb-3">📉 Depreciation</h4>
                        <MathText>{`V_{final} = V_{initial} \\left(1 - \\frac{R}{100}\\right)^n`}</MathText>
                        <p className="text-sm text-neutral-400 mt-2">Car value, Machine value</p>
                    </div>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="medium"
                    question="A car worth ₹5,00,000 depreciates at 10% per year. Find its value after 2 years."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Depreciation:</strong> Use (1 − R/100)</p>
                            <p>V = 500000 × (1 − 0.1)² = 500000 × (0.9)²</p>
                            <p>= 500000 × 0.81 = <strong>₹4,05,000</strong></p>
                        </div>
                    }
                    answer="₹4,05,000"
                />

                <CheckUnderstanding
                    question="Population grows at 20% per year. If current = 1000, what is it after 2 years?"
                    options={["1200", "1400", "1440", "1600"]}
                    correctIndex={2}
                    explanation="P = 1000 × (1.2)² = 1000 × 1.44 = 1440"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing CI with SI</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            SI = PRT/100 (linear). CI = P(1+R/100)ⁿ − P (exponential). They're different!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting Half-Yearly Adjustments</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Half-yearly = Rate÷2, Time×2. Don't use annual values!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Finding CI Instead of Amount (or vice versa)</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Amount = P + CI. Read the question carefully — what's being asked?
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Using + for Depreciation</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Depreciation means DECREASE. Use (1 − R/100), not (1 + R/100)!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Compound Interest Master Reference"
                    rows={[
                        { concept: 'Amount (CI)', formula: 'A = P(1 + R/100)^n' },
                        { concept: 'CI', formula: 'A - P' },
                        { concept: 'CI − SI (2 years)', formula: 'P \\times (R/100)^2' },
                        { concept: 'Half-yearly', formula: 'A = P(1 + R/200)^{2n}' },
                        { concept: 'Quarterly', formula: 'A = P(1 + R/400)^{4n}' },
                        { concept: 'Growth', formula: 'P_{final} = P(1 + R/100)^n' },
                        { concept: 'Depreciation', formula: 'V_{final} = V(1 - R/100)^n' },
                        { concept: 'Variable rates', formula: 'P \\times (1+R_1/100)(1+R_2/100)...' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
