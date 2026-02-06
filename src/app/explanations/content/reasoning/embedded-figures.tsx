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

export default function EmbeddedFiguresContent() {
    return (
        <>
            <ConceptSection id="strategy" title="Strategic Approach">
                <p>
                    A simple shape (X) is hidden inside a complex geometric pattern.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-violet-500/30">
                    <h4 className="text-violet-400 font-bold mb-4 text-lg">The 3 Rules of Detection</h4>
                    <ol className="list-decimal list-inside space-y-4 text-neutral-300">
                        <li>
                            <strong>Trace the Unique:</strong> Find the most unique part of the target shape (e.g., a sharp V-cut or a distinct curve) and search ONLY for that in the complex figure.
                        </li>
                        <li>
                            <strong>Check Orientation:</strong>
                            <span className="block text-sm text-neutral-400 mt-1 pl-5">
                                Preference 1: Same Orientation (Up is Up).
                                <br />Preference 2: Rotated (Only if same orientation is impossible).
                            </span>
                        </li>
                        <li>
                            <strong>Size Matters:</strong> The size ratio must remain consistent.
                        </li>
                    </ol>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: ROTATION LOGIC */}
            <ConceptSection id="rotation" title="Rotation Rules">
                <p>
                    SSC CGL instructions usually say "Rotation is NOT allowed".
                </p>

                <TipBox variant="warning" title="Crucial Warning">
                    Always prioritize the <strong>Non-Rotated</strong> match.
                    <br />Only if absolutely NO match exists in the original orientation, look for a rotated version.
                </TipBox>

                <CheckUnderstanding
                    question="If Figure X is an arrow pointing UP, and Option A has an arrow pointing RIGHT. Is it the answer?"
                    options={["Yes, always", "No, unless no upright arrow exists", "Never"]}
                    correctIndex={1}
                    explanation="Rotation is a secondary option. If the question doesn't explicitly forbid it, check upright first. If missing, then check 90° rotation."
                />
            </ConceptSection>

            {/* CONCEPT 3: COMPLEXITY TRAPS */}
            <ConceptSection id="traps" title="Confusion Traps">
                <p>Exam figures are designed to mislead.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Trap 1: Extra Lines</h4>
                        <p className="text-sm text-neutral-400">
                            The hidden figure might be part of a larger line that continues.
                            <br /><em>Example: A triangle hidden inside a Star.</em>
                        </p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-white font-bold mb-2">Trap 2: Slight Distortion</h4>
                        <p className="text-sm text-neutral-400">
                            Sometimes angles look 90° but are actually 85°. Look for exact parallel/perpendicular lines.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Embedded Master Reference"
                    rows={[
                        { concept: 'First Step', formula: 'Find Unique Angle' },
                        { concept: 'Rotation', formula: 'Avoid if possible' },
                        { concept: 'Scan', formula: 'Left to Right' },
                        { concept: 'Lines', formula: 'Ignore continuations' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
