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

export default function SimpleInterestContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-neutral-900 to-black" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[8rem] opacity-20">🏦</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/20">
                        Financial Mathematics
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Simple Interest</h1>
                    <p className="text-neutral-400 text-lg">Linear money growth — the bank gives you the same interest every year!</p>
                </div>
            </div>

            {/* WHY THIS MATTERS */}
            <ConceptSection id="why" title="Understanding Interest — The Rental Analogy" icon="🏠">
                <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-6 rounded-xl border-l-4 border-blue-500 mb-6">
                    <p className="text-lg">
                        <strong>Think of it this way:</strong> When you rent a house, you pay rent every month.
                        When you "rent" money to a bank, <span className="text-blue-400">interest is the rent they pay you!</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-blue-400 font-bold mb-3">When YOU Deposit 💰</h4>
                        <p className="text-sm text-neutral-300">
                            You're lending money to the bank.<br />
                            Bank pays YOU interest (rent) for using your money.
                        </p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-red-400 font-bold mb-3">When YOU Borrow 🏦</h4>
                        <p className="text-sm text-neutral-300">
                            Bank lends money to you.<br />
                            YOU pay the bank interest for using their money.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* THE TERMS */}
            <ConceptSection id="terms" title="The 4 Key Terms" icon="📖">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                    <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                        <div className="text-4xl font-black text-blue-400 mb-2">P</div>
                        <p className="text-neutral-300 font-bold">Principal</p>
                        <p className="text-xs text-neutral-500 mt-1">Initial amount deposited/borrowed</p>
                    </div>
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                        <div className="text-4xl font-black text-emerald-400 mb-2">R</div>
                        <p className="text-neutral-300 font-bold">Rate</p>
                        <p className="text-xs text-neutral-500 mt-1">Interest % per year</p>
                    </div>
                    <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                        <div className="text-4xl font-black text-amber-400 mb-2">T</div>
                        <p className="text-neutral-300 font-bold">Time</p>
                        <p className="text-xs text-neutral-500 mt-1">Number of years</p>
                    </div>
                    <div className="p-5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                        <div className="text-4xl font-black text-purple-400 mb-2">A</div>
                        <p className="text-neutral-300 font-bold">Amount</p>
                        <p className="text-xs text-neutral-500 mt-1">P + Interest = Final money</p>
                    </div>
                </div>
            </ConceptSection>

            {/* THE FORMULA */}
            <ConceptSection id="formula" title="The Simple Interest Formula" icon="📐">
                <FormulaBox title="The Master Formula" variant="primary">
                    <div className="text-center">
                        <MathText className="text-3xl">{`SI = \\frac{P \\times R \\times T}{100}`}</MathText>
                        <div className="flex justify-center gap-8 mt-4 text-sm text-neutral-400">
                            <span>SI = Simple Interest</span>
                            <span>A = P + SI</span>
                        </div>
                    </div>
                </FormulaBox>

                {/* Visual: Linear growth */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-blue-500/30">
                    <h4 className="text-blue-400 font-bold mb-4 text-center">Visual: SI Growth (P=₹1000, R=10%)</h4>

                    <div className="flex items-end justify-center gap-4 h-48">
                        {[0, 1, 2, 3, 4, 5].map((year) => (
                            <div key={year} className="flex flex-col items-center">
                                <div
                                    className="w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                                    style={{ height: `${(1 + year * 0.1) * 100}px` }}
                                >
                                    <div className="text-xs text-center pt-2 text-white font-bold">
                                        ₹{1000 + year * 100}
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">Year {year}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-neutral-400 text-sm mt-4">
                        Notice: Same ₹100 increase each year — that's <strong className="text-blue-400">SIMPLE</strong> interest!
                    </p>
                </div>

                <TipBox variant="note" title="Why 'Simple'?">
                    <p className="text-sm">
                        It's called Simple because interest is calculated on the <strong>ORIGINAL</strong> principal only,
                        not on the accumulated interest. Every year's interest is exactly the same!
                    </p>
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Find SI on ₹5000 at 8% for 3 years."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> SI = PRT/100</p>
                            <p><MathText>{`SI = \\frac{5000 \\times 8 \\times 3}{100} = \\frac{120000}{100} = ₹1200`}</MathText></p>
                        </div>
                    }
                    answer="₹1200"
                />

                <CheckUnderstanding
                    question="SI on ₹2000 at 10% for 2 years = ?"
                    options={["₹200", "₹400", "₹440", "₹2400"]}
                    correctIndex={1}
                    explanation="SI = 2000 × 10 × 2 / 100 = 40000/100 = ₹400"
                />
            </ConceptSection>

            {/* DERIVED FORMULAS */}
            <ConceptSection id="derived" title="Finding P, R, or T (When SI is Given)" icon="🔄">
                <p className="mb-6">
                    Rearrange the SI formula to find any unknown variable!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <FormulaBox title="Find Principal">
                        <div className="text-center">
                            <MathText className="text-lg">{`P = \\frac{100 \\times SI}{R \\times T}`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="Find Rate">
                        <div className="text-center">
                            <MathText className="text-lg">{`R = \\frac{100 \\times SI}{P \\times T}`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="Find Time">
                        <div className="text-center">
                            <MathText className="text-lg">{`T = \\frac{100 \\times SI}{P \\times R}`}</MathText>
                        </div>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="SI on a sum at 5% for 4 years is ₹800. Find the principal."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> P = (100 × SI) / (R × T)</p>
                            <p><MathText>{`P = \\frac{100 \\times 800}{5 \\times 4} = \\frac{80000}{20} = ₹4000`}</MathText></p>
                        </div>
                    }
                    answer="₹4000"
                />
            </ConceptSection>

            {/* DOUBLING TIME */}
            <ConceptSection id="doubling" title="Doubling / Tripling Questions" icon="📈">
                <div className="bg-gradient-to-r from-emerald-900/20 to-transparent p-6 rounded-xl border-l-4 border-emerald-500 mb-6">
                    <p className="text-lg">
                        <strong>The Trick:</strong> "Sum doubles" means Amount = 2P, so Interest = P (100% of Principal)
                    </p>
                </div>

                <FormulaBox title="Multiplication Shortcut" variant="secondary">
                    <div className="text-center space-y-3">
                        <p className="text-neutral-400">If a sum becomes <strong>n times</strong> in T years at R%:</p>
                        <MathText className="text-xl">{`(n - 1) \\times 100 = R \\times T`}</MathText>
                        <div className="text-sm text-neutral-500">
                            <p>Doubles (n=2): RT = 100</p>
                            <p>Triples (n=3): RT = 200</p>
                            <p>Quadruples (n=4): RT = 300</p>
                        </div>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="A sum doubles in 5 years at SI. Find the rate %."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Doubles:</strong> n = 2, so (n−1) × 100 = R × T</p>
                            <p>1 × 100 = R × 5</p>
                            <p>R = 100/5 = <strong>20%</strong></p>
                        </div>
                    }
                    answer="20%"
                />

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="At 12.5% SI, in how many years will a sum triple?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Triples:</strong> n = 3, so (3−1) × 100 = R × T</p>
                            <p>200 = 12.5 × T</p>
                            <p>T = 200/12.5 = <strong>16 years</strong></p>
                        </div>
                    }
                    answer="16 years"
                />

                <CheckUnderstanding
                    question="At what rate will a sum become 4 times itself in 15 years?"
                    options={["15%", "20%", "25%", "30%"]}
                    correctIndex={1}
                    explanation="(4−1) × 100 = R × 15 → 300 = 15R → R = 20%"
                />
            </ConceptSection>

            {/* MIXED QUESTIONS */}
            <ConceptSection id="mixed" title="Mixed Rate / Split Principal" icon="🔀">
                <p className="mb-4">
                    Sometimes a sum is divided into parts at different rates, or invested for different times.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-amber-400 font-bold mb-4">Scenario: Two Different Rates</h4>
                    <p className="text-neutral-300 text-sm mb-4">
                        ₹10,000 invested: Part at 8%, rest at 12%. Total SI = ₹1040 for 1 year. Find each part.
                    </p>
                    <div className="p-4 bg-black/50 rounded-lg">
                        <p className="text-sm"><strong>Method: Alligation or Algebra</strong></p>
                        <ol className="list-decimal list-inside text-sm text-neutral-400 mt-2 space-y-1">
                            <li>Let x be at 8%, so (10000−x) is at 12%</li>
                            <li>SI₁ + SI₂ = 1040</li>
                            <li>x×8/100 + (10000−x)×12/100 = 1040</li>
                            <li>Solve to find x</li>
                        </ol>
                    </div>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="hard"
                    question="A sum of ₹10,000 is lent in two parts. One at 8% and other at 12%. If total interest after 1 year is ₹1040, find each part."
                    solution={
                        <div className="space-y-2">
                            <p>Let x be at 8%. Then (10000−x) at 12%.</p>
                            <p><MathText>{`\\frac{8x}{100} + \\frac{12(10000-x)}{100} = 1040`}</MathText></p>
                            <p>8x + 120000 − 12x = 104000</p>
                            <p>−4x = −16000 → x = 4000</p>
                            <p><strong>At 8%:</strong> ₹4000, <strong>At 12%:</strong> ₹6000</p>
                        </div>
                    }
                    answer="₹4000 at 8%, ₹6000 at 12%"
                />
            </ConceptSection>

            {/* INSTALLMENT */}
            <ConceptSection id="installment" title="Equal Installment Problems" icon="📅">
                <p className="mb-4">
                    A loan is repaid in equal yearly installments including interest. This is a common SSC question!
                </p>

                <FormulaBox title="Equal Yearly Installment">
                    <div className="text-center">
                        <MathText className="text-lg">{`\\text{Installment} = \\frac{P \\times 100}{T \\times 100 + \\frac{RT(T-1)}{2}}`}</MathText>
                        <p className="text-neutral-500 text-sm mt-3">Where P = Principal, R = Rate, T = Number of installments</p>
                    </div>
                </FormulaBox>

                <TipBox title="Intuition">
                    <p className="text-sm">
                        Each installment pays off part of principal PLUS interest on remaining principal.
                        Earlier installments have more interest component, later ones have more principal.
                    </p>
                </TipBox>

                <ExampleCard
                    number={6}
                    difficulty="hard"
                    question="₹1440 is to be repaid in 3 equal yearly installments at 10% SI. Find installment value."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong></p>
                            <p><MathText>{`\\frac{1440 \\times 100}{3 \\times 100 + \\frac{10 \\times 3 \\times 2}{2}}`}</MathText></p>
                            <p><MathText>{`= \\frac{144000}{300 + 30} = \\frac{144000}{330} = ₹436.36`}</MathText></p>
                        </div>
                    }
                    answer="₹436.36"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing SI with CI</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            In SI, interest is always on ORIGINAL principal. In CI, it's on accumulated amount.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong Time Unit</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            If rate is per year but time is in months, convert! 6 months = 0.5 years.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting (n−1) in Multiplication</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Doubles" means n=2, not n=1. Interest = (n−1) × Principal.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing Amount with Interest</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Amount = P + SI. If asked for SI, don't give Amount!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Simple Interest Master Reference"
                    rows={[
                        { concept: 'Simple Interest', formula: 'SI = \\frac{PRT}{100}' },
                        { concept: 'Amount', formula: 'A = P + SI' },
                        { concept: 'Find Principal', formula: 'P = \\frac{100 \\times SI}{RT}' },
                        { concept: 'Find Rate', formula: 'R = \\frac{100 \\times SI}{PT}' },
                        { concept: 'Find Time', formula: 'T = \\frac{100 \\times SI}{PR}' },
                        { concept: 'Doubles in T years', formula: 'RT = 100' },
                        { concept: 'n times in T years', formula: '(n-1) \\times 100 = RT' },
                        { concept: 'Equal Installment', formula: '\\frac{P \\times 100}{100T + \\frac{RT(T-1)}{2}}' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
