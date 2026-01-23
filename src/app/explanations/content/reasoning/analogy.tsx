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

export default function AnalogyContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[4rem] font-bold text-amber-500/10 select-none">A : B :: C : ?</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 border border-amber-500/20">
                        Phase 01: Verbal Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Analogy</h1>
                    <p className="text-neutral-400 text-lg">Master the art of finding hidden relationships.</p>
                </div>
            </div>

            {/* CONCEPT 1: WHAT IS ANALOGY */}
            <ConceptSection id="intro" title="What is Analogy?" icon="🔗">
                <p>
                    Analogy means <strong>"similarity of relationship"</strong>. If two things are related in a certain way,
                    find another pair with the SAME relationship.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                    <h4 className="text-amber-400 font-bold mb-4">The Format</h4>
                    <div className="text-2xl text-center font-mono text-white">
                        A : B :: C : <span className="text-amber-400">?</span>
                    </div>
                    <p className="text-center text-neutral-400 mt-4">
                        "A is to B as C is to ?"
                    </p>
                    <p className="text-center text-sm text-neutral-500 mt-2">
                        Your job: Find how A relates to B, then apply the SAME relationship to C.
                    </p>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Doctor : Hospital :: Teacher : ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Identify relationship between Doctor and Hospital</p>
                            <p>A Doctor <em>works at</em> a Hospital.</p>
                            <p><strong>Step 2:</strong> Apply same relationship to Teacher</p>
                            <p>A Teacher <em>works at</em> a School.</p>
                        </div>
                    }
                    answer="School"
                />
            </ConceptSection>

            {/* CONCEPT 2: WORD ANALOGY TYPES */}
            <ConceptSection id="word-types" title="Types of Word Analogies" icon="📝">
                <p>Memorize these common relationship types. They appear 90% of the time.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">1. Worker : Workplace</h4>
                        <p className="text-sm text-neutral-400">Doctor : Hospital, Pilot : Cockpit</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">2. Worker : Tool</h4>
                        <p className="text-sm text-neutral-400">Carpenter : Hammer, Surgeon : Scalpel</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">3. Part : Whole</h4>
                        <p className="text-sm text-neutral-400">Wheel : Car, Page : Book</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">4. Product : Raw Material</h4>
                        <p className="text-sm text-neutral-400">Paper : Pulp, Bread : Flour</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">5. Male : Female</h4>
                        <p className="text-sm text-neutral-400">Lion : Lioness, Actor : Actress</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">6. Young : Adult</h4>
                        <p className="text-sm text-neutral-400">Cub : Lion, Puppy : Dog</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">7. Synonym / Antonym</h4>
                        <p className="text-sm text-neutral-400">Big : Large (Syn), Hot : Cold (Ant)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">8. Cause : Effect</h4>
                        <p className="text-sm text-neutral-400">Rain : Flood, Fire : Burn</p>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Needle : Thread :: Pen : ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Relationship:</strong> Tool : What it uses to work</p>
                            <p>Needle uses Thread to sew.</p>
                            <p>Pen uses Ink to write.</p>
                        </div>
                    }
                    answer="Ink"
                />

                <CheckUnderstanding
                    question="Cub : Lion :: Calf : ?"
                    options={["Tiger", "Cow", "Horse", "Elephant"]}
                    correctIndex={1}
                    explanation="Relationship: Young animal : Adult animal. Cub grows into Lion. Calf grows into Cow."
                />
            </ConceptSection>

            {/* CONCEPT 3: NUMBER ANALOGY */}
            <ConceptSection id="number" title="Number Analogies" icon="🔢">
                <p>Numbers are related through mathematical operations. Common patterns:</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                        <div className="text-amber-400 font-bold">Square</div>
                        <div className="text-xs text-neutral-500">4 : 16 (4²)</div>
                    </div>
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                        <div className="text-amber-400 font-bold">Cube</div>
                        <div className="text-xs text-neutral-500">3 : 27 (3³)</div>
                    </div>
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                        <div className="text-amber-400 font-bold">Double/Triple</div>
                        <div className="text-xs text-neutral-500">5 : 10, 5 : 15</div>
                    </div>
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                        <div className="text-amber-400 font-bold">Square + 1</div>
                        <div className="text-xs text-neutral-500">4 : 17 (4²+1)</div>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="8 : 64 :: 7 : ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Check relationship:</strong> 8 → 64</p>
                            <p>Is 64 = 8 × 8 = 8²? Yes!</p>
                            <p>Apply to 7: 7² = 49</p>
                        </div>
                    }
                    answer="49"
                />

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="5 : 126 :: 7 : ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Test patterns:</strong></p>
                            <p>5² = 25 ≠ 126</p>
                            <p>5³ = 125 ≈ 126 → Maybe n³ + 1?</p>
                            <p>5³ + 1 = 126 ✓</p>
                            <p>Apply: 7³ + 1 = 343 + 1 = 344</p>
                        </div>
                    }
                    answer="344"
                />

                <CheckUnderstanding
                    question="25 : 36 :: 49 : ?"
                    options={["64", "56", "81", "100"]}
                    correctIndex={0}
                    explanation="25 = 5², 36 = 6² (5+1)². Similarly, 49 = 7², so answer = 8² = 64."
                />
            </ConceptSection>

            {/* CONCEPT 4: LETTER ANALOGY */}
            <ConceptSection id="letter" title="Letter Analogies" icon="🔤">
                <p>Letters are related by their positions in the alphabet. Use <strong>EJOTY</strong> as reference!</p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="grid grid-cols-5 gap-4 text-center">
                        {[
                            { l: 'E', n: 5 }, { l: 'J', n: 10 }, { l: 'O', n: 15 }, { l: 'T', n: 20 }, { l: 'Y', n: 25 }
                        ].map(({ l, n }) => (
                            <div key={l}>
                                <div className="text-3xl font-bold text-amber-400">{l}</div>
                                <div className="text-sm text-neutral-500">{n}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="medium"
                    question="ACE : BDF :: GIK : ?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Pattern in ACE → BDF:</strong></p>
                            <p>A(1) → B(2): +1</p>
                            <p>C(3) → D(4): +1</p>
                            <p>E(5) → F(6): +1</p>
                            <p><strong>Apply to GIK:</strong></p>
                            <p>G(7) → H(8), I(9) → J(10), K(11) → L(12)</p>
                        </div>
                    }
                    answer="HJL"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Don't Fall For These Traps" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Superficial Similarity</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Bird : Sky :: Fish : Water" is correct. But "Bird : Fly" doesn't mean "Fish : Swim" directly—
                            the question format matters!
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting Direction</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Cow : Calf" is Adult→Young. Don't answer "Lion : Cub" when the question asks "Calf : Cow" (Young→Adult).
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Analogy Master Reference"
                    rows={[
                        { concept: 'Word Analogy', formula: 'Worker↔Place, Tool, Product' },
                        { concept: 'Number: Square', formula: 'n : n²' },
                        { concept: 'Number: Cube + 1', formula: 'n : n³ + 1' },
                        { concept: 'Letter Position', formula: 'Use EJOTY (5,10,15,20,25)' },
                        { concept: 'Direction', formula: 'Match Adult→Young or Young→Adult' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
