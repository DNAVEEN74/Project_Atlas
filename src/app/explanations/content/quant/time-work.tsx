"use client";

import React from 'react';
import Image from 'next/image';
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

export default function TimeWorkContent() {
    return (
        <LessonLayout>

            {/* HERO IMAGE */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/time_work_gears_hero.png"
                        alt="Time & Work Gears"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute text-[10rem] font-bold text-amber-500/5 select-none animate-spin-slow">⚙️</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 border border-amber-500/20">
                        Phase 03: The Ratio Family
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Time and Work</h1>
                    <p className="text-neutral-400 text-lg">Mastering Efficiency with the LCM Method.</p>
                </div>
            </div>

            {/* 1. THE MENTAL MODEL */}
            <ConceptSection id="intro" title="The Chocolates Method" icon="🍫">
                <p>
                    Traditionally, schools teach us to assume Total Work = 1. This leads to ugly fractions like <MathText>{`\\frac{1}{10} + \\frac{1}{15}`}</MathText>.
                </p>
                <p>
                    <strong>Stop doing that.</strong>
                </p>
                <p>
                    Instead, assume the work is <strong>eating chocolates</strong>.
                    If A takes 10 days and B takes 15 days, assume the Total Chocolates to be a number divisible by both (LCM).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
                    <div className="bg-[#1a1a1a] rounded-xl p-8 border border-neutral-800">
                        <h4 className="text-amber-500 font-bold mb-4">The Algorithm</h4>
                        <ol className="list-decimal list-inside space-y-3 text-neutral-300">
                            <li><span className="text-white">Take LCM</span> of all "Days" given. This is your <strong>Total Work</strong>.</li>
                            <li><span className="text-white">Find Efficiency</span> (Chocolates per day) for each person by dividing.</li>
                            <li><span className="text-white">Add Efficiencies</span> if they work together.</li>
                            <li><span className="text-white">Divide Total Work</span> by Combined Efficiency to get Answer.</li>
                        </ol>
                    </div>

                    <div>
                        <ExampleCard
                            number={1}
                            difficulty="easy"
                            question="A can do a work in 20 days and B in 30 days. In how many days can they do it together?"
                            solution={
                                <div>
                                    <p className="mb-2"><strong>Step 1:</strong> LCM(20, 30) = 60 Units (Total Work).</p>
                                    <p className="mb-2"><strong>Step 2:</strong> Find per day work:</p>
                                    <ul className="list-disc list-inside ml-4 mb-2 text-neutral-400">
                                        <li>A's Efficiency = <MathText>{`\\frac{60}{20} = 3`}</MathText> units/day.</li>
                                        <li>B's Efficiency = <MathText>{`\\frac{60}{30} = 2`}</MathText> units/day.</li>
                                    </ul>
                                    <p className="mb-2"><strong>Step 3:</strong> Combined Efficiency = 3 + 2 = 5 units/day.</p>
                                    <p><strong>Step 4:</strong> Time = <MathText>{`\\frac{60}{5} = 12`}</MathText> days.</p>
                                </div>
                            }
                            answer="12 days"
                        />
                    </div>
                </div>

                <CheckUnderstanding
                    question="If A takes 12 days and B takes 24 days, what is the most convenient number to assume for Total Work?"
                    options={["1 (School Method)", "12 (A's time)", "24 (LCM)", "36 (Sum)"]}
                    correctIndex={2}
                    explanation="Always take the LCM. LCM(12, 24) is 24. This ensures efficiencies are whole numbers (24/12 = 2, 24/24 = 1)."
                />
            </ConceptSection>

            {/* 2. MDH Formula */}
            <ConceptSection id="mdh" title="The Army Rule (MDH)" icon="🎖️">
                <p>
                    When dealing with groups of people (men, women, machines) instead of individuals, we use the <strong>Chain Rule</strong>.
                </p>
                <div className="flex justify-center my-8">
                    <div className="px-8 py-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
                        <div className="text-sm font-bold text-amber-500 tracking-widest uppercase mb-2">The MDH Formula</div>
                        <MathText className="text-3xl text-white font-bold">{`\\frac{M_1 D_1 H_1}{W_1} = \\frac{M_2 D_2 H_2}{W_2}`}</MathText>
                    </div>
                </div>
                <p className="text-center text-neutral-400 mb-8 max-w-2xl mx-auto">
                    Where <strong>M</strong> is Men (Workforce), <strong>D</strong> is Days, <strong>H</strong> is Hours per day, and <strong>W</strong> is Work done (or Wages earned).
                </p>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="10 men can build a wall in 12 days working 6 hours a day. How many men are needed to build another wall (double size) in 8 days working 9 hours a day?"
                    solution={
                        <div>
                            <p className="mb-2">Here, <MathText>{`W_2 = 2 \\times W_1`}</MathText> (Double work).</p>
                            <p className="mb-4"><MathText>{`\\frac{10 \\times 12 \\times 6}{1} = \\frac{M_2 \\times 8 \\times 9}{2}`}</MathText></p>
                            <p className="mb-2">Solving LHS: <MathText>{`720`}</MathText></p>
                            <p className="mb-2">Solving RHS: <MathText>{`36 M_2`}</MathText></p>
                            <p><MathText>{`720 = 36 M_2 \\Rightarrow M_2 = 20`}</MathText></p>
                        </div>
                    }
                    answer="20 Men"
                />
            </ConceptSection>

            {/* 3. EFFICIENCY RATIOS */}
            <ConceptSection id="efficiency" title="Efficiency & Time" icon="⚡">
                <p>
                    <strong>Efficiency is inversely proportional to Time.</strong>
                </p>
                <FormulaBox>
                    <MathText>{`E \\propto \\frac{1}{T}`}</MathText>
                </FormulaBox>
                <p>
                    If A is <strong>twice</strong> as efficient as B, A will take <strong>half</strong> the time.
                </p>

                <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 text-xs uppercase font-bold mb-1">Ratio of Efficiency</div>
                        <div className="text-2xl text-white font-bold">A : B = 3 : 1</div>
                    </div>
                    <div className="flex items-center justify-center text-neutral-600">
                        implies
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 text-xs uppercase font-bold mb-1">Ratio of Time</div>
                        <div className="text-2xl text-amber-500 font-bold">A : B = 1 : 3</div>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="A is 3 times as efficient as B and finishes a job 60 days sooner than B. Find the time taken by A and B."
                    solution={
                        <div>
                            <p>Efficiency Ratio <MathText>{`A:B = 3:1`}</MathText></p>
                            <p>Time Ratio <MathText>{`A:B = 1:3`}</MathText></p>
                            <p>Gap in ratio = <MathText>{`3 - 1 = 2`}</MathText> units.</p>
                            <p>Given Gap = 60 days.</p>
                            <p><MathText>{`2 \\text{ units} = 60 \\rightarrow 1 \\text{ unit} = 30`}</MathText>.</p>
                            <p>So, Time A = <MathText>{`1 \\times 30 = 30`}</MathText> days.</p>
                            <p>Time B = <MathText>{`3 \\times 30 = 90`}</MathText> days.</p>
                        </div>
                    }
                    answer="A=30, B=90"
                />
            </ConceptSection>

            {/* Cheat Sheet */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Time & Work Rules"
                    rows={[
                        { concept: 'Total Work', formula: '\\text{LCM of Time}' },
                        { concept: 'Worker Addition', formula: '\\text{Work} = (E_A + E_B) \\times T' },
                        { concept: 'MDH Formula', formula: '\\frac{M_1 D_1 T_1}{W_1} = \\frac{M_2 D_2 T_2}{W_2}' },
                        { concept: 'Efficiency', formula: 'E \\propto 1/T' },
                    ]}
                />
            </ConceptSection>

        </LessonLayout>
    );
}
