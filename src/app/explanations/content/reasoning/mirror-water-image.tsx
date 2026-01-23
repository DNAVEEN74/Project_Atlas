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

export default function MirrorWaterImageContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl select-none font-mono tracking-widest">
                        <span className="text-white">F</span>
                        <span className="text-neutral-600 mx-4">│</span>
                        <span className="text-cyan-400" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>F</span>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        Phase 02: Visual Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mirror & Water Image</h1>
                    <p className="text-neutral-400 text-lg">Master reflections like a pro.</p>
                </div>
            </div>

            {/* CONCEPT 1: MIRROR IMAGE */}
            <ConceptSection id="mirror" title="Mirror Image: The Rule" icon="🪞">
                <p>
                    When you stand before a mirror, your left hand appears as right, and vice versa.
                    <strong>But top and bottom stay the same.</strong>
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-cyan-500/30">
                    <h4 className="text-cyan-400 font-bold mb-4 text-center text-lg">Vertical Mirror (Mirror on RIGHT side)</h4>
                    <div className="flex items-center justify-center gap-8 my-4">
                        <div className="text-4xl font-bold text-white">E</div>
                        <div className="h-16 w-1 bg-cyan-500" />
                        <div className="text-4xl font-bold text-cyan-400" style={{ transform: 'scaleX(-1)' }}>E</div>
                    </div>
                    <p className="text-center text-neutral-400 text-sm">
                        Left-Right SWAP. Top-Bottom SAME.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-cyan-400 font-bold mb-2">What Changes?</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>• Left becomes Right</li>
                            <li>• Right becomes Left</li>
                            <li>• Arrows: ← becomes →</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-cyan-400 font-bold mb-2">What Stays Same?</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>• Top stays Top</li>
                            <li>• Bottom stays Bottom</li>
                            <li>• Size and shape</li>
                        </ul>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="What is the mirror image of 'AMBULANCE' as seen in a rearview mirror?"
                    solution={
                        <div className="space-y-2">
                            <p>Real ambulances write their name in reverse so it appears correct in car mirrors!</p>
                            <p>Mirror image of reversed text = Normal text</p>
                            <p>That's why you see "AMBULANCE" correctly when an ambulance is behind you.</p>
                        </div>
                    }
                    answer="AMBULANCE (readable)"
                />

                <TipBox title="Symmetric Letters">
                    These letters look the SAME in a vertical mirror: <strong>A, H, I, M, O, T, U, V, W, X, Y</strong>
                    <br />Why? Because they're symmetric about a vertical axis.
                </TipBox>

                <CheckUnderstanding
                    question="What is the mirror image of '3:45' (clock time) in a vertical mirror?"
                    options={["3:45", "54:3", "9:15", "None of these"]}
                    correctIndex={2}
                    explanation="In a mirror, 3:45 looks like 9:15 due to left-right reversal. The minute hand at 9 becomes 3, and vice versa."
                />
            </ConceptSection>

            {/* CONCEPT 2: WATER IMAGE */}
            <ConceptSection id="water" title="Water Image: The Rule" icon="💧">
                <p>
                    A water image is like looking at a reflection in a pond.
                    <strong>Top and bottom swap, but left and right stay the same.</strong>
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-blue-500/30">
                    <h4 className="text-blue-400 font-bold mb-4 text-center text-lg">Horizontal Mirror (Water below)</h4>
                    <div className="flex flex-col items-center gap-2 my-4">
                        <div className="text-4xl font-bold text-white">E</div>
                        <div className="w-16 h-1 bg-blue-500" />
                        <div className="text-4xl font-bold text-blue-400" style={{ transform: 'scaleY(-1)' }}>E</div>
                    </div>
                    <p className="text-center text-neutral-400 text-sm">
                        Top-Bottom SWAP. Left-Right SAME.
                    </p>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Water image of the word 'FLIP'?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Letters analyzed:</strong></p>
                            <p>F → Upside down F (curved part moves down)</p>
                            <p>L → Upside down L (horizontal line at top)</p>
                            <p>I → Stays same (symmetric)</p>
                            <p>P → Upside down P (curved part moves down)</p>
                            <p>The word is now upside down but still readable left-to-right</p>
                        </div>
                    }
                    answer="FLIP (upside down)"
                />

                <CheckUnderstanding
                    question="Which letter looks SAME in both mirror image and water image?"
                    options={["F", "O", "K", "L"]}
                    correctIndex={1}
                    explanation="O is symmetric both horizontally and vertically. It looks the same no matter how you flip it!"
                />
            </ConceptSection>

            {/* CONCEPT 3: KEY DIFFERENCES */}
            <ConceptSection id="difference" title="Mirror vs Water: Quick Comparison" icon="🔍">
                <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-900 text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">Aspect</th>
                                <th className="px-4 py-3">Mirror Image</th>
                                <th className="px-4 py-3">Water Image</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-400">
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-bold">Mirror Position</td>
                                <td>Vertical (beside you)</td>
                                <td>Horizontal (below you)</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-bold">What Swaps?</td>
                                <td className="text-cyan-400">Left ↔ Right</td>
                                <td className="text-blue-400">Top ↔ Bottom</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 font-bold">What Stays?</td>
                                <td>Top & Bottom</td>
                                <td>Left & Right</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-bold">Symmetric Letters</td>
                                <td>A, H, I, M, O, T, U, V, W, X, Y</td>
                                <td>B, C, D, E, H, I, K, O, X</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ConceptSection>

            {/* CONCEPT 4: CLOCK IN MIRROR */}
            <ConceptSection id="clock" title="Clock in Mirror: Special Case" icon="🕐">
                <p>
                    Clocks in mirrors are a favorite exam question! Here's the trick:
                </p>

                <FormulaBox title="Mirror Time Formula">
                    <div className="text-center text-lg">
                        Mirror Time = <strong>11:60</strong> − Actual Time
                    </div>
                    <p className="text-center text-sm text-neutral-400 mt-2">
                        (Use 12:60 if result is negative)
                    </p>
                </FormulaBox>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="A clock shows 3:45. What time does it show in a mirror?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> 11:60 − 3:45</p>
                            <p>= 11 hours 60 minutes − 3 hours 45 minutes</p>
                            <p>= (11-3) hours (60-45) minutes</p>
                            <p>= 8 hours 15 minutes</p>
                            <p>= <strong>8:15</strong></p>
                        </div>
                    }
                    answer="8:15"
                />

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="Clock shows 2:20 in a mirror. What is the actual time?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Reverse the formula:</strong></p>
                            <p>If Mirror = 11:60 − Actual, then:</p>
                            <p>Actual = 11:60 − Mirror = 11:60 − 2:20</p>
                            <p>= 9 hours 40 minutes = <strong>9:40</strong></p>
                        </div>
                    }
                    answer="9:40"
                />

                <CheckUnderstanding
                    question="Clock shows 6:00 in a mirror. What is the actual time?"
                    options={["6:00", "5:60", "12:00", "None"]}
                    correctIndex={0}
                    explanation="11:60 − 6:00 = 5:60 = 6:00! The mirror image of 6:00 is itself (symmetric position)."
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Reflection Master Reference"
                    rows={[
                        { concept: 'Mirror Image', formula: 'Left ↔ Right swap' },
                        { concept: 'Water Image', formula: 'Top ↔ Bottom swap' },
                        { concept: 'Mirror Time', formula: '11:60 − Actual' },
                        { concept: 'Symmetric (both)', formula: 'H, I, O, X' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
