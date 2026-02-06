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
import { SwapVertIcon, HeightIcon, WarningIcon, CompareArrowsIcon } from '@/components/icons';

export default function OrderRankingContent() {
    return (
        <>
            <ConceptSection id="total" title="Finding Total Persons">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-lg">
                        <strong>Rule #1:</strong> Subtract 1 because the person is counted TWICE (once from left, once from right).
                    </p>
                </div>

                <FormulaBox title="Total Formula">
                    <div className="text-center">
                        <MathText className="text-xl">{`\\text{Total} = (\\text{Left} + \\text{Right}) - 1`}</MathText>
                        <p className="text-neutral-500 text-sm mt-2">Also: Total = (Top + Bottom) − 1</p>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Rohan is 15th from the left and 21st from the right. How many people in the row?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Use Formula:</strong> Total = (L + R) − 1</p>
                            <p>Total = (15 + 21) − 1</p>
                            <p>= 36 − 1 = <strong>35 people</strong></p>
                        </div>
                    }
                    answer="35"
                />

                <CheckUnderstanding
                    question="In a class of 40, Amit is 12th from the top. What is his rank from the bottom?"
                    options={["28th", "29th", "30th", "27th"]}
                    correctIndex={1}
                    explanation="Using T = T + B − 1 → 40 = 12 + B − 1 → 40 = 11 + B → B = 29th."
                />
            </ConceptSection>

            {/* CONCEPT 2: PERSONS BETWEEN */}
            <ConceptSection id="between" title="Persons Between Two People">
                <p className="mb-4">
                    There are TWO cases here: <strong>Simple Case</strong> (Total {'>'} L+R) and <strong>Overlapping Case</strong> (Total {'<'} L+R).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-violet-500/30">
                        <h4 className="text-violet-400 font-bold mb-3">Case 1: Simple (Non-Overlapping)</h4>
                        <p className="text-sm text-neutral-300 mb-2">When Total {'>'} (Left + Right)</p>
                        <FormulaBox variant="secondary">
                            <MathText>{`\\text{Between} = \\text{Total} - (\\text{Left} + \\text{Right})`}</MathText>
                        </FormulaBox>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-fuchsia-500/30">
                        <h4 className="text-fuchsia-400 font-bold mb-3">Case 2: Overlapping</h4>
                        <p className="text-sm text-neutral-300 mb-2">When Total {'<'} (Left + Right)</p>
                        <FormulaBox variant="secondary">
                            <MathText>{`\\text{Between} = (\\text{Left} + \\text{Right}) - \\text{Total} - 2`}</MathText>
                        </FormulaBox>
                        <p className="text-xs text-neutral-500 mt-2">Subtract 2 for the two people themselves!</p>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="In a row of 40 people, A is 25th from left and B is 20th from right. How many between them?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Check Sum:</strong> L + R = 25 + 20 = 45</p>
                            <p><strong>Compare:</strong> Sum (45) {'>'} Total (40). This is <strong>Overlapping Case</strong>.</p>
                            <p><strong>Formula:</strong> Between = (L + R) − Total − 2</p>
                            <p>= 45 − 40 − 2 = 5 − 2 = <strong>3 people</strong></p>
                        </div>
                    }
                    answer="3"
                />
            </ConceptSection>

            {/* CONCEPT 3: INTERCHANGE */}
            <ConceptSection id="interchange" title="Position Interchange">
                <p className="mb-4">
                    Common type: Two people swap places. The key is to track ONE person's new position.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4 flex items-center gap-2"><SwapVertIcon /> The Logic</h4>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 text-sm">
                        <li>After swapping, A takes B's old seat (and vice versa).</li>
                        <li><strong>New Rank of A + Old Rank of B − 1 = Total</strong></li>
                        <li><strong>Difference in ranks stays constant</strong> for both people.</li>
                    </ul>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="A is 10th from left, B is 15th from right. They swap. A becomes 20th from left. Find new rank of B."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Analyze A's change:</strong> 10th → 20th (Increased by 10)</p>
                            <p>Since they swapped, B must also move same steps in same direction.</p>
                            <p><strong>B's change:</strong> 15th + 10 = <strong>25th from right</strong></p>
                            <hr className="border-neutral-800 my-2" />
                            <p className="text-xs text-neutral-500">Alternatively: Total = New A(20) + Old B(15) - 1 = 34. New B = 34 - Old A(10) + 1 = 25.</p>
                        </div>
                    }
                    answer="25th"
                />
            </ConceptSection>

            {/* CONCEPT 4: COMPARISON RANKING */}
            <ConceptSection id="comparison" title="Comparison Logic">
                <p>
                    "A is taller than B but shorter than C..." Draw a vertical diagram!
                </p>

                <div className="my-6 flex justify-center">
                    <div className="p-4 bg-black/50 rounded-lg flex flex-col items-center gap-2">
                        <div className="w-12 h-6 bg-violet-500/20 text-violet-500 text-center text-xs rounded border border-violet-500/30">C (Tallest)</div>
                        <div className="h-6 w-0.5 bg-neutral-700"></div>
                        <div className="w-12 h-6 bg-white/10 text-white text-center text-xs rounded">A</div>
                        <div className="h-6 w-0.5 bg-neutral-700"></div>
                        <div className="w-12 h-6 bg-white/10 text-white text-center text-xs rounded">B</div>
                        <div className="h-6 w-0.5 bg-neutral-700"></div>
                        <div className="w-12 h-6 bg-white/10 text-white text-center text-xs rounded">D (Shortest)</div>
                    </div>
                </div>

                <TipBox title="Strategy">
                    Always arrange vertically. Top = "More/Taller/Heavier". Bottom = "Less/Shorter/Lighter".
                    Place variables with gaps in between for later insertions.
                </TipBox>
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Forgetting "-1" or "+1"</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Total = L + R <strong>− 1</strong>. Finding Rank = Total − Other Rank <strong>+ 1</strong>. Don't mix them!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Overlapping Case Error</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            If Sum of Ranks {'>'} Total, remember to subtract <strong>Total AND 2</strong>.
                            Formula: (L+R) − Total − 2.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> "Between" Calculation</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Rank difference = N. People between = N − 1.
                            Example: 5th and 10th rank have (10−5)−1 = 4 people between.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Order Ranking Master Reference"
                    rows={[
                        { concept: 'Total Persons', formula: '(L + R) - 1' },
                        { concept: 'Find Rank', formula: '(Total - Other) + 1' },
                        { concept: 'Between (Simple)', formula: 'Total - (L + R)' },
                        { concept: 'Between (Overlap)', formula: '(L + R) - Total - 2' },
                        { concept: 'Interchange', formula: 'New Rank = Old Rank + Shift' },
                        { concept: 'Midpoint', formula: '(Rank1 + Rank2) / 2' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
