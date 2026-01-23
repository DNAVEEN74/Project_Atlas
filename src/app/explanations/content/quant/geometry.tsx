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

export default function GeometryContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/geometry_hero.png"
                        alt="Geometry Shapes"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-2 border border-pink-500/20">
                        Phase 04: Visual Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Geometry</h1>
                    <p className="text-neutral-400 text-lg">Circles, Triangles, and the rules of space.</p>
                </div>
            </div>

            <ConceptSection id="triangles" title="Triangle Properties" icon="🔺">
                <p>
                    Triangles are the building blocks of geometry.
                </p>

                <h4 className="text-white font-bold mt-6 mb-2">Centers of Triangle</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-900 rounded-lg">
                        <div className="text-pink-400 font-bold mb-1">Centroid (G)</div>
                        <div className="text-xs text-neutral-400">Intersection of Medians. Divide 2:1.</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-lg">
                        <div className="text-pink-400 font-bold mb-1">Incenter (I)</div>
                        <div className="text-xs text-neutral-400">Angle bisectors. Equidistant from sides.</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-lg">
                        <div className="text-pink-400 font-bold mb-1">Circumcenter (O)</div>
                        <div className="text-xs text-neutral-400">Perpendicular bisectors. Equidistant from vertices.</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-lg">
                        <div className="text-pink-400 font-bold mb-1">Orthocenter (H)</div>
                        <div className="text-xs text-neutral-400">Altitudes intersection.</div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="hard"
                    question="In a triangle, the Centroid divides the median in what ratio?"
                    solution={
                        <div>
                            <p>By property, Centroid divides any median in ratio <strong>2:1</strong>.</p>
                        </div>
                    }
                    answer="2:1"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Geometry Rules"
                    rows={[
                        { concept: 'Sum of Angles', formula: '180°' },
                        { concept: 'Pythagoras', formula: 'a^2 + b^2 = c^2' },
                        { concept: 'Circle Area', formula: '\\pi r^2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
