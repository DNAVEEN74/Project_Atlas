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

export default function SyllogismContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/syllogism_hero.png"
                        alt="Venn Diagrams"
                        className="object-cover w-full h-full opacity-60"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute text-[6rem] select-none opacity-20">⭕⭕</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest mb-2 border border-purple-500/20">
                        Phase 03: Analytical Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Syllogism</h1>
                    <p className="text-neutral-400 text-lg">Master logical deductions using Venn Diagrams.</p>
                </div>
            </div>

            {/* CONCEPT 1: FORGET REALITY */}
            <ConceptSection id="intro" title="The First Rule: Forget Reality" icon="🧠">
                <p>
                    In Syllogism, <strong>real-world logic doesn't matter</strong>. Only the statements given are true.
                </p>

                <div className="my-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 font-bold">❌ WRONG Thinking:</p>
                    <p className="text-neutral-300 text-sm mt-1">
                        "All cats are dogs" → But cats aren't dogs in real life! → Answer: False
                    </p>
                    <p className="text-emerald-400 font-bold mt-3">✓ CORRECT Thinking:</p>
                    <p className="text-neutral-300 text-sm mt-1">
                        "All cats are dogs" → If the question says so, I'll draw cats INSIDE dogs.
                    </p>
                </div>

                <TipBox title="The Mindset">
                    Treat each problem as a new fantasy world where only the given statements are laws.
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 2: THE 4 STATEMENTS */}
            <ConceptSection id="statements" title="The 4 Types of Statements" icon="📝">
                <p>Every syllogism statement falls into one of these 4 categories:</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-purple-500/30 text-center">
                        <div className="text-purple-400 font-bold text-lg mb-2">ALL</div>
                        <p className="text-xs text-neutral-400">Universal Affirmative</p>
                        <p className="text-xs text-neutral-500 mt-1">"All A are B"</p>
                        <div className="mt-4 mx-auto w-12 h-12 border-2 border-white rounded-full flex items-center justify-center relative">
                            <div className="w-6 h-6 bg-purple-500/50 rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-neutral-600 mt-2">A inside B</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-red-500/30 text-center">
                        <div className="text-red-400 font-bold text-lg mb-2">NO</div>
                        <p className="text-xs text-neutral-400">Universal Negative</p>
                        <p className="text-xs text-neutral-500 mt-1">"No A is B"</p>
                        <div className="mt-4 mx-auto w-16 h-8 flex items-center justify-between">
                            <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                            <div className="w-6 h-6 border-2 border-red-500 rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-neutral-600 mt-2">Separate</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-blue-500/30 text-center">
                        <div className="text-blue-400 font-bold text-lg mb-2">SOME</div>
                        <p className="text-xs text-neutral-400">Particular Affirmative</p>
                        <p className="text-xs text-neutral-500 mt-1">"Some A are B"</p>
                        <div className="mt-4 mx-auto w-12 h-8 flex items-center relative">
                            <div className="w-8 h-8 border-2 border-white rounded-full absolute left-0"></div>
                            <div className="w-8 h-8 border-2 border-blue-500 rounded-full absolute right-0 bg-blue-500/20"></div>
                        </div>
                        <p className="text-[10px] text-neutral-600 mt-2">Overlap</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/30 text-center">
                        <div className="text-amber-400 font-bold text-lg mb-2">SOME NOT</div>
                        <p className="text-xs text-neutral-400">Particular Negative</p>
                        <p className="text-xs text-neutral-500 mt-1">"Some A are not B"</p>
                        <div className="mt-4 mx-auto w-12 h-8 flex items-center relative">
                            <div className="w-8 h-8 border-2 border-white rounded-full absolute left-0"></div>
                            <div className="w-8 h-8 border-2 border-amber-500 rounded-full absolute right-0"></div>
                        </div>
                        <p className="text-[10px] text-neutral-600 mt-2">Part outside</p>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 3: DRAWING VENN DIAGRAMS */}
            <ConceptSection id="venn" title="How to Draw Venn Diagrams" icon="🎨">
                <p>The method that <strong>never fails</strong>:</p>

                <div className="space-y-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Step 1: Draw the FIRST statement</h4>
                        <p className="text-sm text-neutral-400">Create circles based on the relationship.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Step 2: Add the SECOND statement</h4>
                        <p className="text-sm text-neutral-400">Connect to existing circles if they share a term.</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-purple-400 font-bold">Step 3: Check EACH conclusion</h4>
                        <p className="text-sm text-neutral-400">Is it DEFINITELY true? Only then mark "Follows".</p>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Statements: All dogs are animals. All animals are living beings. Conclusion: All dogs are living beings."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Draw:</strong></p>
                            <p>Dogs (smallest) → inside Animals → inside Living Beings</p>
                            <p><strong>Check conclusion:</strong></p>
                            <p>Since Dogs is completely inside Living Beings... YES, it follows!</p>
                        </div>
                    }
                    answer="Follows"
                />

                <CheckUnderstanding
                    question="Statements: All roses are flowers. Some flowers are red. Conclusion: Some roses are red."
                    options={["Definitely Follows", "Does Not Follow", "Cannot determine"]}
                    correctIndex={1}
                    explanation="'Some flowers are red' doesn't mean the RED part overlaps with Roses. The red flowers could be entirely non-roses. Draw it!"
                />
            </ConceptSection>

            {/* CONCEPT 4: DEFINITE VS POSSIBILITY */}
            <ConceptSection id="definite" title="Definite vs Possibility" icon="🎲">
                <p>
                    A conclusion <strong>"Follows"</strong> only if it's TRUE in ALL possible diagrams.
                    If it's true in SOME diagrams but not others, it "Does Not Follow".
                </p>

                <div className="grid grid-cols-2 gap-6 my-6">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <h4 className="text-emerald-400 font-bold mb-2">✓ FOLLOWS</h4>
                        <p className="text-sm text-neutral-400">Must be true in every valid diagram.</p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold mb-2">✗ DOES NOT FOLLOW</h4>
                        <p className="text-sm text-neutral-400">False in at least one valid diagram.</p>
                    </div>
                </div>

                <TipBox title="The 'Some' Trap">
                    "Some A are B" does NOT mean "Some A are not B".
                    "Some" could mean ALL (subset) OR a few (overlap).
                </TipBox>
            </ConceptSection>

            {/* CONCEPT 5: EITHER-OR CASE */}
            <ConceptSection id="either-or" title="The Either-Or Case" icon="⚡">
                <p>Sometimes the answer is "Either I or II follows". This happens when:</p>

                <div className="my-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300">
                        <li>Both conclusions are individually FALSE</li>
                        <li>Subject and Predicate are SAME in both</li>
                        <li>They form a <strong>complementary pair</strong>:
                            <ul className="ml-6 mt-2 text-sm text-neutral-400">
                                <li>• "All + Some Not" → One must be true</li>
                                <li>• "Some + No" → One must be true</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Statements: Some pens are pencils. Conclusions: I. All pens are pencils. II. Some pens are not pencils."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Check I:</strong> "All pens are pencils" - NOT definite (only "some" given)</p>
                            <p><strong>Check II:</strong> "Some pens are not pencils" - Also NOT definite (the "some" could be all)</p>
                            <p><strong>Complementary check:</strong> I is "All" and II is "Some Not" → Complementary pair!</p>
                            <p><strong>Same subject/predicate:</strong> Both about pens and pencils</p>
                            <p className="text-purple-400 mt-2">Answer: Either I or II follows</p>
                        </div>
                    }
                    answer="Either I or II"
                />
            </ConceptSection>

            {/* CONCEPT 6: CONVERSION RULES */}
            <ConceptSection id="conversion" title="Conversion Rules" icon="🔄">
                <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-900 text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">Original</th>
                                <th className="px-4 py-3">Converts To</th>
                                <th className="px-4 py-3">Example</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-400">
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3">All A are B</td>
                                <td className="text-emerald-400">Some B are A</td>
                                <td className="text-xs">All dogs are animals → Some animals are dogs</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3">No A is B</td>
                                <td className="text-emerald-400">No B is A</td>
                                <td className="text-xs">No cat is dog → No dog is cat</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3">Some A are B</td>
                                <td className="text-emerald-400">Some B are A</td>
                                <td className="text-xs">Some men are teachers → Some teachers are men</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Some A are not B</td>
                                <td className="text-red-400">NO conversion</td>
                                <td className="text-xs">Cannot be converted!</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Syllogism Master Reference"
                    rows={[
                        { concept: 'All A are B', formula: 'A inside B' },
                        { concept: 'No A is B', formula: 'Separate circles' },
                        { concept: 'Some A are B', formula: 'Overlapping circles' },
                        { concept: 'Either-Or', formula: 'All+SomeNot OR Some+No' },
                        { concept: 'All → Converts to', formula: 'Some (reverse)' },
                        { concept: 'Some Not', formula: 'CANNOT be converted' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
