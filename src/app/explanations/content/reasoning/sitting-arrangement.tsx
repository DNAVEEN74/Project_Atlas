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

export default function SittingArrangementContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🪑</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest mb-2 border border-purple-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Sitting Arrangement</h1>
                    <p className="text-neutral-400 text-lg">Linear lines & Round tables — master the map.</p>
                </div>
            </div>

            {/* CONCEPT 1: LINEAR ARRANGEMENT */}
            <ConceptSection id="linear" title="Linear Arrangement" icon="➡️">
                <p>
                    People sitting in a straight line. Direction matters!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-purple-500/30">
                        <h4 className="text-purple-400 font-bold mb-3">Facing NORTH (↑)</h4>
                        <p className="text-sm text-neutral-300">
                            <strong>Your Left</strong> is their Left.<br />
                            <strong>Your Right</strong> is their Right.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2 text-white font-mono text-sm">
                            <span>Left</span>
                            <span>←</span>
                            <span className="bg-purple-900 px-2 rounded">Person</span>
                            <span>→</span>
                            <span>Right</span>
                        </div>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-red-500/30">
                        <h4 className="text-red-400 font-bold mb-3">Facing SOUTH (↓)</h4>
                        <p className="text-sm text-neutral-300">
                            Directions are <strong>REVERSED</strong>.<br />
                            Your Left = Their Right.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2 text-white font-mono text-sm">
                            <span>Right</span>
                            <span>←</span>
                            <span className="bg-red-900 px-2 rounded">Person</span>
                            <span>→</span>
                            <span>Left</span>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: CIRCULAR ARRANGEMENT */}
            <ConceptSection id="circular" title="Circular Arrangement" icon="⭕">
                <p>
                    Sitting around a round table.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold mb-3">Facing CENTER (Inside)</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>Left = <strong>Clockwise</strong> Movement</li>
                            <li>Right = <strong>Anti-Clockwise</strong> Movement</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-orange-500/30">
                        <h4 className="text-orange-400 font-bold mb-3">Facing OUTSIDE</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>Left = <strong>Anti-Clockwise</strong> Movement</li>
                            <li>Right = <strong>Clockwise</strong> Movement</li>
                        </ul>
                    </div>
                </div>

                <TipBox title="Golden Rule">
                    Start by placing a person at the <strong>BOTTOM</strong> of the circle. This aligns their Right/Left with YOUR Right/Left (for center facing).
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 3: LANGUAGE DECODING */}
            <ConceptSection id="language" title="Key Words: AND vs WHO" icon="🔑">
                <p>
                    Understanding standard connector words is critical.
                </p>

                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Case 1: "AND / BUT"</h4>
                        <p className="text-sm text-neutral-300 bg-black/50 p-2 rounded mb-2">
                            "A is left of B <strong>AND</strong> right of C"
                        </p>
                        <p className="text-sm text-neutral-400">
                            Refers to the <strong>FIRST person (A)</strong>.
                            <br />So: A is left of B, and A is right of C.
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Case 2: "WHO / WHOM / WHOSE"</h4>
                        <p className="text-sm text-neutral-300 bg-black/50 p-2 rounded mb-2">
                            "A is left of B <strong>WHO</strong> is right of C"
                        </p>
                        <p className="text-sm text-neutral-400">
                            Refers to the <strong>SECOND person (B)</strong> (Immediate neighbor).
                            <br />So: A is left of B. B is right of C.
                        </p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="hard"
                    question="P, Q, R, S, T sitting in circle facing center. R is left of T. P is between S and T."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Place T at bottom.</p>
                            <p><strong>Step 2:</strong> R is left of T &rarr; Place R clockwise from T.</p>
                            <p><strong>Step 3:</strong> P is between S and T &rarr; T, P, S must be together anti-clockwise.</p>
                            <p>Arrangement (Clockwise): T, R, Q, S, P</p>
                        </div>
                    }
                    answer="T-R-Q-S-P"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing Left/Right in Circle</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Don't rotate yourself! Just remember: <strong>Clockwise is Left</strong> (for center facing).
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ "Between" Ambiguity</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "A is between B and C" allows two orders: B-A-C or C-A-B. Don't assume one fixed order without checking other clues.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Seating Master Reference"
                    rows={[
                        { concept: 'Facing Center', formula: 'Left = Clockwise' },
                        { concept: 'Facing Outside', formula: 'Right = Clockwise' },
                        { concept: 'AND/BUT', formula: 'Refers to First Person' },
                        { concept: 'WHO/WHOM', formula: 'Refers to Second Person' },
                        { concept: 'Opposite', formula: 'Passes through center' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
