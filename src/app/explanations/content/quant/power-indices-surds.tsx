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

export default function PowerIndicesSurdsContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[5rem] font-bold text-red-500/10 select-none font-mono">x^n</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-2 border border-red-500/20">
                        Phase 04: Advanced
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Power, Indices & Surds</h1>
                    <p className="text-neutral-400 text-lg">Exponents and Roots.</p>
                </div>
            </div>

            <ConceptSection id="indices" title="Laws of Indices" icon="📊">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <MathText>{`a^m \\times a^n = a^{m+n}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <MathText>{`\\frac{a^m}{a^n} = a^{m-n}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <MathText>{`(a^m)^n = a^{mn}`}</MathText>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <MathText>{`a^0 = 1`}</MathText>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="surds" title="Surds (Radicals)" icon="√">
                <p>A surd is an irrational root like √2, √3, ∛5.</p>

                <TipBox title="Rationalizing the Denominator">
                    <p>To rationalize 1/(a + √b), multiply by (a - √b)/(a - √b).</p>
                    <MathText>{`\\frac{1}{a + \\sqrt{b}} = \\frac{a - \\sqrt{b}}{a^2 - b}`}</MathText>
                </TipBox>
            </ConceptSection>

            <ConceptSection id="common" title="Common Values" icon="📝">
                <div className="grid grid-cols-4 gap-2 my-6 text-center font-mono text-sm">
                    <div className="p-2 bg-neutral-900 rounded">√2 ≈ 1.41</div>
                    <div className="p-2 bg-neutral-900 rounded">√3 ≈ 1.73</div>
                    <div className="p-2 bg-neutral-900 rounded">√5 ≈ 2.24</div>
                    <div className="p-2 bg-neutral-900 rounded">√7 ≈ 2.65</div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Surd Rules"
                    rows={[
                        { concept: '√a × √b', formula: '√(ab)' },
                        { concept: 'a^(1/n)', formula: 'ⁿ√a' },
                        { concept: '(√a + √b)(√a - √b)', formula: 'a - b' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
