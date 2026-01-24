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

export default function VennDiagramContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">⭕</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Venn Diagrams</h1>
                    <p className="text-neutral-400 text-lg">Visualizing sets, subsets, and standard overlaps.</p>
                </div>
            </div>

            {/* CONCEPT 1: STANDARD RELATIONS */}
            <ConceptSection id="relations" title="The 3 Core Relationships" icon="🔗">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    {/* All */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-blue-400 font-bold mb-4">1. All A are B</h4>
                        <div className="relative w-24 h-24 mx-auto mb-4 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-xs">A</div>
                            <div className="absolute top-1 right-2 text-xs text-blue-400">B</div>
                        </div>
                        <p className="text-sm text-neutral-300">Example: Apple, Fruit</p>
                    </div>

                    {/* Some */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-blue-400 font-bold mb-4">2. Some A are B</h4>
                        <div className="relative w-32 h-20 mx-auto mb-4 flex justify-center items-center">
                            <div className="w-16 h-16 border-2 border-blue-500 rounded-full absolute left-0 flex items-center justify-center text-xs">A</div>
                            <div className="w-16 h-16 border-2 border-white rounded-full absolute right-0 flex items-center justify-center text-xs">B</div>
                        </div>
                        <p className="text-sm text-neutral-300 mt-2">Example: Doctor, Woman</p>
                    </div>

                    {/* No */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-blue-400 font-bold mb-4">3. No A is B</h4>
                        <div className="relative w-32 h-20 mx-auto mb-4 flex justify-between items-center px-2">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-xs">A</div>
                            <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-xs">B</div>
                        </div>
                        <p className="text-sm text-neutral-300">Example: Car, Cycle</p>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: COMPLEX MAPPING */}
            <ConceptSection id="complex" title="Complex Scenarios" icon="🧩">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Scenario: A in B, C separate</h4>
                        <p className="text-sm text-neutral-400">Example: Earth, Planet, Sun. (Earth is a Planet, Sun is distinct).</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Scenario: A and B in C, no overlap</h4>
                        <p className="text-sm text-neutral-400">Example: Table, Chair, Furniture. (Both are Furniture, but Table ≠ Chair).</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Scenario: A, B, C chain overlap</h4>
                        <p className="text-sm text-neutral-400">Example: Humans, Males, Brothers. (All Bros are Males, All Males are Humans).</p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Represent: 'Males, Fathers, Doctors'"
                    solution={
                        <div className="space-y-2">
                            <p>1. All Fathers are Males (Circle F inside Circle M).</p>
                            <p>2. Some Fathers are Doctors. Some Males (non-fathers) are Doctors.</p>
                            <p>3. Diagram: A big circle (Males) containing a smaller circle (Fathers). A third circle (Doctors) intersects BOTH.</p>
                        </div>
                    }
                    answer="Intersecting Nested"
                />
            </ConceptSection>

            {/* CONCEPT 3: MATHEMATICAL VENN */}
            <ConceptSection id="math" title="Set Theory Formulas" icon="🔢">
                <p>Sometimes they ask for numbers!</p>

                <FormulaBox title="Union Formula">
                    <MathText>{`n(A \\cup B) = n(A) + n(B) - n(A \\cap B)`}</MathText>
                </FormulaBox>

                <TipBox title="Only A">
                    <MathText>{`n(\\text{Only A}) = n(A) - n(A \\cap B)`}</MathText>
                </TipBox>

                <CheckUnderstanding
                    question="In a class of 50, 30 like Tea, 25 like Coffee, 10 like Both. How many like NEITHER?"
                    options={["5", "15", "10", "0"]}
                    correctIndex={0}
                    explanation="Union (Like at least one) = 30 + 25 - 10 = 45. Neither = Total - Union = 50 - 45 = 5."
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Venn Master Reference"
                    rows={[
                        { concept: 'All', formula: 'Concentric Circles' },
                        { concept: 'Some', formula: 'Intersecting Circles' },
                        { concept: 'No', formula: 'Disjoint Circles' },
                        { concept: 'Union (Total)', formula: 'A + B - Both' },
                        { concept: 'For 3 Sets', formula: 'A+B+C - (AB+BC+CA) + ABC' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
