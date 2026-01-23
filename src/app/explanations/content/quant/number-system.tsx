"use client";

import React from 'react';
import Image from 'next/image';
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

export default function NumberSystemContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/number_system_hero.png"
                        alt="Prime Spiral"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2 border border-indigo-500/20">
                        Phase 01: Origins
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Number System</h1>
                    <p className="text-neutral-400 text-lg">The language of the universe.</p>
                </div>
            </div>

            <ConceptSection id="divisibility" title="Divisibility Rules" icon="➗">
                <p>
                    Checking if a large number divides by 7, 11, or 13 is a superpower in exams.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                        <div className="text-indigo-400 font-bold mb-1">Div by 3 & 9</div>
                        <div className="text-sm text-neutral-400">Sum of digits is div by 3 or 9.</div>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                        <div className="text-indigo-400 font-bold mb-1">Div by 4 & 8</div>
                        <div className="text-sm text-neutral-400">Last 2 digits (for 4) or 3 digits (for 8).</div>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                        <div className="text-indigo-400 font-bold mb-1">Div by 11</div>
                        <div className="text-sm text-neutral-400">Diff between sum of odd & even places is 0 or 11.</div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Which value of k makes 91876k2 divisible by 8?"
                    solution={
                        <div>
                            <p>To be div by 8, last 3 digits (6k2) must be divisible by 8.</p>
                            <p>Try values for k:</p>
                            <ul className="ml-4 text-sm text-neutral-400">
                                <li>k=1: 612 / 8 = 76.5 (No)</li>
                                <li>k=3: 632 / 8 = 79 (Yes!)</li>
                                <li>k=7: 672 / 8 = 84 (Yes!)</li>
                            </ul>
                            <p>Smallest k=3.</p>
                        </div>
                    }
                    answer="3"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Number Rules"
                    rows={[
                        { concept: 'Prime Check', formula: '6k +/- 1' },
                        { concept: 'Sum (1..n)', formula: 'n(n+1)/2' },
                        { concept: 'Unit Digit', formula: 'Cyclicity of 4' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
