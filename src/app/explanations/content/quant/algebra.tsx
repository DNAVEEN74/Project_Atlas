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

export default function AlgebraContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] font-bold text-violet-500/10 select-none font-mono">x² + y²</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-500 text-xs font-bold uppercase tracking-widest mb-2 border border-violet-500/20">
                        Phase 04: Advanced Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Algebra</h1>
                    <p className="text-neutral-400 text-lg">Master identities to solve questions in seconds.</p>
                </div>
            </div>

            {/* CONCEPT 1: WHY ALGEBRA MATTERS */}
            <ConceptSection id="intro" title="Why Algebra is a Cheat Code" icon="🔑">
                <p>
                    Algebra in SSC isn't about solving equations. It's about <strong>recognizing patterns</strong>
                    and <strong>applying identities</strong> to simplify complex expressions instantly.
                </p>

                <div className="my-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                    <p className="text-violet-400 font-bold">The Secret:</p>
                    <p className="text-neutral-300">
                        80% of SSC algebra questions can be solved by just knowing 5-6 identities.
                        Don't expand blindly—pattern match first!
                    </p>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: SQUARE IDENTITIES */}
            <ConceptSection id="squares" title="The Square Identities" icon="²">
                <p>These are your bread and butter. Know them forward AND backward.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <FormulaBox title="Identity 1: (a + b)²">
                        <MathText>{`(a + b)^2 = a^2 + 2ab + b^2`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Identity 2: (a − b)²">
                        <MathText>{`(a - b)^2 = a^2 - 2ab + b^2`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Identity 3: a² − b²">
                        <MathText>{`a^2 - b^2 = (a + b)(a - b)`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Derived: (a + b)² − (a − b)²">
                        <MathText>{`(a+b)^2 - (a-b)^2 = 4ab`}</MathText>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Find the value of 103² − 97²"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Recognize:</strong> This is a² − b² form!</p>
                            <p>= (103 + 97)(103 − 97)</p>
                            <p>= 200 × 6 = 1200</p>
                            <p className="text-amber-400 text-xs mt-2">Without this, you'd compute 10609 − 9409 = 1200 (much slower!)</p>
                        </div>
                    }
                    answer="1200"
                />

                <CheckUnderstanding
                    question="If a + b = 7 and ab = 12, find a² + b²"
                    options={["49", "25", "37", "61"]}
                    correctIndex={1}
                    explanation="Use: a² + b² = (a+b)² − 2ab = 49 − 24 = 25"
                />
            </ConceptSection>

            {/* CONCEPT 3: CUBE IDENTITIES */}
            <ConceptSection id="cubes" title="The Cube Identities" icon="³">
                <p>Slightly harder, but equally important for SSC Tier-II.</p>

                <div className="space-y-4 my-6">
                    <FormulaBox title="(a + b)³">
                        <MathText>{`(a + b)^3 = a^3 + b^3 + 3ab(a + b)`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="(a − b)³">
                        <MathText>{`(a - b)^3 = a^3 - b^3 - 3ab(a - b)`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="a³ + b³ (Sum of Cubes)">
                        <MathText>{`a^3 + b^3 = (a + b)(a^2 - ab + b^2)`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="a³ − b³ (Difference of Cubes)">
                        <MathText>{`a^3 - b^3 = (a - b)(a^2 + ab + b^2)`}</MathText>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="If a + b = 5 and ab = 6, find a³ + b³"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Method 1 (Direct):</strong> Find a, b first</p>
                            <p>a + b = 5, ab = 6 → a=2, b=3 or a=3, b=2</p>
                            <p>a³ + b³ = 8 + 27 = 35</p>
                            <hr className="my-2 border-neutral-700" />
                            <p><strong>Method 2 (Formula):</strong></p>
                            <p>a³ + b³ = (a+b)³ − 3ab(a+b)</p>
                            <p>= 125 − 3(6)(5) = 125 − 90 = 35</p>
                        </div>
                    }
                    answer="35"
                />
            </ConceptSection>

            {/* CONCEPT 4: x + 1/x PATTERN */}
            <ConceptSection id="reciprocal" title="The x + 1/x Family" icon="🔄">
                <p>
                    These patterns appear in <strong>90% of algebra questions</strong> in SSC. Master them completely!
                </p>

                <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-900 text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">If you know...</th>
                                <th className="px-4 py-3">You can find...</th>
                                <th className="px-4 py-3">Formula</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-400">
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3"><MathText>{`x + \\frac{1}{x} = k`}</MathText></td>
                                <td><MathText>{`x^2 + \\frac{1}{x^2}`}</MathText></td>
                                <td className="text-violet-400"><MathText>{`k^2 - 2`}</MathText></td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3"><MathText>{`x + \\frac{1}{x} = k`}</MathText></td>
                                <td><MathText>{`x^3 + \\frac{1}{x^3}`}</MathText></td>
                                <td className="text-violet-400"><MathText>{`k^3 - 3k`}</MathText></td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3"><MathText>{`x - \\frac{1}{x} = k`}</MathText></td>
                                <td><MathText>{`x^2 + \\frac{1}{x^2}`}</MathText></td>
                                <td className="text-violet-400"><MathText>{`k^2 + 2`}</MathText></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3"><MathText>{`x - \\frac{1}{x} = k`}</MathText></td>
                                <td><MathText>{`x^3 - \\frac{1}{x^3}`}</MathText></td>
                                <td className="text-violet-400"><MathText>{`k^3 + 3k`}</MathText></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="If x + 1/x = 3, find x² + 1/x²"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Direct formula:</strong></p>
                            <p>x² + 1/x² = (x + 1/x)² − 2</p>
                            <p>= 3² − 2 = 9 − 2 = 7</p>
                        </div>
                    }
                    answer="7"
                />

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="If x + 1/x = 4, find x³ + 1/x³"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using shortcut:</strong> k³ − 3k</p>
                            <p>= 4³ − 3(4)</p>
                            <p>= 64 − 12 = 52</p>
                        </div>
                    }
                    answer="52"
                />

                <CheckUnderstanding
                    question="If x − 1/x = 2, find x² + 1/x²"
                    options={["2", "4", "6", "8"]}
                    correctIndex={2}
                    explanation="For x − 1/x, use: x² + 1/x² = k² + 2 = 4 + 2 = 6"
                />
            </ConceptSection>

            {/* CONCEPT 5: SPECIAL VALUES */}
            <ConceptSection id="special" title="Special Values to Remember" icon="⭐">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-violet-400 font-bold">x + 1/x = 2</p>
                        <p className="text-lg text-white mt-2">x = 1</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-violet-400 font-bold">x + 1/x = −2</p>
                        <p className="text-lg text-white mt-2">x = −1</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-violet-400 font-bold">x − 1/x = 0</p>
                        <p className="text-lg text-white mt-2">x = ±1</p>
                    </div>
                </div>

                <TipBox title="The Golden Trick">
                    If x + 1/x = 2, then x = 1, and ALL powers become trivial:
                    x² + 1/x² = 2, x³ + 1/x³ = 2, x¹⁰⁰ + 1/x¹⁰⁰ = 2
                </TipBox>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Algebra Master Reference"
                    rows={[
                        { concept: '(a+b)²', formula: 'a² + 2ab + b²' },
                        { concept: '(a−b)²', formula: 'a² − 2ab + b²' },
                        { concept: 'a² − b²', formula: '(a+b)(a−b)' },
                        { concept: 'a³ + b³', formula: '(a+b)(a²−ab+b²)' },
                        { concept: 'x+1/x → x²+1/x²', formula: 'k² − 2' },
                        { concept: 'x+1/x → x³+1/x³', formula: 'k³ − 3k' },
                        { concept: 'x−1/x → x²+1/x²', formula: 'k² + 2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
