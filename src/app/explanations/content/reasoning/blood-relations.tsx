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

export default function BloodRelationsContent() {
    return (
        <LessonLayout>
            {/* HERO */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/blood_relations_hero.png"
                        alt="Family Tree"
                        className="object-cover w-full h-full opacity-60"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute text-[6rem] select-none opacity-20">👨‍👩‍👧‍👦</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-widest mb-2 border border-rose-500/20">
                        Phase 04: Real World Logic
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Blood Relations</h1>
                    <p className="text-neutral-400 text-lg">Master family tree problems step by step.</p>
                </div>
            </div>

            {/* CONCEPT 1: THE GOLDEN RULE */}
            <ConceptSection id="intro" title="The Golden Rule: ALWAYS Draw!" icon="✏️">
                <p>
                    <strong>NEVER solve blood relations in your head.</strong> Always draw a family tree diagram.
                    It takes 10 seconds to draw but saves minutes of confusion.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-rose-500/30">
                    <h4 className="text-rose-400 font-bold mb-4 text-center text-lg">Standard Symbols</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-blue-500 mx-auto"></div>
                            <p className="text-sm text-blue-400 mt-2">Male (+)</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-pink-500 rounded-full mx-auto"></div>
                            <p className="text-sm text-pink-400 mt-2">Female (−)</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 h-12">
                                <div className="w-8 h-8 border-2 border-blue-500"></div>
                                <div className="w-6 h-0.5 bg-white"></div>
                                <div className="w-8 h-8 border-2 border-pink-500 rounded-full"></div>
                            </div>
                            <p className="text-sm text-neutral-400 mt-2">Couple (=)</p>
                        </div>
                        <div className="text-center">
                            <div className="flex flex-col items-center justify-center h-12">
                                <div className="w-0.5 h-4 bg-white"></div>
                                <div className="flex gap-4">
                                    <div className="w-4 h-4 border border-white"></div>
                                    <div className="w-4 h-4 border border-white rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-400 mt-2">Children</p>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 2: RELATIONSHIPS CHART */}
            <ConceptSection id="relations" title="Relationship Reference" icon="👨‍👩‍👧">
                <p>Memorize these terms. They appear EVERY exam.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-rose-400 font-bold mb-3">Paternal Side (Father's)</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>• Father's Father → <strong>Grandfather (Paternal)</strong></li>
                            <li>• Father's Mother → <strong>Grandmother (Paternal)</strong></li>
                            <li>• Father's Brother → <strong>Uncle (Paternal)</strong></li>
                            <li>• Father's Sister → <strong>Aunt (Paternal)</strong></li>
                        </ul>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-rose-400 font-bold mb-3">Maternal Side (Mother's)</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>• Mother's Father → <strong>Grandfather (Maternal)</strong></li>
                            <li>• Mother's Mother → <strong>Grandmother (Maternal)</strong></li>
                            <li>• Mother's Brother → <strong>Uncle (Maternal)</strong></li>
                            <li>• Mother's Sister → <strong>Aunt (Maternal)</strong></li>
                        </ul>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-rose-400 font-bold mb-3">In-Laws (By Marriage)</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>• Spouse's Father → <strong>Father-in-law</strong></li>
                            <li>• Spouse's Mother → <strong>Mother-in-law</strong></li>
                            <li>• Spouse's Brother → <strong>Brother-in-law</strong></li>
                            <li>• Spouse's Sister → <strong>Sister-in-law</strong></li>
                        </ul>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-rose-400 font-bold mb-3">Other Relations</h4>
                        <ul className="text-sm text-neutral-300 space-y-1">
                            <li>• Uncle's/Aunt's children → <strong>Cousin</strong></li>
                            <li>• Brother's/Sister's son → <strong>Nephew</strong></li>
                            <li>• Brother's/Sister's daughter → <strong>Niece</strong></li>
                        </ul>
                    </div>
                </div>
            </ConceptSection>

            {/* CONCEPT 3: POINTING PROBLEMS */}
            <ConceptSection id="pointing" title="Pointing Problems" icon="👉">
                <p>
                    "Pointing to a photograph, A said..." → Start from the END and work backwards to "MY".
                </p>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife.' How is the lady related to the man?"
                    solution={
                        <div className="space-y-3">
                            <p><strong>Work backwards:</strong></p>
                            <p>1. "My wife" → Man's Wife</p>
                            <p>2. "Brother of my wife" → Man's Brother-in-law</p>
                            <p>3. "Son of her only brother" = Man's Brother-in-law</p>
                            <p>4. So: Lady's Brother's Son = Man's Brother-in-law</p>
                            <p>5. This means: Lady's Brother = Man's Father-in-law</p>
                            <p>6. Therefore: Lady = Sister of Man's Father-in-law</p>
                        </div>
                    }
                    answer="Sister of Father-in-law"
                />

                <CheckUnderstanding
                    question="Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?"
                    options={["Mother", "Aunt", "Grandmother", "Sister"]}
                    correctIndex={0}
                    explanation="'Only daughter of my mother' = The woman herself. So 'His mother' = The woman. Therefore, the woman is the man's mother."
                />
            </ConceptSection>

            {/* CONCEPT 4: CODED RELATIONS */}
            <ConceptSection id="coded" title="Coded Relations (A+B, A−B)" icon="🔢">
                <p>Some questions use codes like: A + B means "A is mother of B"</p>

                <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <p className="text-sm text-neutral-400 mb-4">Common coding patterns:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                        <div className="text-center">
                            <div className="text-rose-400">+</div>
                            <div className="text-neutral-500">Mother</div>
                        </div>
                        <div className="text-center">
                            <div className="text-rose-400">−</div>
                            <div className="text-neutral-500">Father</div>
                        </div>
                        <div className="text-center">
                            <div className="text-rose-400">×</div>
                            <div className="text-neutral-500">Brother</div>
                        </div>
                        <div className="text-center">
                            <div className="text-rose-400">÷</div>
                            <div className="text-neutral-500">Sister</div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="If A + B means A is father of B, A − B means A is mother of B, A × B means A is brother of B. What does P + Q − R × S mean?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Decode step by step:</strong></p>
                            <p>P + Q → P is father of Q</p>
                            <p>Q − R → Q is mother of R</p>
                            <p>R × S → R is brother of S</p>
                            <p><strong>Build tree:</strong> P married to Q, they have children R and S (R is male, S's gender unknown)</p>
                        </div>
                    }
                    answer="P is grandfather of S"
                />
            </ConceptSection>

            {/* CONCEPT 5: COMMON TRAPS */}
            <ConceptSection id="traps" title="Common Traps to Avoid" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Assuming Gender</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Doctor", "Engineer", "Teacher" → Can be male OR female!
                            <br />Only explicit words like "he", "she", "husband", "wife" indicate gender.
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ "Only Son" vs "Only Child"</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            "Only son" means no other sons (but daughters possible).
                            <br />"Only child" means no siblings at all.
                        </p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Cousin Confusion</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Cousins can be male or female. "Cousin brother" or "Cousin sister" specifies gender.
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Blood Relations Master Reference"
                    rows={[
                        { concept: 'Symbols', formula: 'Square=Male, Circle=Female' },
                        { concept: 'Paternal', formula: 'Father\'s side' },
                        { concept: 'Maternal', formula: 'Mother\'s side' },
                        { concept: 'Nephew', formula: 'Sibling\'s son' },
                        { concept: 'Niece', formula: 'Sibling\'s daughter' },
                        { concept: 'Always', formula: 'DRAW the family tree!' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
