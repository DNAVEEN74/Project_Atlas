"use client";

import React from 'react';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';
import {
    CheckCircleIcon,
    CancelIcon
} from '@/components/icons';

export default function SyllogismContent() {
    return (
        <>
            <ConceptSection id="intro" title="Rule #1: FORGET Reality!">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-2xl font-bold text-violet-400 text-center">
                        In Syllogism, Real-World Logic Does NOT Matter!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                            <CancelIcon fontSize="small" /> WRONG Thinking
                        </h4>
                        <p className="text-sm text-neutral-300 mb-2">&quot;All cats are dogs&quot;</p>
                        <p className="text-xs text-neutral-500">
                            → &quot;But cats aren&apos;t dogs in real life!&quot;<br />
                            → Answer: False
                        </p>
                        <p className="text-red-400 mt-2 text-sm font-bold">This is WRONG approach!</p>
                    </div>

                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                            <CheckCircleIcon fontSize="small" /> CORRECT Thinking
                        </h4>
                        <p className="text-sm text-neutral-300 mb-2">&quot;All cats are dogs&quot;</p>
                        <p className="text-xs text-neutral-500">
                            → The question says so, so I&apos;ll accept it!<br />
                            → Draw cats circle INSIDE dogs circle
                        </p>
                        <p className="text-emerald-400 mt-2 text-sm font-bold">Trust only what&apos;s given!</p>
                    </div>
                </div>

                <TipBox variant="note" title="The Fantasy World Mindset">
                    <p className="text-sm">
                        Treat each syllogism problem as a <strong>new fantasy world</strong> where ONLY the given statements are true.
                        Forget everything you know about real cats, dogs, humans, etc.!
                    </p>
                </TipBox>
            </ConceptSection>

            {/* THE 4 STATEMENTS */}
            <ConceptSection id="statements" title="The 4 Types of Statements">
                <p className="mb-6">
                    Every syllogism statement falls into one of these 4 categories. Learn to identify them instantly!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    {/* ALL */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-purple-500/30 hover:border-purple-500 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl font-black text-purple-400">ALL</div>
                            <div className="text-xs text-neutral-500">Universal Affirmative</div>
                        </div>
                        <p className="text-sm text-neutral-300 mb-4">&quot;All A are B&quot;</p>

                        {/* Visual */}
                        <div className="flex justify-center p-4 bg-black/50 rounded-lg">
                            <div className="relative w-40 h-24">
                                <div className="absolute right-0 top-0 w-24 h-24 rounded-full border-2 border-neutral-600 flex items-center justify-end pr-2">
                                    <span className="text-neutral-500 text-xs">B</span>
                                </div>
                                <div className="absolute left-8 top-4 w-16 h-16 rounded-full border-2 border-purple-500 bg-purple-500/20 flex items-center justify-center">
                                    <span className="text-purple-400 text-sm font-bold">A</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-neutral-500 mt-2">A is COMPLETELY inside B</p>
                    </div>

                    {/* NO */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-red-500/30 hover:border-red-500 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl font-black text-red-400">NO</div>
                            <div className="text-xs text-neutral-500">Universal Negative</div>
                        </div>
                        <p className="text-sm text-neutral-300 mb-4">&quot;No A is B&quot;</p>

                        {/* Visual */}
                        <div className="flex justify-center p-4 bg-black/50 rounded-lg">
                            <div className="relative w-40 h-24 flex justify-between items-center px-2">
                                <div className="w-14 h-14 rounded-full border-2 border-red-500 bg-red-500/10 flex items-center justify-center">
                                    <span className="text-red-400 text-sm font-bold">A</span>
                                </div>
                                <div className="w-14 h-14 rounded-full border-2 border-neutral-600 flex items-center justify-center">
                                    <span className="text-neutral-500 text-sm">B</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-neutral-500 mt-2">A and B are COMPLETELY separate</p>
                    </div>

                    {/* SOME */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-blue-500/30 hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl font-black text-blue-400">SOME</div>
                            <div className="text-xs text-neutral-500">Particular Affirmative</div>
                        </div>
                        <p className="text-sm text-neutral-300 mb-4">&quot;Some A are B&quot;</p>

                        {/* Visual */}
                        <div className="flex justify-center p-4 bg-black/50 rounded-lg">
                            <div className="relative w-40 h-24 flex items-center justify-center">
                                <div className="absolute left-4 w-16 h-16 rounded-full border-2 border-blue-500 bg-blue-500/10 flex items-center justify-start pl-2">
                                    <span className="text-blue-400 text-sm font-bold">A</span>
                                </div>
                                <div className="absolute right-4 w-16 h-16 rounded-full border-2 border-neutral-600 flex items-center justify-end pr-2">
                                    <span className="text-neutral-500 text-sm">B</span>
                                </div>
                                <div className="absolute w-6 h-12 bg-gradient-to-r from-blue-500/30 to-neutral-500/30 rounded-full" />
                            </div>
                        </div>
                        <p className="text-center text-xs text-neutral-500 mt-2">A and B OVERLAP (share some area)</p>
                    </div>

                    {/* SOME NOT */}
                    <div className="p-6 bg-neutral-900 rounded-xl border border-amber-500/30 hover:border-amber-500 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-2xl font-black text-amber-400">SOME...NOT</div>
                            <div className="text-xs text-neutral-500">Particular Negative</div>
                        </div>
                        <p className="text-sm text-neutral-300 mb-4">&quot;Some A are not B&quot;</p>

                        {/* Visual */}
                        <div className="flex justify-center p-4 bg-black/50 rounded-lg">
                            <div className="relative w-40 h-24 flex items-center justify-center">
                                <div className="absolute left-4 w-16 h-16 rounded-full border-2 border-amber-500 bg-amber-500/10 flex items-center justify-start pl-2">
                                    <span className="text-amber-400 text-sm font-bold">A</span>
                                </div>
                                <div className="absolute right-4 w-16 h-16 rounded-full border-2 border-neutral-600 flex items-center justify-end pr-2">
                                    <span className="text-neutral-500 text-sm">B</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-neutral-500 mt-2">SOME of A lies OUTSIDE B</p>
                    </div>
                </div>

                <TipBox title="How to Identify Statement Type">
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li><strong className="text-violet-400">ALL:</strong> &quot;All&quot;, &quot;Every&quot;, &quot;Each&quot;, &quot;Any&quot;</li>
                        <li><strong className="text-violet-400">NO:</strong> &quot;No&quot;, &quot;None of&quot;, &quot;Not a single&quot;</li>
                        <li><strong className="text-violet-400">SOME:</strong> &quot;Some&quot;, &quot;A few&quot;, &quot;Many&quot;, &quot;Most&quot;, &quot;Almost all&quot;</li>
                        <li><strong className="text-violet-400">SOME NOT:</strong> &quot;Some...not&quot;, &quot;All...not&quot;, &quot;Not all&quot;</li>
                    </ul>
                </TipBox>
            </ConceptSection>

            {/* HOW TO DRAW VENN DIAGRAMS */}
            <ConceptSection id="venn" title="Drawing Venn Diagrams — Step by Step">
                <p className="mb-4">
                    The method that <strong>NEVER fails</strong>: Always draw, never solve in your head!
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-6 text-center">The 3-Step Method</h4>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                            <div>
                                <h5 className="font-bold text-white">Draw the FIRST statement</h5>
                                <p className="text-sm text-neutral-400">Create circles based on the relationship (All/No/Some)</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                            <div>
                                <h5 className="font-bold text-white">Add the SECOND statement</h5>
                                <p className="text-sm text-neutral-400">Connect to existing circles if they share a term. Draw the relationship.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                            <div>
                                <h5 className="font-bold text-white">Check EACH conclusion</h5>
                                <p className="text-sm text-neutral-400">Is it <strong>DEFINITELY true</strong> from the diagram? Only then mark &quot;Follows&quot;</p>
                            </div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="Statements: All dogs are animals. All animals are living beings. Conclusion: All dogs are living beings."
                    solution={
                        <div className="space-y-3">
                            <p><strong>Step 1:</strong> Draw: Dogs circle inside Animals circle</p>
                            <p><strong>Step 2:</strong> Animals circle inside Living Beings circle</p>
                            <p><strong>Result:</strong> Dogs is completely inside Living Beings!</p>
                            <div className="flex justify-center p-4 bg-black/50 rounded-lg">
                                <div className="relative w-48 h-32">
                                    <div className="absolute right-0 top-0 w-32 h-32 rounded-full border-2 border-neutral-600 flex items-end justify-end p-2">
                                        <span className="text-xs text-neutral-500">Living</span>
                                    </div>
                                    <div className="absolute right-8 top-4 w-20 h-20 rounded-full border-2 border-blue-500 flex items-end justify-end p-2">
                                        <span className="text-xs text-blue-400">Animals</span>
                                    </div>
                                    <div className="absolute right-12 top-8 w-12 h-12 rounded-full border-2 border-purple-500 bg-purple-500/20 flex items-center justify-center">
                                        <span className="text-xs text-purple-400">Dogs</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-emerald-400"><strong>Conclusion: FOLLOWS</strong></p>
                        </div>
                    }
                    answer="Follows"
                />

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="Statements: All roses are flowers. Some flowers are red. Conclusion: Some roses are red."
                    solution={
                        <div className="space-y-3">
                            <p><strong>Step 1:</strong> Roses inside Flowers</p>
                            <p><strong>Step 2:</strong> Red overlaps with Flowers (some)</p>
                            <p><strong>Key Question:</strong> Does Red NECESSARILY overlap with Roses?</p>
                            <div className="flex justify-center p-4 bg-black/50 rounded-lg gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Possible Case 1</p>
                                    <div className="relative w-24 h-24">
                                        <div className="absolute w-20 h-20 rounded-full border-2 border-neutral-600" />
                                        <div className="absolute left-2 top-2 w-10 h-10 rounded-full border-2 border-purple-500 bg-purple-500/20" />
                                        <div className="absolute right-0 top-0 w-12 h-12 rounded-full border-2 border-red-500 bg-red-500/10" />
                                    </div>
                                    <p className="text-xs text-red-400">Red overlaps Roses ✓</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Possible Case 2</p>
                                    <div className="relative w-24 h-24">
                                        <div className="absolute w-20 h-20 rounded-full border-2 border-neutral-600" />
                                        <div className="absolute left-2 top-2 w-10 h-10 rounded-full border-2 border-purple-500 bg-purple-500/20" />
                                        <div className="absolute right-0 bottom-0 w-12 h-12 rounded-full border-2 border-red-500 bg-red-500/10" />
                                    </div>
                                    <p className="text-xs text-amber-400">Red doesn&apos;t overlap Roses ✗</p>
                                </div>
                            </div>
                            <p className="text-red-400"><strong>Since Case 2 is possible: DOES NOT FOLLOW</strong></p>
                        </div>
                    }
                    answer="Does Not Follow"
                />

                <CheckUnderstanding
                    question="All tables are wood. All wood is furniture. Conclusion: Some furniture is table."
                    options={["Follows", "Does Not Follow", "Cannot Determine"]}
                    correctIndex={0}
                    explanation="Tables ⊂ Wood ⊂ Furniture. Since all tables are furniture, at least SOME furniture must be tables. (At minimum, all tables are some furniture.)"
                />
            </ConceptSection>

            {/* DEFINITE VS POSSIBILITY */}
            <ConceptSection id="definite" title="Definite vs Possibility — The Key Difference">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <h4 className="text-emerald-400 font-bold text-xl mb-3 flex items-center gap-2">
                            <CheckCircleIcon /> &quot;FOLLOWS&quot;
                        </h4>
                        <p className="text-sm text-neutral-300 mb-4">
                            Must be TRUE in <strong>EVERY</strong> possible Venn diagram you can draw
                        </p>
                        <div className="p-3 bg-black/50 rounded-lg text-sm">
                            <p className="text-neutral-400">If even ONE valid diagram makes it false → Does Not Follow</p>
                        </div>
                    </div>

                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold text-xl mb-3 flex items-center gap-2">
                            <CancelIcon /> &quot;DOES NOT FOLLOW&quot;
                        </h4>
                        <p className="text-sm text-neutral-300 mb-4">
                            FALSE in <strong>at least ONE</strong> valid diagram
                        </p>
                        <div className="p-3 bg-black/50 rounded-lg text-sm">
                            <p className="text-neutral-400">It might be true in some cases, but not guaranteed!</p>
                        </div>
                    </div>
                </div>

                <TipBox variant="warning" title="The 'Some' Trap">
                    <div className="space-y-2 text-sm">
                        <p><strong>&quot;Some A are B&quot;</strong> does NOT automatically mean <strong>&quot;Some A are NOT B&quot;</strong>!</p>
                        <p className="text-neutral-400">
                            &quot;Some&quot; could mean ALL (when A is subset of B) OR just a few (when they overlap).
                            Both interpretations are valid from &quot;Some A are B&quot;!
                        </p>
                    </div>
                </TipBox>

                <FormulaBox title="The Possibility Question" variant="secondary">
                    <div className="text-center">
                        <p className="mb-2">If the question asks &quot;Can it be possible that...?&quot;</p>
                        <p className="text-violet-400 font-bold">
                            Answer YES if it&apos;s true in even ONE valid diagram!
                        </p>
                    </div>
                </FormulaBox>
            </ConceptSection>

            {/* EITHER-OR CASE */}
            <ConceptSection id="either-or" title="The Either-Or Case">
                <p className="mb-4">
                    Sometimes the answer is &quot;Either I or II follows&quot;. This is a special case!
                </p>

                <div className="my-8 p-6 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                    <h4 className="text-violet-400 font-bold mb-4 text-center">When Does &quot;Either-Or&quot; Apply?</h4>
                    <p className="text-center mb-4 text-neutral-300">ALL THREE conditions must be true:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl mb-2">❶</div>
                            <p className="text-sm">Both conclusions are individually <strong className="text-red-400">FALSE</strong></p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl mb-2">❷</div>
                            <p className="text-sm">Subject and Predicate are <strong className="text-amber-400">SAME</strong> in both</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl mb-2">❸</div>
                            <p className="text-sm">They form a <strong className="text-violet-400">COMPLEMENTARY PAIR</strong></p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Complementary Pair 1</h4>
                        <div className="text-center text-2xl font-bold text-white">
                            ALL + SOME NOT
                        </div>
                        <p className="text-xs text-neutral-500 text-center mt-2">One of them MUST be true!</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Complementary Pair 2</h4>
                        <div className="text-center text-2xl font-bold text-white">
                            SOME + NO
                        </div>
                        <p className="text-xs text-neutral-500 text-center mt-2">One of them MUST be true!</p>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Statement: Some pens are pencils. Conclusions: I. All pens are pencils. II. Some pens are not pencils."
                    solution={
                        <div className="space-y-3">
                            <p><strong>Check I:</strong> &quot;All pens are pencils&quot; — Only &quot;Some&quot; given, so NOT definite ❌</p>
                            <p><strong>Check II:</strong> &quot;Some pens are not pencils&quot; — &quot;Some&quot; could mean ALL, so NOT definite ❌</p>
                            <p><strong>Complementary Check:</strong></p>
                            <ul className="list-disc list-inside text-sm">
                                <li>I is &quot;All&quot; and II is &quot;Some Not&quot; → They&apos;re complementary! ✓</li>
                                <li>Same subject (pens) and predicate (pencils) ✓</li>
                            </ul>
                            <p className="text-violet-400 mt-2"><strong>Answer: Either I or II follows</strong></p>
                        </div>
                    }
                    answer="Either I or II"
                />
            </ConceptSection>

            {/* CONVERSION RULES */}
            <ConceptSection id="conversion" title="Conversion Rules — Transform Statements">
                <p className="mb-4">
                    Sometimes you need to convert a statement to check conclusions. Learn these rules!
                </p>

                <div className="overflow-x-auto my-8">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-neutral-400">Original</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Converts To</th>
                                <th className="px-4 py-3 text-left text-neutral-400">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4">
                                    <span className="font-bold text-violet-400">All A are B</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-emerald-400">Some B are A</span>
                                </td>
                                <td className="px-4 py-4 text-neutral-500 text-xs">
                                    All dogs are animals → Some animals are dogs
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4">
                                    <span className="font-bold text-red-400">No A is B</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-emerald-400">No B is A</span>
                                </td>
                                <td className="px-4 py-4 text-neutral-500 text-xs">
                                    No cat is dog → No dog is cat
                                </td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-4">
                                    <span className="font-bold text-blue-400">Some A are B</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-emerald-400">Some B are A</span>
                                </td>
                                <td className="px-4 py-4 text-neutral-500 text-xs">
                                    Some men are teachers → Some teachers are men
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4">
                                    <span className="font-bold text-amber-400">Some A are not B</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-red-400 font-bold">❌ NO CONVERSION</span>
                                </td>
                                <td className="px-4 py-4 text-neutral-500 text-xs">
                                    Cannot be converted!
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <TipBox variant="warning" title="Critical Rule">
                    <p className="text-sm">
                        <strong>&quot;Some A are not B&quot;</strong> can NEVER be converted! If you need to use this in reverse,
                        you cannot derive anything about B from it.
                    </p>
                </TipBox>

                <CheckUnderstanding
                    question="'All A are B' converts to?"
                    options={["All B are A", "Some B are A", "No A is B", "Some A are not B"]}
                    correctIndex={1}
                    explanation="'All A are B' means A is inside B. So SOME of B must be A (the part where A is). It doesn't mean ALL B are A!"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2">
                            <CancelIcon fontSize="small" /> Using Real-World Logic
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            &quot;Cats can&apos;t be dogs!&quot; → WRONG! Accept whatever the statement says.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2">
                            <CancelIcon fontSize="small" /> &quot;Some&quot; means &quot;Not All&quot;
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            &quot;Some A are B&quot; could mean ALL A are B! &quot;Some&quot; just means &quot;at least one&quot;.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2">
                            <CancelIcon fontSize="small" /> Converting &quot;Some...Not&quot;
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            &quot;Some A are not B&quot; cannot be flipped to say anything about B!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2">
                            <CancelIcon fontSize="small" /> Forgetting Either-Or Check
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            When both conclusions are individually false, check if they form a complementary pair!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Syllogism Master Reference"
                    rows={[
                        { concept: 'All A are B', formula: 'A \\subset B \\text{ (inside)}' },
                        { concept: 'No A is B', formula: 'A \\cap B = \\emptyset \\text{ (separate)}' },
                        { concept: 'Some A are B', formula: 'A \\cap B \\neq \\emptyset \\text{ (overlap)}' },
                        { concept: 'All → Converts to', formula: '\\text{Some (reverse)}' },
                        { concept: 'No → Converts to', formula: '\\text{No (reverse)}' },
                        { concept: 'Some Not → Converts to', formula: '\\text{NOTHING! Cannot convert}' },
                        { concept: 'Either-Or Pair 1', formula: '\\text{All + Some Not}' },
                        { concept: 'Either-Or Pair 2', formula: '\\text{Some + No}' },
                        { concept: 'Follows', formula: '\\text{True in ALL diagrams}' },
                        { concept: 'Does Not Follow', formula: '\\text{False in ANY diagram}' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
