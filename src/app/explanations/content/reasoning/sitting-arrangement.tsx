"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function SittingArrangementContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🪑</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest mb-2 border border-purple-500/20">
                        Phase 04: Real World Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Sitting Arrangement</h1>
                    <p className="text-neutral-400 text-lg">Linear and Circular seating.</p>
                </div>
            </div>

            <ConceptSection id="linear" title="Linear Arrangement" icon="➡️">
                <p>People in a row. Key concepts:</p>

                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Facing Same Direction</h4>
                        <p className="text-sm text-neutral-400">Left = Left, Right = Right for everyone.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Facing Each Other</h4>
                        <p className="text-sm text-neutral-400">Two rows! Left of Row 1 = Right of Row 2.</p>
                    </div>
                </div>

                <TipBox title="Drawing Tip">
                    Always assume people face NORTH. Draw ↑ for facing direction.
                </TipBox>
            </ConceptSection>

            <ConceptSection id="circular" title="Circular Arrangement" icon="🔵">
                <p>People sitting around a table.</p>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Facing Center</h4>
                        <p className="text-sm text-neutral-400">Clockwise = Right, Anti-clockwise = Left.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Facing Outward</h4>
                        <p className="text-sm text-neutral-400">Directions are REVERSED.</p>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Seating Rules"
                    rows={[
                        { concept: 'Immediate Left/Right', formula: 'Adjacent seat' },
                        { concept: 'Opposite', formula: 'n/2 positions away' },
                        { concept: 'Draw first', formula: 'ALWAYS draw diagram!' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
