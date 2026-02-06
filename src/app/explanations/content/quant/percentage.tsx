"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    RocketLaunchIcon,
    CancelIcon,
    ShoppingCartIcon,
    AccountBalanceIcon,
    BarChartIcon,
    BoltIcon,
    PsychologyIcon,
    WarningIcon,
    SpeedIcon,
    BookIcon
} from '@/components/icons';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function PercentageContent() {
    return (
        <>
            <ConceptSection id="why" title="Why Percentage is EVERYWHERE">
                <FormulaBox title="Imagine">
                    <p>
                        A shop says "50% OFF!" and another says "₹500 discount on ₹1000!"
                        <span className="text-amber-400"> Both are the SAME thing!</span> Percentage is just a universal way to compare.
                    </p>
                </FormulaBox>

                <p className="mb-4">
                    Percentage appears in <strong>Profit/Loss, Interest, Tax, Discount, Data Interpretation, Elections, Statistics...</strong> — literally EVERYWHERE in SSC CGL!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center text-amber-400"><ShoppingCartIcon fontSize="large" /></div>
                        <h4 className="text-white font-bold">Shopping</h4>
                        <p className="text-sm text-neutral-400">"30% OFF!"</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center text-amber-400"><AccountBalanceIcon fontSize="large" /></div>
                        <h4 className="text-white font-bold">Banking</h4>
                        <p className="text-sm text-neutral-400">"8% interest rate"</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center text-amber-400"><BarChartIcon fontSize="large" /></div>
                        <h4 className="text-white font-bold">Exams</h4>
                        <p className="text-sm text-neutral-400">"85% marks"</p>
                    </div>
                </div>
            </ConceptSection>

            {/* THE MENTAL MODEL */}
            <ConceptSection id="intro" title="The Battery Mental Model">
                <p className="mb-4">
                    To truly understand percentage, stop thinking of it as calculation.
                    <strong> Think of it as a BATTERY!</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
                    {/* Battery Visual - More engaging */}
                    <div className="bg-[#0a0a0a] rounded-xl p-8 border border-neutral-800 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-48 border-4 border-neutral-600 rounded-2xl p-2 mb-4">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-neutral-600 rounded-t-sm" />
                            <div className="w-full h-full bg-neutral-900 rounded-lg overflow-hidden flex flex-col-reverse relative">
                                <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-2xl text-white drop-shadow-lg">
                                    75%
                                </div>
                                {/* Animated fill */}
                                <div
                                    className="h-[75%] bg-gradient-to-t from-amber-600 to-amber-400 w-full shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                                    style={{
                                        animation: 'pulse 2s infinite',
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-neutral-400 text-sm">75% = <MathText>{`\\frac{3}{4}`}</MathText> = 0.75</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                            <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2"><BookIcon /> The Word Origin</h4>
                            <p className="text-sm text-neutral-300">
                                <strong>"Per"</strong> = For each<br />
                                <strong>"Cent"</strong> = 100 (like Century = 100 years)<br />
                                <strong>"Per-Cent"</strong> = <span className="text-amber-400">For every 100</span>
                            </p>
                        </div>

                        <FormulaBox title="The Golden Definition">
                            <div className="text-center">
                                <MathText className="text-2xl">{`x\\% = \\frac{x}{100}`}</MathText>
                                <p className="text-neutral-500 text-sm mt-2">That's it. That's the ONLY formula you need to understand!</p>
                            </div>
                        </FormulaBox>

                        <p className="text-neutral-300">
                            So <strong className="text-white">25%</strong> is literally <MathText>{`\\frac{25}{100} = \\frac{1}{4}`}</MathText>
                        </p>
                    </div>
                </div>

                <CheckUnderstanding
                    question="If your battery is at 60%, what fraction of full charge do you have?"
                    options={["3/4", "2/3", "3/5", "1/2"]}
                    correctIndex={2}
                    explanation="60% = 60/100 = 6/10 = 3/5. You have 3 parts out of 5!"
                />
            </ConceptSection>

            {/* THE FRACTION SHORTCUT - EXAM POWER MOVE */}
            <ConceptSection id="fractions" title="The Fraction Shortcut — Your Exam Weapon">
                <div className="flex items-center gap-2 mb-6">
                    <BoltIcon className="text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Speed Up Calculation</h3>
                </div>
                <FormulaBox title="The Secret of Toppers">
                    <p>
                        They NEVER calculate percentages in exams.
                        They convert everything to <span className="text-amber-400">FRACTIONS</span> and calculate mentally!
                    </p>
                </FormulaBox>

                <p className="mb-4">
                    Which is faster: <MathText>{`\\frac{16.66}{100} \\times 36`}</MathText> OR <MathText>{`\\frac{1}{6} \\times 36 = 6`}</MathText>?
                </p>

                <p className="text-amber-400 font-bold mb-6">MEMORIZE these conversions like you memorized multiplication tables!</p>

                {/* Fraction Grid with animations */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 my-8">
                    {[
                        { f: '1/2', p: '50%', color: 'amber' },
                        { f: '1/3', p: '33.33%', color: 'amber' },
                        { f: '2/3', p: '66.66%', color: 'amber' },
                        { f: '1/4', p: '25%', color: 'amber' },
                        { f: '3/4', p: '75%', color: 'amber' },
                        { f: '1/5', p: '20%', color: 'amber' },
                        { f: '2/5', p: '40%', color: 'amber' },
                        { f: '3/5', p: '60%', color: 'amber' },
                        { f: '4/5', p: '80%', color: 'amber' },
                        { f: '1/6', p: '16.66%', color: 'amber' },
                        { f: '5/6', p: '83.33%', color: 'amber' },
                        { f: '1/7', p: '14.28%', color: 'amber' },
                        { f: '1/8', p: '12.5%', color: 'amber' },
                        { f: '3/8', p: '37.5%', color: 'amber' },
                        { f: '5/8', p: '62.5%', color: 'amber' },
                        { f: '7/8', p: '87.5%', color: 'amber' },
                        { f: '1/9', p: '11.11%', color: 'amber' },
                        { f: '1/10', p: '10%', color: 'amber' },
                        { f: '1/11', p: '9.09%', color: 'amber' },
                        { f: '1/12', p: '8.33%', color: 'amber' },
                        { f: '1/15', p: '6.66%', color: 'amber' },
                        { f: '1/20', p: '5%', color: 'amber' },
                        { f: '1/25', p: '4%', color: 'amber' },
                        { f: '1/50', p: '2%', color: 'amber' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`bg-[#1a1a1a] border border-neutral-800 hover:border-${item.color}-500/50 hover:bg-neutral-800 rounded-xl p-3 text-center transition-all group cursor-default hover:scale-105 hover:shadow-lg`}
                        >
                            <div className="text-neutral-400 text-xs mb-1 group-hover:text-white transition-colors font-mono">
                                {item.f}
                            </div>
                            <div className={`text-lg font-bold text-white group-hover:text-amber-400 transition-all`}>
                                {item.p}
                            </div>
                        </div>
                    ))}
                </div>

                <TipBox variant="note" title="Memory Hacks">
                    <div className="space-y-3 text-sm">
                        <div>
                            <strong>The 9-11 Symmetry:</strong>
                            <ul className="list-disc list-inside mt-1 text-neutral-400">
                                <li>1/9 = 11.11% (repeating 11)</li>
                                <li>1/11 = 9.09% (repeating 09)</li>
                            </ul>
                        </div>
                        <div>
                            <strong>The Eighth Family:</strong> All multiples of 12.5%
                            <ul className="list-disc list-inside mt-1 text-neutral-400">
                                <li>1/8 = 12.5%, 2/8 = 25%, 3/8 = 37.5%, ...</li>
                            </ul>
                        </div>
                        <div>
                            <strong>The Third Family:</strong> Repeating 33
                            <ul className="list-disc list-inside mt-1 text-neutral-400">
                                <li>1/3 = 33.33%, 2/3 = 66.66%</li>
                            </ul>
                        </div>
                    </div>
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Find 16.66% of 72"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Recognize 16.66% = 1/6</p>
                            <p><strong>Step 2:</strong> <MathText>{`\\frac{1}{6} \\times 72 = 12`}</MathText></p>
                            <p className="text-amber-400">Done in 2 seconds mentally!</p>
                        </div>
                    }
                    answer="12"
                />

                <CheckUnderstanding
                    question="What is 37.5% of 80?"
                    options={["25", "30", "35", "40"]}
                    correctIndex={1}
                    explanation="37.5% = 3/8. So (3/8) × 80 = 3 × 10 = 30"
                />
            </ConceptSection>

            {/* PERCENTAGE CHANGE */}
            <ConceptSection id="change" title="Percentage Change — The Core Skill">
                <p className="mb-4">
                    "How much did the price increase?" This question has only ONE formula.
                </p>

                <FormulaBox title="Percentage Change Formula" variant="primary">
                    <div className="text-center">
                        <MathText className="text-2xl">{`\\text{\\% Change} = \\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100`}</MathText>
                        <div className="mt-4 text-sm text-neutral-400">
                            <p>If result is <span className="text-emerald-400">positive</span> → Increase</p>
                            <p>If result is <span className="text-red-400">negative</span> → Decrease</p>
                        </div>
                    </div>
                </FormulaBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <ExampleCard
                        number={2}
                        difficulty="easy"
                        question="Price increased from ₹80 to ₹100. What is the percentage increase?"
                        solution={
                            <div className="space-y-2">
                                <p><strong>Change:</strong> 100 - 80 = 20</p>
                                <p><strong>Base:</strong> 80 (the OLD value)</p>
                                <p><MathText>{`\\frac{20}{80} \\times 100 = 25\\%`}</MathText></p>
                            </div>
                        }
                        answer="25% increase"
                    />

                    <ExampleCard
                        number={3}
                        difficulty="easy"
                        question="Population decreased from 50,000 to 45,000. What is the percentage decrease?"
                        solution={
                            <div className="space-y-2">
                                <p><strong>Change:</strong> 45000 - 50000 = -5000</p>
                                <p><strong>Base:</strong> 50000</p>
                                <p><MathText>{`\\frac{-5000}{50000} \\times 100 = -10\\%`}</MathText></p>
                            </div>
                        }
                        answer="10% decrease"
                    />
                </div>

                <TipBox variant="warning" title="The Biggest Trap">
                    <p className="mb-2">
                        <strong>Always divide by the ORIGINAL (Old) value!</strong>
                    </p>
                    <p className="text-sm text-neutral-400">
                        If price goes from 80 → 100, the base is 80.<br />
                        If price goes from 100 → 80, the base is 100 (different answer!).
                    </p>
                </TipBox>
            </ConceptSection>

            {/* MULTIPLYING FACTOR */}
            <ConceptSection id="mf" title="The Multiplying Factor (MF) — Game Changer">
                <FormulaBox>
                    <p>
                        This single concept makes <strong>Compound Interest, Profit/Loss, and DI</strong> problems 10x faster.
                    </p>
                </FormulaBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
                    <div>
                        <h4 className="text-violet-400 font-bold text-lg mb-4">The Old Way (Slow) <SpeedIcon className="text-neutral-500" /></h4>
                        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 opacity-70">
                            <p className="text-sm text-neutral-400">
                                "Increase by 20%"<br />
                                → Find 20%: <MathText>{`\\frac{20}{100} \\times \\text{Amount}`}</MathText><br />
                                → Add to original<br />
                                → <span className="text-red-400">Multiple steps!</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-emerald-400 font-bold text-lg mb-4">The MF Way (Fast)</h4>
                        <div className="p-4 bg-neutral-900 rounded-xl border border-emerald-500/30">
                            <p className="text-sm text-neutral-300">
                                "Increase by 20%"<br />
                                → Multiply by <strong className="text-emerald-400">1.20</strong><br />
                                → <span className="text-emerald-400">One step!</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                    <h4 className="text-amber-400 font-bold text-center mb-6">The MF Table</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <div className="text-3xl mb-2 flex justify-center text-amber-400"><AccountBalanceIcon fontSize="large" /></div>
                            <h4 className="font-bold text-white">Interest (SI/CI)</h4>
                        </div>
                        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <div className="text-3xl mb-2 flex justify-center text-amber-400"><ShoppingCartIcon fontSize="large" /></div>
                            <h4 className="font-bold text-white">Profit & Loss</h4>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">+10%</p>
                            <p className="text-2xl font-bold text-emerald-400">× 1.1</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">+20%</p>
                            <p className="text-2xl font-bold text-emerald-400">× 1.2</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">+25%</p>
                            <p className="text-2xl font-bold text-emerald-400">× 1.25</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">+50%</p>
                            <p className="text-2xl font-bold text-emerald-400">× 1.5</p>
                        </div>
                        <div className="p-4 bg-red-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">−10%</p>
                            <p className="text-2xl font-bold text-red-400">× 0.9</p>
                        </div>
                        <div className="p-4 bg-red-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">−20%</p>
                            <p className="text-2xl font-bold text-red-400">× 0.8</p>
                        </div>
                        <div className="p-4 bg-red-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">−25%</p>
                            <p className="text-2xl font-bold text-red-400">× 0.75</p>
                        </div>
                        <div className="p-4 bg-red-500/10 rounded-lg">
                            <p className="text-neutral-400 text-sm">−50%</p>
                            <p className="text-2xl font-bold text-red-400">× 0.5</p>
                        </div>
                    </div>
                </div>

                <FormulaBox title="MF with Fractions (Even Faster)">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                            <p className="text-neutral-400">+20% =</p>
                            <MathText>{`\\times \\frac{6}{5}`}</MathText>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-400">−20% =</p>
                            <MathText>{`\\times \\frac{4}{5}`}</MathText>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-400">+25% =</p>
                            <MathText>{`\\times \\frac{5}{4}`}</MathText>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-400">−25% =</p>
                            <MathText>{`\\times \\frac{3}{4}`}</MathText>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-400">+33.33% =</p>
                            <MathText>{`\\times \\frac{4}{3}`}</MathText>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-400">−33.33% =</p>
                            <MathText>{`\\times \\frac{2}{3}`}</MathText>
                        </div>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="After a 20% increase, phone price is ₹24,000. What was the original price?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Method:</strong> 20% increase means Original × (6/5) = 24000</p>
                            <p><strong>Reverse:</strong> Original = 24000 × (5/6)</p>
                            <p><MathText>{`= 4000 \\times 5 = 20000`}</MathText></p>
                        </div>
                    }
                    answer="₹20,000"
                />

                <CheckUnderstanding
                    question="If a number is decreased by 20%, what should you multiply by?"
                    options={["0.2", "1.2", "0.8", "0.20"]}
                    correctIndex={2}
                    explanation="Decrease by 20% means you have 80% left. 80% = 0.8"
                />
            </ConceptSection>

            {/* SUCCESSIVE PERCENTAGE */}
            <ConceptSection id="successive" title="Successive Changes (AB Rule)">
                <p className="mb-4">
                    What if a price increases by 10%, then <strong>again</strong> by 10%? Is the total increase 20%?
                </p>

                <div className="my-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                    <p className="text-red-400 font-bold text-xl flex items-center justify-center gap-2">
                        <CancelIcon /> NO! It's NOT 20%!
                    </p>
                </div>

                {/* Visual explanation */}
                <div className="flex flex-col md:flex-row gap-4 my-8 items-center justify-center text-center">
                    <div className="w-28 h-28 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-neutral-700 shadow-lg">
                        100
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-emerald-500 font-bold text-lg">+10%</div>
                        <div className="text-neutral-500 text-sm">(+10)</div>
                        <div className="text-2xl">→</div>
                    </div>
                    <div className="w-28 h-28 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-neutral-700 shadow-lg">
                        110
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-emerald-500 font-bold text-lg">+10%</div>
                        <div className="text-amber-400 text-sm">(+11, not 10!)</div>
                        <div className="text-2xl">→</div>
                    </div>
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        121
                    </div>
                </div>

                <p className="text-center text-neutral-300 mb-8">
                    The second 10% is calculated on <strong>110</strong> (not 100)!
                    So you get 11, not 10. <span className="text-amber-400">Total = 21% increase!</span>
                </p>

                <FormulaBox title="The AB Formula (Nettt Change)" variant="secondary">
                    <div className="text-center">
                        <p className="text-neutral-400 mb-2">For two successive changes of a% and b%:</p>
                        <MathText className="text-2xl">{`\\text{Net Change} = a + b + \\frac{a \\times b}{100}`}</MathText>
                        <p className="text-neutral-500 text-sm mt-3">Use positive for increase, negative for decrease!</p>
                    </div>
                </FormulaBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <ExampleCard
                        number={5}
                        difficulty="medium"
                        question="Two successive increases of 10% each. Net change?"
                        solution={
                            <div className="space-y-2">
                                <p><strong>Using AB formula:</strong> a = 10, b = 10</p>
                                <p><MathText>{`= 10 + 10 + \\frac{10 \\times 10}{100}`}</MathText></p>
                                <p><MathText>{`= 20 + 1 = 21\\%`}</MathText> increase</p>
                            </div>
                        }
                        answer="21% increase"
                    />

                    <ExampleCard
                        number={6}
                        difficulty="hard"
                        question="Price marked up 25%, then discount of 20%. Profit/Loss?"
                        solution={
                            <div className="space-y-2">
                                <p><strong>Using AB formula:</strong> a = +25, b = −20</p>
                                <p><MathText>{`= 25 + (-20) + \\frac{25 \\times (-20)}{100}`}</MathText></p>
                                <p><MathText>{`= 5 - 5 = 0\\%`}</MathText></p>
                                <p className="text-amber-400">No profit, no loss!</p>
                            </div>
                        }
                        answer="0% (No profit/loss)"
                    />
                </div>

                <TipBox title="Special Patterns to Remember">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-amber-400 font-bold">+20% then −20% ≠ 0%</p>
                            <p className="text-neutral-400">Net = 20−20+(20×−20/100) = −4%</p>
                        </div>
                        <div>
                            <p className="text-amber-400 font-bold">+25% then −20% = 0%</p>
                            <p className="text-neutral-400">Net = 25−20+(25×−20/100) = 0%</p>
                        </div>
                    </div>
                </TipBox>

                <CheckUnderstanding
                    question="A shopkeeper marks up by 20% and gives 10% discount. What is his profit %?"
                    options={["10%", "8%", "12%", "5%"]}
                    correctIndex={1}
                    explanation="AB Formula: a=+20, b=−10. Net = 20 + (−10) + (20×−10)/100 = 10 − 2 = 8%"
                />
            </ConceptSection>

            {/* A IS WHAT % OF B */}
            <ConceptSection id="compare" title="Comparisons: 'A is what % of B?'">
                <p className="mb-4">
                    This confuses many students, but it's simple once you understand the question format.
                </p>

                <FormulaBox title="The Comparison Formula">
                    <div className="text-center">
                        <p className="text-neutral-400 mb-2">"<span className="text-white">A</span> is what % of <span className="text-amber-400">B</span>?"</p>
                        <MathText className="text-2xl">{`= \\frac{A}{B} \\times 100`}</MathText>
                        <p className="text-neutral-500 text-sm mt-2">The word after "of" goes in the denominator!</p>
                    </div>
                </FormulaBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-3">Question Type 1</h4>
                        <p className="text-neutral-300 mb-2">"30 is what % of 50?"</p>
                        <p className="text-sm text-neutral-400">
                            <MathText>{`= \\frac{30}{50} \\times 100 = 60\\%`}</MathText>
                        </p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-3">Question Type 2</h4>
                        <p className="text-neutral-300 mb-2">"50 is what % of 30?"</p>
                        <p className="text-sm text-neutral-400">
                            <MathText>{`= \\frac{50}{30} \\times 100 = 166.66\\%`}</MathText>
                        </p>
                    </div>
                </div>

                <TipBox variant="note" title="More vs Less Questions">
                    <div className="space-y-2 text-sm">
                        <p><strong>"A is how much % MORE than B?"</strong></p>
                        <p className="text-neutral-400"><MathText>{`= \\frac{A - B}{B} \\times 100`}</MathText></p>
                        <p><strong>"A is how much % LESS than B?"</strong></p>
                        <p className="text-neutral-400"><MathText>{`= \\frac{B - A}{B} \\times 100`}</MathText></p>
                        <p className="text-amber-400 mt-2">The word after "than" always goes in denominator!</p>
                    </div>
                </TipBox>

                <ExampleCard
                    number={7}
                    difficulty="medium"
                    question="If A's salary is ₹25,000 and B's is ₹20,000, by what % is A's salary more than B's?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> (A−B)/B × 100</p>
                            <p><MathText>{`= \\frac{25000 - 20000}{20000} \\times 100`}</MathText></p>
                            <p><MathText>{`= \\frac{5000}{20000} \\times 100 = 25\\%`}</MathText></p>
                        </div>
                    }
                    answer="25%"
                />

                <CheckUnderstanding
                    question="If B's salary is ₹20,000 and A's is ₹25,000, by what % is B's salary LESS than A's?"
                    options={["20%", "25%", "15%", "30%"]}
                    correctIndex={0}
                    explanation="'Less than A' means A is in denominator: (25000−20000)/25000 × 100 = 5000/25000 × 100 = 20%"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> +a% then −a% = 0%
                        </h4>
                        <p className="text-sm text-neutral-400">
                            <strong className="text-white">Wrong!</strong> +10% then −10% is NOT zero.
                            Use AB formula: 10 + (−10) + (10×−10)/100 = −1% LOSS!
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Using wrong base in % change
                        </h4>
                        <p className="text-sm text-neutral-400">
                            "Price went from 80 to 100" →  Always divide by <strong className="text-white">OLD</strong> value (80).
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Confusing "more than" and "of"
                        </h4>
                        <p className="text-sm text-neutral-400">
                            "A is 25% more than B" means A = 1.25B, NOT A = 0.25B!
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Forgetting to use fraction shortcuts
                        </h4>
                        <p className="text-sm text-neutral-400">
                            Calculating 33.33% × 99 the long way when you could just do (1/3) × 99 = 33!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Percentage Master Reference"
                    rows={[
                        { concept: 'x% to fraction', formula: '\\frac{x}{100}' },
                        { concept: '% Change', formula: '\\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100' },
                        { concept: 'A is what % of B', formula: '\\frac{A}{B} \\times 100' },
                        { concept: 'A is x% more than B', formula: 'A = B \\times \\frac{100+x}{100}' },
                        { concept: 'A is x% less than B', formula: 'A = B \\times \\frac{100-x}{100}' },
                        { concept: 'Successive change', formula: 'a + b + \\frac{ab}{100}' },
                        { concept: '+20% MF', formula: '\\times \\frac{6}{5}' },
                        { concept: '−20% MF', formula: '\\times \\frac{4}{5}' },
                        { concept: '+25% MF', formula: '\\times \\frac{5}{4}' },
                        { concept: '−25% MF', formula: '\\times \\frac{3}{4}' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
