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

export default function BoatStreamContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">⛵</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Boat & Stream</h1>
                    <p className="text-neutral-400 text-lg">Don't fight the current — calculate it!</p>
                </div>
            </div>

            {/* CONCEPT 1: TERMINOLOGY */}
            <ConceptSection id="basics" title="Upstream vs Downstream" icon="🌊">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-blue-500/30 text-center">
                        <div className="flex justify-center mb-4 text-4xl">🌊🛶🌊</div>
                        <h4 className="text-blue-400 font-bold text-xl mb-2">Downstream (D)</h4>
                        <p className="text-sm text-neutral-300">Moving WITH the flow.</p>
                        <p className="text-xs text-neutral-500 mt-2">Speed gets ADDED.</p>
                        <MathText className="mt-4 text-lg">{`D = B + S`}</MathText>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-red-500/30 text-center">
                        <div className="flex justify-center mb-4 text-4xl">🌊🛶⬅️</div>
                        <h4 className="text-red-400 font-bold text-xl mb-2">Upstream (U)</h4>
                        <p className="text-sm text-neutral-300">Moving AGAINST the flow.</p>
                        <p className="text-xs text-neutral-500 mt-2">Speed gets SUBTRACTED.</p>
                        <MathText className="mt-4 text-lg">{`U = B - S`}</MathText>
                    </div>
                </div>

                <TipBox variant="note" title="Variables">
                    <strong>B</strong> = Speed of Boat in Still Water<br />
                    <strong>S</strong> = Speed of Stream (Current)<br />
                    <strong>D</strong> = Downstream Speed<br />
                    <strong>U</strong> = Upstream Speed
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: DERIVED FORMULAS */}
            <ConceptSection id="formulas" title="Finding Boat & Stream Speeds" icon="📐">
                <p>If you know Downstream (D) and Upstream (U) speeds, you can find B and S instantly.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <FormulaBox title="Boat Speed (Still Water)">
                        <MathText>{`B = \\frac{D + U}{2}`}</MathText>
                    </FormulaBox>
                    <FormulaBox title="Stream Speed">
                        <MathText>{`S = \\frac{D - U}{2}`}</MathText>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A boat goes 12 km downstream in 2h and returns upstream in 4h. Find speed of stream."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1: Calculate Speeds</strong></p>
                            <p>Downstream Speed (D) = 12/2 = 6 km/h</p>
                            <p>Upstream Speed (U) = 12/4 = 3 km/h</p>
                            <p><strong>Step 2: Formula</strong></p>
                            <p>Stream Speed (S) = (D − U) / 2</p>
                            <p>= (6 − 3) / 2 = 1.5 km/h</p>
                        </div>
                    }
                    answer="1.5 km/h"
                />
            </ConceptSection>

            {/* CONCEPT 3: AVERAGE SPEED */}
            <ConceptSection id="average" title="Average Speed in Water" icon="⏱️">
                <p>
                    For a round trip (Distance constant), Average Speed formula applies.
                </p>

                <FormulaBox variant="secondary">
                    <MathText>{`\\text{Avg Speed} = \\frac{\\text{Total Distance}}{\\text{Total Time}} = \\frac{2 \\times D \\times U}{D + U}`}</MathText>
                </FormulaBox>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="A boat goes to a place at 6 km/h (down) and comes back at 3 km/h (up). Find avg speed."
                    solution={
                        <div className="space-y-2">
                            <p>Avg Speed = (2 × 6 × 3) / (6 + 3)</p>
                            <p>= 36 / 9 = <strong>4 km/h</strong></p>
                            <p className="text-xs text-neutral-500">Note: It's NOT (6+3)/2 = 4.5!</p>
                        </div>
                    }
                    answer="4 km/h"
                />
            </ConceptSection>

            {/* CONCEPT 4: DISTANCE & TIME RELATIONS */}
            <ConceptSection id="applications" title="Common Problem Types" icon="🎯">
                <div className="space-y-6 my-6">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Distance Formula (Round Trip)</h4>
                        <p className="text-sm text-neutral-400 mb-2">If total time T is given to go and come back:</p>
                        <MathText>{`\\text{Distance} = \\frac{T \\times (B^2 - S^2)}{2B}`}</MathText>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Ratio Shortcut</h4>
                        <p className="text-sm text-neutral-400 mb-2">
                            If calculating time ratio <MathText>{`$t_{up}/t_{down} = n$`}</MathText>, then:
                        </p>
                        <MathText>{`\\frac{B}{S} = \\frac{n+1}{n-1}`}</MathText>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="A man can row 8 km/h in still water. If river flows at 4 km/h, calculate time to go 6 km upstream?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Values:</strong> B=8, S=4, Dist=6</p>
                            <p>Upstream Speed (U) = B − S = 8 − 4 = 4 km/h</p>
                            <p>Time = Distance / Speed</p>
                            <p>= 6 / 4 = 1.5 hours = <strong>1 hour 30 mins</strong></p>
                        </div>
                    }
                    answer="1 hr 30 mins"
                />

                <CheckUnderstanding
                    question="If B=10 and S=5, what is ratio of Downstream time to Upstream time for same distance?"
                    options={["1:3", "3:1", "1:2", "2:1"]}
                    correctIndex={0}
                    explanation="Speeds: D=15, U=5. Ratio of Speeds 3:1. Time is inverse to speed. So Time ratio = 1:3."
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing B and D</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Speed in still water" is B. "Speed with current" is D.
                            Usually B {'>'} S (always, for boat to move upstream).
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong Arithmetic</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Upstream is MINUS (B−S). Downstream is PLUS (B+S).
                            Stream speed cannot be negative.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Average Speed Error</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Simple average (D+U)/2 gives Boat Speed (B), NOT Average Speed of journey!
                            Average Speed = 2DU/(D+U).
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Boat & Stream Master Reference"
                    rows={[
                        { concept: 'Downstream (D)', formula: 'B + S' },
                        { concept: 'Upstream (U)', formula: 'B - S' },
                        { concept: 'Boat Speed (B)', formula: '(D + U) / 2' },
                        { concept: 'Stream Speed (S)', formula: '(D - U) / 2' },
                        { concept: 'Avg Speed', formula: '2DU / (D + U)' },
                        { concept: 'Speed/Time Ratio', formula: 'D/U = T_{up}/T_{down}' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
