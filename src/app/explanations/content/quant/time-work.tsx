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
    CancelIcon,
    CheckIcon,
    WarningIcon,
    LightbulbIcon,
    WidgetsIcon,
    WaterIcon,
    RemoveCircleIcon,
    RemoveIcon,
    AddIcon
} from '@/components/icons';

export default function TimeWorkContent() {
    return (
        <>
            <ConceptSection id="why" title="Why Time & Work Questions Feel Hard">
                <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-xl border-l-4 border-amber-500 mb-6">
                    <p className="text-lg">
                        <strong>The Problem:</strong> Schools teach us to assume Total Work = 1, which leads to
                        <span className="text-amber-400"> ugly fractions and slow calculations!</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-500/30 transition-all">
                        <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2"><CancelIcon className="text-red-400" /> The Old Way (Slow)</h4>
                        <p className="text-sm text-neutral-300 mb-2">A does work in 10 days, B in 15 days...</p>
                        <p className="text-sm text-neutral-400">
                            A's 1 day work = 1/10<br />
                            B's 1 day work = 1/15<br />
                            Together = 1/10 + 1/15 = (3+2)/30 = 5/30 = 1/6<br />
                            Time = 6 days
                        </p>
                        <p className="text-red-400 text-xs mt-2">Too many fractions! 😫</p>
                    </div>

                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-emerald-500/30 transition-all">
                        <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><CheckIcon className="text-emerald-400" /> The LCM Way (Fast)</h4>
                        <p className="text-sm text-neutral-300 mb-2">Total Work = LCM(10, 15) = 30 units</p>
                        <p className="text-sm text-neutral-400">
                            A's efficiency = 30/10 = 3 units/day<br />
                            B's efficiency = 30/15 = 2 units/day<br />
                            Together = 3 + 2 = 5 units/day<br />
                            Time = 30/5 = 6 days
                        </p>
                        <p className="text-emerald-400 text-xs mt-2">Only whole numbers! 🚀</p>
                    </div>
                </div>
            </ConceptSection>

            {/* THE LCM METHOD */}
            <ConceptSection id="lcm" title="The LCM Method — Your Secret Weapon">
                <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-xl border-l-4 border-amber-500 mb-6">
                    <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2"><WidgetsIcon /> The Chocolate Analogy</h4>
                    <p className="text-lg">
                        Think of "Work" as <strong>eating chocolates!</strong><br />
                        If A takes 10 days and B takes 15 days to eat all chocolates,
                        how many chocolates should we have? <span className="text-amber-400">LCM = 30 chocolates!</span>
                    </p>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                    <h4 className="text-amber-400 font-bold mb-6 text-center text-lg">The 4-Step Algorithm</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4 items-start p-4 bg-black/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">1</div>
                            <div>
                                <h5 className="font-bold text-white">Find Total Work</h5>
                                <p className="text-sm text-neutral-400">= LCM of all given days</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-4 bg-black/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">2</div>
                            <div>
                                <h5 className="font-bold text-white">Find Each Efficiency</h5>
                                <p className="text-sm text-neutral-400">= Total Work ÷ Days</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-4 bg-black/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">3</div>
                            <div>
                                <h5 className="font-bold text-white">Combine Efficiencies</h5>
                                <p className="text-sm text-neutral-400">Add if working together</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-4 bg-black/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">4</div>
                            <div>
                                <h5 className="font-bold text-white">Find Time</h5>
                                <p className="text-sm text-neutral-400">= Total Work ÷ Combined Efficiency</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual example */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-amber-400 font-bold mb-4 text-center">Visual: A (10 days) + B (15 days)</h4>

                    <div className="flex flex-col items-center gap-4">
                        {/* Total work bar */}
                        <div className="w-full max-w-md">
                            <p className="text-xs text-neutral-500 mb-1 text-center">Total Work = LCM(10,15) = 30 units</p>
                            <div className="h-8 bg-neutral-800 rounded-lg overflow-hidden flex">
                                {[...Array(30)].map((_, i) => (
                                    <div key={i} className="flex-1 border-r border-neutral-700 last:border-r-0 bg-amber-500/20" />
                                ))}
                            </div>
                        </div>

                        {/* Efficiency comparison */}
                        <div className="grid grid-cols-2 gap-8 w-full max-w-md mt-4">
                            <div className="text-center">
                                <p className="text-sm text-neutral-400 mb-2">A: 30/10 = 3 units/day</p>
                                <div className="flex gap-1 justify-center">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 bg-blue-500 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-neutral-400 mb-2">B: 30/15 = 2 units/day</p>
                                <div className="flex gap-1 justify-center">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 bg-pink-500 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Combined */}
                        <div className="text-center mt-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                            <p className="text-emerald-400 font-bold">Together: 3 + 2 = 5 units/day</p>
                            <p className="text-white text-lg">Time = 30 ÷ 5 = <strong>6 days</strong></p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A can do a work in 20 days and B in 30 days. In how many days can they do it together?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> LCM(20, 30) = 60 units (Total Work)</p>
                            <p><strong>Step 2:</strong> A's efficiency = 60/20 = 3 units/day</p>
                            <p><strong>Step 3:</strong> B's efficiency = 60/30 = 2 units/day</p>
                            <p><strong>Step 4:</strong> Combined = 3 + 2 = 5 units/day</p>
                            <p><strong>Step 5:</strong> Time = 60/5 = <strong>12 days</strong></p>
                        </div>
                    }
                    answer="12 days"
                />

                <CheckUnderstanding
                    question="If A takes 12 days and B takes 24 days, what should we assume as Total Work?"
                    options={["1 (School method)", "12 (A's time)", "24 (LCM)", "36 (Sum)"]}
                    correctIndex={2}
                    explanation="LCM(12, 24) = 24. This gives us: A = 2 units/day, B = 1 unit/day. All whole numbers!"
                />
            </ConceptSection>

            {/* NEGATIVE EFFICIENCY - PIPES */}
            <ConceptSection id="pipes" title="Pipes & Cisterns — Negative Work">
                <p className="mb-4">
                    When a <strong>pipe fills</strong> a tank, it does <span className="text-emerald-400">positive work</span>.
                    When a <strong>leak drains</strong> a tank, it does <span className="text-red-400">negative work</span>!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                        <div className="text-4xl mb-2 flex justify-center"><WaterIcon className="text-emerald-400" fontSize="large" /></div>
                        <h4 className="text-emerald-400 font-bold mb-2">Inlet Pipe</h4>
                        <p className="text-sm text-neutral-300">Fills the tank</p>
                        <p className="text-emerald-400 font-bold mt-2 flex items-center justify-center gap-1"><AddIcon fontSize="small" /> Efficiency</p>
                    </div>

                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                        <div className="text-4xl mb-2 flex justify-center"><RemoveCircleIcon className="text-red-400" fontSize="large" /></div>
                        <h4 className="text-red-400 font-bold mb-2">Outlet Pipe / Leak</h4>
                        <p className="text-sm text-neutral-300">Empties the tank</p>
                        <p className="text-red-400 font-bold mt-2 flex items-center justify-center gap-1"><RemoveIcon fontSize="small" /> Efficiency</p>
                    </div>
                </div>

                <FormulaBox title="Combined Efficiency with Leaks">
                    <div className="text-center">
                        <MathText className="text-xl">{`\\text{Net Efficiency} = \\text{Inlets} - \\text{Outlets}`}</MathText>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Pipe A fills a tank in 10 hours. Pipe B can empty it in 15 hours. If both are open, how long to fill the tank?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Total Work:</strong> LCM(10, 15) = 30 units</p>
                            <p><strong>A (fills):</strong> +30/10 = <span className="text-emerald-400">+3 units/hr</span></p>
                            <p><strong>B (empties):</strong> −30/15 = <span className="text-red-400">−2 units/hr</span></p>
                            <p><strong>Net:</strong> 3 − 2 = 1 unit/hr</p>
                            <p><strong>Time:</strong> 30/1 = <strong>30 hours</strong></p>
                        </div>
                    }
                    answer="30 hours"
                />

                <TipBox variant="warning" title="When Net Efficiency is Negative">
                    <p className="text-sm">
                        If combined efficiency is negative, the tank will <strong>NEVER fill</strong> — it will keep getting emptier!
                        The question might ask "time to empty" instead.
                    </p>
                </TipBox>

                <CheckUnderstanding
                    question="A pipe fills in 6 hours, a leak empties in 8 hours. Net efficiency per hour?"
                    options={["+4 units", "+1 unit", "-2 units", "Can't determine"]}
                    correctIndex={1}
                    explanation="Total = LCM(6,8) = 24. Fill = +4, Leak = -3. Net = 4-3 = +1 unit/hour"
                />
            </ConceptSection>

            {/* MDH FORMULA */}
            <ConceptSection id="mdh" title="The MDH Formula — For Groups">
                <p className="mb-4">
                    When dealing with groups (like "10 men" or "5 machines"), use the Chain Rule!
                </p>

                <FormulaBox title="The MDH Formula" variant="primary">
                    <div className="text-center">
                        <MathText className="text-2xl">{`\\frac{M_1 \\times D_1 \\times H_1}{W_1} = \\frac{M_2 \\times D_2 \\times H_2}{W_2}`}</MathText>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-neutral-400">
                            <div><strong className="text-white">M</strong> = Men/Workers</div>
                            <div><strong className="text-white">D</strong> = Days</div>
                            <div><strong className="text-white">H</strong> = Hours/Day</div>
                            <div><strong className="text-white">W</strong> = Work Done</div>
                        </div>
                    </div>
                </FormulaBox>

                <TipBox title="When to Use MDH">
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Questions with "X men do work in Y days"</li>
                        <li>Questions involving hours per day</li>
                        <li>Questions comparing two scenarios</li>
                    </ul>
                </TipBox>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="10 men can build a wall in 12 days working 6 hours/day. How many men needed to build same wall in 8 days working 9 hours/day?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Apply MDH:</strong> Work is same (W₁ = W₂ = 1)</p>
                            <p><MathText>{`M_1 \\times D_1 \\times H_1 = M_2 \\times D_2 \\times H_2`}</MathText></p>
                            <p><MathText>{`10 \\times 12 \\times 6 = M_2 \\times 8 \\times 9`}</MathText></p>
                            <p><MathText>{`720 = 72 \\times M_2`}</MathText></p>
                            <p><MathText>{`M_2 = 10`}</MathText> men</p>
                        </div>
                    }
                    answer="10 men"
                />

                <ExampleCard
                    number={4}
                    difficulty="hard"
                    question="10 men can build a wall in 12 days working 6 hours/day. How many men needed to build a wall TWICE the size in 8 days working 9 hours/day?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Now W₂ = 2 × W₁</strong></p>
                            <p><MathText>{`\\frac{M_1 D_1 H_1}{W_1} = \\frac{M_2 D_2 H_2}{W_2}`}</MathText></p>
                            <p><MathText>{`\\frac{10 \\times 12 \\times 6}{1} = \\frac{M_2 \\times 8 \\times 9}{2}`}</MathText></p>
                            <p><MathText>{`720 = \\frac{72 M_2}{2} = 36 M_2`}</MathText></p>
                            <p><MathText>{`M_2 = 20`}</MathText> men</p>
                        </div>
                    }
                    answer="20 men"
                />
            </ConceptSection>

            {/* EFFICIENCY RATIOS */}
            <ConceptSection id="efficiency" title="Efficiency Ratio Trick">
                <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-xl border-l-4 border-purple-500 mb-6">
                    <p className="text-2xl font-bold text-purple-400 text-center">
                        Efficiency ∝ 1/Time
                    </p>
                    <p className="text-center text-neutral-400 mt-2">
                        If A is twice as efficient as B, A takes half the time!
                    </p>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-purple-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-neutral-500 text-xs uppercase font-bold mb-2">Efficiency Ratio</p>
                            <p className="text-2xl text-white font-bold">A : B = 3 : 1</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-neutral-600 text-2xl">⟹</span>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg">
                            <p className="text-neutral-500 text-xs uppercase font-bold mb-2">Time Ratio</p>
                            <p className="text-2xl text-purple-400 font-bold">A : B = 1 : 3</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="hard"
                    question="A is 3 times as efficient as B and finishes a job 60 days sooner. Find time taken by each."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Efficiency ratio:</strong> A : B = 3 : 1</p>
                            <p><strong>Time ratio:</strong> A : B = 1 : 3 (inverse)</p>
                            <p><strong>Difference in ratio:</strong> 3 − 1 = 2 parts</p>
                            <p><strong>Given:</strong> 2 parts = 60 days → 1 part = 30 days</p>
                            <p><strong>A's time:</strong> 1 × 30 = <strong>30 days</strong></p>
                            <p><strong>B's time:</strong> 3 × 30 = <strong>90 days</strong></p>
                        </div>
                    }
                    answer="A = 30 days, B = 90 days"
                />

                <CheckUnderstanding
                    question="If A:B efficiency is 2:3, what is A:B time ratio?"
                    options={["2:3", "3:2", "1:1.5", "4:9"]}
                    correctIndex={1}
                    explanation="Time ratio is inverse of efficiency ratio. E = 2:3 → T = 3:2"
                />
            </ConceptSection>

            {/* ALTERNATE DAY / LEAVING PROBLEMS */}
            <ConceptSection id="alternate" title="Special Cases">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-3">📆 Alternate Day Working</h4>
                        <p className="text-sm text-neutral-300 mb-3">
                            A and B work on alternate days...
                        </p>
                        <div className="p-3 bg-black/50 rounded-lg text-sm">
                            <p className="text-neutral-400">
                                <strong>Method:</strong> Calculate work done in 2-day cycles,
                                then find how many cycles complete the work.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-3">🚶 Someone Leaves Early</h4>
                        <p className="text-sm text-neutral-300 mb-3">
                            A leaves after working X days...
                        </p>
                        <div className="p-3 bg-black/50 rounded-lg text-sm">
                            <p className="text-neutral-400">
                                <strong>Method:</strong> Calculate how much work A did,
                                then remaining work = B alone.
                            </p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={6}
                    difficulty="hard"
                    question="A can do work in 10 days, B in 15 days. They work together for 4 days, then A leaves. In how many more days will B finish?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Total Work:</strong> LCM(10,15) = 30 units</p>
                            <p><strong>A's efficiency:</strong> 3 units/day</p>
                            <p><strong>B's efficiency:</strong> 2 units/day</p>
                            <p><strong>Work in 4 days together:</strong> (3+2) × 4 = 20 units</p>
                            <p><strong>Remaining:</strong> 30 − 20 = 10 units</p>
                            <p><strong>B alone:</strong> 10 ÷ 2 = <strong>5 days</strong></p>
                        </div>
                    }
                    answer="5 more days"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Adding Times Instead of Efficiencies</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            A takes 10 days, B takes 15 days → Together is NOT 25 days!
                            Add efficiencies, not times.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Forgetting Negative Efficiency for Leaks</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Outlet pipes and leaks do NEGATIVE work. Subtract their efficiency!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Mixing Up Efficiency and Time Ratios</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            They are INVERSE! High efficiency = Less time.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Using Fractions Instead of LCM</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Always use LCM method — it's faster and less error-prone!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Time & Work Master Reference"
                    rows={[
                        { concept: 'Total Work', formula: '\\text{LCM of all times}' },
                        { concept: 'Efficiency', formula: '\\frac{\\text{Total Work}}{\\text{Time}}' },
                        { concept: 'Combined Time', formula: '\\frac{\\text{Total Work}}{E_A + E_B}' },
                        { concept: 'With Leak', formula: '\\frac{\\text{Total Work}}{E_{\\text{fill}} - E_{\\text{leak}}}' },
                        { concept: 'MDH Formula', formula: '\\frac{M_1 D_1 H_1}{W_1} = \\frac{M_2 D_2 H_2}{W_2}' },
                        { concept: 'Efficiency ↔ Time', formula: 'E \\propto \\frac{1}{T}' },
                        { concept: 'Work Done', formula: '\\text{Efficiency} \\times \\text{Time}' },
                        { concept: 'Remaining Work', formula: '\\text{Total} - \\text{Done}' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
