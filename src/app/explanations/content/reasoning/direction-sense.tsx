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
import {
    ExploreIcon,
    ArrowForwardIcon,
    ArrowBackIcon,
    RotateRightIcon,
    RotateLeftIcon,
    AccessibilityNewIcon,
    WbSunnyIcon,
    NightsStayIcon,
    CancelIcon,
    CheckIcon,
    LightbulbIcon
} from '@/components/icons';

export default function DirectionSenseContent() {
    return (
        <>
            <ConceptSection id="compass" title="Rule #1: Know Your Compass">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-lg">
                        <strong>Before solving ANY direction problem:</strong> Draw the compass!
                        It takes 2 seconds and prevents all confusion.
                    </p>
                </div>

                <div className="my-8 flex justify-center">
                    <div className="relative w-72 h-72 bg-neutral-900 rounded-full border-2 border-neutral-700 shadow-2xl shadow-violet-900/10">
                        {/* Cross lines */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-700 -translate-y-1/2" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-700 -translate-x-1/2" />

                        {/* North */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                            <div className="text-3xl font-bold text-violet-400">N</div>
                            <div className="text-xs text-neutral-500">↑</div>
                        </div>
                        {/* South */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                            <div className="text-xs text-neutral-500">↓</div>
                            <div className="text-3xl font-bold text-violet-400">S</div>
                        </div>
                        {/* East */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center flex items-center gap-1">
                            <div className="text-xs text-neutral-500">→</div>
                            <div className="text-3xl font-bold text-violet-400">E</div>
                        </div>
                        {/* West */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-center flex items-center gap-1">
                            <div className="text-3xl font-bold text-violet-400">W</div>
                            <div className="text-xs text-neutral-500">←</div>
                        </div>
                        {/* Diagonals */}
                        <div className="absolute top-12 right-12 text-lg text-fuchsia-400 font-bold">NE</div>
                        <div className="absolute top-12 left-12 text-lg text-fuchsia-400 font-bold">NW</div>
                        <div className="absolute bottom-12 right-12 text-lg text-fuchsia-400 font-bold">SE</div>
                        <div className="absolute bottom-12 left-12 text-lg text-fuchsia-400 font-bold">SW</div>
                        {/* Center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg items-center justify-center flex"><ExploreIcon fontSize="small" className="text-neutral-900" /></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <TipBox title="Memory Trick #1: NEWS">
                        <p className="text-sm">
                            <strong className="text-violet-400">N</strong>orth,
                            <strong className="text-violet-400">E</strong>ast,
                            <strong className="text-violet-400">W</strong>est,
                            <strong className="text-violet-400">S</strong>outh
                        </p>
                    </TipBox>
                    <TipBox title="Memory Trick #2">
                        <p className="text-sm">
                            <strong>"Never Eat Soggy Waffles"</strong> (clockwise: N → E → S → W)
                        </p>
                    </TipBox>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4 text-center">Angle Reference</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-black/50 rounded-lg">
                            <p className="text-neutral-500 text-xs">N to E</p>
                            <p className="text-xl font-bold text-white">90°</p>
                        </div>
                        <div className="p-3 bg-black/50 rounded-lg">
                            <p className="text-neutral-500 text-xs">N to S</p>
                            <p className="text-xl font-bold text-white">180°</p>
                        </div>
                        <div className="p-3 bg-black/50 rounded-lg">
                            <p className="text-neutral-500 text-xs">N to NE</p>
                            <p className="text-xl font-bold text-white">45°</p>
                        </div>
                        <div className="p-3 bg-black/50 rounded-lg">
                            <p className="text-neutral-500 text-xs">Full circle</p>
                            <p className="text-xl font-bold text-white">360°</p>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            {/* TURNS */}
            <ConceptSection id="turns" title="Left Turn vs Right Turn">
                <p className="mb-4">
                    This is where most mistakes happen. Be crystal clear on turn directions!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-violet-500/30 hover:border-violet-500/50 transition-all">
                        <h4 className="text-violet-400 font-bold mb-4 text-center text-lg flex items-center justify-center gap-2">
                            <RotateRightIcon /> Right Turn = Clockwise
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-violet-500/10 transition-all">
                                <span className="text-neutral-400">Facing North →</span>
                                <span className="text-white font-bold">East</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-violet-500/10 transition-all">
                                <span className="text-neutral-400">Facing East →</span>
                                <span className="text-white font-bold">South</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-violet-500/10 transition-all">
                                <span className="text-neutral-400">Facing South →</span>
                                <span className="text-white font-bold">West</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-violet-500/10 transition-all">
                                <span className="text-neutral-400">Facing West →</span>
                                <span className="text-white font-bold">North</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-neutral-900 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/50 transition-all">
                        <h4 className="text-fuchsia-400 font-bold mb-4 text-center text-lg flex items-center justify-center gap-2">
                            <RotateLeftIcon /> Left Turn = Anti-clockwise
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-fuchsia-500/10 transition-all">
                                <span className="text-neutral-400">Facing North →</span>
                                <span className="text-white font-bold">West</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-fuchsia-500/10 transition-all">
                                <span className="text-neutral-400">Facing East →</span>
                                <span className="text-white font-bold">North</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-fuchsia-500/10 transition-all">
                                <span className="text-neutral-400">Facing South →</span>
                                <span className="text-white font-bold">East</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded hover:bg-fuchsia-500/10 transition-all">
                                <span className="text-neutral-400">Facing West →</span>
                                <span className="text-white font-bold">South</span>
                            </div>
                        </div>
                    </div>
                </div>

                <FormulaBox title="Degree Turns">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div>
                            <p className="text-neutral-400">90° right</p>
                            <p className="text-white font-bold">1 position clockwise</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">180°</p>
                            <p className="text-white font-bold">Opposite direction</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">270° right</p>
                            <p className="text-white font-bold">= 90° left</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">360°</p>
                            <p className="text-white font-bold">Back to same</p>
                        </div>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A person facing East turns 135° clockwise. Which direction is he facing now?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Starting:</strong> East</p>
                            <p><strong>135° clockwise:</strong> 90° + 45°</p>
                            <p>90° from East → South</p>
                            <p>45° more → halfway between South and West = <strong>South-West</strong></p>
                        </div>
                    }
                    answer="South-West"
                />

                <CheckUnderstanding
                    question="A person facing West turns 270° anti-clockwise. Which direction is he facing?"
                    options={["North", "South", "East", "West"]}
                    correctIndex={1}
                    explanation="270° anti-clockwise = 90° clockwise. From West, 90° clockwise = South."
                />
            </ConceptSection>

            {/* TRACING PATH */}
            <ConceptSection id="path" title="Tracing a Path — The Drawing Method">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-lg">
                        <strong>Golden Rule:</strong> ALWAYS draw the path step by step.
                        <span className="text-violet-400"> Never try to solve in your head!</span>
                    </p>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4">The Method:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-300">
                        <li>Draw a compass first (N pointing up)</li>
                        <li>Mark starting point as A</li>
                        <li>Draw each movement with proper direction and label distance</li>
                        <li>For final direction: think "from start to end"</li>
                        <li>For distance: use Pythagoras if path is not straight</li>
                    </ol>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="A person starts from A, walks 5 km North, turns right and walks 3 km, turns right and walks 5 km. How far is he from A?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Walk 5 km North (A to B)</p>
                            <p><strong>Step 2:</strong> Turn right (now facing East), walk 3 km (B to C)</p>
                            <p><strong>Step 3:</strong> Turn right (now facing South), walk 5 km (C to D)</p>
                            <p><strong>Analysis:</strong></p>
                            <ul className="list-disc list-inside text-sm text-neutral-400">
                                <li>North-South: 5 km N then 5 km S = 0</li>
                                <li>East-West: 3 km East</li>
                            </ul>
                            <p><strong>Final:</strong> D is directly 3 km East of A</p>
                        </div>
                    }
                    answer="3 km East"
                />

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Ram walks 4 km North, 3 km East, 8 km South, 6 km West. How far is he from start?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Net displacement:</strong></p>
                            <p>N-S: 4 km N − 8 km S = <strong>4 km South</strong></p>
                            <p>E-W: 3 km E − 6 km W = <strong>3 km West</strong></p>
                            <p><strong>Using Pythagoras:</strong></p>
                            <p><MathText>{`\\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5`}</MathText> km</p>
                            <p>Direction: South-West (since both components are S and W)</p>
                        </div>
                    }
                    answer="5 km South-West"
                />

                <CheckUnderstanding
                    question="If net displacement is 6 km North and 8 km East, what is the straight-line distance from start?"
                    options={["10 km", "14 km", "7 km", "8 km"]}
                    correctIndex={0}
                    explanation="Pythagoras: √(6² + 8²) = √(36 + 64) = √100 = 10 km. This is a 3-4-5 triangle scaled by 2!"
                />
            </ConceptSection>

            {/* SHADOW PROBLEMS */}
            <ConceptSection id="shadow" title="Shadow Problems — The Sun Rule">
                <p className="mb-4">
                    Shadow direction depends on where the Sun is. Master this simple rule:
                </p>

                <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-xl border-l-4 border-amber-500 mb-6">
                    <p className="text-2xl font-bold text-amber-400 text-center flex items-center justify-center gap-2">
                        <WbSunnyIcon /> Shadow falls OPPOSITE to the Sun
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30 text-center">
                        <div className="text-4xl mb-2 flex justify-center"><WbSunnyIcon className="text-amber-400" /></div>
                        <h4 className="text-amber-400 font-bold">Morning (6 AM - 12 PM)</h4>
                        <p className="text-sm text-neutral-300 mt-2">Sun in <strong>East</strong></p>
                        <p className="text-sm text-neutral-400">Shadow falls to <strong>West</strong></p>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-500/30 text-center">
                        <div className="text-4xl mb-2 flex justify-center"><WbSunnyIcon className="text-yellow-200" /></div>
                        <h4 className="text-neutral-400 font-bold">Noon (12 PM)</h4>
                        <p className="text-sm text-neutral-300 mt-2">Sun <strong>overhead</strong></p>
                        <p className="text-sm text-neutral-400">Shadow <strong>shortest/below</strong></p>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-orange-500/30 text-center">
                        <div className="text-4xl mb-2 flex justify-center"><NightsStayIcon className="text-orange-400" /></div>
                        <h4 className="text-orange-400 font-bold">Evening (12 PM - 6 PM)</h4>
                        <p className="text-sm text-neutral-300 mt-2">Sun in <strong>West</strong></p>
                        <p className="text-sm text-neutral-400">Shadow falls to <strong>East</strong></p>
                    </div>
                </div>

                <TipBox title="Solving Shadow + Person Direction">
                    <ol className="list-decimal list-inside text-sm space-y-1">
                        <li>First determine shadow direction (based on time)</li>
                        <li>Then use person&apos;s orientation to find shadow position (left/right/front/back)</li>
                        <li>When facing X, your right/left are RELATIVE to X</li>
                    </ol>
                </TipBox>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="At 8 AM, Ram's shadow falls to his right. Which direction is he facing?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> At 8 AM, Sun is in East</p>
                            <p><strong>Step 2:</strong> Shadow falls to West (opposite of Sun)</p>
                            <p><strong>Step 3:</strong> Shadow is to his RIGHT</p>
                            <p><strong>Step 4:</strong> When facing South, your right is West ✓</p>
                            <p className="text-violet-400"><strong>He is facing South</strong></p>
                        </div>
                    }
                    answer="South"
                />

                <ExampleCard
                    number={5}
                    difficulty="medium"
                    question="At 5 PM, a person facing North sees his shadow. Where is it?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> At 5 PM (evening), Sun is in West</p>
                            <p><strong>Step 2:</strong> Shadow falls to East</p>
                            <p><strong>Step 3:</strong> When facing North, East is to your RIGHT</p>
                            <p className="text-violet-400"><strong>Shadow is to his Right</strong></p>
                        </div>
                    }
                    answer="To his Right"
                />

                <CheckUnderstanding
                    question="At 7 AM, a person facing West sees his shadow in front of him. Is this possible?"
                    options={["Yes", "No"]}
                    correctIndex={0}
                    explanation="At 7 AM, Sun is in East, shadow falls West. If facing West, shadow is in FRONT. Yes, it's possible!"
                />
            </ConceptSection >

            {/* COMMON MISTAKES */}
            < ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" >
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Confusing Left/Right with Compass Directions</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Left/Right are RELATIVE to where you're facing. East/West are FIXED.
                            When facing North: Right = East. But facing South: Right = West!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Not Drawing the Diagram</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            ALWAYS draw! It takes 10 seconds but prevents all calculation errors.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Wrong Pythagoras Application</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Calculate NET N-S and NET E-W first, then apply √(a² + b²).
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Clockwise vs Anti-clockwise Confusion</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Think of a clock face. Right = clockwise = same as clock hands.
                            Left = anti-clockwise = opposite to clock hands.
                        </p>
                    </div>
                </div>
            </ConceptSection >

            {/* CHEAT SHEET */}
            < ConceptSection id="summary" title="Cheat Sheet" >
                <CheatSheet
                    title="Direction Sense Master Reference"
                    rows={[
                        { concept: 'Clockwise order', formula: 'N → E → S → W' },
                        { concept: 'Right turn', formula: '90° \\text{ clockwise}' },
                        { concept: 'Left turn', formula: '90° \\text{ anti-clockwise}' },
                        { concept: '180° turn', formula: '\\text{Opposite direction}' },
                        { concept: 'Morning shadow', formula: '\\text{Falls to West (Sun in East)}' },
                        { concept: 'Evening shadow', formula: '\\text{Falls to East (Sun in West)}' },
                        { concept: 'Diagonal distance', formula: '\\sqrt{(\\Delta NS)^2 + (\\Delta EW)^2}' },
                        { concept: 'Facing North: Right', formula: '\\text{East}' },
                        { concept: 'Facing South: Right', formula: '\\text{West}' },
                    ]}
                />
            </ConceptSection >
        </>
    );
}
