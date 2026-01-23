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

export default function TimeSpeedDistanceContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/tsd_hero.png"
                        alt="Time Speed Motion"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        Phase 03: Motion
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Time, Speed & Distance</h1>
                    <p className="text-neutral-400 text-lg">Mastering Relative Speed and Trains.</p>
                </div>
            </div>

            <ConceptSection id="intro" title="The Triangle of Motion" icon="⚡">
                <p>
                    Speed is simply the rate of covering distance.
                </p>
                <div className="flex justify-center my-6">
                    <div className="relative w-48 h-48">
                        <div className="absolute inset-0 border-2 border-cyan-500 rounded-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">D</div>
                                <div className="w-32 h-0.5 bg-neutral-700 mx-auto mb-2" />
                                <div className="flex justify-around w-full px-8">
                                    <span className="text-2xl font-bold text-cyan-400">S</span>
                                    <span className="text-neutral-600">x</span>
                                    <span className="text-2xl font-bold text-amber-500">T</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FormulaBox>
                    <MathText>{`\\text{Distance} = \\text{Speed} \\times \\text{Time}`}</MathText>
                </FormulaBox>
                <p className="mt-4 text-sm text-neutral-400 text-center">
                    If Distance is constant, Speed and Time are Inversely Proportional. <br />
                    (Double speed = Half time).
                </p>
            </ConceptSection>

            <ConceptSection id="relative" title="Relative Speed" icon="🚄">
                <p>
                    When two bodies move, their speed depends on direction.
                </p>
                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                        <div className="text-sm text-neutral-500 mb-2">Opposite Direction</div>
                        <div className="text-2xl font-bold text-emerald-400">Add Speeds</div>
                        <div className="mt-2 text-xs">A → ← B</div>
                        <div className="font-mono mt-1"><MathText>{`S_1 + S_2`}</MathText></div>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                        <div className="text-sm text-neutral-500 mb-2">Same Direction</div>
                        <div className="text-2xl font-bold text-amber-400">Subtract Speeds</div>
                        <div className="mt-2 text-xs">A → B →</div>
                        <div className="font-mono mt-1"><MathText>{`|S_1 - S_2|`}</MathText></div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Two trains 100m and 120m long are running in same direction at 72 km/h and 54 km/h. Time to cross?"
                    solution={
                        <div>
                            <p className="mb-2"><strong>Total Distance</strong> = Sum of Lengths = <MathText>{`100 + 120 = 220`}</MathText> m.</p>
                            <p className="mb-2"><strong>Relative Speed</strong> (Same Dir) = <MathText>{`72 - 54 = 18`}</MathText> km/h.</p>
                            <p className="mb-2">Convert Speed to m/s: <MathText>{`18 \\times \\frac{5}{18} = 5`}</MathText> m/s.</p>
                            <p>Time = <MathText>{`\\frac{220}{5} = 44`}</MathText> seconds.</p>
                        </div>
                    }
                    answer="44 sec"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="TSD Formulas"
                    rows={[
                        { concept: 'km/h to m/s', formula: '\\times 5/18' },
                        { concept: 'm/s to km/h', formula: '\\times 18/5' },
                        { concept: 'Avg Speed', formula: '2xy/(x+y)' },
                        { concept: 'Rel Speed (Opp)', formula: 'S_1 + S_2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
