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

export default function Mensuration2DContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">📐</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-2 border border-pink-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mensuration 2D</h1>
                    <p className="text-neutral-400 text-lg">Area & Perimeter of flat shapes — formula-heavy but rewarding!</p>
                </div>
            </div>

            {/* TRIANGLES */}
            <ConceptSection id="triangles" title="Triangles" icon="🔺">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <FormulaBox title="Basic Triangle Area">
                        <div className="text-center">
                            <MathText className="text-xl">{`Area = \\frac{1}{2} \\times base \\times height`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="Heron's Formula">
                        <div className="text-center">
                            <MathText className="text-lg">{`Area = \\sqrt{s(s-a)(s-b)(s-c)}`}</MathText>
                            <p className="text-neutral-500 text-xs mt-2">where s = (a+b+c)/2</p>
                        </div>
                    </FormulaBox>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl text-center">
                        <h4 className="text-pink-400 font-bold mb-2">Equilateral △</h4>
                        <MathText>{`Area = \\frac{\\sqrt{3}}{4}a^2`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Height = (√3/2)a</p>
                    </div>
                    <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl text-center">
                        <h4 className="text-pink-400 font-bold mb-2">Right △</h4>
                        <MathText>{`Area = \\frac{1}{2}ab`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">legs a, b as base & height</p>
                    </div>
                    <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl text-center">
                        <h4 className="text-pink-400 font-bold mb-2">Isosceles △</h4>
                        <MathText>{`Area = \\frac{b}{4}\\sqrt{4a^2 - b^2}`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">a = equal sides, b = base</p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Find area of a triangle with sides 5, 6, and 7 cm."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using Heron's:</strong> s = (5+6+7)/2 = 9</p>
                            <p>Area = √[9 × (9−5) × (9−6) × (9−7)]</p>
                            <p>= √[9 × 4 × 3 × 2] = √216 = <strong>6√6 cm²</strong></p>
                        </div>
                    }
                    answer="6√6 ≈ 14.7 cm²"
                />

                <CheckUnderstanding
                    question="Area of equilateral triangle with side 6 cm = ?"
                    options={["9 cm²", "9√3 cm²", "18 cm²", "36√3 cm²"]}
                    correctIndex={1}
                    explanation="(√3/4) × 6² = (√3/4) × 36 = 9√3 cm²"
                />
            </ConceptSection>

            {/* RECTANGLES & SQUARES */}
            <ConceptSection id="rectangles" title="Rectangles & Squares" icon="⬜">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-4 text-center text-lg">Rectangle</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Area</span>
                                <MathText>{`l \\times b`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Perimeter</span>
                                <MathText>{`2(l + b)`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Diagonal</span>
                                <MathText>{`\\sqrt{l^2 + b^2}`}</MathText>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-4 text-center text-lg">Square</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Area</span>
                                <MathText>{`a^2`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Perimeter</span>
                                <MathText>{`4a`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Diagonal</span>
                                <MathText>{`a\\sqrt{2}`}</MathText>
                            </div>
                        </div>
                    </div>
                </div>

                <TipBox title="Quick Relationship">
                    <p className="text-sm">
                        For a square: Area = (Diagonal)² / 2<br />
                        For a rectangle: If perimeter P and area A are given, sides can be found using quadratic!
                    </p>
                </TipBox>
            </ConceptSection>

            {/* PARALLELOGRAM, RHOMBUS, TRAPEZIUM */}
            <ConceptSection id="quadrilaterals" title="Other Quadrilaterals" icon="⬛">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-amber-400 font-bold mb-3">Parallelogram</h4>
                        <MathText>{`Area = base \\times height`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Also: d₁×d₂×sin(θ)/2</p>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-emerald-400 font-bold mb-3">Rhombus</h4>
                        <MathText>{`Area = \\frac{d_1 \\times d_2}{2}`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Diagonals bisect at 90°</p>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-cyan-400 font-bold mb-3">Trapezium</h4>
                        <MathText>{`Area = \\frac{(a+b)}{2} \\times h`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">a, b = parallel sides</p>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="easy"
                    question="Rhombus with diagonals 10 cm and 8 cm. Find area."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> Area = (d₁ × d₂) / 2</p>
                            <p>= (10 × 8) / 2 = 80/2 = <strong>40 cm²</strong></p>
                        </div>
                    }
                    answer="40 cm²"
                />
            </ConceptSection>

            {/* CIRCLES */}
            <ConceptSection id="circles" title="Circles, Sectors & Arcs" icon="⭕">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-pink-500/30">
                        <h4 className="text-pink-400 font-bold mb-4 text-center">Full Circle</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Area</span>
                                <MathText>{`\\pi r^2`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Circumference</span>
                                <MathText>{`2\\pi r`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Diameter</span>
                                <MathText>{`2r`}</MathText>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-4 text-center">Sector & Arc (angle θ°)</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Sector Area</span>
                                <MathText>{`\\frac{\\theta}{360} \\times \\pi r^2`}</MathText>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-400">Arc Length</span>
                                <MathText>{`\\frac{\\theta}{360} \\times 2\\pi r`}</MathText>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <FormulaBox title="Ring (Annulus)">
                        <div className="text-center">
                            <MathText>{`Area = \\pi(R^2 - r^2)`}</MathText>
                            <p className="text-xs text-neutral-500 mt-1">R = outer, r = inner radius</p>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="Semicircle">
                        <div className="text-center">
                            <MathText>{`Area = \\frac{\\pi r^2}{2}`}</MathText>
                            <p className="text-xs text-neutral-500 mt-1">Perimeter = πr + 2r</p>
                        </div>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="Find area of a 60° sector with radius 7 cm. (π = 22/7)"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> (θ/360) × πr²</p>
                            <p>= (60/360) × (22/7) × 7²</p>
                            <p>= (1/6) × (22/7) × 49</p>
                            <p>= (1/6) × 22 × 7 = 154/6 = <strong>25.67 cm²</strong></p>
                        </div>
                    }
                    answer="25.67 cm²"
                />

                <CheckUnderstanding
                    question="Arc length of a 90° sector with radius 14 cm = ? (π = 22/7)"
                    options={["11 cm", "22 cm", "44 cm", "88 cm"]}
                    correctIndex={1}
                    explanation="(90/360) × 2 × (22/7) × 14 = (1/4) × 88 = 22 cm"
                />
            </ConceptSection>

            {/* PATHWAYS & BORDERS */}
            <ConceptSection id="pathways" title="Pathways & Borders" icon="🛤️">
                <p className="mb-4">
                    Common in SSC: A path runs around a field. Find the path area = Outer area − Inner area.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-3">Rectangular Path (outside)</h4>
                        <p className="text-sm text-neutral-300">
                            Field: L × B, Path width: w<br />
                            Outer: (L+2w) × (B+2w)<br />
                            <strong>Path Area = Outer − Field</strong>
                        </p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-3">Circular Path (ring)</h4>
                        <p className="text-sm text-neutral-300">
                            Inner radius: r, Path width: w<br />
                            <strong>Path Area = π[(r+w)² − r²]</strong>
                        </p>
                    </div>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="A 60m × 40m field has a 5m wide path around it. Find path area."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Outer dimensions:</strong> (60+10) × (40+10) = 70 × 50 = 3500 m²</p>
                            <p><strong>Inner (field):</strong> 60 × 40 = 2400 m²</p>
                            <p><strong>Path area:</strong> 3500 − 2400 = <strong>1100 m²</strong></p>
                        </div>
                    }
                    answer="1100 m²"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing Perimeter with Area</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Perimeter is length (cm, m). Area is squared (cm², m²). Watch units!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting 2w in Pathway Problems</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Path goes on BOTH sides! L becomes (L + 2w), not (L + w).
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong s in Heron's Formula</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            s = (a+b+c)/2, then use (s−a), (s−b), (s−c). Don't forget the 2!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Using πr for Area</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Area = πr². Circumference = 2πr (or πd). Don't mix them up!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="2D Mensuration Master Reference"
                    rows={[
                        { concept: 'Triangle', formula: '\\frac{1}{2} \\times b \\times h' },
                        { concept: 'Equilateral △', formula: '\\frac{\\sqrt{3}}{4}a^2' },
                        { concept: 'Rectangle', formula: 'l \\times b' },
                        { concept: 'Square', formula: 'a^2' },
                        { concept: 'Parallelogram', formula: 'b \\times h' },
                        { concept: 'Rhombus', formula: '\\frac{d_1 \\times d_2}{2}' },
                        { concept: 'Trapezium', formula: '\\frac{(a+b)}{2} \\times h' },
                        { concept: 'Circle', formula: '\\pi r^2' },
                        { concept: 'Sector', formula: '\\frac{\\theta}{360} \\times \\pi r^2' },
                        { concept: 'Ring', formula: '\\pi(R^2 - r^2)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
