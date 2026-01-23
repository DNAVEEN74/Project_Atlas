"use client";

import React from 'react';
import Image from 'next/image';
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

export default function CodingDecodingContent() {
    return (
        <LessonLayout>

            {/* HERO IMAGE */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/coding_decoding_cipher_hero.png"
                        alt="Coding Decoding Matrix"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute text-[8rem] font-mono font-bold text-violet-500/10 select-none tracking-[2rem]">cipher</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-500 text-xs font-bold uppercase tracking-widest mb-2 border border-violet-500/20">
                        Phase 01: Verbal Reasoning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Coding & Decoding</h1>
                    <p className="text-neutral-400 text-lg">Deciphering the patterns hidden in plain sight.</p>
                </div>
            </div>

            {/* 1. CONCEPT ALPHA */}
            <ConceptSection id="intro" title="The Alpha Map (EJOTY)" icon="🗺️">
                <p>
                    Coding questions are just number problems disguised as letters.
                    If you see <strong>T</strong>, your brain should scream <strong>20</strong>.
                </p>

                <div className="my-8 p-6 bg-[#0f0f0f] border border-neutral-800 rounded-xl">
                    <div className="grid grid-cols-5 gap-4 text-center">
                        {[
                            { l: 'E', n: 5 }, { l: 'J', n: 10 }, { l: 'O', n: 15 }, { l: 'T', n: 20 }, { l: 'Y', n: 25 }
                        ].map(({ l, n }) => (
                            <div key={l} className="group relative">
                                <div className="text-4xl font-black text-violet-500 group-hover:scale-125 transition-transform duration-300 cursor-default">{l}</div>
                                <div className="text-xs text-neutral-500 mt-1">{n}</div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-neutral-800 px-2 py-1 rounded transition-opacity">
                                    Use {l} to find neighbors
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <TipBox title="Speed Hack" variant="tip">
                    Don't count on your fingers. Use "Reference Points".
                    <ul className="list-disc list-inside mt-2 text-sm text-neutral-300">
                        <li><strong>T</strong>20 (T-20 Cricket)</li>
                        <li><strong>M</strong> is middle (13)</li>
                        <li><strong>G</strong> looks like 7</li>
                        <li><strong>R</strong> looks like 18 (Right to Vote)</li>
                    </ul>
                </TipBox>

                <CheckUnderstanding
                    question="If E=5 and T=20, what is the position of 'Q'?"
                    options={["16", "17", "18", "19"]}
                    correctIndex={1}
                    explanation="Using EJOTY: O is 15. P is 16. Q is 17. Or T is 20. S is 19. R is 18. Q is 17."
                />
            </ConceptSection>

            {/* 2. REVERSE PAIRS */}
            <ConceptSection id="reverse" title="The 'Opposite' Trap" icon="🪞">
                <p>
                    Sometimes, A is coded as Z. This is the Reverse Pair pattern.
                    Remember: <strong>Sum of positions = 27</strong>.
                </p>

                <FormulaBox variant="secondary" title="The 27 Rule">
                    <MathText>{`\\text{Opposite}(X) = 27 - \\text{Position}(X)`}</MathText>
                </FormulaBox>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-neutral-400 my-6">
                    {['A-Z (Azad)', 'B-Y (Boy)', 'C-X (Crux)', 'D-W (Dew)', 'E-V (Eve)', 'F-U (Full)', 'G-T (GT Road)', 'H-S (High School)', 'I-R (Indian Rail)', 'J-Q (Jack Queen)', 'K-P (Kevin P)', 'L-O (Love)', 'M-N (Man)'].map(s => (
                        <div key={s} className="bg-neutral-900 border border-neutral-800 p-2 rounded text-center hover:bg-neutral-800 hover:text-white transition-colors cursor-default">
                            {s}
                        </div>
                    ))}
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="If KING is coded as PRMT, how is RAIN coded?"
                    solution={
                        <div>
                            <p className="mb-2">Check relation between KING and PRMT:</p>
                            <ul className="ml-4 mb-2 text-neutral-400 text-sm">
                                <li>K (11) ↔ P (16) [Sum 27]</li>
                                <li>I (9) ↔ R (18) [Sum 27]</li>
                                <li>N (14) ↔ M (13) [Sum 27]</li>
                            </ul>
                            <p>This is Reverse Pair coding. Apply to RAIN:</p>
                            <ul className="ml-4 text-white font-bold">
                                <li>R ↔ I</li>
                                <li>A ↔ Z</li>
                                <li>I ↔ R</li>
                                <li>N ↔ M</li>
                            </ul>
                        </div>
                    }
                    answer="IZRM"
                />
            </ConceptSection>

            {/* 3. SHIFTING PATTERNS */}
            <ConceptSection id="shifting" title="Shifting Patterns" icon="🔄">
                <p>
                    The most common type. Letters shift forward or backward.
                    Watch out for <strong>Cross Shifting</strong>.
                </p>

                <div className="flex justify-center my-6 gap-8 text-2xl font-mono text-neutral-500">
                    <div className="flex flex-col items-center">
                        <div>C</div><div className="text-sm">↓ +1</div><div>D</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div>A</div><div className="text-sm">↓ +2</div><div>C</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div>T</div><div className="text-sm">↓ +3</div><div>W</div>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="In a code, TEMPLE is written as VHQURL. Decode CHURCH."
                    solution={
                        <div>
                            <p className="mb-2 font-mono">
                                T --(+2)→ V <br />
                                E --(+3)→ H <br />
                                M --(+4)→ Q <br />
                                P --(+5)→ U <br />
                                L --(+6)→ R <br />
                                E --(+7)→ L
                            </p>
                            <p>Pattern is Increasing Shift (+2, +3, ...).</p>
                            <p className="mt-2 text-white">Apply to CHURCH:</p>
                            <p>C(+2)E, H(+3)K, U(+4)Y, R(+5)W, C(+6)I, H(+7)O</p>
                        </div>
                    }
                    answer="EKYWIO"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Code Breaker's Guide"
                    rows={[
                        { concept: 'EJOTY', formula: '5, 10, 15, 20, 25' },
                        { concept: 'Reverse Sum', formula: 'Pos + Opp = 27' },
                        { concept: 'Circular', formula: 'A(1) is next to Z(26)' },
                    ]}
                />
            </ConceptSection>

        </LessonLayout>
    );
}
