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

export default function PipeCisternContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] opacity-20 select-none">🚿</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
                        High Weightage
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Pipe & Cistern</h1>
                    <p className="text-neutral-400 text-lg">Same logic as Time & Work — but with leaks!</p>
                </div>
            </div>

            {/* CONCEPT 1: INLET vs OUTLET */}
            <ConceptSection id="basics" title="Inlet (+) vs Outlet (-)" icon="💧">
                <p>
                    The only difference from Time & Work: Pipes can do <strong>Negative Work</strong> by emptying the tank.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-emerald-500/30 text-center">
                        <div className="text-4xl mb-4">🚰</div>
                        <h4 className="text-emerald-400 font-bold text-xl mb-2">Inlet Pipe</h4>
                        <p className="text-sm text-neutral-300">Fills the tank.</p>
                        <p className="text-xs text-neutral-500 mt-2">Work Rate = <strong>Positive (+)</strong></p>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-red-500/30 text-center">
                        <div className="text-4xl mb-4">🚽</div>
                        <h4 className="text-red-400 font-bold text-xl mb-2">Outlet Pipe (or Leak)</h4>
                        <p className="text-sm text-neutral-300">Empties the tank.</p>
                        <p className="text-xs text-neutral-500 mt-2">Work Rate = <strong>Negative (−)</strong></p>
                    </div>
                </div>

                <TipBox title="LCM Method Rule">
                    1. Assume Total Capacity = LCM(All Times)<br />
                    2. Calculate Efficiency (Units/Hour) +ve or -ve<br />
                    3. Net Efficiency = Sum of all efficiencies<br />
                    4. Time = Capacity / Net Efficiency
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: NET RATE EXAMPLES */}
            <ConceptSection id="net-rate" title="Calculating Net Rate" icon="📊">
                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Pipe A fills in 10h, Pipe B fills in 15h. Pipe C empties entire tank in 6h. All open together, time to fill?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1: Total Capacity</strong></p>
                            <p>LCM(10, 15, 6) = 30 units</p>
                            <p><strong>Step 2: Efficiency</strong></p>
                            <p>A (Inlet) = +30/10 = +3</p>
                            <p>B (Inlet) = +30/15 = +2</p>
                            <p>C (Outlet) = -30/6 = -5</p>
                            <p><strong>Step 3: Net Efficiency</strong></p>
                            <p>Net = (+3) + (+2) + (-5) = <strong>0</strong></p>
                            <p><strong>Conclusion:</strong> Tank will never fill! (Net rate is zero).</p>
                        </div>
                    }
                    answer="Never fills"
                />

                <CheckUnderstanding
                    question="A fills in 20min, B leaks in 30min. Net time?"
                    options={["50 min", "60 min", "10 min", "12 min"]}
                    correctIndex={1}
                    explanation="LCM(20, 30) = 60. A=+3, B=-2. Net=+1. Time = 60/1 = 60 mins."
                />
            </ConceptSection>

            {/* CONCEPT 3: ALTERNATE PIPES */}
            <ConceptSection id="alternate" title="Alternating Pipes" icon="⏱️">
                <p>
                    Tricky scenario: Pipes open in turns (1st hour A, 2nd hour B...).
                </p>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="A fills in 3h, B empties in 4h. Opened alternately starting with A. Total time?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Capacity:</strong> LCM(3, 4) = 12 units</p>
                            <p>A = +4 units/hr, B = -3 units/hr</p>
                            <p><strong>Cycle (2 hours):</strong> (+4) + (-3) = +1 unit filled in 2 hours.</p>
                            <p><strong>Caution! Don't do 12/1 × 2 = 24h.</strong></p>
                            <p>Last 4 units will be filled by A in 1 hour directly!</p>
                            <p>Units needed before last burst: 12 - 4 = 8 units.</p>
                            <p>Time for 8 units = 8 × 2 = 16 hours.</p>
                            <p>After 16h, tank has 8 units. A opens (17th hour), adds 4 units.</p>
                            <p>Total = 8 + 4 = 12 units (Full).</p>
                            <p>Total Time = 16 + 1 = <strong>17 hours</strong>.</p>
                        </div>
                    }
                    answer="17 hours"
                />
            </ConceptSection>

            {/* CONCEPT 4: CAPACITY FINDING */}
            <ConceptSection id="capacity" title="Finding Tank Capacity" icon="🛢️">
                <p>When questions give flow rate (e.g., 'Outlet C drains 5 gallons/min').</p>

                <TipBox variant="note" title="Steps">
                    1. Use partial times to find time taken by the Unknown Pipe.<br />
                    2. Multiply that time by the given Flow Rate.<br />
                    3. Capacity = Time × Rate.
                </TipBox>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="A fills in 10h, B fills in 12h. C empties 5 liters/min. All open, fills in 20h. Find capacity."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Assume Capacity 60 units (LCM 10,12,20).</strong></p>
                            <p>A=+6, B=+5, Net(A+B+C) = +3 (since 60/20=3).</p>
                            <p>So, (+6) + (+5) + C = +3 → C = 3 - 11 = <strong>-8 units/hr</strong>.</p>
                            <p>Time for C alone = 60/8 = 7.5 hours.</p>
                            <p><strong>Convert to minutes:</strong> 7.5 × 60 = 450 mins.</p>
                            <p><strong>Capacity:</strong> 450 mins × 5 L/min = <strong>2250 Liters</strong>.</p>
                        </div>
                    }
                    answer="2250 Liters"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Ignoring Negative Sign</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Outlet pipes reduce total work. Always subtract their efficiency. Ignoring this leads to wrong Net Work.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Alternating Work Trap</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            In alternating cases with negative work, subtract the positive work from total first to find the "safe zone" cycles.
                            Never divide total directly by net per cycle.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Pipe & Cistern Master Reference"
                    rows={[
                        { concept: 'Inlet Efficiency', formula: '+ (Capacity/Time)' },
                        { concept: 'Outlet Efficiency', formula: '- (Capacity/Time)' },
                        { concept: 'Net Rate', formula: 'E_A + E_B - E_C' },
                        { concept: 'Capacity', formula: 'Time × Flow Rate' },
                        { concept: 'Leak Formula', formula: 'XY / (Y-X)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
