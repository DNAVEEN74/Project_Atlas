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

export default function SimpleInterestContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[10rem] font-bold text-neutral-800 select-none">SI</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/20">
                        Phase 02: Interest
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Simple Interest</h1>
                    <p className="text-neutral-400 text-lg">Linear growth over time.</p>
                </div>
            </div>

            <ConceptSection id="intro" title="The Concept" icon="🏦">
                <p>
                    Simple interest is exactly that—simple. The interest is same every year.
                </p>
                <FormulaBox>
                    <MathText>{`SI = \\frac{P \\times R \\times T}{100}`}</MathText>
                </FormulaBox>
                <p className="mt-4">
                    Since <MathText>{`I`}</MathText> is constant each year, the Total Interest is just <MathText>{`R \\times T \\%`}</MathText> of Principal.
                </p>
            </ConceptSection>

            <ConceptSection id="types" title="Common Types">
                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A sum doubles itself in 5 years at SI. Find the Rate %."
                    solution={
                        <div>
                            <p>Sum doubles <MathText>{`\\implies`}</MathText> Amount = 2P.</p>
                            <p>Interest = Amount - P = P.</p>
                            <p><MathText>{`SI = \\frac{PRT}{100} \\implies P = \\frac{P \\times R \\times 5}{100}`}</MathText></p>
                            <p><MathText>{`1 = \\frac{5R}{100} \\implies R = 20\\%`}</MathText>.</p>
                        </div>
                    }
                    answer="20%"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="SI Formulas"
                    rows={[
                        { concept: 'Simple Interest', formula: 'PRT/100' },
                        { concept: 'Rate', formula: '(100 \\times SI) / (P \\times T)' },
                        { concept: 'Installments', formula: '100A / (100T + RT(T-1)/2)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
