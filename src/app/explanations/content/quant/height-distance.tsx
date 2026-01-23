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

export default function HeightDistanceContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🗼</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 border border-orange-500/20">
                        Phase 04: Advanced Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Height & Distance</h1>
                    <p className="text-neutral-400 text-lg">Trigonometry in real life.</p>
                </div>
            </div>

            <ConceptSection id="angles" title="Key Angles" icon="📐">
                <p>Two types of angles dominate this topic:</p>

                <div className="grid grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-orange-500/30">
                        <h4 className="text-orange-400 font-bold">Angle of Elevation ↗</h4>
                        <p className="text-sm text-neutral-400">Looking UP from horizontal.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold">Angle of Depression ↘</h4>
                        <p className="text-sm text-neutral-400">Looking DOWN from horizontal.</p>
                    </div>
                </div>

                <TipBox title="Standard Angles">
                    <div className="grid grid-cols-3 gap-4 mt-2 text-center font-mono">
                        <div>tan 30° = 1/√3</div>
                        <div>tan 45° = 1</div>
                        <div>tan 60° = √3</div>
                    </div>
                </TipBox>
            </ConceptSection>

            <ConceptSection id="example" title="Classic Problem" icon="🏗️">
                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="From a point on ground, angle of elevation of top of a tower is 60°. Moving 20m away, it becomes 30°. Height of tower?"
                    solution={
                        <div>
                            <p>Let height = h, distance = x</p>
                            <p>tan 60° = h/x → √3 = h/x → h = √3x</p>
                            <p>tan 30° = h/(x+20) → 1/√3 = h/(x+20)</p>
                            <p>Solving: x = 10m, h = 10√3 m ≈ 17.32m</p>
                        </div>
                    }
                    answer="10√3 m"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="H&D Rules"
                    rows={[
                        { concept: 'tan θ', formula: 'Height / Base' },
                        { concept: '45° Triangle', formula: '1:1:√2' },
                        { concept: '30-60 Triangle', formula: '1:√3:2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
