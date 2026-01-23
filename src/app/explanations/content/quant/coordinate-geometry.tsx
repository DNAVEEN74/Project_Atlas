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

export default function CoordinateGeometryContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">📍</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest mb-2 border border-green-500/20">
                        Phase 04: Advanced
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Coordinate Geometry</h1>
                    <p className="text-neutral-400 text-lg">Points, Lines, and Equations.</p>
                </div>
            </div>

            <ConceptSection id="distance" title="Distance Formula" icon="📏">
                <FormulaBox>
                    <MathText>{`d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`}</MathText>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="section" title="Section Formula" icon="✂️">
                <p>Point dividing line joining (x₁, y₁) and (x₂, y₂) in ratio m:n.</p>
                <FormulaBox title="Internal Division">
                    <MathText>{`\\left( \\frac{mx_2 + nx_1}{m+n}, \\frac{my_2 + ny_1}{m+n} \\right)`}</MathText>
                </FormulaBox>

                <TipBox title="Midpoint">
                    When m = n, point is the midpoint: ((x₁+x₂)/2, (y₁+y₂)/2)
                </TipBox>
            </ConceptSection>

            <ConceptSection id="line" title="Line Equations" icon="📈">
                <div className="space-y-4 my-6">
                    <FormulaBox title="Slope">
                        <MathText>{`m = \\frac{y_2 - y_1}{x_2 - x_1}`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Slope-Intercept Form">
                        <MathText>{`y = mx + c`}</MathText>
                    </FormulaBox>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Coordinate Formulas"
                    rows={[
                        { concept: 'Triangle Area', formula: '(1/2)|x₁(y₂-y₃) + ...|' },
                        { concept: 'Collinear Check', formula: 'Area = 0' },
                        { concept: 'Parallel Lines', formula: 'm₁ = m₂' },
                        { concept: 'Perpendicular', formula: 'm₁ × m₂ = -1' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
