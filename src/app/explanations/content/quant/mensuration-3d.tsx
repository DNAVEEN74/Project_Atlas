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

export default function Mensuration3DContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🧊</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-500 text-xs font-bold uppercase tracking-widest mb-2 border border-violet-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mensuration 3D</h1>
                    <p className="text-neutral-400 text-lg">Volume, CSA, TSA — conquer all 3D solids!</p>
                </div>
            </div>

            {/* KEY CONCEPT */}
            <ConceptSection id="basics" title="Volume vs Surface Area" icon="📦">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-violet-500/10 border border-violet-500/30 rounded-xl text-center">
                        <h4 className="text-violet-400 font-bold mb-3">Volume</h4>
                        <p className="text-sm text-neutral-300">Space INSIDE the solid</p>
                        <p className="text-xs text-neutral-500 mt-2">Unit: cm³, m³, liters</p>
                        <p className="text-xs text-neutral-500">1 liter = 1000 cm³</p>
                    </div>
                    <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                        <h4 className="text-amber-400 font-bold mb-3">Surface Area</h4>
                        <p className="text-sm text-neutral-300">Total area of OUTSIDE surface</p>
                        <p className="text-xs text-neutral-500 mt-2">CSA = Curved Surface Area</p>
                        <p className="text-xs text-neutral-500">TSA = Total (CSA + bases)</p>
                    </div>
                </div>
            </ConceptSection>

            {/* CUBE & CUBOID */}
            <ConceptSection id="cube" title="Cube & Cuboid" icon="🟦">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-violet-500/30">
                        <h4 className="text-violet-400 font-bold mb-4 text-center text-lg">Cube (side = a)</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Volume</span>
                                <MathText>{`a^3`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">TSA</span>
                                <MathText>{`6a^2`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">LSA (4 faces)</span>
                                <MathText>{`4a^2`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Body Diagonal</span>
                                <MathText>{`a\\sqrt{3}`}</MathText>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-4 text-center text-lg">Cuboid (l × b × h)</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Volume</span>
                                <MathText>{`l \\times b \\times h`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">TSA</span>
                                <MathText>{`2(lb + bh + hl)`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">LSA</span>
                                <MathText>{`2h(l + b)`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Diagonal</span>
                                <MathText>{`\\sqrt{l^2 + b^2 + h^2}`}</MathText>
                            </div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A cube has edge 5 cm. Find volume and TSA."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Volume:</strong> a³ = 5³ = 125 cm³</p>
                            <p><strong>TSA:</strong> 6a² = 6 × 25 = 150 cm²</p>
                        </div>
                    }
                    answer="V = 125 cm³, TSA = 150 cm²"
                />
            </ConceptSection>

            {/* CYLINDER */}
            <ConceptSection id="cylinder" title="Cylinder" icon="🔵">
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-cyan-400 font-bold mb-4 text-center">Cylinder (radius r, height h)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormulaBox title="Volume">
                            <MathText className="text-lg">{`\\pi r^2 h`}</MathText>
                        </FormulaBox>
                        <FormulaBox title="CSA">
                            <MathText className="text-lg">{`2\\pi rh`}</MathText>
                        </FormulaBox>
                        <FormulaBox title="TSA">
                            <MathText className="text-lg">{`2\\pi r(r + h)`}</MathText>
                        </FormulaBox>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="A cylinder has radius 7 cm and height 10 cm. Find CSA. (π = 22/7)"
                    solution={
                        <div className="space-y-2">
                            <p><strong>CSA = 2πrh</strong></p>
                            <p>= 2 × (22/7) × 7 × 10</p>
                            <p>= 2 × 22 × 10 = <strong>440 cm²</strong></p>
                        </div>
                    }
                    answer="440 cm²"
                />

                <TipBox title="Hollow Cylinder (Pipe)">
                    <p className="text-sm">
                        Volume = πh(R² − r²) where R = outer radius, r = inner radius
                    </p>
                </TipBox>
            </ConceptSection>

            {/* CONE */}
            <ConceptSection id="cone" title="Cone" icon="🔺">
                <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-6 rounded-xl border-l-4 border-orange-500 mb-6">
                    <p className="text-lg">
                        <strong>Key relationship:</strong> l² = r² + h² (slant height, radius, height form a right triangle)
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <FormulaBox title="Volume">
                        <MathText className="text-lg">{`\\frac{1}{3}\\pi r^2 h`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="CSA">
                        <MathText className="text-lg">{`\\pi rl`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="TSA">
                        <MathText className="text-lg">{`\\pi r(r + l)`}</MathText>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="A cone has radius 3 cm and height 4 cm. Find slant height and CSA."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Slant height:</strong> l = √(r² + h²) = √(9 + 16) = √25 = 5 cm</p>
                            <p><strong>CSA = πrl:</strong> = π × 3 × 5 = 15π cm²</p>
                        </div>
                    }
                    answer="l = 5 cm, CSA = 15π cm²"
                />

                <CheckUnderstanding
                    question="Cone volume is 1/3 of which solid with same base and height?"
                    options={["Cube", "Cuboid", "Cylinder", "Sphere"]}
                    correctIndex={2}
                    explanation="Cone volume = (1/3)πr²h = (1/3) × Cylinder volume"
                />
            </ConceptSection>

            {/* SPHERE & HEMISPHERE */}
            <ConceptSection id="sphere" title="Sphere & Hemisphere" icon="🔴">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-red-500/30">
                        <h4 className="text-red-400 font-bold mb-4 text-center">Sphere (radius r)</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Volume</span>
                                <MathText>{`\\frac{4}{3}\\pi r^3`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Surface Area</span>
                                <MathText>{`4\\pi r^2`}</MathText>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold mb-4 text-center">Hemisphere (radius r)</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">Volume</span>
                                <MathText>{`\\frac{2}{3}\\pi r^3`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">CSA</span>
                                <MathText>{`2\\pi r^2`}</MathText>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded">
                                <span className="text-neutral-400">TSA</span>
                                <MathText>{`3\\pi r^2`}</MathText>
                            </div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="A solid hemisphere has radius 7 cm. Find TSA. (π = 22/7)"
                    solution={
                        <div className="space-y-2">
                            <p><strong>TSA = 3πr²</strong></p>
                            <p>= 3 × (22/7) × 7²</p>
                            <p>= 3 × 22 × 7 = <strong>462 cm²</strong></p>
                        </div>
                    }
                    answer="462 cm²"
                />
            </ConceptSection>

            {/* FRUSTUM */}
            <ConceptSection id="frustum" title="Frustum of a Cone" icon="🪣">
                <p className="mb-4">
                    A frustum is a cone with its top cut off — like a bucket!
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <p className="text-center text-neutral-400 mb-4">R = bigger radius, r = smaller radius, h = height, l = slant height</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormulaBox title="Volume">
                            <MathText className="text-sm">{`\\frac{1}{3}\\pi h(R^2 + r^2 + Rr)`}</MathText>
                        </FormulaBox>
                        <FormulaBox title="CSA">
                            <MathText className="text-sm">{`\\pi(R + r)l`}</MathText>
                        </FormulaBox>
                    </div>
                    <p className="text-center text-neutral-500 text-xs mt-4">
                        l = √[h² + (R−r)²]
                    </p>
                </div>
            </ConceptSection>

            {/* MELTING & RECASTING */}
            <ConceptSection id="melting" title="Melting & Recasting Problems" icon="🔥">
                <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-6 rounded-xl border-l-4 border-orange-500 mb-6">
                    <p className="text-lg">
                        <strong>Golden Rule:</strong> When a solid is melted and recast,
                        <span className="text-orange-400"> VOLUME STAYS THE SAME!</span>
                    </p>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="hard"
                    question="A cone (r=3, h=12) is melted into small spheres of r=0.5. How many spheres formed?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Volume of cone:</strong> (1/3)π × 3² × 12 = 36π cm³</p>
                            <p><strong>Volume of 1 sphere:</strong> (4/3)π × (0.5)³ = (4/3)π × 0.125 = π/6 cm³</p>
                            <p><strong>Number of spheres:</strong> 36π ÷ (π/6) = 36 × 6 = <strong>216 spheres</strong></p>
                        </div>
                    }
                    answer="216 spheres"
                />

                <CheckUnderstanding
                    question="A cube of side 6 is melted into a cylinder of r=3. Find height."
                    options={["6/π", "12/π", "24/π", "π/6"]}
                    correctIndex={2}
                    explanation="Cube vol = Cylinder vol. 6³ = πr²h → 216 = 9πh → h = 24/π"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing CSA with TSA</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            CSA = curved only. TSA = CSA + base areas. Read carefully!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Using Height Instead of Slant Height</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Cone CSA uses SLANT height (l). Volume uses HEIGHT (h). Don't mix!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong Coefficients</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Sphere: (4/3)πr³. Hemisphere: (2/3)πr³. Cone: (1/3)πr²h. Remember the fractions!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="3D Mensuration Master Reference"
                    rows={[
                        { concept: 'Cube Vol', formula: 'a^3' },
                        { concept: 'Cube TSA', formula: '6a^2' },
                        { concept: 'Cuboid Vol', formula: 'lbh' },
                        { concept: 'Cylinder Vol', formula: '\\pi r^2 h' },
                        { concept: 'Cylinder CSA', formula: '2\\pi rh' },
                        { concept: 'Cone Vol', formula: '\\frac{1}{3}\\pi r^2 h' },
                        { concept: 'Cone CSA', formula: '\\pi rl' },
                        { concept: 'Sphere Vol', formula: '\\frac{4}{3}\\pi r^3' },
                        { concept: 'Sphere SA', formula: '4\\pi r^2' },
                        { concept: 'Hemisphere TSA', formula: '3\\pi r^2' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
