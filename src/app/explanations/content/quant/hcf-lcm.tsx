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

export default function HCFLCMContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[4rem] font-bold text-indigo-500/10 select-none">HCF ∩ LCM</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2 border border-indigo-500/20">
                        Phase 01: Foundation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">HCF & LCM</h1>
                    <p className="text-neutral-400 text-lg">The Greatest Common Factor and Least Common Multiple explained.</p>
                </div>
            </div>

            {/* CONCEPT 1: WHAT ARE THEY */}
            <ConceptSection id="intro" title="Understanding HCF & LCM" icon="🔗">
                <p>
                    Before formulas, understand <strong>what</strong> these concepts mean:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-indigo-500/30">
                        <h4 className="text-indigo-400 font-bold text-lg mb-3">HCF (Highest Common Factor)</h4>
                        <p className="text-neutral-300 text-sm mb-4">
                            The <strong>LARGEST number</strong> that divides both numbers exactly.
                        </p>
                        <div className="bg-black/50 p-4 rounded-lg">
                            <p className="font-mono text-sm">Factors of 12: 1, 2, 3, 4, 6, 12</p>
                            <p className="font-mono text-sm">Factors of 18: 1, 2, 3, 6, 9, 18</p>
                            <p className="font-mono text-sm mt-2 text-indigo-400">Common: 1, 2, 3, 6 → HCF = 6</p>
                        </div>
                        <p className="text-xs text-neutral-500 mt-3">Also called GCD (Greatest Common Divisor)</p>
                    </div>
                    <div className="p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold text-lg mb-3">LCM (Least Common Multiple)</h4>
                        <p className="text-neutral-300 text-sm mb-4">
                            The <strong>SMALLEST number</strong> that both numbers divide into exactly.
                        </p>
                        <div className="bg-black/50 p-4 rounded-lg">
                            <p className="font-mono text-sm">Multiples of 4: 4, 8, 12, 16, 20, 24...</p>
                            <p className="font-mono text-sm">Multiples of 6: 6, 12, 18, 24, 30...</p>
                            <p className="font-mono text-sm mt-2 text-amber-400">Common: 12, 24... → LCM = 12</p>
                        </div>
                        <p className="text-xs text-neutral-500 mt-3">Smallest number divisible by both</p>
                    </div>
                </div>

                <TipBox title="Real-Life Analogy">
                    <strong>HCF:</strong> Imagine cutting two ropes (12m and 18m) into equal pieces without waste. Largest piece size = HCF = 6m.
                    <br /><br />
                    <strong>LCM:</strong> Two bells ring every 4 and 6 minutes. When do they ring together again? At LCM = 12 minutes.
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: THE GOLDEN RULE */}
            <ConceptSection id="golden" title="The Golden Product Rule" icon="⭐">
                <p>This is the MOST important formula. Memorize it!</p>

                <FormulaBox title="Product Rule">
                    <MathText>{`HCF(a, b) \\times LCM(a, b) = a \\times b`}</MathText>
                </FormulaBox>

                <p className="mt-4 text-neutral-400">
                    If you know HCF and one number, you can find LCM (and vice versa)!
                </p>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="HCF of two numbers is 6 and their product is 180. Find LCM."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using Product Rule:</strong></p>
                            <p>HCF × LCM = Product</p>
                            <p>6 × LCM = 180</p>
                            <p>LCM = 180 ÷ 6 = 30</p>
                        </div>
                    }
                    answer="30"
                />

                <CheckUnderstanding
                    question="If LCM of 12 and a number is 60, and HCF is 4, what is the number?"
                    options={["15", "20", "48", "10"]}
                    correctIndex={1}
                    explanation="Product = HCF × LCM = 4 × 60 = 240. Number = 240 ÷ 12 = 20."
                />
            </ConceptSection>

            {/* CONCEPT 3: FINDING HCF */}
            <ConceptSection id="find-hcf" title="Methods to Find HCF" icon="🔍">
                <p>Two powerful methods:</p>

                <div className="space-y-6 my-6">
                    {/* Prime Factorization */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-4">Method 1: Prime Factorization</h4>
                        <p className="text-sm text-neutral-400 mb-4">Break both numbers into prime factors. Take common primes with LOWEST power.</p>
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-sm">
                            <p>48 = 2⁴ × 3¹</p>
                            <p>60 = 2² × 3¹ × 5¹</p>
                            <p className="mt-2 text-indigo-400">HCF = 2² × 3¹ = 4 × 3 = 12</p>
                        </div>
                    </div>

                    {/* Division Method */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-4">Method 2: Division (Euclid's Algorithm)</h4>
                        <p className="text-sm text-neutral-400 mb-4">Divide the larger by smaller. Repeat with remainder. HCF = last non-zero remainder.</p>
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-sm">
                            <p>48 ÷ 18 = 2 remainder <strong>12</strong></p>
                            <p>18 ÷ 12 = 1 remainder <strong>6</strong></p>
                            <p>12 ÷ 6 = 2 remainder <strong>0</strong></p>
                            <p className="mt-2 text-indigo-400">HCF = 6 (last non-zero remainder)</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Find HCF of 84 and 126 using division method."
                    solution={
                        <div className="space-y-2">
                            <p>126 ÷ 84 = 1 remainder 42</p>
                            <p>84 ÷ 42 = 2 remainder 0</p>
                            <p>HCF = 42</p>
                        </div>
                    }
                    answer="42"
                />
            </ConceptSection>

            {/* CONCEPT 4: FINDING LCM */}
            <ConceptSection id="find-lcm" title="Methods to Find LCM" icon="🔍">
                <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 my-6">
                    <h4 className="text-amber-400 font-bold mb-4">Prime Factorization for LCM</h4>
                    <p className="text-sm text-neutral-400 mb-4">Take all primes with HIGHEST power.</p>
                    <div className="bg-black/50 p-4 rounded-lg font-mono text-sm">
                        <p>48 = 2⁴ × 3¹</p>
                        <p>60 = 2² × 3¹ × 5¹</p>
                        <p className="mt-2 text-amber-400">LCM = 2⁴ × 3¹ × 5¹ = 16 × 3 × 5 = 240</p>
                    </div>
                </div>

                <TipBox title="Quick Shortcut">
                    If one number is a multiple of the other, LCM = the larger number.
                    <br />Example: LCM(5, 15) = 15 (since 15 = 5 × 3)
                </TipBox>

                <CheckUnderstanding
                    question="LCM of 12, 15, and 20 is?"
                    options={["60", "120", "180", "240"]}
                    correctIndex={0}
                    explanation="12=2²×3, 15=3×5, 20=2²×5. LCM = 2² × 3 × 5 = 60."
                />
            </ConceptSection>

            {/* CONCEPT 5: SPECIAL CASES */}
            <ConceptSection id="special" title="Special Cases & Shortcuts" icon="💡">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-2">Co-prime Numbers</h4>
                        <p className="text-sm text-neutral-400">Numbers with HCF = 1</p>
                        <p className="text-xs text-neutral-500 mt-1">Example: 8 and 15 (no common factor)</p>
                        <p className="text-xs text-amber-400 mt-1">LCM = Product = 8 × 15 = 120</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-2">Consecutive Numbers</h4>
                        <p className="text-sm text-neutral-400">Always co-prime!</p>
                        <p className="text-xs text-neutral-500 mt-1">Example: 7 and 8 → HCF = 1</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-2">HCF of Fractions</h4>
                        <MathText>{`\\frac{HCF(num)}{LCM(den)}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-2">LCM of Fractions</h4>
                        <MathText>{`\\frac{LCM(num)}{HCF(den)}`}</MathText>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Find HCF of 2/3 and 4/5"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> HCF of fractions = HCF(numerators) / LCM(denominators)</p>
                            <p>HCF(2, 4) = 2</p>
                            <p>LCM(3, 5) = 15</p>
                            <p>Answer = 2/15</p>
                        </div>
                    }
                    answer="2/15"
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="HCF & LCM Master Reference"
                    rows={[
                        { concept: 'Product Rule', formula: 'HCF × LCM = a × b' },
                        { concept: 'HCF (Prime)', formula: 'Common primes, LOWEST power' },
                        { concept: 'LCM (Prime)', formula: 'All primes, HIGHEST power' },
                        { concept: 'Co-prime', formula: 'HCF = 1, LCM = Product' },
                        { concept: 'HCF of Fractions', formula: 'HCF(num) / LCM(den)' },
                        { concept: 'LCM of Fractions', formula: 'LCM(num) / HCF(den)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
