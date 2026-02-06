"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    CancelIcon,
    CheckIcon,
    WarningIcon,
    LightbulbIcon
} from '@/components/icons';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function ClassificationContent() {
    return (
        <>
            <ConceptSection id="approach" title="The Mental Model">
                <p>
                    Classification questions give you 4-5 items. Three or four share a common property.
                    One is the <strong>"Odd One Out"</strong>. Your job is to find that hidden pattern.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4 text-lg">The Quick Scan Technique</h4>
                    <ol className="list-decimal list-inside space-y-3 text-neutral-300">
                        <li><strong>First glance:</strong> Are they all numbers? Letters? Words? Mixed?</li>
                        <li><strong>Find the majority:</strong> What do 3-4 items have in common?</li>
                        <li><strong>Spot the outcast:</strong> Which one breaks the pattern?</li>
                        <li><strong>Verify:</strong> Make sure your answer follows the logic.</li>
                    </ol>
                </div>

                <TipBox title="Pro Tip" variant="tip">
                    Don't overthink! The pattern is usually obvious. If you can't find it in 30 seconds, move on and return later.
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: NUMBER CLASSIFICATION */}
            <ConceptSection id="numbers" title="Number Classification">
                <p>The most common type. Look for these patterns:</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Prime Numbers</div>
                        <div className="text-xs text-neutral-500 mt-1">2, 3, 5, 7, 11, 13...</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Even / Odd</div>
                        <div className="text-xs text-neutral-500 mt-1">Divisibility by 2</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Perfect Squares</div>
                        <div className="text-xs text-neutral-500 mt-1">1, 4, 9, 16, 25...</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Perfect Cubes</div>
                        <div className="text-xs text-neutral-500 mt-1">1, 8, 27, 64...</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Divisibility</div>
                        <div className="text-xs text-neutral-500 mt-1">By 3, 5, 7, etc.</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Sum of Digits</div>
                        <div className="text-xs text-neutral-500 mt-1">123 → 1+2+3=6</div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Find odd one out: 2, 5, 7, 9, 11"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Check for Prime:</strong></p>
                            <p>• 2 → Prime ✓</p>
                            <p>• 5 → Prime ✓</p>
                            <p>• 7 → Prime ✓</p>
                            <p>• 9 → 3 × 3 = <strong>Composite</strong> ✗</p>
                            <p>• 11 → Prime ✓</p>
                            <p>9 is the only non-prime (composite) number.</p>
                        </div>
                    }
                    answer="9"
                />

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Find odd one out: 121, 144, 169, __(196)__, __(225)__, __(256)__ → Wait, question is: 121, 144, 196, __(169)__"
                    solution={
                        <div className="space-y-2">
                            <p>Hmm, let me check: 121 = 11², 144 = 12², 169 = 13², 196 = 14², 225 = 15²</p>
                            <p>All are perfect squares! So the pattern must be different.</p>
                        </div>
                    }
                    answer="Check pattern"
                />

                <CheckUnderstanding
                    question="Find odd: 8, 27, 64, 100, 125"
                    options={["8", "27", "64", "100"]}
                    correctIndex={3}
                    explanation="8=2³, 27=3³, 64=4³, 125=5³ are all perfect cubes. 100=10² is a perfect SQUARE, not a cube."
                />
            </ConceptSection>

            {/* CONCEPT 3: LETTER CLASSIFICATION */}
            <ConceptSection id="letters" title="Letter Classification">
                <p>Use the <strong>EJOTY</strong> rule to quickly find letter positions!</p>

                <div className="my-6 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="grid grid-cols-5 gap-4 text-center">
                        {[
                            { l: 'E', n: 5 }, { l: 'J', n: 10 }, { l: 'O', n: 15 }, { l: 'T', n: 20 }, { l: 'Y', n: 25 }
                        ].map(({ l, n }) => (
                            <div key={l}>
                                <div className="text-3xl font-bold text-violet-400">{l}</div>
                                <div className="text-sm text-neutral-500">{n}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-neutral-500 text-sm mt-4">Use as reference points: E=5, J=10, O=15, T=20, Y=25</p>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="Find odd: BDF, CEG, DFH,__(EGJ)__, FHJ"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Pattern check:</strong> Gap between letters</p>
                            <p>• BDF → B(2), D(4), F(6) → Gap: +2, +2 ✓</p>
                            <p>• CEG → C(3), E(5), G(7) → Gap: +2, +2 ✓</p>
                            <p>• DFH → D(4), F(6), H(8) → Gap: +2, +2 ✓</p>
                            <p>• EGJ → E(5), G(7), J(10) → Gap: +2, +3 ✗</p>
                            <p>• FHJ → F(6), H(8), J(10) → Gap: +2, +2 ✓</p>
                            <p>EGJ breaks the pattern (should be EGI, not EGJ).</p>
                        </div>
                    }
                    answer="EGJ"
                />

                <CheckUnderstanding
                    question="Find the position of letter 'R' using EJOTY"
                    options={["17", "18", "19", "20"]}
                    correctIndex={1}
                    explanation="T = 20. R is 2 before T. So R = 20 − 2 = 18."
                />
            </ConceptSection>

            {/* CONCEPT 4: WORD CLASSIFICATION */}
            <ConceptSection id="words" title="Word Classification">
                <p>Look for categories, relationships, or linguistic patterns:</p>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Categories</div>
                        <div className="text-xs text-neutral-400 mt-1">Fruits vs Vegetables, Mammals vs Birds</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Relationships</div>
                        <div className="text-xs text-neutral-400 mt-1">Part of body, Types of transport</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Countries & Capitals</div>
                        <div className="text-xs text-neutral-400 mt-1">All capitals except one country</div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-violet-500/30 transition-all">
                        <div className="text-violet-400 font-bold">Synonyms / Antonyms</div>
                        <div className="text-xs text-neutral-400 mt-1">Similar meanings vs opposite</div>
                    </div>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="easy"
                    question="Find odd: Apple, Mango, Carrot, Orange, Banana"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Category check:</strong></p>
                            <p>• Apple → Fruit ✓</p>
                            <p>• Mango → Fruit ✓</p>
                            <p>• Carrot → <strong>Vegetable</strong> ✗</p>
                            <p>• Orange → Fruit ✓</p>
                            <p>• Banana → Fruit ✓</p>
                            <p>Carrot is a vegetable, others are fruits.</p>
                        </div>
                    }
                    answer="Carrot"
                />
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Classification Quick Reference"
                    rows={[
                        { concept: 'Number Check', formula: 'Prime, Square, Cube, Even/Odd' },
                        { concept: 'Letter Position', formula: 'Use EJOTY (5,10,15,20,25)' },
                        { concept: 'Word Category', formula: 'Living/Non-living, Place/Person' },
                        { concept: 'Time Rule', formula: 'Max 30 seconds per question' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
