"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    MaleIcon,
    FemaleIcon,
    FavoriteIcon,
    CloseIcon,
    CheckIcon,
    KeyIcon,
    PeopleIcon,
    WarningIcon
} from '@/components/icons';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function BloodRelationsContent() {
    return (
        <>
            <ConceptSection id="intro" title="Rule #1: ALWAYS Draw!">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-2xl font-bold text-violet-400 text-center">
                        NEVER Solve Blood Relations in Your Head!
                    </p>
                    <p className="text-center text-neutral-400 mt-2">
                        Drawing takes 10 seconds but saves minutes of confusion!
                    </p>
                </div>

                <p className="mb-6">
                    These questions look tough because they describe relationships in words. But when you <strong>draw a family tree</strong>,
                    everything becomes crystal clear!
                </p>

                {/* Standard symbols */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-violet-500/30">
                    <h4 className="text-violet-400 font-bold mb-6 text-center text-lg">Standard Symbols to Use</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-500 mx-auto flex items-center justify-center bg-blue-500/10">
                                <span className="text-blue-400 text-sm font-bold">M</span>
                            </div>
                            <p className="text-sm text-blue-400 mt-3 font-bold">Male</p>
                            <p className="text-xs text-neutral-500">Square shape</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-pink-500 rounded-full mx-auto flex items-center justify-center bg-pink-500/10">
                                <span className="text-pink-400 text-sm font-bold">F</span>
                            </div>
                            <p className="text-sm text-pink-400 mt-3 font-bold">Female</p>
                            <p className="text-xs text-neutral-500">Circle shape</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 h-16 mx-auto">
                                <div className="w-10 h-10 border-2 border-blue-500"></div>
                                <div className="w-8 h-0.5 bg-white"></div>
                                <div className="w-10 h-10 border-2 border-pink-500 rounded-full"></div>
                            </div>
                            <p className="text-sm text-neutral-400 mt-3 font-bold">Married</p>
                            <p className="text-xs text-neutral-500">Horizontal line</p>
                        </div>
                        <div className="text-center">
                            <div className="flex flex-col items-center justify-center h-16 mx-auto">
                                <div className="w-0.5 h-4 bg-white"></div>
                                <div className="flex gap-6">
                                    <div className="w-6 h-6 border border-neutral-500"></div>
                                    <div className="w-6 h-6 border border-neutral-500 rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-400 mt-3 font-bold">Children</p>
                            <p className="text-xs text-neutral-500">Vertical line down</p>
                        </div>
                    </div>
                </div>

                <TipBox variant="note" title="Unknown Gender?">
                    <p className="text-sm">
                        If gender is not mentioned, use a <strong>triangle △</strong> or <strong>question mark ?</strong>.
                        You can determine the gender from other clues later!
                    </p>
                </TipBox>
            </ConceptSection>

            {/* FAMILY RELATIONSHIPS */}
            <ConceptSection id="relations" title="Complete Family Relationship Reference">
                <p className="mb-6">Memorize these terms. They appear in EVERY exam!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                    {/* Paternal Side */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-blue-500/20 rounded-lg"><MaleIcon /></span>
                            Paternal Side (Father's)
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Father's Father</span>
                                <span className="text-white font-bold">Grandfather (Paternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Father's Mother</span>
                                <span className="text-white font-bold">Grandmother (Paternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Father's Brother</span>
                                <span className="text-white font-bold">Uncle (Paternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Father's Sister</span>
                                <span className="text-white font-bold">Aunt (Paternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Father's Brother's Son</span>
                                <span className="text-white font-bold">Cousin</span>
                            </li>
                        </ul>
                    </div>

                    {/* Maternal Side */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-pink-500/30">
                        <h4 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-pink-500/20 rounded-lg"><FemaleIcon /></span>
                            Maternal Side (Mother's)
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Mother's Father</span>
                                <span className="text-white font-bold">Grandfather (Maternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Mother's Mother</span>
                                <span className="text-white font-bold">Grandmother (Maternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Mother's Brother</span>
                                <span className="text-white font-bold">Uncle (Maternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Mother's Sister</span>
                                <span className="text-white font-bold">Aunt (Maternal)</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Mother's Sister's Daughter</span>
                                <span className="text-white font-bold">Cousin</span>
                            </li>
                        </ul>
                    </div>

                    {/* In-Laws */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-amber-500/30">
                        <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2"><FavoriteIcon /> In-Laws (By Marriage)</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Spouse's Father</span>
                                <span className="text-white font-bold">Father-in-law</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Spouse's Mother</span>
                                <span className="text-white font-bold">Mother-in-law</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Spouse's Brother</span>
                                <span className="text-white font-bold">Brother-in-law</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Spouse's Sister</span>
                                <span className="text-white font-bold">Sister-in-law</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Son's Wife</span>
                                <span className="text-white font-bold">Daughter-in-law</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Daughter's Husband</span>
                                <span className="text-white font-bold">Son-in-law</span>
                            </li>
                        </ul>
                    </div>

                    {/* Siblings & Their Children */}
                    <div className="p-5 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><PeopleIcon /> Siblings & Their Children</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Brother's Son</span>
                                <span className="text-white font-bold">Nephew</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Brother's Daughter</span>
                                <span className="text-white font-bold">Niece</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Sister's Son</span>
                                <span className="text-white font-bold">Nephew</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Sister's Daughter</span>
                                <span className="text-white font-bold">Niece</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-neutral-400">Uncle/Aunt's Children</span>
                                <span className="text-white font-bold">Cousin</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <CheckUnderstanding
                    question="What is my mother's brother's daughter to me?"
                    options={["Sister", "Niece", "Cousin", "Aunt"]}
                    correctIndex={2}
                    explanation="Mother's brother = Uncle (maternal). Uncle's daughter = Cousin!"
                />
            </ConceptSection>

            {/* POINTING PROBLEMS */}
            <ConceptSection id="pointing" title="Solving 'Pointing' Problems">
                <p className="mb-4">
                    The most common type: <strong>"Pointing to a photograph, A said..."</strong>
                </p>

                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <h4 className="text-violet-400 font-bold mb-3 flex items-center gap-2"><KeyIcon /> The Golden Technique</h4>
                    <p className="text-lg">
                        Start from the <strong>END</strong> of the sentence and work <strong>BACKWARDS</strong> to "MY"!
                    </p>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4">Step-by-Step Process</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                            <div>
                                <p className="font-bold text-white">Read the FULL statement</p>
                                <p className="text-sm text-neutral-400">Identify who is speaking (usually "I" or "A")</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                            <div>
                                <p className="font-bold text-white">Start from "MY" or "I"</p>
                                <p className="text-sm text-neutral-400">Draw yourself first, then build the tree from there</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                            <div>
                                <p className="font-bold text-white">Work backwards through EACH relationship</p>
                                <p className="text-sm text-neutral-400">"Brother's wife" → find brother first, then add wife</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">4</div>
                            <div>
                                <p className="font-bold text-white">Find the person in photo</p>
                                <p className="text-sm text-neutral-400">Connect them to your tree and read the relationship</p>
                            </div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Pointing to a woman, a man said, 'Her mother is the only daughter of my mother.' How is the man related to the woman?"
                    solution={
                        <div className="space-y-3">
                            <p><strong>Step 1:</strong> Start from "my mother"</p>
                            <p><strong>Step 2:</strong> "Only daughter of my mother" = The man's sister</p>
                            <p><strong>Step 3:</strong> "Her mother" = The woman's mother = Man's sister</p>
                            <p><strong>Step 4:</strong> So the woman is the daughter of man's sister</p>
                            <p><strong>Step 5:</strong> Sister's daughter = <span className="text-violet-400 font-bold">NIECE</span></p>
                            <div className="mt-4 p-3 bg-black/50 rounded-lg">
                                <p className="text-xs text-neutral-400">
                                    Man's Mother → Man's Sister (only daughter) → Woman (daughter)
                                </p>
                            </div>
                        </div>
                    }
                    answer="Uncle (The man is the woman's uncle)"
                />

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife.' How is the lady related to the man?"
                    solution={
                        <div className="space-y-3">
                            <p><strong>Decode backwards:</strong></p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>"my wife" → Man's Wife</li>
                                <li>"brother of my wife" → Man's Brother-in-law</li>
                                <li>"son of her only brother" = Man's Brother-in-law</li>
                                <li>So: Lady's Brother's Son = Man's Brother-in-law</li>
                                <li>This means: Lady's Brother = Man's Father-in-law</li>
                                <li>Therefore: Lady = Sister of Man's Father-in-law</li>
                            </ul>
                        </div>
                    }
                    answer="Sister of Father-in-law (or Aunt-in-law)"
                />

                <CheckUnderstanding
                    question="Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?"
                    options={["Mother", "Aunt", "Grandmother", "Sister"]}
                    correctIndex={0}
                    explanation="'Only daughter of my mother' = The woman herself. So 'His mother' = The woman. Therefore, the woman is the man's MOTHER!"
                />
            </ConceptSection>

            {/* CODED RELATIONS */}
            <ConceptSection id="coded" title="Coded Relations (A+B, A×B)">
                <p className="mb-4">
                    Some questions use symbols like +, −, ×, ÷ to represent relationships. <strong>Decode them first!</strong>
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4 text-center">Common Coding Patterns</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl text-rose-400 font-bold mb-2">+</div>
                            <p className="text-sm text-neutral-400">Usually means</p>
                            <p className="text-white font-bold">Mother</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl text-blue-400 font-bold mb-2">−</div>
                            <p className="text-sm text-neutral-400">Usually means</p>
                            <p className="text-white font-bold">Father</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl text-amber-400 font-bold mb-2">×</div>
                            <p className="text-sm text-neutral-400">Usually means</p>
                            <p className="text-white font-bold">Brother</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <div className="text-3xl text-pink-400 font-bold mb-2">÷</div>
                            <p className="text-sm text-neutral-400">Usually means</p>
                            <p className="text-white font-bold">Sister</p>
                        </div>
                    </div>
                    <p className="text-center text-neutral-500 text-xs mt-4">
                        ⚠️ Always check the question — codes can vary!
                    </p>
                </div>

                <FormulaBox title="The Decoding Method">
                    <ol className="list-decimal list-inside text-sm space-y-2">
                        <li>Write down the meaning of each symbol (given in question)</li>
                        <li>Replace symbols with relationships: P + Q − R = "P mother of Q, Q father of R"</li>
                        <li>Draw the family tree step by step</li>
                        <li>Find the answer from your diagram</li>
                    </ol>
                </FormulaBox>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="If A + B means A is father of B, A − B means A is mother of B, A × B means A is brother of B. What does P + Q − R × S mean?"
                    solution={
                        <div className="space-y-3">
                            <p><strong>Decode step by step:</strong></p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>P + Q → P is father of Q</li>
                                <li>Q − R → Q is mother of R</li>
                                <li>R × S → R is brother of S</li>
                            </ul>
                            <p className="mt-2"><strong>Build tree:</strong></p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>P (♂) married to Q (♀)</li>
                                <li>They have children: R (♂, since he's brother) and S</li>
                            </ul>
                            <p className="text-rose-400 mt-2"><strong>P is grandfather of S</strong></p>
                        </div>
                    }
                    answer="P is grandfather of S"
                />
            </ConceptSection>

            {/* ONLY CHILD / ONLY SON */}
            <ConceptSection id="only" title="'Only' Keyword — The Trap Word">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold mb-3">⚠️ "Only Son"</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                            Means: No other <strong>sons</strong>
                        </p>
                        <p className="text-xs text-neutral-500">
                            But there could be daughters! "Only son" doesn't mean "no siblings"
                        </p>
                    </div>
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <h4 className="text-emerald-400 font-bold mb-3">✓ "Only Child"</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                            Means: No siblings at all
                        </p>
                        <p className="text-xs text-neutral-500">
                            No brothers AND no sisters — truly alone!
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
                        <h4 className="text-amber-400 font-bold mb-3">"Only Daughter"</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                            Means: No other daughters (sisters possible)
                        </p>
                    </div>
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
                        <h4 className="text-amber-400 font-bold mb-3">"Only Brother"</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                            Means: She has exactly one brother (no other brothers)
                        </p>
                    </div>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="'I am the only son of my father' — Does this mean the speaker has no siblings?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Analysis:</strong> "Only son" means no other sons (brothers)</p>
                            <p><strong>But:</strong> The speaker could have sisters!</p>
                            <p className="text-amber-400"><strong>So NO — the speaker might have sisters.</strong></p>
                        </div>
                    }
                    answer="No, might have sisters"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CloseIcon fontSize="small" /> Assuming Gender from Names</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Pat", "Sam", "Alex" can be male or female! Only explicit words like "he", "she",
                            "husband", "wife" confirm gender.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CloseIcon fontSize="small" /> Assuming Gender from Profession</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Doctor", "Engineer", "Teacher" → Can be male OR female!
                            Don't assume gender from profession.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CloseIcon fontSize="small" /> Confusing "Only Son" with "Only Child"</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Only son" means no brothers (but sisters possible).
                            "Only child" means no siblings at all.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CloseIcon fontSize="small" /> Cousin Confusion</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Cousin" is gender-neutral! Use "cousin brother" or "cousin sister" if gender matters.
                            Uncle's child = Cousin (could be male or female)
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><CloseIcon fontSize="small" /> Not Drawing the Family Tree</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            This is the biggest mistake! Always draw — it takes seconds and prevents all confusion.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Blood Relations Master Reference"
                    rows={[
                        { concept: 'Symbols', formula: '\\square = \\text{Male}, \\bigcirc = \\text{Female}' },
                        { concept: 'Paternal', formula: "\\text{Father's side}" },
                        { concept: 'Maternal', formula: "\\text{Mother's side}" },
                        { concept: 'Nephew', formula: "\\text{Sibling's son}" },
                        { concept: 'Niece', formula: "\\text{Sibling's daughter}" },
                        { concept: 'Cousin', formula: "\\text{Uncle/Aunt's child}" },
                        { concept: 'Brother-in-law', formula: "\\text{Spouse's brother OR Sister's husband}" },
                        { concept: 'Only Son', formula: '\\text{No brothers (sisters possible)}' },
                        { concept: 'Only Child', formula: '\\text{No siblings at all}' },
                        { concept: 'Rule #1', formula: '\\text{ALWAYS DRAW THE TREE!}' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
