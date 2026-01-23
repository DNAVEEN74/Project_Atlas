"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function VennDiagramContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">⭕</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/20">
                        Phase 03: Analytical Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Venn Diagram</h1>
                    <p className="text-neutral-400 text-lg">Visualizing relationships.</p>
                </div>
            </div>

            <ConceptSection id="types" title="Types of Relationships" icon="🔵">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="text-blue-400 font-bold mb-2">Identical</div>
                        <p className="text-xs text-neutral-400">Same set (Men = Males)</p>
                        <div className="mt-2 mx-auto w-8 h-8 border-2 border-blue-500 rounded-full" />
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="text-blue-400 font-bold mb-2">Subset</div>
                        <p className="text-xs text-neutral-400">One inside other</p>
                        <div className="relative mt-2 mx-auto w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white rounded-full" />
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="text-blue-400 font-bold mb-2">Overlap</div>
                        <p className="text-xs text-neutral-400">Some common</p>
                        <div className="relative mt-2 mx-auto w-12 h-8 flex items-center">
                            <div className="w-6 h-6 border-2 border-blue-500 rounded-full absolute left-0" />
                            <div className="w-6 h-6 border-2 border-white rounded-full absolute right-0" />
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="text-blue-400 font-bold mb-2">Disjoint</div>
                        <p className="text-xs text-neutral-400">No common</p>
                        <div className="relative mt-2 mx-auto w-14 h-6 flex items-center justify-between">
                            <div className="w-5 h-5 border-2 border-blue-500 rounded-full" />
                            <div className="w-5 h-5 border-2 border-white rounded-full" />
                        </div>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="example" title="Solved Example" icon="📝">
                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Which diagram shows: Women, Mothers, Teachers?"
                    solution={
                        <div>
                            <p>All Mothers are Women (Subset).</p>
                            <p>Some Women are Teachers (Overlap).</p>
                            <p>Some Mothers may be Teachers (Overlap).</p>
                            <p>Answer: Women (big) contains Mothers, with Teachers overlapping both.</p>
                        </div>
                    }
                    answer="Nested with overlap"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Relationships"
                    rows={[
                        { concept: 'All A are B', formula: 'A inside B' },
                        { concept: 'No A is B', formula: 'Separate circles' },
                        { concept: 'Some A are B', formula: 'Overlapping circles' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
