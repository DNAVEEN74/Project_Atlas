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

export default function PartnershipContent() {
    return (
        <>
            <ConceptSection id="basic" title="The Golden Formula">
                <FormulaBox>
                    <MathText>{`\\text{Profit Ratio} = (\\text{Capital}_A \\times \\text{Time}_A) : (\\text{Capital}_B \\times \\text{Time}_B)`}</MathText>
                </FormulaBox>

                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <p className="text-sm text-neutral-300">
                        Note: Time must be in SAME units (months or years).
                        Usually convert everything to months.
                    </p>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A invests 2000 for 1 year. B invests 3000 for 8 months. Ratio of profit?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1: Convert to months</strong></p>
                            <p>A time = 12 months. B time = 8 months.</p>
                            <p><strong>Step 2: Calculate Product (C×T)</strong></p>
                            <p>A: 2000 × 12 = 24000</p>
                            <p>B: 3000 × 8 = 24000</p>
                            <p><strong>Step 3: Ratio</strong></p>
                            <p>24000 : 24000 = <strong>1 : 1</strong></p>
                        </div>
                    }
                    answer="1 : 1"
                />
            </ConceptSection>

            {/* CONCEPT 2: ADDITION & WITHDRAWAL */}
            <ConceptSection id="change" title="Investment Changes">
                <p>
                    If investment changes after X months, split the calculation.
                </p>

                <TipBox title="Split Method">
                    Total Share = (Initial Amount × Initial Months) + (New Amount × Remaining Months)
                </TipBox>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="A starts with 1000. After 4 months, he adds 500. B invests 2000 for full year. Find ratio."
                    solution={
                        <div className="space-y-2">
                            <p><strong>A's effective capital:</strong></p>
                            <p>(1000 × 4 months) + (1500 × 8 months)</p>
                            <p>= 4000 + 12000 = 16000</p>
                            <p><strong>B's effective capital:</strong></p>
                            <p>2000 × 12 = 24000</p>
                            <p><strong>Ratio:</strong></p>
                            <p>16000 : 24000 = 16 : 24 = <strong>2 : 3</strong></p>
                        </div>
                    }
                    answer="2 : 3"
                />
            </ConceptSection>

            {/* CONCEPT 3: WORKING PARTNER */}
            <ConceptSection id="types" title="Working vs Sleeping Partner">
                <div className="space-y-4 my-6">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold mb-2">Scenario</h4>
                        <p className="text-sm text-neutral-300">
                            A manages the business and takes 20% of profit as Salary.
                            Only the remaining 80% is shared based on Investment ratio.
                        </p>
                    </div>
                </div>

                <CheckUnderstanding
                    question="Total profit 1000. A is working partner (10% salary). Investment ratio 1:1. Find A's total share."
                    options={["500", "550", "450", "600"]}
                    correctIndex={1}
                    explanation="Salary = 100. Remaining = 900. Shared 1:1 → A gets 450, B gets 450. A total = 100 + 450 = 550."
                />
            </ConceptSection>

            {/* CONCEPT 4: FINDING TIME/CAPITAL */}
            <ConceptSection id="finding" title="Finding Missing Capital/Time">
                <p>
                    Use the formula in reverse: <MathText>{`$\\frac{C_1 T_1}{C_2 T_2} = \\frac{P_1}{P_2}$`}</MathText>
                </p>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="A invests 5000. B invests 8000. Ratio of profit 5:4. If A invested for 8 months, find B's time."
                    solution={
                        <div className="space-y-2">
                            <p>Let B's time be 'x'.</p>
                            <p>(5000 × 8) / (8000 × x) = 5 / 4</p>
                            <p>40000 / 8000x = 5 / 4</p>
                            <p>5/x = 5/4</p>
                            <p>x = <strong>4 months</strong></p>
                        </div>
                    }
                    answer="4 months"
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Partnership Master Reference"
                    rows={[
                        { concept: 'Profit Share', formula: 'Capital × Time' },
                        { concept: 'Changing Invest', formula: 'Sum of (Amt × Months)' },
                        { concept: 'Working Salary', formula: 'Deduct salary first' },
                        { concept: 'Find Time', formula: '(P1/P2) × (C2/C1) × T1' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
