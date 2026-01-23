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

export default function ClockCalendarContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🕐📅</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-500 text-xs font-bold uppercase tracking-widest mb-2 border border-teal-500/20">
                        Phase 04: Real World Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Clock & Calendar</h1>
                    <p className="text-neutral-400 text-lg">Master time angles and day calculations.</p>
                </div>
            </div>

            {/* CONCEPT 1: CLOCK BASICS */}
            <ConceptSection id="clock-basics" title="Clock Fundamentals" icon="🕐">
                <p>First, understand how clock hands move:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-teal-500/30">
                        <h4 className="text-teal-400 font-bold mb-4">Hour Hand</h4>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li>Completes 360° in <strong>12 hours</strong></li>
                            <li>Speed: <strong>0.5° per minute</strong></li>
                            <li>Speed: <strong>30° per hour</strong></li>
                        </ul>
                    </div>
                    <div className="p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-4">Minute Hand</h4>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li>Completes 360° in <strong>1 hour</strong></li>
                            <li>Speed: <strong>6° per minute</strong></li>
                            <li>Speed: <strong>360° per hour</strong></li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 my-6">
                    <h4 className="text-teal-400 font-bold mb-2">Relative Speed</h4>
                    <p className="text-neutral-300">
                        Minute hand gains on hour hand: <strong>6° − 0.5° = 5.5° per minute</strong>
                    </p>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: ANGLE FORMULA */}
            <ConceptSection id="angle" title="Angle Between Hands" icon="📐">
                <FormulaBox title="The Master Formula">
                    <MathText>{`\\theta = \\left| 30H - 5.5M \\right|`}</MathText>
                    <p className="text-center text-neutral-400 text-sm mt-2">H = Hour, M = Minutes</p>
                </FormulaBox>

                <TipBox title="Important">
                    If the result {'>'} 180°, subtract from 360° to get the smaller angle.
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Find angle between hands at 3:30"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> θ = |30H − 5.5M|</p>
                            <p>H = 3, M = 30</p>
                            <p>θ = |30(3) − 5.5(30)| = |90 − 165| = |−75| = 75°</p>
                        </div>
                    }
                    answer="75°"
                />

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Find angle at 7:20"
                    solution={
                        <div className="space-y-2">
                            <p>θ = |30(7) − 5.5(20)|</p>
                            <p>= |210 − 110| = 100°</p>
                        </div>
                    }
                    answer="100°"
                />

                <CheckUnderstanding
                    question="At what time between 2 and 3 o'clock will the hands be at 90°?"
                    options={["2:27 3/11", "2:30", "2:45", "2:16 4/11"]}
                    correctIndex={0}
                    explanation="Using θ = |30H − 5.5M| = 90, with H=2: |60 − 5.5M| = 90. Solving: M = 300/11 ≈ 27 3/11 minutes."
                />
            </ConceptSection>

            {/* CONCEPT 3: SPECIAL ANGLES */}
            <ConceptSection id="special-angles" title="Special Angle Times" icon="⚡">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-teal-400 font-bold mb-2">Hands Overlap (0°)</h4>
                        <p className="text-sm text-neutral-400">22 times in 24 hours</p>
                        <p className="text-xs text-neutral-500 mt-1">11 times in 12 hours (not at 12:00)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-teal-400 font-bold mb-2">Right Angle (90°)</h4>
                        <p className="text-sm text-neutral-400">44 times in 24 hours</p>
                        <p className="text-xs text-neutral-500 mt-1">22 times in 12 hours</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-teal-400 font-bold mb-2">Straight Line (180°)</h4>
                        <p className="text-sm text-neutral-400">22 times in 24 hours</p>
                        <p className="text-xs text-neutral-500 mt-1">11 times in 12 hours</p>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 4: CALENDAR BASICS */}
            <ConceptSection id="calendar" title="Calendar: Odd Days Concept" icon="📅">
                <p>
                    <strong>Odd days</strong> = Number of days beyond complete weeks.
                    7 days = 0 odd days, 8 days = 1 odd day, etc.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-teal-400 font-bold">Ordinary Year</p>
                        <p className="text-2xl text-white font-bold mt-2">1</p>
                        <p className="text-xs text-neutral-500">odd day (365 = 52×7 + 1)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-teal-400 font-bold">Leap Year</p>
                        <p className="text-2xl text-white font-bold mt-2">2</p>
                        <p className="text-xs text-neutral-500">odd days (366 = 52×7 + 2)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-teal-400 font-bold">100 Years</p>
                        <p className="text-2xl text-white font-bold mt-2">5</p>
                        <p className="text-xs text-neutral-500">odd days</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                        <p className="text-teal-400 font-bold">400 Years</p>
                        <p className="text-2xl text-white font-bold mt-2">0</p>
                        <p className="text-xs text-neutral-500">odd days</p>
                    </div>
                </div>

                <FormulaBox title="Century Odd Days">
                    <div className="text-center space-y-1">
                        <p>100 years = 5 odd days</p>
                        <p>200 years = 3 odd days</p>
                        <p>300 years = 1 odd day</p>
                        <p>400 years = 0 odd days</p>
                    </div>
                </FormulaBox>
            </ConceptSection>

            {/* CONCEPT 5: LEAP YEAR */}
            <ConceptSection id="leap" title="Leap Year Rules" icon="🗓️">
                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-teal-400 font-bold mb-4">A year is a leap year if:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300">
                        <li>Divisible by 4 <strong>AND NOT</strong> divisible by 100</li>
                        <li><strong>OR</strong> Divisible by 400</li>
                    </ol>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <p className="text-emerald-400 font-bold">Leap Years</p>
                        <p className="text-sm text-neutral-400 mt-1">2000, 2004, 2020, 2024, 1600</p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 font-bold">NOT Leap Years</p>
                        <p className="text-sm text-neutral-400 mt-1">1900, 2100, 2200, 2300</p>
                    </div>
                </div>

                <CheckUnderstanding
                    question="Is 2100 a leap year?"
                    options={["Yes", "No"]}
                    correctIndex={1}
                    explanation="2100 is divisible by 4 but ALSO by 100. Since it's not divisible by 400, it's NOT a leap year."
                />
            </ConceptSection>

            {/* CONCEPT 6: DAY CALCULATION */}
            <ConceptSection id="day" title="Finding the Day" icon="📆">
                <p>To find what day a date falls on:</p>

                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300">
                        <li>Count total odd days from a reference point (usually Jan 1, 1 AD = Monday)</li>
                        <li>Divide by 7 and find remainder</li>
                        <li>Match remainder to day: 0=Sun, 1=Mon, 2=Tue...</li>
                    </ol>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="What day was January 1, 2000?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>From 1 AD to 2000 AD:</strong></p>
                            <p>1600 years = 0 odd days (400×4)</p>
                            <p>300 years = 1 odd day</p>
                            <p>99 years = 99 + 24(leaps) = 123 days = 17 weeks + 4 days = 4 odd days</p>
                            <p>Total = 0 + 1 + 4 = 5 odd days</p>
                            <p>5 → Saturday (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)</p>
                        </div>
                    }
                    answer="Saturday"
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Clock & Calendar Master Reference"
                    rows={[
                        { concept: 'Angle formula', formula: '|30H − 5.5M|' },
                        { concept: 'Hour hand speed', formula: '0.5° per minute' },
                        { concept: 'Minute hand speed', formula: '6° per minute' },
                        { concept: 'Ordinary year', formula: '1 odd day' },
                        { concept: 'Leap year', formula: '2 odd days' },
                        { concept: '400 years', formula: '0 odd days' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
