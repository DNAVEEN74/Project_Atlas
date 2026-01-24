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

export default function TimeSpeedDistanceContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🚄</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Time, Speed & Distance</h1>
                    <p className="text-neutral-400 text-lg">Master the D = S × T triangle — and dominate train/boat problems!</p>
                </div>
            </div>

            {/* THE CORE FORMULA */}
            <ConceptSection id="basics" title="The Triangle of Motion" icon="⚡">
                <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 rounded-xl border-l-4 border-cyan-500 mb-6">
                    <p className="text-lg">
                        <strong>One formula rules them all:</strong> Distance = Speed × Time.
                        Know how to rearrange it!
                    </p>
                </div>

                {/* Visual Triangle */}
                <div className="flex justify-center my-8">
                    <div className="relative w-52 h-52">
                        <div className="absolute inset-0 border-2 border-cyan-500 rounded-full flex items-center justify-center bg-cyan-500/5">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">D</div>
                                <div className="w-32 h-0.5 bg-neutral-600 mx-auto mb-2" />
                                <div className="flex justify-around w-full px-4">
                                    <span className="text-3xl font-bold text-cyan-400">S</span>
                                    <span className="text-2xl text-neutral-600">×</span>
                                    <span className="text-3xl font-bold text-amber-400">T</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <FormulaBox title="Find Distance">
                        <div className="text-center">
                            <MathText className="text-lg">{`D = S \\times T`}</MathText>
                        </div>
                    </FormulaBox>
                    <FormulaBox title="Find Speed">
                        <div className="text-center">
                            <MathText className="text-lg">{`S = \\frac{D}{T}`}</MathText>
                        </div>
                    </FormulaBox>
                    <FormulaBox title="Find Time">
                        <div className="text-center">
                            <MathText className="text-lg">{`T = \\frac{D}{S}`}</MathText>
                        </div>
                    </FormulaBox>
                </div>

                <TipBox title="The Inverse Relationship">
                    <p className="text-sm">
                        If Distance is constant: Speed and Time are <strong>inversely proportional</strong>.<br />
                        Double the speed → Half the time. Triple the speed → One-third the time.
                    </p>
                </TipBox>
            </ConceptSection>

            {/* UNIT CONVERSIONS */}
            <ConceptSection id="units" title="Unit Conversion — Must Know!" icon="🔄">
                <p className="mb-4">
                    Most questions mix km/h and m/s. Master these conversions!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center">
                        <h4 className="text-cyan-400 font-bold mb-3">km/h → m/s</h4>
                        <MathText className="text-2xl">{`\\times \\frac{5}{18}`}</MathText>
                        <p className="text-sm text-neutral-400 mt-3">Example: 36 km/h = 36 × 5/18 = 10 m/s</p>
                    </div>
                    <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                        <h4 className="text-amber-400 font-bold mb-3">m/s → km/h</h4>
                        <MathText className="text-2xl">{`\\times \\frac{18}{5}`}</MathText>
                        <p className="text-sm text-neutral-400 mt-3">Example: 10 m/s = 10 × 18/5 = 36 km/h</p>
                    </div>
                </div>

                <TipBox variant="note" title="Quick Mental Math">
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>18 km/h = 5 m/s (baseline)</li>
                        <li>36 km/h = 10 m/s (double)</li>
                        <li>72 km/h = 20 m/s (4×)</li>
                        <li>90 km/h = 25 m/s (5×)</li>
                    </ul>
                </TipBox>

                <CheckUnderstanding
                    question="54 km/h = ? m/s"
                    options={["10", "12", "15", "18"]}
                    correctIndex={2}
                    explanation="54 × 5/18 = 54/18 × 5 = 3 × 5 = 15 m/s"
                />
            </ConceptSection>

            {/* RELATIVE SPEED */}
            <ConceptSection id="relative" title="Relative Speed — The Key to Train Problems" icon="🚄">
                <p className="mb-4">
                    When two objects move, their <strong>relative speed</strong> determines how fast they approach or separate.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                        <h4 className="text-emerald-400 font-bold mb-3">Opposite Directions</h4>
                        <div className="text-2xl mb-2">← A &nbsp;&nbsp;&nbsp; B →</div>
                        <MathText className="text-xl">{`S_{rel} = S_1 + S_2`}</MathText>
                        <p className="text-sm text-neutral-400 mt-3">They approach each other faster!</p>
                    </div>
                    <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                        <h4 className="text-amber-400 font-bold mb-3">Same Direction</h4>
                        <div className="text-2xl mb-2">A → &nbsp;&nbsp;&nbsp; B →</div>
                        <MathText className="text-xl">{`S_{rel} = |S_1 - S_2|`}</MathText>
                        <p className="text-sm text-neutral-400 mt-3">The gap changes slowly</p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Two trains running opposite directions at 50 km/h and 40 km/h cross each other in 10s. If their lengths are 100m and 200m, verify this."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Total distance:</strong> 100 + 200 = 300m</p>
                            <p><strong>Relative speed:</strong> 50 + 40 = 90 km/h = 25 m/s</p>
                            <p><strong>Time:</strong> 300 ÷ 25 = 12s</p>
                            <p className="text-amber-400 text-sm">Hmm, 12s ≠ 10s — one of the given values must be wrong!</p>
                        </div>
                    }
                    answer="12 seconds (not 10s)"
                />
            </ConceptSection>

            {/* TRAIN PROBLEMS */}
            <ConceptSection id="trains" title="Train Problems — Distance Covered" icon="🚆">
                <p className="mb-4">
                    The key insight: When a train crosses something, what's the <strong>TOTAL distance</strong> it covers?
                </p>

                <div className="overflow-x-auto my-8">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-neutral-400">Scenario</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Distance Covered</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4 text-white">Train crosses a pole/person</td>
                                <td className="px-4 py-4">Train's length only</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4 text-white">Train crosses a platform/bridge</td>
                                <td className="px-4 py-4">Train length + Platform length</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4 text-white">Train crosses another train</td>
                                <td className="px-4 py-4">Both trains' lengths combined</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 text-white">Train passes a man walking same direction</td>
                                <td className="px-4 py-4">Train length (relative speed!)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="A 200m train at 72 km/h crosses a platform in 25s. Find platform length."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Speed:</strong> 72 km/h = 72 × 5/18 = 20 m/s</p>
                            <p><strong>Distance covered:</strong> 20 × 25 = 500m</p>
                            <p><strong>Distance = Train + Platform:</strong> 200 + P = 500</p>
                            <p><strong>Platform:</strong> P = 300m</p>
                        </div>
                    }
                    answer="300m"
                />

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Two trains 100m and 120m long run in same direction at 72 km/h and 54 km/h. Time to cross each other?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Total distance:</strong> 100 + 120 = 220m</p>
                            <p><strong>Relative speed (same dir):</strong> 72 − 54 = 18 km/h = 5 m/s</p>
                            <p><strong>Time:</strong> 220 ÷ 5 = <strong>44 seconds</strong></p>
                        </div>
                    }
                    answer="44 seconds"
                />

                <CheckUnderstanding
                    question="A train crosses a pole in 15s and a 300m platform in 25s. Find train length."
                    options={["300m", "400m", "450m", "500m"]}
                    correctIndex={2}
                    explanation="Let train = L, speed = L/15. For platform: (L+300)/(L/15) = 25. Solving: 15(L+300)/L = 25 → L+300 = 5L/3 → 3L+900 = 5L → L = 450m"
                />
            </ConceptSection>

            {/* BOATS & STREAMS */}
            <ConceptSection id="boats" title="Boats & Streams" icon="🚤">
                <p className="mb-4">
                    Same concept as relative speed, but with water current!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                        <h4 className="text-emerald-400 font-bold mb-3">⬇️ Downstream</h4>
                        <p className="text-sm text-neutral-300 mb-2">Boat + Current (same direction)</p>
                        <MathText className="text-xl">{`S_{down} = B + C`}</MathText>
                    </div>
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                        <h4 className="text-red-400 font-bold mb-3">⬆️ Upstream</h4>
                        <p className="text-sm text-neutral-300 mb-2">Boat − Current (opposite direction)</p>
                        <MathText className="text-xl">{`S_{up} = B - C`}</MathText>
                    </div>
                </div>

                <FormulaBox title="Finding Boat Speed & Stream Speed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-neutral-400 text-sm mb-1">Speed of Boat (still water)</p>
                            <MathText>{`B = \\frac{S_{down} + S_{up}}{2}`}</MathText>
                        </div>
                        <div>
                            <p className="text-neutral-400 text-sm mb-1">Speed of Stream</p>
                            <MathText>{`C = \\frac{S_{down} - S_{up}}{2}`}</MathText>
                        </div>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="A boat goes 30 km downstream in 3 hours and returns in 5 hours. Find boat speed in still water."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Downstream speed:</strong> 30/3 = 10 km/h</p>
                            <p><strong>Upstream speed:</strong> 30/5 = 6 km/h</p>
                            <p><strong>Boat speed:</strong> (10 + 6)/2 = <strong>8 km/h</strong></p>
                            <p className="text-neutral-500 text-sm">Stream speed: (10 − 6)/2 = 2 km/h</p>
                        </div>
                    }
                    answer="8 km/h"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting Unit Conversion</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            If speed is in km/h and length in meters, you MUST convert before dividing!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong Distance for Train Problems</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Crossing a platform = Train + Platform. Crossing a pole = Train only.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Adding Speeds When Same Direction</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Same direction = SUBTRACT speeds. Opposite direction = ADD speeds.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Average Speed ≠ Simple Average</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            For equal distances: Use 2S₁S₂/(S₁+S₂), not (S₁+S₂)/2!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Time, Speed & Distance Master Reference"
                    rows={[
                        { concept: 'Basic Formula', formula: 'D = S \\times T' },
                        { concept: 'km/h → m/s', formula: '\\times 5/18' },
                        { concept: 'm/s → km/h', formula: '\\times 18/5' },
                        { concept: 'Relative (opposite)', formula: 'S_1 + S_2' },
                        { concept: 'Relative (same)', formula: '|S_1 - S_2|' },
                        { concept: 'Train + Platform', formula: 'D = L_{train} + L_{platform}' },
                        { concept: 'Downstream', formula: 'B + C' },
                        { concept: 'Upstream', formula: 'B - C' },
                        { concept: 'Boat speed', formula: '(S_{down} + S_{up})/2' },
                        { concept: 'Average speed', formula: '2S_1 S_2 / (S_1 + S_2)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
