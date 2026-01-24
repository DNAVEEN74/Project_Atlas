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

export default function PaperCuttingContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">✂️</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-2 border border-pink-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Paper Cutting & Folding</h1>
                    <p className="text-neutral-400 text-lg">Unfold the mystery with symmetry rules.</p>
                </div>
            </div>

            {/* CONCEPT 1: THE MIRROR RULE */}
            <ConceptSection id="mirror-rule" title="The Golden Rule: Mirror It!" icon="🪞">
                <p>
                    Every time you <strong>unfold</strong> a paper, the cut pattern is <strong>mirrored</strong> across the fold line.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-pink-500/30">
                        <h4 className="text-pink-400 font-bold mb-4">Vertical Fold</h4>
                        <p className="text-sm text-neutral-300">It acts like a <strong>Vertical Mirror</strong>.</p>
                        <p className="text-xs text-neutral-500 mt-2">Left becomes Right. Shape flips horizontally.</p>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-pink-500/30">
                        <h4 className="text-pink-400 font-bold mb-4">Horizontal Fold</h4>
                        <p className="text-sm text-neutral-300">It acts like a <strong>Water Image</strong>.</p>
                        <p className="text-xs text-neutral-500 mt-2">Top becomes Bottom. Shape flips vertically.</p>
                    </div>
                </div>

                <TipBox title="Work Backwards">
                    Always start from the LAST fold and work backwards to the first. Unfold one step at a time.
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: COUNTING HOLES */}
            <ConceptSection id="counting" title="Predicting Number of Cuts" icon="🔢">
                <p>
                    How many holes will appear in the final paper?
                </p>

                <FormulaBox>
                    <MathText>{`\\text{Total Cuts} = (\\text{Original Cuts}) \\times 2^n`}</MathText>
                    <p className="text-center text-neutral-400 text-sm mt-2">n = Number of folds covering the cut area</p>
                </FormulaBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Paper folded once, then folded again (total 2 folds). 1 hole punched. How many holes on unfolding?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Folds (n):</strong> 2</p>
                            <p><strong>Initial Cuts:</strong> 1</p>
                            <p><strong>Total:</strong> 1 × 2² = 1 × 4 = <strong>4 holes</strong></p>
                        </div>
                    }
                    answer="4 holes"
                />
            </ConceptSection>

            {/* CONCEPT 3: DIAGONAL FOLDS */}
            <ConceptSection id="diagonal" title="Diagonal Folds" icon="📐">
                <p>
                    Diagonal folds are tricky. The reflection happens across the 45° line.
                </p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <ul className="list-disc list-inside space-y-3 text-neutral-300">
                        <li>
                            <strong className="text-pink-400">Corner to Corner:</strong> A cut at the corner will appear at <strong>all 4 corners</strong> if folded twice centrally.
                        </li>
                        <li>
                            <strong className="text-pink-400">Center Cut:</strong> A cut in the center usually remains <strong>one large cut</strong> (often a diamond or square) after unfolding.
                        </li>
                    </ul>
                </div>

                <CheckUnderstanding
                    question="Square paper folded diagonally to form triangle. Then a circle cut at center of triangle. Unfolded shape?"
                    options={["1 circle in center", "2 circles on diagonal", "4 circles", "1 oval"]}
                    correctIndex={1}
                    explanation="Folded once diagonally = 2 layers. Cut goes through both. Unfolding mirrors it across diagonal. Result: 2 circles symmetric to diagonal."
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting to Mirror</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Don't just copy-paste the shape. You MUST flip it. A 'P' becomes 'q', not 'P'.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Ignoring Layers</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            If a cut is made on a part with 4 layers, it produces 4 cuts. If made on a single layer edge, it produces only 1!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Paper Cutting Master Reference"
                    rows={[
                        { concept: 'Unfold Up/Down', formula: 'Water Image (Flip Vert)' },
                        { concept: 'Unfold Left/Right', formula: 'Mirror Image (Flip Horiz)' },
                        { concept: 'Hole Formula', formula: 'Cuts × 2^(folds)' },
                        { concept: 'Diagonal Fold', formula: 'Reflection across 45°' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
