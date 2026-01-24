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

export default function StatementConclusionContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">💡</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2 border border-emerald-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Statement & Conclusion</h1>
                    <p className="text-neutral-400 text-lg">Logic without emotion. Facts over feelings.</p>
                </div>
            </div>

            {/* CONCEPT 1: CONCLUSION RULES */}
            <ConceptSection id="conclusion" title="Statement & Conclusion" icon="📝">
                <p>
                    A conclusion is a fact that can be <strong>100% derived</strong> from the statement.
                </p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-emerald-400 font-bold mb-4">Golden Rules</h4>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300">
                        <li><strong>No Outside Knowledge:</strong> If statement says "Cats can fly", then cats can fly. Don't use real-world logic.</li>
                        <li><strong>No Assumptions:</strong> Don't guess. If it's not written, it's not true.</li>
                        <li><strong>Keywords:</strong> Beware of "All", "Only", "Exactly", "Always". They restrict the logic.</li>
                    </ul>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Statement: 'All tough questions were solved by smart students.'\nConclusion 1: All students are smart.\nConclusion 2: Only smart students solved tough questions."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Analyze 1:</strong> Statement says smart students solved tough ones. Doesn't say ALL students are smart. (False)</p>
                            <p><strong>Analyze 2:</strong> Statement implies tough questions required smartness. But 'Only' is tricky. If a student solved a tough question, they MUST be smart (based on statement). So this follows contextually.</p>
                            <p><strong>Verdict:</strong> Conclusion 2 follows.</p>
                        </div>
                    }
                    answer="Only 2 follows"
                />
            </ConceptSection>

            {/* CONCEPT 2: COURSE OF ACTION */}
            <ConceptSection id="action" title="Course of Action" icon="🚀">
                <p>
                    Given a problem, suggest a practical solution.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-2">Valid Actions</h4>
                        <ul className="text-sm text-neutral-300">
                            <li>• Solves or reduces the problem</li>
                            <li>• Is practically possible</li>
                            <li>• Is a long-term solution</li>
                        </ul>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-red-500/30">
                        <h4 className="text-red-400 font-bold mb-2">Invalid Actions</h4>
                        <ul className="text-sm text-neutral-300">
                            <li>• Extreme measures (Ban everything!)</li>
                            <li>• Creates a bigger problem</li>
                            <li>• Just a temporary patch</li>
                        </ul>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 3: ASSUMPTIONS */}
            <ConceptSection id="assumption" title="Statement & Assumption" icon="💭">
                <p>
                    An assumption is the <strong>unspoken premise</strong> the speaker believes to be true.
                </p>

                <TipBox variant="note" title="The 'Advertisement' Rule">
                    If an ad says "Buy X for distinct skin", the assumption is "People want distinct skin" and "X can provide it".
                    Assumptions supporting the statement are usually IMPLICIT.
                </TipBox>

                <CheckUnderstanding
                    question="Statement: 'Please do not lean on the door.' - Notice in Metro."
                    options={["People are leaning", "It is dangerous", "People read notices", "All of above"]}
                    correctIndex={2}
                    explanation="The primary assumption of any notice is that 'People will read and obey it'. Danger is the reason, not assumption."
                />
            </ConceptSection>

            {/* CONCEPT 4: ARGUMENTS */}
            <ConceptSection id="arguments" title="Strong vs Weak Arguments" icon="⚖️">
                <p>
                    "Should X be done?" Arguments must be evaluated for strength.
                </p>
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="p-4 bg-neutral-900 border border-emerald-500/30 rounded">
                        <div className="text-emerald-400 font-bold">Strong</div>
                        <div className="text-xs text-neutral-400">Backed by facts, universal truth, or established experience.</div>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-red-500/30 rounded">
                        <div className="text-red-400 font-bold">Weak</div>
                        <div className="text-xs text-neutral-400">Opinion-based, ambiguous, or comparisons ("Look at USA...").</div>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Logic Master Reference"
                    rows={[
                        { concept: 'Conclusion', formula: '100% Derived from Statement' },
                        { concept: 'Assumption', formula: 'Speaker\'s belief (Implicit)' },
                        { concept: 'Action', formula: 'Practical Solution' },
                        { concept: 'Strong Arg', formula: 'Fact/Experience based' },
                        { concept: 'Weak Arg', formula: 'Opinion/Comparison' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
