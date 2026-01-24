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
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🗼</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 border border-orange-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Height & Distance</h1>
                    <p className="text-neutral-400 text-lg">No more trigonometry tables — use the Ratio Method!</p>
                </div>
            </div>

            {/* CONCEPT 1: ANGLES */}
            <ConceptSection id="angles" title="Terminology" icon="📐">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-orange-500/30 text-center">
                        <div className="text-4xl mb-2">👀 ↖️ 🦅</div>
                        <h4 className="text-orange-400 font-bold mb-2">Angle of Elevation</h4>
                        <p className="text-sm text-neutral-300">Looking UP at an object.</p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-blue-500/30 text-center">
                        <div className="text-4xl mb-2">🦅 ↘️ 👀</div>
                        <h4 className="text-blue-400 font-bold mb-2">Angle of Depression</h4>
                        <p className="text-sm text-neutral-300">Looking DOWN at an object.</p>
                        <p className="text-xs text-neutral-500 mt-2">Mathematically equal to Angle of Elevation (Alternate Interior Angles)</p>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: RATIO METHOD */}
            <ConceptSection id="ratios" title="The Golden Ratio Method" icon="✨">
                <p>
                    Forget sin/cos/tan. Memorize these triangle side ratios corresponding to angles.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    {/* 30-60-90 */}
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-white font-bold mb-4">30° - 60° - 90°</h4>
                        <div className="space-y-2 font-mono text-lg">
                            <p className="text-neutral-400">Opposite 30° : <span className="text-orange-400">1</span></p>
                            <p className="text-neutral-400">Opposite 60° : <span className="text-orange-400">√3</span></p>
                            <p className="text-neutral-400">Opposite 90° : <span className="text-orange-400">2</span></p>
                        </div>
                    </div>

                    {/* 45-45-90 */}
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-white font-bold mb-4">45° - 45° - 90°</h4>
                        <div className="space-y-2 font-mono text-lg">
                            <p className="text-neutral-400">Opposite 45° : <span className="text-orange-400">1</span></p>
                            <p className="text-neutral-400">Opposite 45° : <span className="text-orange-400">1</span></p>
                            <p className="text-neutral-400">Opposite 90° : <span className="text-orange-400">√2</span></p>
                        </div>
                    </div>

                    {/* 15-75-90 */}
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <h4 className="text-white font-bold mb-4">15° - 75° - 90°</h4>
                        <div className="space-y-2 font-mono text-lg">
                            <p className="text-neutral-400">Height : Base</p>
                            <p className="text-orange-400">1 : (2 + √3)</p>
                            <p className="text-xs text-neutral-500 mt-2">(Rare but possible)</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Shadow of a tower is √3 times its height. Find angle of elevation."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Ratio:</strong> Height : Shadow = 1 : √3</p>
                            <p>This matches the <strong>30-60-90</strong> triangle where:</p>
                            <p>Opposite side 30° is 1.</p>
                            <p>Adjacent side 30° is √3.</p>
                            <p>So, angle is <strong>30°</strong>.</p>
                        </div>
                    }
                    answer="30°"
                />
            </ConceptSection>

            {/* CONCEPT 3: TWO ANGLES PROBLEM */}
            <ConceptSection id="movement" title="Object Moving Towards Tower" icon="🏃">
                <p>
                    When angle changes from θ1 to θ2 as you move distance 'd' towards tower of height 'h':
                </p>

                <FormulaBox variant="secondary">
                    <MathText>{`d = h (\\cot \\theta_1 - \\cot \\theta_2)`}</MathText>
                </FormulaBox>

                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-orange-400 font-bold mb-2">Common Case: 30° to 60°</h4>
                    <p className="text-sm text-neutral-300">
                        If angle changes from 30° to 60°, the total distance is divided in ratio <strong>2 : 1</strong>.
                        <br />Distance moved = 2 units. Remaining distance = 1 unit.
                    </p>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Angle of elevation changes from 30° to 60° on walking 20m towards a tower. Find height."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Shortcut:</strong> For 30°→60°, distance moved 'd' relates to height 'h' as:</p>
                            <p><MathText>{`d = \\frac{2h}{\\sqrt{3}}`}</MathText></p>
                            <p>So <MathText>{`20 = \\frac{2h}{\\sqrt{3}} \\rightarrow 10 = \\frac{h}{\\sqrt{3}}`}</MathText></p>
                            <p>Height <MathText>{`h = 10\\sqrt{3} m`}</MathText></p>
                        </div>
                    }
                    answer="10√3 m"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong Ratio Order</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Opposite 30° is 1, NOT √3. Remember: Small angle faces small side. 30° &lt; 60°, so 1 &lt; √3.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ 15° Trap</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Don't guess for 15°. Use tan(A-B) or remember tan 15° = 2 - √3.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="H&D Master Reference"
                    rows={[
                        { concept: '30-60-90 sides', formula: '1 : √3 : 2' },
                        { concept: '45-45-90 sides', formula: '1 : 1 : √2' },
                        { concept: 'Distance Formula', formula: 'h(cot θ1 - cot θ2)' },
                        { concept: '30° → 60° Dist', formula: 'd = 2h / √3' },
                        { concept: 'Complementary Angles', formula: 'h = √(ab)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
