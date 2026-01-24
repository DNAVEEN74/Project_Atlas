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

export default function CountingFiguresContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🔺</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2 border border-indigo-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Counting Figures</h1>
                    <p className="text-neutral-400 text-lg">Don't count 1-by-1! Use the magic formulas.</p>
                </div>
            </div>

            {/* CONCEPT 1: TRIANGLES */}
            <ConceptSection id="triangles" title="Counting Triangles" icon="🔺">
                <p>Standard patterns appear in 90% of questions. Memorize these!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    {/* Pattern 1 */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-indigo-500/30">
                        <h4 className="text-indigo-400 font-bold mb-4">Type 1: Vertex to Base</h4>
                        <div className="mb-4 flex justify-center">
                            {/* Visual representation could go here */}
                            <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-indigo-500 relative">
                                <div className="absolute top-[50px] left-[-30px] w-[60px] h-[1px] bg-white"></div>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-300">If a triangle is divided by 'n' vertical lines from vertex:</p>
                        <p className="text-sm text-neutral-300 mt-2">Number the parts: 1, 2, 3...</p>
                        <FormulaBox variant="secondary">
                            <MathText>{`\\text{Total} = 1 + 2 + 3 + ... + n`}</MathText>
                        </FormulaBox>
                    </div>

                    {/* Pattern 2 */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-indigo-500/30">
                        <h4 className="text-indigo-400 font-bold mb-4">Type 2: Triangle in Box</h4>
                        <p className="text-sm text-neutral-300">If a square/rectangle has diagonals crossing:</p>
                        <p className="text-sm text-neutral-300 mt-2">Count small triangles (n) and double it.</p>
                        <FormulaBox variant="secondary">
                            <MathText>{`\\text{Total} = 2n`}</MathText>
                        </FormulaBox>
                        <p className="text-xs text-neutral-500 mt-2">Example: 4 small triangles → 8 total.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    {/* Pattern 3 */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-indigo-500/30">
                        <h4 className="text-indigo-400 font-bold mb-4">Type 3: Triangle inside Triangle</h4>
                        <p className="text-sm text-neutral-300">A triangle inside a triangle (touching midpoints) creates 4 small triangles.</p>
                        <FormulaBox variant="secondary">
                            <MathText>{`\\text{Total} = 4n + 1`}</MathText>
                        </FormulaBox>
                        <p className="text-xs text-neutral-500 mt-2">n = number of inner triangles</p>
                    </div>

                    {/* Pattern 4 */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-indigo-500/30">
                        <h4 className="text-indigo-400 font-bold mb-4">Type 4: Star Pattern</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li><strong>5-Point Star:</strong> 10 Triangles (5 small + 5 big)</li>
                            <li><strong>6-Point Star (Davids Star):</strong> 8 Triangles (6 small + 2 big)</li>
                        </ul>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: SQUARES & RECTANGLES */}
            <ConceptSection id="squares" title="Counting Squares & Rectangles" icon="⬜">
                <p>For a Grid of size m × n:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-4">Counting SQUARES</h4>
                        <p className="text-sm text-neutral-300 mb-2">Multiply dimensions and decrease by 1 until 0.</p>
                        <FormulaBox>
                            <MathText>{`(m \\times n) + (m-1)(n-1) + ...`}</MathText>
                        </FormulaBox>
                        <p className="text-xs text-neutral-500 mt-2">Example 3×2 grid: (3×2) + (2×1) = 6 + 2 = 8 squares</p>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold mb-4">Counting RECTANGLES</h4>
                        <p className="text-sm text-neutral-300 mb-2">Sum of row parts × Sum of column parts.</p>
                        <FormulaBox>
                            <MathText>{`\\text{Rects} = \\frac{m(m+1)}{2} \\times \\frac{n(n+1)}{2}`}</MathText>
                        </FormulaBox>
                        <p className="text-xs text-neutral-500 mt-2">Note: This Includes squares! (Every square is a rectangle)</p>
                    </div>
                </div>

                <TipBox title="Only Rectangles?">
                    If question asks for "Only Rectangles" (excluding squares):
                    <br /><strong>Result = Total Rectangles − Total Squares</strong>
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 3: LINES & CIRCLES */}
            <ConceptSection id="lines" title="Lines & Circles" icon="⚪">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Straight Lines</h4>
                        <p className="text-sm text-neutral-400">Count in 3 groups to avoid confusion:</p>
                        <ol className="list-decimal list-inside text-sm text-neutral-300 mt-2">
                            <li>Horizontal Lines</li>
                            <li>Vertical Lines</li>
                            <li>Slanting Lines</li>
                        </ol>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Circles</h4>
                        <p className="text-sm text-neutral-400">
                            Simply count them!
                            <br /><strong>Trick:</strong> Look for intersections. Often circles don't overlap in a way that creates 'new' circles, unlike triangles.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* EXAMPLE */}
            <ConceptSection id="example" title="Solved Example" icon="📝">
                <ExampleCard
                    number={1}
                    difficulty="hard"
                    question="How many squares in a 4×4 Chessboard?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Grid Size:</strong> 4 × 4 (Symmetric)</p>
                            <p><strong>Formula:</strong> 1² + 2² + 3² + 4²</p>
                            <p>= 1 + 4 + 9 + 16</p>
                            <p>= <strong>30 Squares</strong></p>
                        </div>
                    }
                    answer="30"
                />

                <CheckUnderstanding
                    question="How many rectangles in a 2×2 grid?"
                    options={["4", "5", "9", "8"]}
                    correctIndex={2}
                    explanation="Sum of row parts (1+2)=3. Sum of col parts (1+2)=3. Total = 3×3 = 9. (Includes the 4 small squares, 1 big square, 4 rectangles)."
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Counting Figures Master Reference"
                    rows={[
                        { concept: 'Triangle (Vertex)', formula: 'Sum of parts (1+2+...)' },
                        { concept: 'Triangle (Box)', formula: '2 × Small Triangles' },
                        { concept: 'Squares (m×n)', formula: 'Σ (m-k)(n-k)' },
                        { concept: 'Rectangles (m×n)', formula: 'Sum(rows) × Sum(cols)' },
                        { concept: 'Star (5-point)', formula: '10 Triangles' },
                        { concept: 'Star (6-point)', formula: '8 Triangles' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
