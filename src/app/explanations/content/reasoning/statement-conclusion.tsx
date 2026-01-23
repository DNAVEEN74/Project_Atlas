"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function StatementConclusionContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">💡</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2 border border-emerald-500/20">
                        Phase 03: Analytical Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Statement & Conclusion</h1>
                    <p className="text-neutral-400 text-lg">What logically follows?</p>
                </div>
            </div>

            <ConceptSection id="types" title="Types of Questions" icon="📋">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-emerald-400 font-bold">Statement & Conclusions</h4>
                        <p className="text-sm text-neutral-400">Does the conclusion DEFINITELY follow from the statement?</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-emerald-400 font-bold">Statement & Assumptions</h4>
                        <p className="text-sm text-neutral-400">What hidden belief makes the statement true?</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-emerald-400 font-bold">Course of Action</h4>
                        <p className="text-sm text-neutral-400">Is the proposed action practical and solves the problem?</p>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="tips" title="Key Tips" icon="⚡">
                <TipBox title="Golden Rule">
                    A conclusion FOLLOWS only if it is DEFINITELY true based on the statement.
                    "Probably" or "Maybe" = Does NOT follow.
                </TipBox>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Logic Rules"
                    rows={[
                        { concept: 'Conclusion', formula: 'Must be definite' },
                        { concept: 'Assumption', formula: 'Hidden belief' },
                        { concept: 'Course of Action', formula: 'Practical & Relevant' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
