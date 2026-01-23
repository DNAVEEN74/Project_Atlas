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

export default function Mensuration2DContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">📐</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-2 border border-pink-500/20">
                        Phase 04: Visual Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mensuration 2D</h1>
                    <p className="text-neutral-400 text-lg">Area and Perimeter of flat shapes.</p>
                </div>
            </div>

            <ConceptSection id="formulas" title="Essential Formulas" icon="📏">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-3">Triangle</h4>
                        <div className="space-y-2 text-sm">
                            <p>Area = ½ × base × height</p>
                            <p>Heron's: √[s(s-a)(s-b)(s-c)]</p>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-3">Circle</h4>
                        <div className="space-y-2 text-sm">
                            <p>Area = πr²</p>
                            <p>Circumference = 2πr</p>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-3">Rectangle</h4>
                        <div className="space-y-2 text-sm">
                            <p>Area = l × b</p>
                            <p>Perimeter = 2(l + b)</p>
                            <p>Diagonal = √(l² + b²)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-pink-400 font-bold mb-3">Square</h4>
                        <div className="space-y-2 text-sm">
                            <p>Area = a²</p>
                            <p>Perimeter = 4a</p>
                            <p>Diagonal = a√2</p>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="quadrilaterals" title="Quadrilaterals" icon="⬛">
                <div className="space-y-4">
                    <FormulaBox title="Parallelogram">
                        <MathText>{`\\text{Area} = \\text{base} \\times \\text{height}`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Trapezium">
                        <MathText>{`\\text{Area} = \\frac{1}{2}(a + b) \\times h`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Rhombus">
                        <MathText>{`\\text{Area} = \\frac{1}{2} \\times d_1 \\times d_2`}</MathText>
                    </FormulaBox>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="2D Formulas"
                    rows={[
                        { concept: 'Equilateral △', formula: '(√3/4) × a²' },
                        { concept: 'Sector Area', formula: '(θ/360) × πr²' },
                        { concept: 'Arc Length', formula: '(θ/360) × 2πr' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
