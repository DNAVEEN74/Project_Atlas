"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import { RocketLaunchIcon, CheckIcon, CancelIcon } from '@/components/icons';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';

export default function CodingDecodingContent() {
    return (
        <>
            {/* THE ALPHABET TABLE */}
            <ConceptSection id="alpha" title="Step 1: Master the Alphabet Numbers">
                <div className="mb-8">
                    <TipBox variant="note" title="The #1 skill">
                        <p className="text-base text-neutral-300">
                            Instantly convert letters to numbers and back! If you see <span className="text-white font-semibold">T</span>, think <span className="text-white font-semibold">20</span> immediately.
                        </p>
                    </TipBox>
                </div>

                {/* Full Alphabet Reference - Tabular Grid */}
                <div className="my-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Alphabet Index</h4>
                        <span className="text-xs text-neutral-500">Row 1: 1-13 • Row 2: 14-26</span>
                    </div>

                    <div className="bg-neutral-900/20 border border-neutral-800 rounded-xl p-4 overflow-x-auto">
                        <div className="min-w-max grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3">
                            {/* Row 1: A-M */}
                            {[
                                { l: 'A', n: 1 }, { l: 'B', n: 2 }, { l: 'C', n: 3 }, { l: 'D', n: 4 },
                                { l: 'E', n: 5 }, { l: 'F', n: 6 }, { l: 'G', n: 7 }, { l: 'H', n: 8 },
                                { l: 'I', n: 9 }, { l: 'J', n: 10 }, { l: 'K', n: 11 }, { l: 'L', n: 12 }, { l: 'M', n: 13 },
                            ].map(({ l, n }) => (
                                <div key={l} className="flex flex-col items-center justify-center w-10 h-14 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-violet-500/50 hover:bg-neutral-800 transition-all group cursor-default">
                                    <span className="text-lg font-bold text-white group-hover:text-violet-400">{l}</span>
                                    <span className="text-[10px] text-neutral-300 group-hover:text-white font-mono">{n}</span>
                                </div>
                            ))}

                            {/* Row 2: N-Z */}
                            {[
                                { l: 'N', n: 14 }, { l: 'O', n: 15 }, { l: 'P', n: 16 }, { l: 'Q', n: 17 },
                                { l: 'R', n: 18 }, { l: 'S', n: 19 }, { l: 'T', n: 20 }, { l: 'U', n: 21 },
                                { l: 'V', n: 22 }, { l: 'W', n: 23 }, { l: 'X', n: 24 }, { l: 'Y', n: 25 }, { l: 'Z', n: 26 },
                            ].map(({ l, n }) => (
                                <div key={l} className="flex flex-col items-center justify-center w-10 h-14 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-violet-500/50 hover:bg-neutral-800 transition-all group cursor-default">
                                    <span className="text-lg font-bold text-white group-hover:text-violet-400">{l}</span>
                                    <span className="text-[10px] text-neutral-300 group-hover:text-white font-mono">{n}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* EJOTY Trick - Minimal */}
                <div className="my-8">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                        <RocketLaunchIcon className="text-violet-500" />
                        EJOTY — The Speed Trick
                    </h4>
                    <p className="text-neutral-400 mb-6 max-w-2xl">
                        Memorize these 5 reference points. Find any letter by counting from the nearest EJOTY!
                    </p>
                    <div className="grid grid-cols-5 gap-4">
                        {[{ l: 'E', n: 5 }, { l: 'J', n: 10 }, { l: 'O', n: 15 }, { l: 'T', n: 20 }, { l: 'Y', n: 25 }].map(({ l, n }) => (
                            <div key={l} className="p-4 border border-neutral-800 rounded-lg text-center hover:border-violet-500/50 transition-colors group">
                                <div className="text-2xl font-bold text-neutral-300 group-hover:text-violet-400">{l}</div>
                                <div className="text-sm text-neutral-500 mt-1">{n}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <TipBox variant="tip" title="More Memory Tricks">
                    <ul className="list-disc list-inside text-sm space-y-2 text-neutral-400">
                        <li><strong className="text-neutral-200">M = 13</strong> (M for Middle of 26)</li>
                        <li><strong className="text-neutral-200">T = 20</strong> (T-20 Cricket)</li>
                        <li><strong className="text-neutral-200">R = 18</strong> (Right to Vote age!)</li>
                        <li><strong className="text-neutral-200">G = 7</strong> (G looks like 7)</li>
                    </ul>
                </TipBox>

                <CheckUnderstanding
                    question="Using EJOTY, find the position of 'Q'"
                    options={["15", "16", "17", "18"]}
                    correctIndex={2}
                    explanation="O = 15, P = 16, Q = 17. Or: T = 20, S = 19, R = 18, Q = 17"
                />
            </ConceptSection>

            {/* TYPE 1: SHIFTING */}
            <ConceptSection id="shifting" title="Type 1: Shifting Patterns (+/- N)">
                <p className="mb-4">
                    The most common type! Each letter shifts forward or backward by a fixed number.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-bold mb-3">Forward Shift (+N)</h4>
                        <p className="text-sm text-neutral-300 mb-3">Each letter moves forward in alphabet</p>
                        <div className="font-mono text-center">
                            <p className="text-neutral-500">CAT → <span className="text-white">DBU</span> (+1)</p>
                            <p className="text-neutral-500">CAT → <span className="text-white">FDW</span> (+3)</p>
                        </div>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-red-500/30">
                        <h4 className="text-red-400 font-bold mb-3">Backward Shift (−N)</h4>
                        <p className="text-sm text-neutral-300 mb-3">Each letter moves backward in alphabet</p>
                        <div className="font-mono text-center">
                            <p className="text-neutral-500">DOG → <span className="text-white">CNF</span> (−1)</p>
                            <p className="text-neutral-500">DOG → <span className="text-white">ALD</span> (−3)</p>
                        </div>
                    </div>
                </div>

                <TipBox variant="warning" title="Circular Alphabet!">
                    <p className="text-sm">
                        Z + 1 = A (wrap around). If a shift goes past Z, continue from A.<br />
                        Example: Y (+3) = B (not "beyond Z")
                    </p>
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="If APPLE is coded as DSSOH, how is MANGO coded?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Find the pattern:</strong></p>
                            <p className="font-mono text-sm">A→D (+3), P→S (+3), P→S (+3), L→O (+3), E→H (+3)</p>
                            <p>Each letter shifts <strong>+3</strong></p>
                            <p><strong>Apply to MANGO:</strong></p>
                            <p className="font-mono">M→P, A→D, N→Q, G→J, O→R = <strong className="text-violet-400">PDQJR</strong></p>
                        </div>
                    }
                    answer="PDQJR"
                />
            </ConceptSection>

            {/* TYPE 2: VARIABLE SHIFT */}
            <ConceptSection id="variable" title="Type 2: Variable Shifting (+1, +2, +3...)">
                <p className="mb-4">
                    Each position has a different shift! The shift often increases or follows a pattern.
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4 text-center">Common Patterns</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <p className="text-sm text-neutral-500">Increasing</p>
                            <p className="text-lg text-white font-mono">+1, +2, +3, +4...</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <p className="text-sm text-neutral-500">Decreasing</p>
                            <p className="text-lg text-white font-mono">-1, -2, -3, -4...</p>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg text-center">
                            <p className="text-sm text-neutral-500">Alternating</p>
                            <p className="text-lg text-white font-mono">+1, -1, +1, -1...</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="If TEMPLE is written as VHQURL, decode CHURCH."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Find pattern in TEMPLE → VHQURL:</strong></p>
                            <p className="font-mono text-sm">
                                T→V (+2), E→H (+3), M→Q (+4), P→U (+5), L→R (+6), E→L (+7)
                            </p>
                            <p>Pattern: <strong>+2, +3, +4, +5, +6, +7</strong> (increasing by 1)</p>
                            <p><strong>Apply to CHURCH:</strong></p>
                            <p className="font-mono text-sm">
                                C(+2)→E, H(+3)→K, U(+4)→Y, R(+5)→W, C(+6)→I, H(+7)→O
                            </p>
                        </div>
                    }
                    answer="EKYWIO"
                />

                <CheckUnderstanding
                    question="If A→C (+2), B→E (+3), C→G (+4), what is D coded as?"
                    options={["H", "I", "J", "K"]}
                    correctIndex={1}
                    explanation="Pattern is +2, +3, +4... so D gets +5. D(4) + 5 = I(9)"
                />
            </ConceptSection>

            {/* TYPE 3: REVERSE PAIRS */}
            <ConceptSection id="reverse" title="Type 3: Reverse Pairs (A↔Z, B↔Y)">
                <p className="mb-4">
                    A is coded as Z, B as Y, and so on. This is the "mirror" or "opposite" coding.
                </p>

                <FormulaBox title="The 27 Rule" variant="secondary">
                    <div className="text-center">
                        <MathText className="text-xl">{`\\text{Opposite}(X) = 27 - \\text{Position}(X)`}</MathText>
                        <p className="text-neutral-500 text-sm mt-2">A(1) + Z(26) = 27, B(2) + Y(25) = 27, etc.</p>
                    </div>
                </FormulaBox>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4 text-center">All Opposite Pairs</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        {[
                            'A↔Z', 'B↔Y', 'C↔X', 'D↔W',
                            'E↔V', 'F↔U', 'G↔T', 'H↔S',
                            'I↔R', 'J↔Q', 'K↔P', 'L↔O', 'M↔N'
                        ].map(pair => (
                            <div key={pair} className="p-2 bg-black/50 rounded text-center font-mono hover:bg-violet-500/20 transition-all">
                                {pair}
                            </div>
                        ))}
                    </div>
                </div>

                <TipBox title="Memory Mnemonics">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p>A-Z: <strong>A to Z</strong></p>
                        <p>H-S: <strong>High School</strong></p>
                        <p>G-T: <strong>GT Road</strong></p>
                        <p>I-R: <strong>Indian Rail</strong></p>
                        <p>L-O: <strong>Love</strong></p>
                        <p>M-N: <strong>Middle Neighbors</strong></p>
                    </div>
                </TipBox>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="If KING is coded as PRMT, how is RAIN coded?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Verify pattern in KING → PRMT:</strong></p>
                            <p className="text-sm flex items-center gap-1">
                                K(11)+P(16)=27 <CheckIcon className="text-emerald-500" fontSize="small" />,
                                I(9)+R(18)=27 <CheckIcon className="text-emerald-500" fontSize="small" />,
                                N(14)+M(13)=27 <CheckIcon className="text-emerald-500" fontSize="small" />,
                                G(7)+T(20)=27 <CheckIcon className="text-emerald-500" fontSize="small" />
                            </p>
                            <p>It's <strong>Reverse Pair (27 Rule)</strong></p>
                            <p><strong>Apply to RAIN:</strong></p>
                            <p className="font-mono">R↔I, A↔Z, I↔R, N↔M = <strong className="text-violet-400">IZRM</strong></p>
                        </div>
                    }
                    answer="IZRM"
                />
            </ConceptSection>

            {/* TYPE 4: LETTER-NUMBER */}
            <ConceptSection id="letter-number" title="Type 4: Letter-Number Codes">
                <p className="mb-4">
                    Letters are converted to numbers using some formula or pattern.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-violet-500/30">
                        <h4 className="text-violet-400 font-bold mb-3">Direct Position</h4>
                        <p className="text-sm text-neutral-300">CAT = 3, 1, 20</p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-violet-500/30">
                        <h4 className="text-violet-400 font-bold mb-3">Reverse Position</h4>
                        <p className="text-sm text-neutral-300">CAT = 24, 26, 7 (using 27−pos)</p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-violet-500/30">
                        <h4 className="text-violet-400 font-bold mb-3">Sum of Positions</h4>
                        <p className="text-sm text-neutral-300">CAT = 3+1+20 = 24</p>
                    </div>
                    <div className="p-5 bg-neutral-900 rounded-xl border border-violet-500/30">
                        <h4 className="text-violet-400 font-bold mb-3">Product</h4>
                        <p className="text-sm text-neutral-300">AB = 1×2 = 2</p>
                    </div>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="If CAT = 24 and DOG = 26, what is BAT?"
                    solution={
                        <div className="space-y-2">
                            <p className="flex items-center gap-2"><strong>Check CAT:</strong> C(3) + A(1) + T(20) = 24 <CheckIcon className="text-emerald-500" fontSize="small" /></p>
                            <p className="flex items-center gap-2"><strong>Check DOG:</strong> D(4) + O(15) + G(7) = 26 <CheckIcon className="text-emerald-500" fontSize="small" /></p>
                            <p>Pattern: <strong>Sum of positions</strong></p>
                            <p><strong>BAT:</strong> B(2) + A(1) + T(20) = <strong>23</strong></p>
                        </div>
                    }
                    answer="23"
                />
            </ConceptSection>

            {/* TYPE 5: WORD/SENTENCE CODING */}
            <ConceptSection id="word" title="Type 5: Word-Based Coding">
                <p className="mb-4">
                    Full words are coded as other words. Find which word maps to which!
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-4">The Method:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-300">
                        <li>Compare sentences that have words in common</li>
                        <li>Identify which code word stays the same</li>
                        <li>That word maps to that code</li>
                    </ol>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="hard"
                    question={`"Sky is blue" is coded as "na pa ka". "Sea is deep" is coded as "la ka ta". What is the code for "is"?`}
                    solution={
                        <div className="space-y-2">
                            <p><strong>Compare sentences:</strong></p>
                            <p className="text-sm">Sentence 1: Sky is blue → na pa ka</p>
                            <p className="text-sm">Sentence 2: Sea is deep → la ka ta</p>
                            <p><strong>Common word:</strong> "is" (appears in both)</p>
                            <p><strong>Common code:</strong> "ka" (appears in both)</p>
                            <p>Therefore: <strong className="text-violet-400">"is" = "ka"</strong></p>
                        </div>
                    }
                    answer="ka"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Counting Letters Wrong
                        </h4>
                        <p className="text-sm text-neutral-400">
                            Use EJOTY! Don't count on fingers — it's slow and error-prone.
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Forgetting Circular Alphabet
                        </h4>
                        <p className="text-sm text-neutral-400">
                            After Z comes A! Y + 3 = B (not some imaginary letter).
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Assuming One Pattern Fits All
                        </h4>
                        <p className="text-sm text-neutral-400">
                            Check EVERY letter before concluding the pattern. Variable shifts are common traps!
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Confusing +N with −N
                        </h4>
                        <p className="text-sm text-neutral-400">
                            If A→D, that's +3. If D→A, that's −3. Direction matters!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Coding-Decoding Master Reference"
                    rows={[
                        { concept: 'EJOTY', formula: 'E=5, J=10, O=15, T=20, Y=25' },
                        { concept: 'Reverse Pair', formula: '\\text{Position} + \\text{Opposite} = 27' },
                        { concept: 'Circular Rule', formula: '26 + n = n \\text{ (wrap around)}' },
                        { concept: 'Constant Shift', formula: '\\text{Same shift for all letters}' },
                        { concept: 'Variable Shift', formula: '\\text{Different shift per position}' },
                        { concept: 'Word Coding', formula: '\\text{Common word = Common code}' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
