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
import {
    AccountBalanceIcon,
    ScienceIcon,
    ExploreIcon,
    RestaurantIcon,
    PieChartIcon,
    CancelIcon,
    CheckIcon,
    WarningIcon,
    LightbulbIcon,
    MenuBookIcon,
    ArrowForwardIcon,
    TrendingDownIcon,
    TrendingUpIcon
} from '@/components/icons';

export default function RatioProportionContent() {
    return (
        <>
            <ConceptSection id="why" title="Why Ratios are Your Best Friend">
        <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-xl border-l-4 border-amber-500 mb-6">
            <p className="text-lg">
                <strong>Imagine:</strong> You and your friend bought a gift together. You paid ₹300 and your friend paid ₹200.
                Now you sell it for ₹600 profit. How do you split fairly?
                <span className="text-amber-400"> Ratio is the answer: 3:2!</span>
            </p>
        </div>

        <p className="mb-4">
            Ratio helps you <strong>compare</strong> and <strong>share</strong> things fairly — money, work, mixture, time, distance, and much more!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
            {[
                { icon: <AccountBalanceIcon className="text-amber-400" fontSize="large" />, title: 'Partnership', desc: 'Profit sharing' },
                { icon: <ScienceIcon className="text-amber-400" fontSize="large" />, title: 'Mixtures', desc: 'Alligation problems' },
                { icon: <ExploreIcon className="text-amber-400" fontSize="large" />, title: 'Maps', desc: 'Scale conversions' },
                { icon: <RestaurantIcon className="text-amber-400" fontSize="large" />, title: 'Recipes', desc: 'Ingredient scaling' },
            ].map((item, i) => (
                <div key={i} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-amber-500/50 transition-all">
                    <div className="mb-2 flex justify-center">{item.icon}</div>
                    <h4 className="text-amber-400 font-bold">{item.title}</h4>
                    <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
            ))}
        </div>
    </ConceptSection>

    {/* WHAT IS RATIO */ }
    <ConceptSection id="intro" title="What is a Ratio? — The Pizza Analogy">
        <p className="mb-4">
            A ratio is NOT division — it's a way to say <strong>"how many times one thing fits into another"</strong>.
        </p>

        {/* Pizza visual */}
        <div className="bg-neutral-900 rounded-xl p-6 my-8 border border-neutral-800">
            <h4 className="text-amber-400 font-bold text-center mb-4 flex items-center justify-center gap-2">
                <PieChartIcon /> The Pizza Analogy
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Pizza visualization */}
                <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full bg-amber-900/30 border-4 border-amber-700">
                        {/* Show 5 slices - 3 for A, 2 for B */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`absolute top-1/2 left-1/2 w-[2px] h-24 origin-top ${i < 3 ? 'bg-teal-500' : 'bg-amber-500'}`}
                                style={{ transform: `rotate(${i * 72}deg)` }}
                            />
                        ))}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-teal-500/30 rounded text-xs text-teal-400">A: 3</div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-amber-500/30 rounded text-xs text-amber-400">B: 2</div>
                </div>

                <div className="space-y-3">
                    <p className="text-neutral-300">
                        If A and B share a pizza in ratio <strong className="text-white">3:2</strong>:
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                            <span>A gets <strong>3 parts</strong> (3 slices out of 5)</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                            <span>B gets <strong>2 parts</strong> (2 slices out of 5)</span>
                        </li>
                    </ul>
                    <p className="text-neutral-400 text-sm mt-2">
                        Total parts = 3 + 2 = <strong className="text-white">5</strong>
                    </p>
                </div>
            </div>
        </div>

        <FormulaBox title="The Ratio to Fraction Rule">
            <div className="text-center space-y-2">
                <p className="text-neutral-400">If A:B = 3:2, then:</p>
                <div className="flex justify-center gap-8">
                    <div>
                        <p className="text-teal-400">A's share</p>
                        <MathText>{`= \\frac{3}{3+2} = \\frac{3}{5}`}</MathText>
                    </div>
                    <div>
                        <p className="text-amber-400">B's share</p>
                        <MathText>{`= \\frac{2}{3+2} = \\frac{2}{5}`}</MathText>
                    </div>
                </div>
            </div>
        </FormulaBox>

        <ExampleCard
            number={1}
            difficulty="easy"
            question="₹500 is divided between A and B in ratio 3:2. How much does A get?"
            solution={
                <div className="space-y-2">
                    <p><strong>Total parts:</strong> 3 + 2 = 5</p>
                    <p><strong>A's share:</strong> <MathText>{`\\frac{3}{5} \\times 500 = \\frac{1500}{5} = 300`}</MathText></p>
                </div>
            }
            answer="₹300"
        />

        <CheckUnderstanding
            question="If ₹800 is divided in ratio 5:3, how much does the smaller share get?"
            options={["₹500", "₹300", "₹400", "₹200"]}
            correctIndex={1}
            explanation="Total = 5+3 = 8 parts. Smaller share (3 parts) = (3/8) × 800 = ₹300"
        />
    </ConceptSection>

    {/* TYPES OF RATIOS */ }
    <ConceptSection id="types" title="Types of Ratios">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-amber-500/50 transition-all">
                <h4 className="text-amber-400 font-bold mb-3">📈 Compounded Ratio</h4>
                <p className="text-sm text-neutral-400 mb-3">Multiply the ratios together</p>
                <div className="bg-black/50 p-3 rounded-lg">
                    <p className="text-sm">If ratios are a:b and c:d</p>
                    <p className="text-white font-mono mt-1">Compounded = ac : bd</p>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Example: 2:3 and 4:5 → 8:15</p>
            </div>

            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-amber-500/50 transition-all">
                <h4 className="text-amber-400 font-bold mb-3">🔄 Duplicate Ratio</h4>
                <p className="text-sm text-neutral-400 mb-3">Square of the ratio</p>
                <div className="bg-black/50 p-3 rounded-lg">
                    <p className="text-sm">If ratio is a:b</p>
                    <p className="text-white font-mono mt-1">Duplicate = a² : b²</p>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Example: 3:4 → 9:16</p>
            </div>

            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-rose-500/50 transition-all">
                <h4 className="text-rose-400 font-bold mb-3">📉 Sub-duplicate Ratio</h4>
                <p className="text-sm text-neutral-400 mb-3">Square root of the ratio</p>
                <div className="bg-black/50 p-3 rounded-lg">
                    <p className="text-sm">If ratio is a:b</p>
                    <p className="text-white font-mono mt-1">Sub-duplicate = √a : √b</p>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Example: 16:25 → 4:5</p>
            </div>

            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-purple-500/50 transition-all">
                <h4 className="text-purple-400 font-bold mb-3">🔀 Triplicate Ratio</h4>
                <p className="text-sm text-neutral-400 mb-3">Cube of the ratio</p>
                <div className="bg-black/50 p-3 rounded-lg">
                    <p className="text-sm">If ratio is a:b</p>
                    <p className="text-white font-mono mt-1">Triplicate = a³ : b³</p>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Example: 2:3 → 8:27</p>
            </div>
        </div>
    </ConceptSection>

    {/* COMBINING RATIOS */ }
    <ConceptSection id="combining" title="Combining Ratios — The Chain Method">
        <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-xl border-l-4 border-amber-500 mb-6">
            <p className="text-lg">
                <strong>The Problem:</strong> You know A:B and B:C separately. How do you find A:B:C?
            </p>
        </div>

        {/* Visual step-by-step */}
        <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
            <h4 className="text-amber-400 font-bold text-center mb-6">The Step-by-Step Method</h4>

            <div className="space-y-6">
                {/* Step 1 */}
                <div className="p-4 bg-black/50 rounded-lg">
                    <div className="text-sm text-neutral-500 mb-2">GIVEN:</div>
                    <div className="flex gap-8 justify-center">
                        <div className="text-center">
                            <p className="text-white font-mono text-lg">A : B = 2 : 3</p>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-mono text-lg">B : C = 4 : 5</p>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-black/50 rounded-lg border border-rose-500/30">
                    <div className="text-sm text-rose-400 mb-2">STEP 1: Make B common</div>
                    <p className="text-neutral-400 text-sm mb-2">B is 3 in first ratio and 4 in second. Find LCM(3,4) = 12</p>
                    <div className="flex gap-8 justify-center">
                        <div className="text-center">
                            <p className="text-neutral-500 text-sm">Multiply by 4</p>
                            <p className="text-white font-mono text-lg">A : B = 8 : <span className="text-rose-400">12</span></p>
                        </div>
                        <div className="text-center">
                            <p className="text-neutral-500 text-sm">Multiply by 3</p>
                            <p className="text-white font-mono text-lg">B : C = <span className="text-rose-400">12</span> : 15</p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <div className="text-sm text-emerald-400 mb-2">STEP 2: Combine!</div>
                    <p className="text-center text-2xl font-bold text-white">A : B : C = 8 : 12 : 15</p>
                </div>
            </div>
        </div>

        <TipBox variant="note" title="Quick Trick — The Zig-Zag Method">
            <div className="font-mono text-center my-4">
                <div className="grid grid-cols-3 gap-4 mb-2 text-sm opacity-50">
                    <div>A</div><div>B</div><div>C</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="text-white">2</div>
                    <div className="text-rose-400">3 ↘</div>
                    <div className="text-neutral-600">×</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="text-neutral-600">×</div>
                    <div className="text-rose-400">↙ 4</div>
                    <div className="text-white">5</div>
                </div>
                <p className="text-sm text-neutral-400 mt-4">Multiply diagonally: A = 2×4 = 8, B = 3×4 = 12, C = 3×5 = 15</p>
            </div>
        </TipBox>

        <ExampleCard
            number={2}
            difficulty="medium"
            question="If A:B = 3:4 and B:C = 2:5, find A:B:C"
            solution={
                <div className="space-y-2">
                    <p><strong>Make B common:</strong> LCM(4, 2) = 4</p>
                    <p>A:B = 3:4 (keep as is)</p>
                    <p>B:C = 2:5 → multiply by 2 → 4:10</p>
                    <p><strong>Combine:</strong> A:B:C = 3:4:10</p>
                </div>
            }
            answer="3:4:10"
        />

        <CheckUnderstanding
            question="If A:B = 1:2 and B:C = 3:4, find A:B:C"
            options={["1:2:4", "3:6:8", "1:6:8", "3:2:4"]}
            correctIndex={1}
            explanation="B in first = 2, B in second = 3. LCM = 6. First becomes 3:6, second becomes 6:8. Answer: 3:6:8"
        />
    </ConceptSection>

    {/* PROPORTION */ }
    <ConceptSection id="proportion" title="Proportion — When Ratios are Equal">
        <p className="mb-4">
            <strong>Proportion</strong> means two ratios are equal. It's written as A:B :: C:D
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
            <div>
                <FormulaBox title="The Cross Multiplication Rule">
                    <div className="text-center">
                        <MathText className="text-xl">{`\\frac{A}{B} = \\frac{C}{D}`}</MathText>
                        <p className="text-neutral-500 my-2">implies</p>
                        <MathText className="text-2xl text-amber-400">{`A \\times D = B \\times C`}</MathText>
                    </div>
                </FormulaBox>
            </div>

            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                <h4 className="text-amber-400 font-bold mb-3">The Terminology</h4>
                <div className="space-y-2 text-sm">
                    <p>In A : B :: C : D</p>
                    <ul className="list-disc list-inside text-neutral-400 space-y-1">
                        <li>A and D are <strong className="text-white">Extremes</strong></li>
                        <li>B and C are <strong className="text-white">Means</strong></li>
                    </ul>
                    <p className="text-emerald-400 mt-3">Product of Extremes = Product of Means</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="p-4 bg-neutral-900 rounded-xl border border-teal-500/30">
                <h4 className="text-teal-400 font-bold mb-2">Mean Proportional</h4>
                <p className="text-sm text-neutral-400 mb-2">Find x if A:x = x:B</p>
                <MathText>{`x = \\sqrt{A \\times B}`}</MathText>
            </div>
            <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/30">
                <h4 className="text-amber-400 font-bold mb-2">Third Proportional</h4>
                <p className="text-sm text-neutral-400 mb-2">Find x if A:B = B:x</p>
                <MathText>{`x = \\frac{B^2}{A}`}</MathText>
            </div>
            <div className="p-4 bg-neutral-900 rounded-xl border border-rose-500/30">
                <h4 className="text-rose-400 font-bold mb-2">Fourth Proportional</h4>
                <p className="text-sm text-neutral-400 mb-2">Find x if A:B = C:x</p>
                <MathText>{`x = \\frac{B \\times C}{A}`}</MathText>
            </div>
        </div>

        <ExampleCard
            number={3}
            difficulty="medium"
            question="Find the mean proportional of 8 and 18"
            solution={
                <div className="space-y-2">
                    <p><strong>Formula:</strong> Mean Proportional = √(A × B)</p>
                    <p><MathText>{`= \\sqrt{8 \\times 18} = \\sqrt{144} = 12`}</MathText></p>
                </div>
            }
            answer="12"
        />

        <CheckUnderstanding
            question="Find the third proportional to 4 and 12"
            options={["24", "36", "48", "16"]}
            correctIndex={1}
            explanation="Third proportional = B²/A = 12²/4 = 144/4 = 36"
        />
    </ConceptSection>

    {/* COMPONENDO AND DIVIDENDO */ }
    <ConceptSection id="componendo" title="Componendo-Dividendo — The Advanced Trick">
        <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-xl border-l-4 border-purple-500 mb-6">
            <p className="text-lg">
                This powerful technique solves complex ratio problems in ONE step!
            </p>
        </div>

        <FormulaBox title="The Master Formula" variant="secondary">
            <div className="text-center space-y-4">
                <p className="text-neutral-400">If <MathText>{`\\frac{a}{b} = \\frac{c}{d}`}</MathText>, then:</p>
                <MathText className="text-2xl">{`\\frac{a + b}{a - b} = \\frac{c + d}{c - d}`}</MathText>
            </div>
        </FormulaBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                <h4 className="text-purple-400 font-bold mb-2">Componendo Only</h4>
                <MathText>{`\\frac{a}{b} = \\frac{c}{d} \\Rightarrow \\frac{a+b}{b} = \\frac{c+d}{d}`}</MathText>
                <p className="text-xs text-neutral-500 mt-2">Add numerator to denominator</p>
            </div>
            <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                <h4 className="text-rose-400 font-bold mb-2">Dividendo Only</h4>
                <MathText>{`\\frac{a}{b} = \\frac{c}{d} \\Rightarrow \\frac{a-b}{b} = \\frac{c-d}{d}`}</MathText>
                <p className="text-xs text-neutral-500 mt-2">Subtract denominator from numerator</p>
            </div>
        </div>

        <ExampleCard
            number={4}
            difficulty="hard"
            question="If (x+y)/(x-y) = 5/3, find x:y"
            solution={
                <div className="space-y-2">
                    <p><strong>Apply Componendo-Dividendo in reverse:</strong></p>
                    <p>Let a = x+y, b = x-y, then a/b = 5/3</p>
                    <p><MathText>{`\\frac{a+b}{a-b} = \\frac{5+3}{5-3} = \\frac{8}{2} = 4`}</MathText></p>
                    <p>But a+b = 2x and a-b = 2y</p>
                    <p>So 2x/2y = 4 → x/y = 4:1</p>
                </div>
            }
            answer="x:y = 4:1"
        />
    </ConceptSection>

    {/* VARIATIONS */ }
    <ConceptSection id="variations" title="Direct & Inverse Proportion">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-5 bg-neutral-900 rounded-xl border border-emerald-500/30">
                <h4 className="text-emerald-400 font-bold mb-3">📈 Direct Proportion</h4>
                <p className="text-sm text-neutral-400 mb-3">When one increases, other also increases</p>
                <div className="bg-black/50 p-3 rounded-lg">
                    <MathText>{`\\frac{A_1}{A_2} = \\frac{B_1}{B_2}`}</MathText>
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                    <strong>Example:</strong> More workers = More work done
                </p>
            </div>

            <div className="p-5 bg-neutral-900 rounded-xl border border-red-500/30">
                <h4 className="text-red-400 font-bold mb-3">📉 Inverse Proportion</h4>
                <p className="text-sm text-neutral-400 mb-3">When one increases, other decreases</p>
                <div className="bg-black/50 p-3 rounded-lg">
                    <MathText>{`A_1 \\times B_1 = A_2 \\times B_2`}</MathText>
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                    <strong>Example:</strong> More workers = Less time needed
                </p>
            </div>
        </div>

        <ExampleCard
            number={5}
            difficulty="medium"
            question="If 5 workers can do a job in 12 days, how many days will 4 workers take?"
            solution={
                <div className="space-y-2">
                    <p><strong>Type:</strong> Inverse proportion (more workers = less time)</p>
                    <p><strong>Formula:</strong> W₁ × D₁ = W₂ × D₂</p>
                    <p>5 × 12 = 4 × D₂</p>
                    <p>D₂ = 60/4 = 15 days</p>
                </div>
            }
            answer="15 days"
        />

        <CheckUnderstanding
            question="If 8 pipes can fill a tank in 6 hours, how many pipes are needed to fill it in 4 hours?"
            options={["10", "12", "16", "14"]}
            correctIndex={1}
            explanation="Inverse proportion: 8 × 6 = x × 4 → x = 48/4 = 12 pipes"
        />
    </ConceptSection>

    {/* COMMON MISTAKES */ }
    <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
        <div className="space-y-4 my-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Confusing Ratio with Fraction</h4>
                <p className="text-sm text-neutral-400 mt-1">
                    A:B = 3:2 means A is 3/5 of total, NOT 3/2 of total!
                </p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Adding Ratios Directly</h4>
                <p className="text-sm text-neutral-400 mt-1">
                    If A:B = 2:3 and B:C = 3:4, A:B:C is NOT 2:3:4!
                    You need to make B common first.
                </p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Wrong Proportionality Type</h4>
                <p className="text-sm text-neutral-400 mt-1">
                    Always ask: "If X increases, does Y increase or decrease?"
                    This tells you if it's direct or inverse!
                </p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <h4 className="text-red-400 font-bold flex items-center gap-2"><CancelIcon className="text-red-400" /> Ignoring the "k" Factor</h4>
                <p className="text-sm text-neutral-400 mt-1">
                    If A:B = 3:5, the actual values are 3k and 5k for some k.
                    Don't assume A=3 and B=5!
                </p>
            </div>
        </div>
    </ConceptSection>

    {/* CHEAT SHEET */ }
    <ConceptSection id="summary" title="Cheat Sheet">
        <CheatSheet
            title="Ratio & Proportion Master Reference"
            rows={[
                { concept: 'A:B = 3:2 means', formula: 'A = \\frac{3}{5}, B = \\frac{2}{5} \\text{ of total}' },
                { concept: 'Combining A:B and B:C', formula: '\\text{Make B common using LCM}' },
                { concept: 'Mean Proportional', formula: '\\sqrt{A \\times B}' },
                { concept: 'Third Proportional of a,b', formula: '\\frac{b^2}{a}' },
                { concept: 'Fourth Proportional of a,b,c', formula: '\\frac{b \\times c}{a}' },
                { concept: 'Duplicate Ratio', formula: 'a^2 : b^2' },
                { concept: 'Sub-duplicate Ratio', formula: '\\sqrt{a} : \\sqrt{b}' },
                { concept: 'Direct Proportion', formula: '\\frac{A_1}{A_2} = \\frac{B_1}{B_2}' },
                { concept: 'Inverse Proportion', formula: 'A_1 \\times B_1 = A_2 \\times B_2' },
                { concept: 'Componendo-Dividendo', formula: '\\frac{a+b}{a-b} = \\frac{c+d}{c-d}' },
            ]}
        />
    </ConceptSection>
        </>
    );
}
