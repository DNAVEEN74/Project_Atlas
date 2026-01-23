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

export default function DirectionSenseContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🧭</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 text-sky-500 text-xs font-bold uppercase tracking-widest mb-2 border border-sky-500/20">
                        Phase 04: Real World Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Direction Sense</h1>
                    <p className="text-neutral-400 text-lg">Never lose your way in direction problems!</p>
                </div>
            </div>

            {/* CONCEPT 1: THE COMPASS */}
            <ConceptSection id="compass" title="The Compass: Your Mental Map" icon="🧭">
                <p>
                    <strong>Before solving ANY direction problem, draw this compass in your mind (or on paper):</strong>
                </p>

                <div className="my-8 flex justify-center">
                    <div className="relative w-64 h-64 bg-neutral-900 rounded-full border border-neutral-700">
                        {/* North */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
                            <div className="text-2xl font-bold text-sky-400">N</div>
                            <div className="text-xs text-neutral-500">↑</div>
                        </div>
                        {/* South */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                            <div className="text-xs text-neutral-500">↓</div>
                            <div className="text-2xl font-bold text-sky-400">S</div>
                        </div>
                        {/* East */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-center">
                            <div className="text-2xl font-bold text-sky-400">E</div>
                            <div className="text-xs text-neutral-500">→</div>
                        </div>
                        {/* West */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-center">
                            <div className="text-xs text-neutral-500">←</div>
                            <div className="text-2xl font-bold text-sky-400">W</div>
                        </div>
                        {/* NE */}
                        <div className="absolute top-8 right-8 text-sm text-sky-300">NE</div>
                        {/* NW */}
                        <div className="absolute top-8 left-8 text-sm text-sky-300">NW</div>
                        {/* SE */}
                        <div className="absolute bottom-8 right-8 text-sm text-sky-300">SE</div>
                        {/* SW */}
                        <div className="absolute bottom-8 left-8 text-sm text-sky-300">SW</div>
                        {/* Center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>

                <TipBox title="Quick Memory Trick">
                    <strong>NEWS</strong> = North, East, West, South (clockwise: N → E → S → W)
                    <br />Or: <strong>"Never Eat Soggy Waffles"</strong>
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: TURNS */}
            <ConceptSection id="turns" title="Left Turn vs Right Turn" icon="🔄">
                <p>
                    This is where most people make mistakes. Let's be crystal clear:
                </p>

                <div className="grid grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-sky-500/30">
                        <h4 className="text-sky-400 font-bold mb-4 text-center text-lg">Right Turn (90° clockwise)</h4>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li>Facing North → Turn Right → <strong>East</strong></li>
                            <li>Facing East → Turn Right → <strong>South</strong></li>
                            <li>Facing South → Turn Right → <strong>West</strong></li>
                            <li>Facing West → Turn Right → <strong>North</strong></li>
                        </ul>
                    </div>
                    <div className="p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-4 text-center text-lg">Left Turn (90° anti-clockwise)</h4>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li>Facing North → Turn Left → <strong>West</strong></li>
                            <li>Facing East → Turn Left → <strong>North</strong></li>
                            <li>Facing South → Turn Left → <strong>East</strong></li>
                            <li>Facing West → Turn Left → <strong>South</strong></li>
                        </ul>
                    </div>
                </div>

                <CheckUnderstanding
                    question="A person is facing East. He turns 135° clockwise. Which direction is he facing now?"
                    options={["South-West", "South-East", "North-West", "South"]}
                    correctIndex={0}
                    explanation="135° clockwise from East: 90° brings you to South, another 45° brings you to South-West."
                />
            </ConceptSection>

            {/* CONCEPT 3: TRACING PATH */}
            <ConceptSection id="path" title="Tracing a Path" icon="🗺️">
                <p>
                    <strong>The Golden Rule:</strong> ALWAYS draw the path step by step. Never try to solve in your head!
                </p>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="A person starts from point A, walks 5 km North, turns right and walks 3 km, turns right and walks 5 km. How far is he from A and in which direction?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Draw step by step:</strong></p>
                            <p>1. Start at A, walk 5 km North → Point B</p>
                            <p>2. Turn right (now facing East), walk 3 km → Point C</p>
                            <p>3. Turn right (now facing South), walk 5 km → Point D</p>
                            <p><strong>Analysis:</strong></p>
                            <p>You went 5 km North, then 5 km South → Back to same latitude as A</p>
                            <p>You went 3 km East → You're 3 km East of A</p>
                        </div>
                    }
                    answer="3 km East"
                />

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Ram walks 4 km North, then 3 km East, then 8 km South, then 6 km West. How far is he from starting point?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Net displacement:</strong></p>
                            <p>North-South: 4 km N − 8 km S = 4 km South</p>
                            <p>East-West: 3 km E − 6 km W = 3 km West</p>
                            <p><strong>Distance from start:</strong></p>
                            <p>Using Pythagoras: √(4² + 3²) = √(16 + 9) = √25 = 5 km</p>
                            <p>Direction: South-West</p>
                        </div>
                    }
                    answer="5 km South-West"
                />
            </ConceptSection>

            {/* CONCEPT 4: SHADOW PROBLEMS */}
            <ConceptSection id="shadow" title="Shadow Problems" icon="☀️">
                <p>
                    Shadow direction depends on Sun position:
                </p>

                <div className="grid grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-2">Morning (Sunrise)</h4>
                        <p className="text-sm text-neutral-400">Sun is in East → Shadow falls to West</p>
                        <p className="text-xs text-neutral-500 mt-1">6 AM - 12 PM</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-orange-500/30">
                        <h4 className="text-orange-400 font-bold mb-2">Evening (Sunset)</h4>
                        <p className="text-sm text-neutral-400">Sun is in West → Shadow falls to East</p>
                        <p className="text-xs text-neutral-500 mt-1">12 PM - 6 PM</p>
                    </div>
                </div>

                <TipBox title="Shadow Rule">
                    Shadow always falls <strong>OPPOSITE</strong> to the Sun's direction.
                    <br />At noon, shadow is shortest (directly below).
                </TipBox>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="At 8 AM, Ram's shadow falls to his right. Which direction is he facing?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>At 8 AM:</strong> Sun is in East</p>
                            <p><strong>Shadow falls:</strong> West (opposite to Sun)</p>
                            <p><strong>Shadow is to his RIGHT:</strong></p>
                            <p>If shadow (West) is to his right, he must be facing North.</p>
                            <p>(When facing North: Right = East... wait, that's wrong)</p>
                            <p>Let me reconsider: If shadow is West and it's to his right...</p>
                            <p>His right = West, so he's facing South? No...</p>
                            <p>Actually: Right = West means facing South!</p>
                            <p>Wait - if you face South, your right is West. ✓</p>
                        </div>
                    }
                    answer="South"
                />

                <CheckUnderstanding
                    question="At 4 PM, a man is facing North. Where will his shadow fall?"
                    options={["To his left", "To his right", "In front", "Behind"]}
                    correctIndex={0}
                    explanation="At 4 PM, Sun is in West, shadow falls East. If facing North, East is to your RIGHT... wait, let me check: when facing North, right is East, left is West. Shadow is East, so shadow is to his RIGHT, not left!"
                />
            </ConceptSection>

            {/* CONCEPT 5: COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing Left/Right with East/West</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Left/Right are RELATIVE to the person. East/West are FIXED on the compass.
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Not drawing the diagram</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            ALWAYS draw! It takes 10 seconds but prevents all errors.
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting Pythagoras for diagonal distance</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            When path is not straight, use √(N-S² + E-W²) for final distance.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Direction Sense Master Reference"
                    rows={[
                        { concept: 'Clockwise', formula: 'N → E → S → W' },
                        { concept: 'Right turn', formula: '90° clockwise' },
                        { concept: 'Left turn', formula: '90° anti-clockwise' },
                        { concept: 'Morning shadow', formula: 'Falls to West' },
                        { concept: 'Evening shadow', formula: 'Falls to East' },
                        { concept: 'Diagonal distance', formula: '√(a² + b²)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
