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

export default function SeriesContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[4rem] font-bold text-green-500/10 select-none font-mono">2, 4, 8, 16, ?</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest mb-2 border border-green-500/20">
                        Phase 01: Verbal Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Series</h1>
                    <p className="text-neutral-400 text-lg">Master number, letter, and mixed series patterns.</p>
                </div>
            </div>

            {/* CONCEPT 1: THE APPROACH */}
            <ConceptSection id="approach" title="The Universal Approach" icon="🧠">
                <p>
                    Every series question follows a pattern. Your job is to <strong>FIND the pattern</strong>, then apply it to find the missing term.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-green-500/30">
                    <h4 className="text-green-400 font-bold mb-4 text-lg">The 4-Step Method</h4>
                    <ol className="list-decimal list-inside space-y-3 text-neutral-300">
                        <li><strong>Calculate differences:</strong> Find gaps between consecutive terms</li>
                        <li><strong>Check for patterns</strong> in differences (constant, increasing, decreasing)</li>
                        <li><strong>If differences don't work:</strong> Check ratio, squares, cubes, primes</li>
                        <li><strong>Verify:</strong> Your pattern MUST work for ALL terms</li>
                    </ol>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: NUMBER SERIES TYPES */}
            <ConceptSection id="number-types" title="Number Series Patterns" icon="🔢">
                <p>Memorize these common patterns. They cover 95% of exam questions.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">1. Arithmetic (Constant Difference)</h4>
                        <p className="font-mono text-sm text-neutral-400">3, 7, 11, 15, 19...</p>
                        <p className="text-xs text-neutral-500 mt-1">+4, +4, +4, +4</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">2. Geometric (Constant Ratio)</h4>
                        <p className="font-mono text-sm text-neutral-400">2, 6, 18, 54, 162...</p>
                        <p className="text-xs text-neutral-500 mt-1">×3, ×3, ×3, ×3</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">3. Squares</h4>
                        <p className="font-mono text-sm text-neutral-400">1, 4, 9, 16, 25, 36...</p>
                        <p className="text-xs text-neutral-500 mt-1">1², 2², 3², 4², 5²...</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">4. Cubes</h4>
                        <p className="font-mono text-sm text-neutral-400">1, 8, 27, 64, 125...</p>
                        <p className="text-xs text-neutral-500 mt-1">1³, 2³, 3³, 4³, 5³...</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">5. Increasing Difference</h4>
                        <p className="font-mono text-sm text-neutral-400">2, 3, 5, 8, 12, 17...</p>
                        <p className="text-xs text-neutral-500 mt-1">+1, +2, +3, +4, +5</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">6. Two-Level Difference</h4>
                        <p className="font-mono text-sm text-neutral-400">1, 2, 5, 10, 17, 26...</p>
                        <p className="text-xs text-neutral-500 mt-1">Diff: 1,3,5,7,9 (odd numbers)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">7. n² + n or n² − n</h4>
                        <p className="font-mono text-sm text-neutral-400">2, 6, 12, 20, 30...</p>
                        <p className="text-xs text-neutral-500 mt-1">n(n+1): 1×2, 2×3, 3×4...</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">8. Alternating Operations</h4>
                        <p className="font-mono text-sm text-neutral-400">2, 6, 4, 12, 6, 18...</p>
                        <p className="text-xs text-neutral-500 mt-1">×3, −2, ×3, −6, ×3...</p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Find the next: 2, 5, 10, 17, 26, ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1: Find differences</strong></p>
                            <p>5−2=3, 10−5=5, 17−10=7, 26−17=9</p>
                            <p><strong>Step 2: Check second-level difference</strong></p>
                            <p>5−3=2, 7−5=2, 9−7=2 → Constant +2!</p>
                            <p><strong>Step 3: Next difference</strong> = 9+2 = 11</p>
                            <p><strong>Step 4: Answer</strong> = 26+11 = 37</p>
                        </div>
                    }
                    answer="37"
                />

                <CheckUnderstanding
                    question="What comes next: 3, 6, 11, 18, 27, ?"
                    options={["36", "38", "40", "42"]}
                    correctIndex={1}
                    explanation="Differences: 3, 5, 7, 9... (odd numbers). Next diff = 11. Answer = 27 + 11 = 38."
                />
            </ConceptSection>

            {/* CONCEPT 3: LETTER SERIES */}
            <ConceptSection id="letter" title="Letter Series" icon="🔤">
                <p>Use <strong>EJOTY</strong> (E=5, J=10, O=15, T=20, Y=25) as your reference!</p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="grid grid-cols-5 gap-4 text-center">
                        {[
                            { l: 'E', n: 5 }, { l: 'J', n: 10 }, { l: 'O', n: 15 }, { l: 'T', n: 20 }, { l: 'Y', n: 25 }
                        ].map(({ l, n }) => (
                            <div key={l}>
                                <div className="text-3xl font-bold text-green-400">{l}</div>
                                <div className="text-sm text-neutral-500">{n}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">Skip Pattern</h4>
                        <p className="font-mono text-sm text-neutral-400">A, C, E, G, I...</p>
                        <p className="text-xs text-neutral-500 mt-1">Skip 1 letter (+2 positions)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-2">Increasing Skip</h4>
                        <p className="font-mono text-sm text-neutral-400">A, B, D, G, K...</p>
                        <p className="text-xs text-neutral-500 mt-1">+1, +2, +3, +4...</p>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="What comes next: A, C, F, J, O, ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Convert to numbers:</strong> A=1, C=3, F=6, J=10, O=15</p>
                            <p><strong>Differences:</strong> 2, 3, 4, 5 (increasing by 1)</p>
                            <p><strong>Next:</strong> 15 + 6 = 21 = U</p>
                        </div>
                    }
                    answer="U"
                />

                <CheckUnderstanding
                    question="What comes next: Z, X, V, T, ?"
                    options={["S", "R", "Q", "P"]}
                    correctIndex={1}
                    explanation="Going backwards: Z(26), X(24), V(22), T(20). Pattern: −2. Next: 20−2 = 18 = R."
                />
            </ConceptSection>

            {/* CONCEPT 4: WRONG TERM PROBLEMS */}
            <ConceptSection id="wrong" title="Find the Wrong Term" icon="❌">
                <p>
                    Some questions ask: "Which term doesn't fit?" Find the pattern, then find the outlier.
                </p>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Find wrong term: 2, 3, 5, 7, 11, 12, 17"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Recognize pattern:</strong> These look like prime numbers!</p>
                            <p>Prime numbers: 2, 3, 5, 7, 11, 13, 17...</p>
                            <p>12 is NOT prime (12 = 2 × 6).</p>
                            <p>It should be 13, not 12.</p>
                        </div>
                    }
                    answer="12"
                />
            </ConceptSection>

            {/* CONCEPT 5: MIXED SERIES */}
            <ConceptSection id="mixed" title="Mixed (Alpha-Numeric) Series" icon="🔣">
                <p>
                    These combine letters and numbers. Look for SEPARATE patterns in each.
                </p>

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="What comes next: A2, C4, E6, G8, ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Letter pattern:</strong> A, C, E, G → +2 each (next = I)</p>
                            <p><strong>Number pattern:</strong> 2, 4, 6, 8 → +2 each (next = 10)</p>
                            <p><strong>Answer:</strong> I10</p>
                        </div>
                    }
                    answer="I10"
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Series Master Reference"
                    rows={[
                        { concept: 'First check', formula: 'Differences between terms' },
                        { concept: 'Second check', formula: 'Ratio (×2, ×3, ÷2)' },
                        { concept: 'Third check', formula: 'Squares, Cubes, Primes' },
                        { concept: 'EJOTY', formula: '5, 10, 15, 20, 25' },
                        { concept: 'Wrong term', formula: 'Find pattern, find outlier' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
