"use client";

import React from 'react';
import { MathText } from '@/components/ui/MathText';
import {
    ConceptSection,
    FormulaBox,
    TipBox,
    ExampleCard,
    CheckUnderstanding,
    CheatSheet
} from '@/components/explanations';
import { ShoppingCartIcon, BarChartIcon, ReceiptLongIcon, CancelIcon } from '@/components/icons';

export default function ProfitLossContent() {
    return (
        <>
            <ConceptSection id="why" title="Why Profit & Loss is Everywhere">
                <FormulaBox title="Real Life Impact">
                    <p>
                        Every shop, every sale, every discount — it's all Profit & Loss!
                        <span className="text-amber-400"> Understanding this topic helps you think like a businessperson.</span>
                    </p>
                </FormulaBox>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center text-amber-400"><ShoppingCartIcon fontSize="large" /></div>
                        <h4 className="text-white font-bold">Shopping</h4>
                        <p className="text-xs text-neutral-400">Is 50% off + 20% off = 70% off?</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center text-amber-400"><BarChartIcon fontSize="large" /></div>
                        <h4 className="text-white font-bold">DI Problems</h4>
                        <p className="text-xs text-neutral-400">Profit margins in charts</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center text-amber-400"><ReceiptLongIcon fontSize="large" /></div>
                        <h4 className="text-white font-bold">Word Problems</h4>
                        <p className="text-xs text-neutral-400">2-3 questions guaranteed!</p>
                    </div>
                </div>
            </ConceptSection>

            {/* THE TERMINOLOGY */}
            <ConceptSection id="terms" title="The 4 Key Terms">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-center hover:border-amber-500 transition-all">
                        <div className="text-4xl font-black text-amber-400 mb-2">CP</div>
                        <p className="text-white font-bold">Cost Price</p>
                        <p className="text-xs text-neutral-400 mt-2">What the shopkeeper PAYS to buy the item</p>
                    </div>

                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-center hover:border-amber-500 transition-all">
                        <div className="text-4xl font-black text-amber-400 mb-2">MP</div>
                        <p className="text-white font-bold">Marked Price</p>
                        <p className="text-xs text-neutral-400 mt-2">The price TAG on the item (also called MRP)</p>
                    </div>

                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-center hover:border-amber-500 transition-all">
                        <div className="text-4xl font-black text-amber-400 mb-2">SP</div>
                        <p className="text-white font-bold">Selling Price</p>
                        <p className="text-xs text-neutral-400 mt-2">What the customer actually PAYS</p>
                    </div>

                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-center hover:border-amber-500 transition-all">
                        <div className="text-4xl font-black text-amber-400 mb-2">P/L</div>
                        <p className="text-white font-bold">Profit or Loss</p>
                        <p className="text-xs text-neutral-400 mt-2">SP − CP (positive = profit, negative = loss)</p>
                    </div>
                </div>
            </ConceptSection>

            {/* THE FLOW */}
            <ConceptSection id="flow" title="The Shopkeeper's Journey">
                <p className="mb-4">
                    Every P&L problem follows this <strong>exact sequence</strong>. Visualize it!
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto">
                    <div className="flex items-center justify-center gap-4 min-w-max">
                        {/* CP */}
                        <div className="p-4 bg-blue-500/20 rounded-xl text-center border-2 border-blue-500">
                            <div className="text-xs text-blue-400 mb-1">Buy at</div>
                            <div className="text-3xl font-bold text-blue-400">CP</div>
                            <div className="text-sm text-neutral-400 mt-1">₹100</div>
                        </div>

                        {/* Arrow with Markup */}
                        <div className="text-center">
                            <div className="text-emerald-400 text-xs font-bold">+50% Markup</div>
                            <div className="text-2xl">→</div>
                        </div>

                        {/* MP */}
                        <div className="p-4 bg-amber-500/20 rounded-xl text-center border-2 border-amber-500">
                            <div className="text-xs text-amber-400 mb-1">Tag at</div>
                            <div className="text-3xl font-bold text-amber-400">MP</div>
                            <div className="text-sm text-neutral-400 mt-1">₹150</div>
                        </div>

                        {/* Arrow with Discount */}
                        <div className="text-center">
                            <div className="text-red-400 text-xs font-bold">−20% Discount</div>
                            <div className="text-2xl">→</div>
                        </div>

                        {/* SP */}
                        <div className="p-4 bg-emerald-500/20 rounded-xl text-center border-2 border-emerald-500">
                            <div className="text-xs text-emerald-400 mb-1">Sell at</div>
                            <div className="text-3xl font-bold text-emerald-400">SP</div>
                            <div className="text-sm text-neutral-400 mt-1">₹120</div>
                        </div>

                        {/* Final Profit */}
                        <div className="text-center">
                            <div className="text-2xl">=</div>
                        </div>

                        <div className="p-4 bg-purple-500/20 rounded-xl text-center border-2 border-purple-500">
                            <div className="text-xs text-purple-400 mb-1">Profit</div>
                            <div className="text-3xl font-bold text-purple-400">20%</div>
                            <div className="text-sm text-neutral-400 mt-1">₹20</div>
                        </div>
                    </div>
                </div>

                <TipBox variant="note" title="Key Insight">
                    <div className="space-y-2 text-sm">
                        <p><strong>Markup</strong> is calculated on <span className="text-blue-400">CP</span></p>
                        <p><strong>Discount</strong> is calculated on <span className="text-amber-400">MP</span></p>
                        <p><strong>Profit/Loss</strong> is calculated on <span className="text-blue-400">CP</span></p>
                    </div>
                </TipBox>
            </ConceptSection>

            {/* BASIC FORMULAS */}
            <ConceptSection id="formulas" title="The Essential Formulas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <FormulaBox title="Profit %" variant="primary">
                        <div className="text-center">
                            <MathText className="text-xl">{`\\text{Profit \\%} = \\frac{SP - CP}{CP} \\times 100`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="Loss %" variant="primary">
                        <div className="text-center">
                            <MathText className="text-xl">{`\\text{Loss \\%} = \\frac{CP - SP}{CP} \\times 100`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="SP from Profit %">
                        <div className="text-center">
                            <MathText className="text-xl">{`SP = CP \\times \\frac{100 + P\\%}{100}`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="CP from SP">
                        <div className="text-center">
                            <MathText className="text-xl">{`CP = SP \\times \\frac{100}{100 + P\\%}`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="Discount %">
                        <div className="text-center">
                            <MathText className="text-xl">{`\\text{Discount \\%} = \\frac{MP - SP}{MP} \\times 100`}</MathText>
                        </div>
                    </FormulaBox>

                    <FormulaBox title="SP from Discount">
                        <div className="text-center">
                            <MathText className="text-xl">{`SP = MP \\times \\frac{100 - D\\%}{100}`}</MathText>
                        </div>
                    </FormulaBox>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="A pen bought for ₹80 is sold for ₹100. Find profit %."
                    solution={
                        <div className="space-y-2">
                            <p><strong>CP:</strong> ₹80, <strong>SP:</strong> ₹100</p>
                            <p><strong>Profit:</strong> 100 − 80 = ₹20</p>
                            <p><strong>Profit %:</strong> <MathText>{`\\frac{20}{80} \\times 100 = 25\\%`}</MathText></p>
                        </div>
                    }
                    answer="25%"
                />

                <CheckUnderstanding
                    question="CP = ₹200, Loss = 10%. What is the SP?"
                    options={["₹180", "₹190", "₹220", "₹170"]}
                    correctIndex={0}
                    explanation="SP = CP × (100−L%)/100 = 200 × 90/100 = ₹180"
                />
            </ConceptSection>

            {/* THE GOLDEN FORMULA */}
            <ConceptSection id="golden" title="The Golden Formula — MP to CP">
                <FormulaBox>
                    <p>
                        This single formula connects <strong>all three prices</strong> and solves most complex problems!
                    </p>
                </FormulaBox>

                <FormulaBox title="The Golden Relation" variant="secondary">
                    <div className="text-center">
                        <MathText className="text-2xl">{`\\frac{CP}{MP} = \\frac{100 - D\\%}{100 + P\\%}`}</MathText>
                        <p className="text-neutral-500 text-sm mt-3">Where D = Discount %, P = Profit %</p>
                    </div>
                </FormulaBox>

                <TipBox title="When to Use This">
                    <p className="text-sm">
                        Use this when a question gives you <strong>discount % AND profit %</strong> and asks for the ratio or relationship between prices.
                    </p>
                </TipBox>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="A shopkeeper marks 40% above CP and gives 20% discount. Find profit %."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Let CP = 100</strong></p>
                            <p><strong>Markup 40%:</strong> MP = 100 + 40 = 140</p>
                            <p><strong>Discount 20%:</strong> SP = 140 × (80/100) = 112</p>
                            <p><strong>Profit:</strong> 112 − 100 = 12</p>
                            <p><strong>Profit %:</strong> 12%</p>
                        </div>
                    }
                    answer="12%"
                />

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="After 15% discount, a shopkeeper makes 20% profit. Find CP:MP ratio."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using Golden Formula:</strong></p>
                            <p><MathText>{`\\frac{CP}{MP} = \\frac{100 - 15}{100 + 20} = \\frac{85}{120} = \\frac{17}{24}`}</MathText></p>
                            <p><strong>CP : MP = 17 : 24</strong></p>
                        </div>
                    }
                    answer="17:24"
                />

                <CheckUnderstanding
                    question="If discount is 10% and profit is 20%, what is CP:MP?"
                    options={["9:12", "3:4", "4:3", "10:12"]}
                    correctIndex={1}
                    explanation="CP/MP = (100−10)/(100+20) = 90/120 = 3/4. So CP:MP = 3:4"
                />
            </ConceptSection>

            {/* SUCCESSIVE DISCOUNT */}
            <ConceptSection id="successive" title="Successive Discounts">
                <FormulaBox title="Warning">
                    <p>
                        20% off + 10% off is <span className="text-red-400">NOT 30% off!</span>
                    </p>
                </FormulaBox>

                <p className="mb-4">
                    Each discount is applied on the <strong>REDUCED price</strong>, not the original!
                </p>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-red-400 font-bold mb-4 text-center">Visual: 20% + 10% Successive Discount</h4>
                    <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                            <p className="text-neutral-500 text-xs">Original</p>
                            <p className="text-2xl font-bold">₹100</p>
                        </div>
                        <div className="text-center">
                            <p className="text-red-400 text-xs">−20%</p>
                            <p className="text-xl">→</p>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-500 text-xs">After 1st</p>
                            <p className="text-2xl font-bold">₹80</p>
                        </div>
                        <div className="text-center">
                            <p className="text-red-400 text-xs">−10%</p>
                            <p className="text-xl">→</p>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-500 text-xs">Final</p>
                            <p className="text-2xl font-bold text-emerald-400">₹72</p>
                        </div>
                    </div>
                    <p className="text-center text-neutral-400 text-sm mt-4">
                        Effective discount = 28%, not 30%!
                    </p>
                </div>

                <FormulaBox title="Single Equivalent Discount">
                    <div className="text-center">
                        <p className="text-neutral-400 mb-2">For discounts a% and b%:</p>
                        <MathText className="text-xl">{`\\text{Effective Discount} = a + b - \\frac{ab}{100}`}</MathText>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="Find equivalent discount for successive discounts of 20% and 25%"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Formula:</strong> a + b − (ab/100)</p>
                            <p>= 20 + 25 − (20 × 25)/100</p>
                            <p>= 45 − 5 = <strong>40%</strong></p>
                        </div>
                    }
                    answer="40%"
                />

                <CheckUnderstanding
                    question="What is the single equivalent discount for 10% + 10%?"
                    options={["20%", "19%", "21%", "18%"]}
                    correctIndex={1}
                    explanation="10 + 10 − (10×10)/100 = 20 − 1 = 19%"
                />
            </ConceptSection>

            {/* FALSE WEIGHT */}
            <ConceptSection id="false-weight" title="Cheating Problems — False Weights">
                <p className="mb-4">
                    A dishonest shopkeeper uses faulty weights (gives less than promised). This is a type of <strong>hidden profit</strong>.
                </p>

                <FormulaBox title="False Weight Profit Formula">
                    <div className="text-center">
                        <MathText className="text-xl">{`\\text{Profit \\%} = \\frac{\\text{True Weight} - \\text{False Weight}}{\\text{False Weight}} \\times 100`}</MathText>
                        <p className="text-neutral-500 text-sm mt-3">Or simply: <MathText>{`\\frac{\\text{Error}}{\\text{Claimed Weight}} \\times 100`}</MathText></p>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={5}
                    difficulty="medium"
                    question="A shopkeeper uses 900g weight instead of 1kg. What is his profit %?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>True:</strong> 1000g, <strong>False:</strong> 900g</p>
                            <p><strong>Error:</strong> 100g (he's keeping this)</p>
                            <p><strong>Profit %:</strong> <MathText>{`\\frac{100}{900} \\times 100 = 11.11\\%`}</MathText></p>
                        </div>
                    }
                    answer="11.11%"
                />

                <TipBox variant="warning" title="Common Trap">
                    <p className="text-sm">
                        Don't divide by 1000 (true weight)! Divide by what the customer <strong>actually gets</strong> (900g).
                        Think: he sells 900g for the price of 1000g.
                    </p>
                </TipBox>
            </ConceptSection>

            {/* BUYING AND SELLING TOGETHER */}
            <ConceptSection id="combined" title="Combined Profit/Loss">
                <p className="mb-4">
                    When someone sells two items — one at profit, one at loss — finding net result can be tricky.
                </p>

                <FormulaBox title="Equal SP, Different Results" variant="secondary">
                    <div className="text-center">
                        <p className="text-neutral-400 mb-2">If two items are sold at SAME SP with x% profit and x% loss:</p>
                        <MathText className="text-xl">{`\\text{Net Loss \\%} = \\frac{x^2}{100}`}</MathText>
                        <p className="text-amber-400 text-sm mt-3">Always a LOSS — never profit!</p>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={6}
                    difficulty="hard"
                    question="Two articles sold at ₹1200 each — one at 20% profit, other at 20% loss. Find net P/L%."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> Net Loss = x²/100 = 20²/100 = 400/100 = 4%</p>
                            <p className="text-neutral-400 text-sm mt-2">
                                <strong>Verification:</strong><br />
                                Article 1: CP₁ = 1200 × 100/120 = 1000<br />
                                Article 2: CP₂ = 1200 × 100/80 = 1500<br />
                                Total CP = 2500, Total SP = 2400<br />
                                Loss = 100, Loss % = 100/2500 × 100 = 4%
                            </p>
                        </div>
                    }
                    answer="4% Loss"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Calculating Profit on SP
                        </h4>
                        <p className="text-sm text-neutral-400">
                            Profit % is ALWAYS on CP, not SP! "20% profit on SP" is a different formula.
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Adding Successive Discounts Directly
                        </h4>
                        <p className="text-sm text-neutral-400">
                            20% + 10% ≠ 30%! Use: a + b − ab/100 = 28%
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> Confusing MP and SP
                        </h4>
                        <p className="text-sm text-neutral-400">
                            MP is the tagged price. SP is after discount. They're only equal when discount = 0!
                        </p>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                            <CancelIcon fontSize="small" /> False Weight — Wrong Denominator
                        </h4>
                        <p className="text-sm text-neutral-400">
                            In 900g/1kg problem, profit is Error/False Weight, not Error/True Weight!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Profit & Loss Master Reference"
                    rows={[
                        { concept: 'Profit', formula: 'SP - CP' },
                        { concept: 'Profit %', formula: '\\frac{SP-CP}{CP} \\times 100' },
                        { concept: 'SP from Profit %', formula: 'CP \\times \\frac{100+P}{100}' },
                        { concept: 'CP from SP', formula: 'SP \\times \\frac{100}{100+P}' },
                        { concept: 'Discount %', formula: '\\frac{MP-SP}{MP} \\times 100' },
                        { concept: 'Golden Formula', formula: '\\frac{CP}{MP} = \\frac{100-D}{100+P}' },
                        { concept: 'Successive Discount', formula: 'a + b - \\frac{ab}{100}' },
                        { concept: 'False Weight Profit', formula: '\\frac{\\text{Error}}{\\text{False Wt}} \\times 100' },
                        { concept: 'Equal SP, ±x%', formula: '\\text{Loss} = \\frac{x^2}{100}\\%' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
