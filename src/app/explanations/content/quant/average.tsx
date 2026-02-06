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
import { WarningIcon } from '@/components/icons';

export default function AverageContent() {
    return (
        <>
            <ConceptSection id="basics" title="The Leveling Mental Model">
                <p>
                    Forget the formula for a moment. Think of Average like this:
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-amber-500/30">
                    <h4 className="text-amber-400 font-bold mb-4">The "Equal Distribution" Concept</h4>
                    <p className="text-neutral-300">
                        Imagine 3 friends have ₹100, ₹200, and ₹300. If they pool all their money
                        and redistribute it equally, each gets ₹200.
                    </p>
                    <p className="text-neutral-300 mt-2">
                        That's the Average: <strong>The value each gets if everything is made equal.</strong>
                    </p>
                </div>

                <FormulaBox title="The Basic Formula">
                    <MathText>{`\\text{Average} = \\frac{\\text{Sum of all values}}{\\text{Number of values}} = \\frac{\\Sigma x}{n}`}</MathText>
                </FormulaBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="The marks of 5 students are 72, 68, 80, 90, and 65. Find the average."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Sum = 72 + 68 + 80 + 90 + 65 = 375</p>
                            <p><strong>Step 2:</strong> Number of students = 5</p>
                            <p><strong>Step 3:</strong> Average = 375 ÷ 5 = 75</p>
                        </div>
                    }
                    answer="75"
                />

                <CheckUnderstanding
                    question="If the average of 4 numbers is 25, what is their sum?"
                    options={["25", "50", "75", "100"]}
                    correctIndex={3}
                    explanation="Sum = Average × Count = 25 × 4 = 100. This is the reverse formula!"
                />
            </ConceptSection>

            {/* CONCEPT 2: WEIGHTED AVERAGE */}
            <ConceptSection id="weighted" title="Weighted Average">
                <p>
                    When groups have <strong>different sizes</strong>, use weighted average.
                    You can't just average the averages!
                </p>

                <div className="my-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> WRONG: (Avg1 + Avg2) ÷ 2</p>
                    <p className="text-neutral-400 text-sm mt-1">This only works when both groups have equal size.</p>
                </div>

                <FormulaBox title="Weighted Average Formula">
                    <MathText>{`\\text{Weighted Avg} = \\frac{n_1 \\times A_1 + n_2 \\times A_2}{n_1 + n_2}`}</MathText>
                </FormulaBox>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Section A has 30 students with average marks 70. Section B has 20 students with average marks 80. Find combined average."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Total marks of A = 30 × 70 = 2100</p>
                            <p><strong>Step 2:</strong> Total marks of B = 20 × 80 = 1600</p>
                            <p><strong>Step 3:</strong> Combined total = 2100 + 1600 = 3700</p>
                            <p><strong>Step 4:</strong> Total students = 30 + 20 = 50</p>
                            <p><strong>Step 5:</strong> Average = 3700 ÷ 50 = 74</p>
                        </div>
                    }
                    answer="74"
                />

                <TipBox title="Quick Shortcut: Alligation Rule">
                    The combined average is closer to the group with more members.
                    Here: 70 (30 students) and 80 (20 students). Since 30 {'>'} 20, average is 74 (closer to 70).
                </TipBox>

                <CheckUnderstanding
                    question="If 10 boys have average age 15 and 10 girls have average age 16, what's the combined average?"
                    options={["15", "15.5", "16", "31"]}
                    correctIndex={1}
                    explanation="Since both groups are EQUAL size, simple average works: (15 + 16) ÷ 2 = 15.5"
                />
            </ConceptSection>

            {/* CONCEPT 3: CHANGE IN AVERAGE */}
            <ConceptSection id="change" title="When Items are Added/Removed">
                <p>These questions are very common. Master the formula:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-2">New Person Joins</h4>
                        <p className="text-sm text-neutral-400">New person's value = New Average + n × (Increase in Avg)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-red-500/30">
                        <h4 className="text-red-400 font-bold mb-2">Person Leaves</h4>
                        <p className="text-sm text-neutral-400">Leaving person's value = Old Average − n × (Increase in Avg)</p>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="The average age of 8 persons is 25. When a new person joins, average becomes 26. Age of new person?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Method 1 (Direct):</strong></p>
                            <p>Old sum = 8 × 25 = 200</p>
                            <p>New sum = 9 × 26 = 234</p>
                            <p>New person = 234 − 200 = 34</p>
                            <hr className="my-2 border-neutral-700" />
                            <p><strong>Method 2 (Shortcut):</strong></p>
                            <p>New person = New Avg + Old Count × Increase</p>
                            <p>= 26 + 8 × 1 = 34</p>
                        </div>
                    }
                    answer="34 years"
                />

                <CheckUnderstanding
                    question="Average of 5 numbers is 20. If one number is removed, average becomes 15. What was removed?"
                    options={["35", "40", "20", "25"]}
                    correctIndex={1}
                    explanation="Old sum = 100, New sum (4 numbers) = 60. Removed = 100 − 60 = 40."
                />
            </ConceptSection>

            {/* CONCEPT 4: AVERAGE SPEED */}
            <ConceptSection id="speed" title="Average Speed">
                <p>
                    <strong>Critical concept:</strong> Average speed ≠ (Speed1 + Speed2) ÷ 2
                </p>

                <FormulaBox title="Average Speed (Equal Distances)">
                    <MathText>{`\\text{Avg Speed} = \\frac{2 \\times S_1 \\times S_2}{S_1 + S_2}`}</MathText>
                </FormulaBox>

                <p className="text-neutral-400 mt-4">
                    This is the <strong>Harmonic Mean</strong>. Use when distances are equal.
                </p>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="A car goes from A to B at 40 km/h and returns at 60 km/h. Average speed?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong></p>
                            <p>Avg Speed = (2 × 40 × 60) ÷ (40 + 60)</p>
                            <p>= 4800 ÷ 100 = 48 km/h</p>
                            <p className="text-amber-400 mt-2">Note: NOT 50 km/h (which is simple average)</p>
                        </div>
                    }
                    answer="48 km/h"
                />
            </ConceptSection>

            {/* CONCEPT 5: SERIES AVERAGES */}
            <ConceptSection id="series" title="Averages of Series">
                <p>Quick formulas for consecutive numbers:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">First n Natural Numbers</h4>
                        <MathText>{`\\text{Avg} = \\frac{n + 1}{2}`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Example: First 10 → (10+1)/2 = 5.5</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-2">Any Consecutive Numbers</h4>
                        <MathText>{`\\text{Avg} = \\frac{\\text{First} + \\text{Last}}{2}`}</MathText>
                        <p className="text-xs text-neutral-500 mt-2">Example: 10 to 20 → (10+20)/2 = 15</p>
                    </div>
                </div>

                <CheckUnderstanding
                    question="Average of first 100 natural numbers is?"
                    options={["50", "50.5", "51", "100"]}
                    correctIndex={1}
                    explanation="Using formula: (100 + 1) ÷ 2 = 101 ÷ 2 = 50.5"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Simple Average of Averages</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            (Avg1 + Avg2)/2 only works when groups are EQUAL size. Use weighted average otherwise!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Simple Average for Speed</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            (40 + 60)/2 ≠ Average speed! Use harmonic mean: 2×40×60/(40+60) = 48
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Confusing Sum with Average</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Always check: Sum = Avg × Count. Read carefully what the question asks!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Average Master Reference"
                    rows={[
                        { concept: 'Basic Average', formula: 'Sum ÷ Count' },
                        { concept: 'Sum from Average', formula: 'Avg × Count' },
                        { concept: 'Weighted Avg', formula: '(n₁A₁ + n₂A₂) ÷ (n₁ + n₂)' },
                        { concept: 'Avg Speed (same dist)', formula: '2S₁S₂ ÷ (S₁ + S₂)' },
                        { concept: 'First n naturals', formula: '(n + 1) ÷ 2' },
                        { concept: 'New person value', formula: 'New Avg + n × Increase' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
