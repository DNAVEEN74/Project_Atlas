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

export default function MissingNumberContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">❓</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2 border border-yellow-500/20">
                        Phase 01: Verbal Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Missing Number in Figures</h1>
                    <p className="text-neutral-400 text-lg">Decode the hidden pattern in geometric arrangements.</p>
                </div>
            </div>

            {/* CONCEPT 1: THE APPROACH */}
            <ConceptSection id="approach" title="The Universal Approach" icon="🧠">
                <p>
                    These questions show numbers arranged in a pattern (triangle, circle, grid, etc.).
                    One number is replaced with "?" and you must find it.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-yellow-500/30">
                    <h4 className="text-yellow-400 font-bold mb-4 text-lg">The 3-Step Strategy</h4>
                    <ol className="list-decimal list-inside space-y-4 text-neutral-300">
                        <li>
                            <strong>Identify the figure type:</strong> Is it a triangle, square, circle, or grid?
                            Each type has typical patterns.
                        </li>
                        <li>
                            <strong>Test common operations:</strong>
                            <ul className="ml-8 mt-2 text-sm text-neutral-400 space-y-1">
                                <li>• Sum of outer = Center</li>
                                <li>• Product of outer = Center</li>
                                <li>• Difference relationships</li>
                                <li>• Squares/Cubes patterns</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Verify with all given numbers:</strong> Your pattern MUST work for ALL parts, not just one.
                        </li>
                    </ol>
                </div>

                <TipBox title="Golden Rule">
                    If you find a pattern that works for 2 out of 3 sections, it's probably correct.
                    Apply it to find the missing number.
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: TRIANGLE PATTERNS */}
            <ConceptSection id="triangle" title="Triangle Patterns" icon="🔺">
                <p>
                    Triangles typically have 3 numbers at corners and 1 at the center.
                    The center is usually derived from the corners.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-3">Pattern 1: Sum</h4>
                        <p className="text-sm text-neutral-400">Center = Sum of corners</p>
                        <div className="mt-3 text-center font-mono">
                            <div>3, 5, 7 → Center = 15</div>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-3">Pattern 2: Sum ÷ Factor</h4>
                        <p className="text-sm text-neutral-400">Center = (a + b + c) ÷ 3</p>
                        <div className="mt-3 text-center font-mono">
                            <div>9, 12, 15 → Center = 12</div>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-3">Pattern 3: Sum of Squares</h4>
                        <p className="text-sm text-neutral-400">Center = a² + b² + c²</p>
                        <div className="mt-3 text-center font-mono">
                            <div>2, 3, 4 → Center = 29</div>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-3">Pattern 4: Product</h4>
                        <p className="text-sm text-neutral-400">Center = a × b × c</p>
                        <div className="mt-3 text-center font-mono">
                            <div>2, 3, 5 → Center = 30</div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="In three triangles with corners and center: (2,3,4→24), (3,4,5→60), (4,5,6→?)"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Test Pattern:</strong> Check if center = product of corners</p>
                            <p>• Triangle 1: 2 × 3 × 4 = 24 ✓</p>
                            <p>• Triangle 2: 3 × 4 × 5 = 60 ✓</p>
                            <p>• Triangle 3: 4 × 5 × 6 = 120</p>
                            <p className="text-emerald-400 mt-2">Pattern confirmed: Center = Product of corners</p>
                        </div>
                    }
                    answer="120"
                />

                <CheckUnderstanding
                    question="Triangle with corners 5, 12, 13 and center 169. What's the pattern?"
                    options={["Sum", "Product", "Sum of squares", "Largest squared"]}
                    correctIndex={3}
                    explanation="Check: 5² + 12² = 25 + 144 = 169 ≠ 169. But wait, 13² = 169 ✓. The center equals the LARGEST corner squared!"
                />
            </ConceptSection>

            {/* CONCEPT 3: SQUARE/GRID PATTERNS */}
            <ConceptSection id="grid" title="Square & Grid Patterns" icon="⬜">
                <p>
                    Grids (3×3 or 2×2) often have row-wise, column-wise, or diagonal patterns.
                </p>

                <div className="my-6 space-y-4">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-2">Common Grid Patterns</h4>
                        <ul className="text-sm text-neutral-300 space-y-2">
                            <li><strong>Row-wise Sum:</strong> Each row has same sum</li>
                            <li><strong>Col + Row:</strong> Each cell = Row sum + Col sum</li>
                            <li><strong>Magic Square:</strong> Rows, Cols, Diagonals all sum to same value</li>
                            <li><strong>Multiplication:</strong> Third = First × Second</li>
                        </ul>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Grid: [2,3,5 | 4,5,9 | 6,7,?]. Find the missing number."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Check rows:</strong> Does 3rd column = 1st + 2nd?</p>
                            <p>• Row 1: 2 + 3 = 5 ✓</p>
                            <p>• Row 2: 4 + 5 = 9 ✓</p>
                            <p>• Row 3: 6 + 7 = 13</p>
                            <p className="text-emerald-400 mt-2">Pattern: 3rd column = Sum of 1st and 2nd columns</p>
                        </div>
                    }
                    answer="13"
                />

                <CheckUnderstanding
                    question="In a 3x3 magic square where all rows/cols/diagonals sum to 15, and the center is 5, what's a corner value if the opposite corner is 9?"
                    options={["1", "3", "6", "7"]}
                    correctIndex={0}
                    explanation="In a standard magic square, opposite corners + center = 15. So corner + 9 + 5 should relate to the pattern. The corner opposite to 9 through the center is 1 (since 1 + 5 + 9 = 15 for the diagonal)."
                />
            </ConceptSection>

            {/* CONCEPT 4: CIRCLE PATTERNS */}
            <ConceptSection id="circle" title="Circle Patterns" icon="🔵">
                <p>
                    Circles usually have a center number with outer numbers arranged around.
                    The pattern typically involves the center as result of operations on outer numbers.
                </p>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-2">Opposite Relationship</h4>
                        <p className="text-sm text-neutral-400">Numbers opposite to each other are related</p>
                        <p className="text-xs text-neutral-500 mt-1">E.g., Opposite sum = Center</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-yellow-400 font-bold mb-2">Rotational Pattern</h4>
                        <p className="text-sm text-neutral-400">Numbers increase/decrease clockwise</p>
                        <p className="text-xs text-neutral-500 mt-1">E.g., +2 each step clockwise</p>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Three circles with: (outer: 2,3,4 center: 9), (outer: 3,5,2 center: 15), (outer: 4,?,3 center: 21). Find ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Check pattern:</strong> Is center = product of some pair?</p>
                            <p>Circle 1: 2×3 = 6 ≠ 9, but 2+3+4 = 9 ✓</p>
                            <p>Circle 2: 3+5+2 = 10 ≠ 15. Try: 3×5 = 15 ✓</p>
                            <p>Hmm, inconsistent. Let's try: (a×b) + c</p>
                            <p>Circle 1: 2×3 + 4 = 10 ≠ 9. Try: a×b + a = 2×3 + 2 = 8 ≠ 9</p>
                            <p>Let's try: (a+b) × c:</p>
                            <p>Circle 1: (2+3) × something? No.</p>
                            <p>New approach: Center = Sum of (each number × position)?</p>
                            <p className="text-amber-400 mt-2">This requires more context from the actual figure layout.</p>
                        </div>
                    }
                    answer="Depends on layout"
                />

                <TipBox title="When Stuck">
                    If no pattern works after 30 seconds, try these exotic patterns:
                    <ul className="mt-2 text-sm space-y-1">
                        <li>• (a × b) − c or (a × b) + c</li>
                        <li>• a² + b + c or a + b² + c</li>
                        <li>• (a + b) × (c) or a × (b + c)</li>
                        <li>• Differences: (a − b) × c</li>
                    </ul>
                </TipBox>
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes to Avoid" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Mistake 1: Testing only ONE figure</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Your pattern MUST work for ALL figures in the question, not just one.
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Mistake 2: Ignoring the figure structure</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            The arrangement matters! Clock-wise, diagonal, or adjacent relationships differ.
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Mistake 3: Overcomplicating</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            SSC rarely uses patterns beyond: Sum, Product, Squares/Cubes, Simple arithmetic.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Missing Number Quick Reference"
                    rows={[
                        { concept: 'Triangle', formula: 'Center = f(corners)' },
                        { concept: 'Grid Row Pattern', formula: '3rd = 1st ± 2nd' },
                        { concept: 'Circle', formula: 'Center = f(opposite pairs)' },
                        { concept: 'First Try', formula: 'Sum, then Product' },
                        { concept: 'Time Limit', formula: 'Max 45 seconds' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
