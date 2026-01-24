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

export default function TrigonometryContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">📐</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-500 text-xs font-bold uppercase tracking-widest mb-2 border border-teal-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Trigonometry</h1>
                    <p className="text-neutral-400 text-lg">Master the triangle ratios and solve heights & distances!</p>
                </div>
            </div>

            {/* FOUNDATION: RATIOS */}
            <ConceptSection id="basics" title="The 6 Golden Ratios" icon="⚡">
                <div className="bg-gradient-to-r from-teal-900/20 to-transparent p-6 rounded-xl border-l-4 border-teal-500 mb-6">
                    <p className="text-lg">
                        <strong>Mnemonics:</strong> "Some People Have / Curly Brown Hair / Through Proper Brushing"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 text-center">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 transform hover:scale-105 transition-transform">
                        <h4 className="text-teal-400 font-bold text-xl mb-2">sin θ</h4>
                        <MathText>{`\\frac{\\text{Perpendicular}}{\\text{Hypotenuse}}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 transform hover:scale-105 transition-transform">
                        <h4 className="text-teal-400 font-bold text-xl mb-2">cos θ</h4>
                        <MathText>{`\\frac{\\text{Base}}{\\text{Hypotenuse}}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 transform hover:scale-105 transition-transform">
                        <h4 className="text-teal-400 font-bold text-xl mb-2">tan θ</h4>
                        <MathText>{`\\frac{\\text{Perpendicular}}{\\text{Base}}`}</MathText>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <FormulaBox title="Reciprocals">
                        <div className="space-y-2 text-center text-sm">
                            <p><MathText>{`\\csc \\theta = 1/\\sin \\theta`}</MathText></p>
                            <p><MathText>{`\\sec \\theta = 1/\\cos \\theta`}</MathText></p>
                            <p><MathText>{`\\cot \\theta = 1/\\tan \\theta`}</MathText></p>
                        </div>
                    </FormulaBox>
                </div>

                <CheckUnderstanding
                    question="If sin θ = 3/5, what is tan θ?"
                    options={["4/5", "3/4", "5/3", "4/3"]}
                    correctIndex={1}
                    explanation="In right △: P=3, H=5. By Pythagoras, Base = √(5²−3²) = 4. So tan θ = P/B = 3/4."
                />
            </ConceptSection>

            {/* KEY TABLES */}
            <ConceptSection id="values" title="Standard Angles Table" icon="📊">
                <p className="mb-4">
                    Memorize these values. They are non-negotiable for SSC!
                </p>

                <div className="overflow-x-auto my-8 border border-neutral-800 rounded-xl">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-neutral-900 text-teal-400">
                            <tr>
                                <th className="px-4 py-3 border-b border-r border-neutral-800">θ</th>
                                <th className="px-4 py-3 border-b border-neutral-800">0°</th>
                                <th className="px-4 py-3 border-b border-neutral-800">30°</th>
                                <th className="px-4 py-3 border-b border-neutral-800">45°</th>
                                <th className="px-4 py-3 border-b border-neutral-800">60°</th>
                                <th className="px-4 py-3 border-b border-neutral-800">90°</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-300">
                            <tr className="border-b border-neutral-800 hover:bg-neutral-900/50">
                                <td className="px-4 py-3 font-bold border-r border-neutral-800">sin</td>
                                <td className="px-4 py-3">0</td>
                                <td className="px-4 py-3">1/2</td>
                                <td className="px-4 py-3">1/√2</td>
                                <td className="px-4 py-3">√3/2</td>
                                <td className="px-4 py-3">1</td>
                            </tr>
                            <tr className="border-b border-neutral-800 hover:bg-neutral-900/50">
                                <td className="px-4 py-3 font-bold border-r border-neutral-800">cos</td>
                                <td className="px-4 py-3">1</td>
                                <td className="px-4 py-3">√3/2</td>
                                <td className="px-4 py-3">1/√2</td>
                                <td className="px-4 py-3">1/2</td>
                                <td className="px-4 py-3">0</td>
                            </tr>
                            <tr className="hover:bg-neutral-900/50">
                                <td className="px-4 py-3 font-bold border-r border-neutral-800">tan</td>
                                <td className="px-4 py-3">0</td>
                                <td className="px-4 py-3">1/√3</td>
                                <td className="px-4 py-3">1</td>
                                <td className="px-4 py-3">√3</td>
                                <td className="px-4 py-3">∞</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <TipBox title="Memory Trick">
                    <p className="text-sm">
                        Write 0, 1, 2, 3, 4. Divide all by 4. Take square root.<br />
                        √(0/4)=<strong>0</strong>, √(1/4)=<strong>1/2</strong>, √(2/4)=<strong>1/√2</strong>, √(3/4)=<strong>√3/2</strong>, √(4/4)=<strong>1</strong>.
                        These are the sine values!
                    </p>
                </TipBox>
            </ConceptSection>

            {/* IDENTITIES */}
            <ConceptSection id="identities" title="The 3 Pythagorean Identities" icon="🔑">
                <div className="space-y-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-teal-500/30">
                        <h4 className="text-teal-400 font-bold mb-3 text-center">Identity 1: The Classic</h4>
                        <div className="text-center">
                            <MathText className="text-2xl">{`\\sin^2\\theta + \\cos^2\\theta = 1`}</MathText>
                            <div className="mt-2 text-xs text-neutral-500">
                                Derived: sin²θ = 1 − cos²θ
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30 text-center">
                            <h4 className="text-amber-400 font-bold mb-3">Identity 2 (Sec-Tan)</h4>
                            <MathText className="text-xl">{`\\sec^2\\theta - \\tan^2\\theta = 1`}</MathText>
                            <p className="text-xs text-neutral-500 mt-2">So, (sec−tan)(sec+tan) = 1</p>
                            <p className="text-xs text-white mt-1">If sec+tan=x, then sec−tan=1/x</p>
                        </div>

                        <div className="p-5 bg-neutral-900 rounded-xl border border-blue-500/30 text-center">
                            <h4 className="text-blue-400 font-bold mb-3">Identity 3 (Cosec-Cot)</h4>
                            <MathText className="text-xl">{`\\csc^2\\theta - \\cot^2\\theta = 1`}</MathText>
                            <p className="text-xs text-neutral-500 mt-2">So, (csc−cot)(csc+cot) = 1</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="If sec θ + tan θ = 2, find sec θ."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Property:</strong> sec²θ − tan²θ = 1 → (sec+tan)(sec−tan) = 1</p>
                            <p>Since sec+tan = 2, then <strong>sec−tan = 1/2</strong></p>
                            <p>Add both equations:</p>
                            <p>(sec+tan) + (sec−tan) = 2 + 0.5</p>
                            <p>2 sec θ = 2.5</p>
                            <p>sec θ = <strong>1.25</strong></p>
                        </div>
                    }
                    answer="1.25"
                />
            </ConceptSection>

            {/* VALUE PUTTING */}
            <ConceptSection id="value-putting" title="The 'Value Putting' Method" icon="🎯">
                <p className="mb-4">
                    In objective exams, <strong>don't solve traditionally!</strong> Put θ = 0°, 30°, or 45° to check options.
                </p>

                <div className="my-6 p-6 bg-violet-500/10 rounded-xl border border-violet-500/30">
                    <h4 className="text-violet-400 font-bold mb-3">Golden Rules for Value Putting:</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-neutral-300">
                        <li><strong>Try 0° or 90° first</strong> (unless it makes denominator 0).</li>
                        <li><strong>Avoid ∞:</strong> Don't put 90° for tan/sec or 0° for cot/csc.</li>
                        <li><strong>Safe bet:</strong> θ = 45° works for most sin/cos/tan questions.</li>
                        <li><strong>Check options:</strong> Ensure different options don't give same value.</li>
                    </ul>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Find value of (1 + cot θ − csc θ)(1 + tan θ + sec θ)"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Traditional way:</strong> 2 pages of algebra.</p>
                            <p><strong>Smart way:</strong> Put θ = 45°</p>
                            <p>cot 45° = 1, tan 45° = 1, csc 45° = √2, sec 45° = √2</p>
                            <p>Substitute:</p>
                            <p>= (1 + 1 − √2)(1 + 1 + √2)</p>
                            <p>= (2 − √2)(2 + √2)</p>
                            <p>= 2² − (√2)² = 4 − 2 = <strong>2</strong></p>
                        </div>
                    }
                    answer="2"
                />
            </ConceptSection>

            {/* QUADRANTS */}
            <ConceptSection id="quadrants" title="ASTC (All Silver Tea Cups)" icon="🔄">
                <div className="grid grid-cols-2 gap-4 my-6 text-center text-sm">
                    <div className="p-4 bg-neutral-800 rounded-lg">
                        <div className="text-neutral-500">2nd Quadrant (90-180°)</div>
                        <div className="text-amber-400 font-bold">Sin / Csc positive</div>
                        <div className="text-xs mt-1">Others negative</div>
                    </div>
                    <div className="p-4 bg-neutral-800 rounded-lg border-2 border-teal-500/30">
                        <div className="text-neutral-500">1st Quadrant (0-90°)</div>
                        <div className="text-teal-400 font-bold">ALL positive</div>
                        <div className="text-xs mt-1">Everything :)</div>
                    </div>
                    <div className="p-4 bg-neutral-800 rounded-lg">
                        <div className="text-neutral-500">3rd Quadrant (180-270°)</div>
                        <div className="text-amber-400 font-bold">Tan / Cot positive</div>
                        <div className="text-xs mt-1">Others negative</div>
                    </div>
                    <div className="p-4 bg-neutral-800 rounded-lg">
                        <div className="text-neutral-500">4th Quadrant (270-360°)</div>
                        <div className="text-amber-400 font-bold">Cos / Sec positive</div>
                        <div className="text-xs mt-1">Others negative</div>
                    </div>
                </div>

                <CheckUnderstanding
                    question="Is cos(120°) positive or negative?"
                    options={["Positive", "Negative", "Zero", "Undefined"]}
                    correctIndex={1}
                    explanation="120° is in 2nd Quadrant. Only Sin/Csc are positive clearly. So Cos is negative."
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing Inverse</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            sin⁻¹x (arcsin) is NOT 1/sin x (cosecant). They are totally different things!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting Quadrant Signs</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            √x² is always positive distance, but coordinates can be negative. Check ASTC rule!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Value Putting Blindly</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            If you get 0/0 or 1/0, your chosen angle is INVALID. Try a different angle!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Trigonometry Master Reference"
                    rows={[
                        { concept: 'SOH CAH TOA', formula: 'sin=P/H, cos=B/H, tan=P/B' },
                        { concept: 'Pythagoras', formula: '\\sin^2\\theta + \\cos^2\\theta = 1' },
                        { concept: 'Sec-Tan', formula: '\\sec^2\\theta - \\tan^2\\theta = 1' },
                        { concept: 'Cosec-Cot', formula: '\\csc^2\\theta - \\cot^2\\theta = 1' },
                        { concept: 'Value Putting', formula: 'Try 45° for tan/cot problems' },
                        { concept: 'ASTC Rule', formula: 'All, Sin, Tan, Cos positive' },
                        { concept: 'Reciprocal', formula: '\\sec\\theta + \\tan\\theta = 1/(\\sec\\theta - \\tan\\theta)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
