"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function CoordinateGeometryContent() {
    return (
        <>
            <ConceptSection id="basics" title="Distance & Section Formulas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-4">Distance Formula</h4>
                        <MathText>{`d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-green-400 font-bold mb-4">Section Formula (m:n)</h4>
                        <MathText>{`x = \\frac{mx_2 + nx_1}{m+n}, y = \\frac{my_2 + ny_1}{m+n}`}</MathText>
                    </div>
                </div>

                <TipBox title="Midpoint Formula">
                    Midpoint = <MathText>{`$(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2})$`}</MathText>
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: AREA OF TRIANGLE */}
            <ConceptSection id="area" title="Area of Triangle">
                <FormulaBox>
                    <MathText>{`\\text{Area} = \\frac{1}{2} | x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2) |`}</MathText>
                </FormulaBox>

                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-green-400 font-bold mb-2">Collinearity Condition</h4>
                    <p className="text-sm text-neutral-300">
                        Three points are collinear (lie on straight line) if <strong>Area of Triangle = 0</strong>.
                    </p>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Find area of triangle with vertices (1, -1), (-4, 6) and (-3, -5)."
                    solution={
                        <div className="space-y-2">
                            <p>Using formula:</p>
                            <p>1/2 | 1(6 - (-5)) + (-4)((-5) - (-1)) + (-3)((-1) - 6) |</p>
                            <p>= 1/2 | 1(11) + (-4)(-4) + (-3)(-7) |</p>
                            <p>= 1/2 | 11 + 16 + 21 |</p>
                            <p>= 1/2 | 48 | = <strong>24 sq. units</strong></p>
                        </div>
                    }
                    answer="24"
                />
            </ConceptSection>

            {/* CONCEPT 3: STRAIGHT LINES */}
            <ConceptSection id="line" title="Equation of a Line">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-center">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Slope (Gradident m)</h4>
                        <MathText>{`m = \\frac{y_2 - y_1}{x_2 - x_1} = \\tan \\theta`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Standard Form</h4>
                        <MathText>{`ax + by + c = 0`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Slope = -a/b</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4 text-center">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-green-500/30">
                        <h4 className="text-green-400 font-bold mb-1">Parallel Lines</h4>
                        <p className="text-sm text-neutral-300">Slopes are equal</p>
                        <MathText>{`m_1 = m_2`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-green-500/30">
                        <h4 className="text-green-400 font-bold mb-1">Perpendicular Lines</h4>
                        <p className="text-sm text-neutral-300">Product is -1</p>
                        <MathText>{`m_1 \\times m_2 = -1`}</MathText>
                    </div>
                </div>

                <CheckUnderstanding
                    question="Find slope of line perpendicular to 2x + 3y = 5."
                    options={["2/3", "-2/3", "3/2", "-3/2"]}
                    correctIndex={2}
                    explanation="Slope of 2x+3y=5 is -a/b = -2/3. Perpendicular slope = -1/m = -1/(-2/3) = 3/2."
                />
            </ConceptSection>

            {/* CONCEPT 4: TRIANGLE CENTERS */}
            <ConceptSection id="centers" title="Triangle Centers Coordinates">
                <div className="space-y-4 my-6">
                    <FormulaBox title="Centroid (G)" variant="secondary">
                        <MathText>{`G = \\left( \\frac{x_1+x_2+x_3}{3}, \\frac{y_1+y_2+y_3}{3} \\right)`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Incenter (I)" variant="secondary">
                        <MathText>{`I = \\left( \\frac{ax_1+bx_2+cx_3}{a+b+c}, \\frac{ay_1+by_2+cy_3}{a+b+c} \\right)`}</MathText>
                        <p className="text-center text-xs text-neutral-400 mt-1">a, b, c are lengths of sides opposite to A, B, C.</p>
                    </FormulaBox>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Coordinate Master Reference"
                    rows={[
                        { concept: 'Distance', formula: '√[(x₂-x₁)² + (y₂-y₁)²]' },
                        { concept: 'Midpoint', formula: 'Average of coordinates' },
                        { concept: 'Slope', formula: '(y₂-y₁)/(x₂-x₁)' },
                        { concept: 'Line Eq', formula: 'y - y₁ = m(x - x₁)' },
                        { concept: 'Perpendicular', formula: 'm₁m₂ = -1' },
                        { concept: 'Centroid', formula: 'Average of 3 coordinates' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
