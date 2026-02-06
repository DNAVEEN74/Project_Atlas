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
import { WarningIcon } from '@/components/icons';

export default function GeometryContent() {
    return (
        <>
            <ConceptSection id="triangles" title="Triangle Fundamentals">
                <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-xl border-l-4 border-amber-500 mb-6">
                    <p className="text-lg">
                        <strong>Rule #1:</strong> Sum of all angles = 180°. Always!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-amber-400 font-bold mb-2">Acute Triangle</h4>
                        <p className="text-sm text-neutral-400">All angles &lt; 90°</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-amber-400 font-bold mb-2">Right Triangle</h4>
                        <p className="text-sm text-neutral-400">One angle = 90°</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-amber-400 font-bold mb-2">Obtuse Triangle</h4>
                        <p className="text-sm text-neutral-400">One angle &gt; 90°</p>
                    </div>
                </div>

                <FormulaBox title="Pythagoras Theorem (Right △)" variant="primary">
                    <div className="text-center">
                        <MathText className="text-2xl">{`a^2 + b^2 = c^2`}</MathText>
                        <p className="text-neutral-500 text-sm mt-2">c = hypotenuse (longest side, opposite 90°)</p>
                    </div>
                </FormulaBox>

                <TipBox title="Common Pythagorean Triplets">
                    <p className="text-sm font-mono">
                        3-4-5, 5-12-13, 8-15-17, 7-24-25, 9-40-41, 20-21-29
                    </p>
                </TipBox>
            </ConceptSection>

            {/* TRIANGLE CENTERS */}
            <ConceptSection id="centers" title="Centers of a Triangle">
                <p className="mb-4">
                    Every triangle has 4 important centers. Know what creates each!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-3">Centroid (G)</h4>
                        <p className="text-sm text-neutral-300">Intersection of <strong>Medians</strong></p>
                        <ul className="list-disc list-inside text-xs text-neutral-500 mt-2">
                            <li>Divides each median in 2:1 ratio</li>
                            <li>Always lies INSIDE the triangle</li>
                            <li>Center of mass/gravity</li>
                        </ul>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-fuchsia-500/30">
                        <h4 className="text-fuchsia-400 font-bold mb-3">Incenter (I)</h4>
                        <p className="text-sm text-neutral-300">Intersection of <strong>Angle Bisectors</strong></p>
                        <ul className="list-disc list-inside text-xs text-neutral-500 mt-2">
                            <li>Equidistant from all 3 sides</li>
                            <li>Center of inscribed circle (incircle)</li>
                            <li>Always lies INSIDE</li>
                        </ul>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-orange-500/30">
                        <h4 className="text-orange-400 font-bold mb-3">Circumcenter (O)</h4>
                        <p className="text-sm text-neutral-300">Intersection of <strong>Perpendicular Bisectors</strong></p>
                        <ul className="list-disc list-inside text-xs text-neutral-500 mt-2">
                            <li>Equidistant from all 3 vertices</li>
                            <li>Center of circumscribed circle</li>
                            <li>Can be outside (for obtuse △)</li>
                        </ul>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-3">Orthocenter (H)</h4>
                        <p className="text-sm text-neutral-300">Intersection of <strong>Altitudes</strong></p>
                        <ul className="list-disc list-inside text-xs text-neutral-500 mt-2">
                            <li>Altitude = perpendicular from vertex to opposite side</li>
                            <li>Can be outside (for obtuse △)</li>
                            <li>At vertex for right △</li>
                        </ul>
                    </div>
                </div>

                <TipBox variant="note" title="Memory Trick: MIPC">
                    <p className="text-sm">
                        <strong>M</strong>edians → Centroid<br />
                        <strong>I</strong>ncircle → Incenter (angle bisectors)<br />
                        <strong>P</strong>erpendicular bisectors → Circumcenter<br />
                        <strong>C</strong>ompleted altitudes → Orthocenter
                    </p>
                </TipBox>

                <CheckUnderstanding
                    question="Which center divides each median in ratio 2:1?"
                    options={["Incenter", "Circumcenter", "Centroid", "Orthocenter"]}
                    correctIndex={2}
                    explanation="The Centroid divides each median in the ratio 2:1 from vertex to midpoint."
                />
            </ConceptSection>

            {/* SIMILARITY & CONGRUENCE */}
            <ConceptSection id="similarity" title="Similar & Congruent Triangles">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-3">Similar (∼)</h4>
                        <p className="text-sm text-neutral-300">Same SHAPE, different SIZE</p>
                        <ul className="list-disc list-inside text-xs text-neutral-500 mt-2">
                            <li>AAA (all angles equal)</li>
                            <li>SSS (sides in same ratio)</li>
                            <li>SAS (two sides proportional, included angle equal)</li>
                        </ul>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-orange-500/30">
                        <h4 className="text-orange-400 font-bold mb-3">Congruent (≅)</h4>
                        <p className="text-sm text-neutral-300">Same SHAPE and same SIZE</p>
                        <ul className="list-disc list-inside text-xs text-neutral-500 mt-2">
                            <li>SSS (all 3 sides equal)</li>
                            <li>SAS (2 sides + included angle)</li>
                            <li>ASA / AAS</li>
                            <li>RHS (right angle, hypotenuse, side)</li>
                        </ul>
                    </div>
                </div>

                <FormulaBox title="Similar Triangles — Key Property">
                    <div className="text-center">
                        <p className="text-neutral-400 mb-2">If △ABC ∼ △DEF with ratio k, then:</p>
                        <MathText>{`\\frac{\\text{Area of } △ABC}{\\text{Area of } △DEF} = k^2`}</MathText>
                    </div>
                </FormulaBox>
            </ConceptSection>

            {/* CIRCLE THEOREMS */}
            <ConceptSection id="circles" title="Circle Theorems">
                <div className="space-y-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-3">Central Angle vs Inscribed Angle</h4>
                        <p className="text-sm text-neutral-300">
                            Inscribed angle = ½ × Central angle (for same arc)
                        </p>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-3">Angles in a Semicircle</h4>
                        <p className="text-sm text-neutral-300">
                            Angle inscribed in a semicircle = 90°
                        </p>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-3">Tangent Properties</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
                            <li>Tangent is perpendicular to radius at point of contact</li>
                            <li>Two tangents from external point are equal in length</li>
                        </ul>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-3">Chord Properties</h4>
                        <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
                            <li>Equal chords are equidistant from center</li>
                            <li>Perpendicular from center bisects the chord</li>
                        </ul>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="A chord is 6 cm from center of a circle with radius 10 cm. Find chord length."
                    solution={
                        <div className="space-y-2">
                            <p>Let half-chord = x. Then by Pythagoras:</p>
                            <p><MathText>{`10^2 = 6^2 + x^2`}</MathText></p>
                            <p>100 = 36 + x² → x² = 64 → x = 8 cm</p>
                            <p><strong>Full chord = 2 × 8 = 16 cm</strong></p>
                        </div>
                    }
                    answer="16 cm"
                />
            </ConceptSection>

            {/* QUADRILATERAL PROPERTIES */}
            <ConceptSection id="quad" title="Quadrilateral Properties">
                <div className="overflow-x-auto my-8">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-neutral-400">Shape</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Diagonals</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Key Property</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">Parallelogram</td>
                                <td className="px-4 py-3">Bisect each other</td>
                                <td className="px-4 py-3">Opposite sides equal & parallel</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">Rectangle</td>
                                <td className="px-4 py-3">Equal & bisect each other</td>
                                <td className="px-4 py-3">All angles 90°</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">Rhombus</td>
                                <td className="px-4 py-3">Bisect at 90°</td>
                                <td className="px-4 py-3">All sides equal</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">Square</td>
                                <td className="px-4 py-3">Equal, bisect at 90°</td>
                                <td className="px-4 py-3">All sides & angles equal</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-white">Trapezium</td>
                                <td className="px-4 py-3">May not bisect</td>
                                <td className="px-4 py-3">One pair of parallel sides</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <CheckUnderstanding
                    question="In which quadrilateral do diagonals bisect each other at 90° but are NOT equal?"
                    options={["Rectangle", "Square", "Rhombus", "Parallelogram"]}
                    correctIndex={2}
                    explanation="In a rhombus, diagonals bisect at 90° but have different lengths. In a square, they are equal."
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Confusing Median with Altitude</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Median goes to MIDPOINT. Altitude is PERPENDICULAR to opposite side.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Wrong Triangle Center</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Centroid ≠ Circumcenter. Medians → Centroid. Perpendicular bisectors → Circumcenter.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Similar Areas Squared</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            If sides ratio = k, then AREA ratio = k². Don't use k directly for areas!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Geometry Master Reference"
                    rows={[
                        { concept: 'Sum of △ angles', formula: '180°' },
                        { concept: 'Pythagoras', formula: 'a^2 + b^2 = c^2' },
                        { concept: 'Centroid ratio', formula: '2:1' },
                        { concept: 'Inscribed angle', formula: '\\frac{1}{2} \\times \\text{Central angle}' },
                        { concept: 'Semicircle angle', formula: '90°' },
                        { concept: 'Similar △ areas', formula: '\\text{ratio}^2' },
                        { concept: 'Quadrilateral angles', formula: '360°' },
                        { concept: 'Tangent to radius', formula: '90°' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
