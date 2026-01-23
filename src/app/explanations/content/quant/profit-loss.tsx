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

export default function ProfitLossContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/profit_loss_hero.png"
                        alt="Profit Growth"
                        className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2 border border-emerald-500/20">
                        Phase 02: Business Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Profit & Loss</h1>
                    <p className="text-neutral-400 text-lg">The language of business: CP, SP, and MRP.</p>
                </div>
            </div>

            <ConceptSection id="flow" title="The Shopkeeper's Journey" icon="🏪">
                <p>
                    Every Profit & Loss problem follows a single timeline.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-10 font-bold">
                    <div className="p-4 bg-neutral-800 rounded-xl text-center border border-neutral-700">
                        <div className="text-neutral-500 text-xs mb-1">Buy</div>
                        <div className="text-2xl text-blue-400">CP</div>
                    </div>
                    <div className="text-neutral-600">→ (+Markup) →</div>
                    <div className="p-4 bg-neutral-800 rounded-xl text-center border border-neutral-700">
                        <div className="text-neutral-500 text-xs mb-1">Tag</div>
                        <div className="text-2xl text-white">MRP</div>
                    </div>
                    <div className="text-neutral-600">→ (-Discount) →</div>
                    <div className="p-4 bg-neutral-800 rounded-xl text-center border border-neutral-700">
                        <div className="text-neutral-500 text-xs mb-1">Sell</div>
                        <div className="text-2xl text-emerald-400">SP</div>
                    </div>
                </div>

                <FormulaBox title="The Golden Relation">
                    <MathText>{`\\frac{CP}{MRP} = \\frac{100 - \\text{Discount}\\%}{100 + \\text{Profit}\\%}`}</MathText>
                </FormulaBox>
            </ConceptSection>

            <ConceptSection id="calc" title="Calculations">
                <p>
                    <strong>Profit/Loss</strong> is always calculated on <strong>CP</strong>. <br />
                    <strong>Discount</strong> is always calculated on <strong>MRP</strong>.
                </p>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="A shopkeeper earns 20% profit after giving a 10% discount. What is the ratio of CP to MRP?"
                    solution={
                        <div>
                            <p>Using the Golden Relation formula directly:</p>
                            <p><MathText>{`\\frac{CP}{MRP} = \\frac{100 - 10}{100 + 20} = \\frac{90}{120}`}</MathText></p>
                            <p><MathText>{`= \\frac{3}{4}`}</MathText></p>
                            <p>So CP:MRP = 3:4.</p>
                        </div>
                    }
                    answer="3:4"
                />
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="P&L Formulas"
                    rows={[
                        { concept: 'Profit %', formula: '(SP-CP)/CP \\times 100' },
                        { concept: 'CP from SP', formula: 'SP \\times \\frac{100}{100+P\\%}' },
                        { concept: 'Golden Ratio', formula: 'CP/MRP = (100-D)/(100+P)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
