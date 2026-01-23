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

export default function DiceCubeContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🎲</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-2 border border-red-500/20">
                        Phase 02: Visual Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Dice & Cube</h1>
                    <p className="text-neutral-400 text-lg">Master opposite faces and painted cube problems.</p>
                </div>
            </div>

            {/* CONCEPT 1: STANDARD DICE */}
            <ConceptSection id="standard" title="The Standard Dice" icon="🎲">
                <p>
                    A <strong>standard dice</strong> has opposite faces that sum to 7.
                    If the question says "standard dice", use this rule!
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-bold mb-4 text-center text-lg">Opposite Pairs (Sum = 7)</h4>
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-3xl font-bold text-white">1 ↔ 6</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-3xl font-bold text-white">2 ↔ 5</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-3xl font-bold text-white">3 ↔ 4</p>
                        </div>
                    </div>
                </div>

                <CheckUnderstanding
                    question="On a standard dice, if 3 is on top, what is at the bottom?"
                    options={["1", "2", "4", "6"]}
                    correctIndex={2}
                    explanation="Standard dice: opposite faces sum to 7. So bottom = 7 − 3 = 4."
                />
            </ConceptSection>

            {/* CONCEPT 2: FINDING OPPOSITE (NON-STANDARD) */}
            <ConceptSection id="opposite" title="Finding Opposite Faces (Non-Standard)" icon="🔍">
                <p>
                    When given multiple views of a dice, use this technique to find opposites:
                </p>

                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-red-400 font-bold mb-3">The Common Face Method</h4>
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300 text-sm">
                        <li>Find a face that appears in TWO different views</li>
                        <li>In each view, note the adjacent faces</li>
                        <li>The face that appears adjacent in ONE view but NOT the other = OPPOSITE of the unique adjacent</li>
                    </ol>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="View 1: Top=1, Front=2, Right=3. View 2: Top=1, Front=4, Right=2. What is opposite to 3?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Common face:</strong> 1 is on top in both</p>
                            <p>View 1: 1 is adjacent to 2 and 3</p>
                            <p>View 2: 1 is adjacent to 4 and 2</p>
                            <p>2 is common adjacent. 3 appears in View 1, 4 appears in View 2.</p>
                            <p>Since 3 and 4 are both adjacent to 1 but never shown together → they could be opposite</p>
                            <p><strong>But wait:</strong> We need another common face to confirm. Let's check 2.</p>
                            <p>In View 1: 2 is adjacent to 1 and 3. In View 2: 2 is adjacent to 1 and 4.</p>
                            <p>So when 2 rotates, 3 is replaced by 4 → <strong>3 is opposite to 4</strong></p>
                        </div>
                    }
                    answer="4"
                />

                <TipBox title="Quick Rule">
                    If two numbers are NEVER shown together on adjacent faces in any view, they are likely opposite.
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 3: UNFOLDED DICE */}
            <ConceptSection id="unfolded" title="Unfolded Dice (Net)" icon="📦">
                <p>
                    Dice can be shown as flat patterns. Learn to identify opposites from the net.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-red-400 font-bold mb-4">The Rule for Nets</h4>
                    <p className="text-neutral-300 mb-4">
                        In a cross-shaped net (the most common), the face in the middle is adjacent to ALL four around it.
                        The TWO faces that are NOT touching the middle face are OPPOSITE to each other.
                    </p>
                    <p className="text-neutral-400 text-sm">
                        Also: Any two faces with ONE square gap between them are OPPOSITE.
                    </p>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="In a net showing: Top row = A, Middle row = B C D E (left to right), Bottom row = F. Which are opposite pairs?"
                    solution={
                        <div className="space-y-2">
                            <p>Visualize: A is above C, F is below C, B-C-D-E are in a row</p>
                            <p><strong>Opposite pairs:</strong></p>
                            <p>• A ↔ F (both touch C, separated by 2 squares)</p>
                            <p>• B ↔ D (skip one square)</p>
                            <p>• C ↔ E (skip one square)</p>
                        </div>
                    }
                    answer="A-F, B-D, C-E"
                />
            </ConceptSection>

            {/* CONCEPT 4: PAINTED CUBE PROBLEMS */}
            <ConceptSection id="painted" title="Painted Cube Problems" icon="🧊">
                <p>
                    A large cube painted on all sides is cut into smaller cubes. Find how many have 0, 1, 2, or 3 painted faces.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-bold mb-4 text-center">If cube is cut into n×n×n smaller cubes:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-amber-400 font-bold text-lg">3 faces painted</p>
                            <p className="text-neutral-400 text-xs">Corner cubes</p>
                            <p className="text-2xl text-white font-bold mt-2">8</p>
                            <p className="text-xs text-neutral-500">(always 8)</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-green-400 font-bold text-lg">2 faces painted</p>
                            <p className="text-neutral-400 text-xs">Edge cubes</p>
                            <p className="text-2xl text-white font-bold mt-2">12(n−2)</p>
                            <p className="text-xs text-neutral-500">12 edges</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-blue-400 font-bold text-lg">1 face painted</p>
                            <p className="text-neutral-400 text-xs">Face center cubes</p>
                            <p className="text-2xl text-white font-bold mt-2">6(n−2)²</p>
                            <p className="text-xs text-neutral-500">6 faces</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-neutral-400 font-bold text-lg">0 faces painted</p>
                            <p className="text-neutral-400 text-xs">Inside cubes</p>
                            <p className="text-2xl text-white font-bold mt-2">(n−2)³</p>
                            <p className="text-xs text-neutral-500">core cube</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="A 4×4×4 cube is painted red on all faces and cut into 1×1×1 cubes. How many have exactly 2 faces painted?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> 12(n−2) where n = 4</p>
                            <p>= 12(4−2) = 12 × 2 = 24</p>
                            <p>These are the cubes on the 12 edges (excluding corners).</p>
                        </div>
                    }
                    answer="24"
                />

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="Same 4×4×4 cube. How many cubes have NO paint at all?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> (n−2)³ where n = 4</p>
                            <p>= (4−2)³ = 2³ = 8</p>
                            <p>These are the completely hidden inner cubes (a 2×2×2 core).</p>
                        </div>
                    }
                    answer="8"
                />

                <CheckUnderstanding
                    question="A 3×3×3 cube is painted and cut. How many cubes have exactly 1 face painted?"
                    options={["0", "6", "8", "12"]}
                    correctIndex={1}
                    explanation="Formula: 6(n−2)² = 6(3−2)² = 6(1)² = 6. These are the center cubes of each face."
                />
            </ConceptSection>

            {/* CONCEPT 5: QUICK REFERENCE */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Dice & Cube Master Reference"
                    rows={[
                        { concept: 'Standard Dice', formula: 'Opposites sum to 7' },
                        { concept: '3 faces painted', formula: '8 (corners)' },
                        { concept: '2 faces painted', formula: '12(n−2) (edges)' },
                        { concept: '1 face painted', formula: '6(n−2)² (faces)' },
                        { concept: '0 faces painted', formula: '(n−2)³ (inside)' },
                        { concept: 'Total small cubes', formula: 'n³' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
