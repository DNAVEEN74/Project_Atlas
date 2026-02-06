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
import { WarningIcon } from '@/components/icons';

export default function AlgebraContent() {
    return (
        <>
            <ConceptSection id="intro" title="Why Algebra is a Cheat Code">
                <p>
                    Algebra in SSC isn&apos;t about solving equations. It&apos;s about <strong>recognizing patterns</strong>
                    and <strong>applying identities</strong> to simplify complex expressions instantly.
                </p>

                <div className="my-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-amber-400 font-bold">The Secret:</p>
                    <p className="text-neutral-300">
                        80% of SSC algebra questions can be solved by just knowing 5-6 identities.
                        Don&apos;t expand blindly—pattern match first!
                    </p>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: SQUARE IDENTITIES */}
            <ConceptSection id="squares" title="The Square Identities">
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
                            <p className="text-amber-400 text-xs mt-2">Without this, you&apos;d compute 10609 − 9409 = 1200 (much slower!)</p>
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
            <ConceptSection id="cubes" title="The Cube Identities">
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
            <ConceptSection id="reciprocal" title="The x + 1/x Family">
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
                        <tbody className="text-white">
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-mono">x + 1/x</td>
                                <td className="px-4 py-3 font-mono">x² + 1/x²</td>
                                <td className="px-4 py-3 text-amber-400 font-bold">k² − 2</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-mono">x − 1/x</td>
                                <td className="px-4 py-3 font-mono">x² + 1/x²</td>
                                <td className="px-4 py-3 text-amber-400 font-bold">k² + 2</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-mono">x + 1/x</td>
                                <td className="px-4 py-3 font-mono">x³ + 1/x³</td>
                                <td className="px-4 py-3 text-amber-400 font-bold">k³ − 3k</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono">x − 1/x</td>
                                <td className="px-4 py-3 font-mono">x³ − 1/x³</td>
                                <td className="px-4 py-3 text-amber-400 font-bold">k³ + 3k</td>
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
            <ConceptSection id="special" title="Special Values to Remember">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-amber-400 font-bold">x + 1/x = 2</p>
                        <p className="text-lg text-white mt-2">x = 1</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-amber-400 font-bold">x + 1/x = −2</p>
                        <p className="text-lg text-white mt-2">x = −1</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-amber-400 font-bold">x − 1/x = 0</p>
                        <p className="text-lg text-white mt-2">x = ±1</p>
                    </div>
                </div>

                <TipBox title="The Golden Trick">
                    If x + 1/x = 2, then x = 1, and ALL powers become trivial:
                    x² + 1/x² = 2, x³ + 1/x³ = 2, x¹⁰⁰ + 1/x¹⁰⁰ = 2
                </TipBox>
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> (a + b)² ≠ a² + b²</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Don&apos;t forget the middle term! (a + b)² = a² + <strong>2ab</strong> + b²
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Confusing k² − 2 vs k² + 2</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            x + 1/x → use k² − 2 (minus). x − 1/x → use k² + 2 (plus). Notice the switch!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Expanding Instead of Pattern Matching</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            103² − 97² → Don&apos;t calculate squares! Use (a+b)(a−b) = 200 × 6 = 1200
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Wrong Sign in Cube Identities</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            a³ + b³ = (a+b)(a² − ab + b²) has MINUS ab.<br />
                            a³ − b³ = (a−b)(a² + ab + b²) has PLUS ab.
                        </p>
                    </div>
                </div>
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
        </>
    );
}
