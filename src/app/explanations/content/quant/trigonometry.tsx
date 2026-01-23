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

export default function TrigonometryContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/trigonometry_hero.png"
                        alt="Trig Mountains"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-500 text-xs font-bold uppercase tracking-widest mb-2 border border-teal-500/20">
                        Phase 04: Advanced Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Trigonometry</h1>
                    <p className="text-neutral-400 text-lg">Measurer of Triangles.</p>
                </div>
            </div>

            <ConceptSection id="basics" title="SOH CAH TOA" icon="📐">
                <p>
                    For a right-angled triangle:
                </p>

                <div className="grid grid-cols-3 gap-2 my-6 text-center">
                    <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                        <div className="text-teal-400 font-bold">SIN</div>
                        <div className="text-xs">Opposite / Hypotenuse</div>
                    </div>
                    <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                        <div className="text-teal-400 font-bold">COS</div>
                        <div className="text-xs">Adjacent / Hypotenuse</div>
                    </div>
                    <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                        <div className="text-teal-400 font-bold">TAN</div>
                        <div className="text-xs">Opposite / Adjacent</div>
                    </div>
                </div>

                <FormulaBox title="Pythagorean Identity">
                    <MathText>{`\\sin^2\\theta + \\cos^2\\theta = 1`}</MathText>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="tables" title="Standard Values">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-400">
                        <thead className="text-xs uppercase bg-neutral-900 text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">Angle</th>
                                <th className="px-4 py-3">0°</th>
                                <th className="px-4 py-3">30°</th>
                                <th className="px-4 py-3">45°</th>
                                <th className="px-4 py-3">60°</th>
                                <th className="px-4 py-3">90°</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-bold text-white">sin</td>
                                <td className="px-4 py-3">0</td>
                                <td className="px-4 py-3">1/2</td>
                                <td className="px-4 py-3">1/√2</td>
                                <td className="px-4 py-3">√3/2</td>
                                <td className="px-4 py-3">1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Trig Identities"
                    rows={[
                        { concept: 'Inverse', formula: 'csc, sec, cot' },
                        { concept: 'Sec-Tan', formula: 'sec^2 - tan^2 = 1' },
                        { concept: 'Cosec-Cot', formula: 'cosec^2 - cot^2 = 1' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
