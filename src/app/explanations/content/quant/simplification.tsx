"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function SimplificationContent() {
    return (
        <>
            <ConceptSection id="bodmas" title="The BODMAS Rule">
                <p>
                    <strong>BODMAS</strong> (or <strong>PEMDAS</strong> in the US) is the universal order for solving any mathematical expression.
                    If you follow this order, you will NEVER get the wrong answer.
                </p>

                <div className="grid grid-cols-6 gap-2 my-8 text-center">
                    {[
                        { l: 'B', n: 'Brackets', c: 'text-red-400', desc: '( ), [ ], { }' },
                        { l: 'O', n: 'Of / Orders', c: 'text-orange-400', desc: '×, Powers' },
                        { l: 'D', n: 'Division', c: 'text-yellow-400', desc: '÷' },
                        { l: 'M', n: 'Multiply', c: 'text-green-400', desc: '×' },
                        { l: 'A', n: 'Addition', c: 'text-blue-400', desc: '+' },
                        { l: 'S', n: 'Subtract', c: 'text-purple-400', desc: '−' },
                    ].map(({ l, n, c, desc }) => (
                        <div key={l} className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-600 transition-colors">
                            <div className={`text-3xl font-black ${c}`}>{l}</div>
                            <div className="text-xs text-neutral-400 mt-1">{n}</div>
                            <div className="text-[10px] text-neutral-600 mt-1">{desc}</div>
                        </div>
                    ))}
                </div>

                <TipBox title="The Priority Rule">
                    <strong>D and M have SAME priority</strong> (solve left to right). Same for <strong>A and S</strong>.
                    <br />Example: <code>8 ÷ 4 × 2</code> = <code>(8 ÷ 4) × 2</code> = <code>2 × 2</code> = <code>4</code> (NOT 8 ÷ 8 = 1)
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Solve: 12 + 8 ÷ 4 × 2 − 3"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Division first: 8 ÷ 4 = 2</p>
                            <p>Expression becomes: 12 + 2 × 2 − 3</p>
                            <p><strong>Step 2:</strong> Multiplication: 2 × 2 = 4</p>
                            <p>Expression becomes: 12 + 4 − 3</p>
                            <p><strong>Step 3:</strong> Addition: 12 + 4 = 16</p>
                            <p><strong>Step 4:</strong> Subtraction: 16 − 3 = 13</p>
                        </div>
                    }
                    answer="13"
                />

                <CheckUnderstanding
                    question="Solve: 5 + 3 × 2"
                    options={["16", "11", "10", "8"]}
                    correctIndex={1}
                    explanation="Multiplication before addition: 3 × 2 = 6, then 5 + 6 = 11. NOT (5+3) × 2 = 16."
                />
            </ConceptSection>

            {/* CONCEPT 2: BRACKETS */}
            <ConceptSection id="brackets" title="Nested Brackets">
                <p>
                    When you have multiple levels of brackets, ALWAYS solve the <strong>innermost bracket first</strong>.
                </p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                    <div className="text-3xl font-mono text-white">
                        <span className="text-red-400">{'{'}</span>
                        <span className="text-yellow-400">[</span>
                        <span className="text-green-400">(</span>
                        <span className="text-white">innermost</span>
                        <span className="text-green-400">)</span>
                        <span className="text-yellow-400">]</span>
                        <span className="text-red-400">{'}'}</span>
                    </div>
                    <p className="text-neutral-500 text-sm mt-4">
                        Order: <span className="text-green-400">( )</span> → <span className="text-yellow-400">[ ]</span> → <span className="text-red-400">{'{ }'}</span>
                    </p>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Solve: 25 − [10 − {8 − (6 − 4)}]"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Innermost ( ): 6 − 4 = 2</p>
                            <p>= 25 − [10 − {'{'}8 − 2{'}'}]</p>
                            <p><strong>Step 2:</strong> Next {'{ }'}: 8 − 2 = 6</p>
                            <p>= 25 − [10 − 6]</p>
                            <p><strong>Step 3:</strong> Outer [ ]: 10 − 6 = 4</p>
                            <p>= 25 − 4 = 21</p>
                        </div>
                    }
                    answer="21"
                />

                <CheckUnderstanding
                    question="What is the first operation in: 100 − [50 + {20 × (5 − 3)}]?"
                    options={["100 − 50", "50 + 20", "20 × 5", "5 − 3"]}
                    correctIndex={3}
                    explanation="Always start with innermost bracket. (5 − 3) is inside ( ), which is inside { }, which is inside [ ]."
                />
            </ConceptSection>

            {/* CONCEPT 3: SPEED TRICKS */}
            <ConceptSection id="tricks" title="Speed Tricks for Calculations">
                <p>In competitive exams, speed matters. Here are some tricks to calculate faster.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">Fraction Addition (Cross Multiply)</h4>
                        <MathText>{`\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}`}</MathText>
                        <p className="text-sm text-neutral-400 mt-2">Example: <MathText>{`\\frac{1}{3} + \\frac{1}{4} = \\frac{4+3}{12} = \\frac{7}{12}`}</MathText></p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">Squaring Numbers near 50</h4>
                        <p className="text-sm text-neutral-400">n² = (n − 50) × 100 + 25 + (n − 50)²</p>
                        <p className="text-sm text-white mt-2">Example: 52² = 2×100 + 25 + 4 = 2704</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">Multiply by 11</h4>
                        <p className="text-sm text-neutral-400">Split digits and add in middle</p>
                        <p className="text-sm text-white mt-2">Example: 36 × 11 = 3_(3+6)_6 = 396</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">Squaring Numbers near 100</h4>
                        <p className="text-sm text-neutral-400">n² = (n + diff) | (diff)²</p>
                        <p className="text-sm text-white mt-2">Example: 97² = (97−3) | 3² = 94|09 = 9409</p>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Calculate: 78 × 11 without pen/paper"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Trick:</strong> Split and add in middle</p>
                            <p>78 × 11 = 7_(7+8)_8 = 7_15_8</p>
                            <p>Since 15 {'>'} 9, carry the 1</p>
                            <p>= 8_5_8 = <strong>858</strong></p>
                        </div>
                    }
                    answer="858"
                />
            </ConceptSection>

            {/* CONCEPT 4: FRACTION TRICKS */}
            <ConceptSection id="fractions" title="Fraction Simplification">
                <p>Many simplification questions involve complex fractions. Master these conversions:</p>

                <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-900 text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">Percentage</th>
                                <th className="px-4 py-3">Fraction</th>
                                <th className="px-4 py-3">Decimal</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-400">
                            <tr className="border-b border-neutral-800"><td className="px-4 py-2">50%</td><td>1/2</td><td>0.5</td></tr>
                            <tr className="border-b border-neutral-800"><td className="px-4 py-2">25%</td><td>1/4</td><td>0.25</td></tr>
                            <tr className="border-b border-neutral-800"><td className="px-4 py-2">20%</td><td>1/5</td><td>0.2</td></tr>
                            <tr className="border-b border-neutral-800"><td className="px-4 py-2">12.5%</td><td>1/8</td><td>0.125</td></tr>
                            <tr className="border-b border-neutral-800"><td className="px-4 py-2">33.33%</td><td>1/3</td><td>0.333...</td></tr>
                            <tr><td className="px-4 py-2">16.67%</td><td>1/6</td><td>0.166...</td></tr>
                        </tbody>
                    </table>
                </div>

                <CheckUnderstanding
                    question="What is 37.5% as a fraction?"
                    options={["3/8", "2/5", "5/12", "3/10"]}
                    correctIndex={0}
                    explanation="37.5% = 37.5/100 = 375/1000 = 3/8. Or: 37.5 = 25 + 12.5 = 1/4 + 1/8 = 3/8."
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Simplification Master Reference"
                    rows={[
                        { concept: 'BODMAS Order', formula: 'B → O → D/M → A/S' },
                        { concept: '11 × n (2 digits)', formula: 'Split and add middle' },
                        { concept: '(a+b)²', formula: 'a² + 2ab + b²' },
                        { concept: '(a−b)²', formula: 'a² − 2ab + b²' },
                        { concept: 'a² − b²', formula: '(a+b)(a−b)' },
                        { concept: 'Fraction + Fraction', formula: '(ad + bc) / bd' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
