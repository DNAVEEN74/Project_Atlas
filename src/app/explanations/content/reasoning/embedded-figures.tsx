"use client";

import React from 'react';
import {
    LessonLayout,
    ConceptSection,
    TipBox,
    ExampleCard,
    CheatSheet
} from '@/components/explanations';

export default function EmbeddedFiguresContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🔲</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-500 text-xs font-bold uppercase tracking-widest mb-2 border border-violet-500/20">
                        Phase 02: Visual Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Embedded Figures</h1>
                    <p className="text-neutral-400 text-lg">Find the hidden shape.</p>
                </div>
            </div>

            <ConceptSection id="method" title="The Method" icon="👁️">
                <p>A small figure (X) is hidden inside a complex figure. Find where X fits.</p>

                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-2">Tip 1: Focus on Unique Elements</h4>
                        <p className="text-sm text-neutral-400">Look for distinctive angles, curves, or intersections in X.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-2">Tip 2: Ignore Extra Lines</h4>
                        <p className="text-sm text-neutral-400">The complex figure has extra lines to confuse. Focus only on X's outline.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-2">Tip 3: Rotation is Allowed</h4>
                        <p className="text-sm text-neutral-400">The hidden figure may be rotated (but not mirror-flipped).</p>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Tips"
                    rows={[
                        { concept: 'Corners', formula: 'Match unique angles' },
                        { concept: 'Proportions', formula: 'Size ratios must match' },
                        { concept: 'Rotation', formula: 'Allowed, but not flip' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
