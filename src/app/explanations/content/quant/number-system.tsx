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

export default function NumberSystemContent() {
    return (
        <LessonLayout>
            {/* HERO SECTION */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-neutral-900 to-black" />

                {/* Animated numbers background */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-4xl font-bold text-indigo-500/10 animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            {Math.floor(Math.random() * 10)}
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[8rem] font-black text-indigo-500/20 select-none animate-bounce" style={{ animationDuration: '3s' }}>
                        123
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2 border border-indigo-500/20">
                        Phase 01: The Foundation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Number System</h1>
                    <p className="text-neutral-400 text-lg">The building blocks of all mathematics — master these, master everything.</p>
                </div>
            </div>

            {/* WHY THIS MATTERS */}
            <ConceptSection id="why" title="Why Numbers Matter" icon="🌟">
                <div className="bg-gradient-to-r from-indigo-900/20 to-transparent p-6 rounded-xl border-l-4 border-indigo-500 mb-6">
                    <p className="text-lg">
                        <strong>Imagine this:</strong> You're at a shop buying 3 chocolates worth ₹27 each.
                        The shopkeeper says "That's ₹82." Without number sense, you'd just pay.
                        <span className="text-indigo-400"> But YOU will know instantly: 27 × 3 = 81, not 82!</span>
                    </p>
                </div>

                <p>
                    Numbers are everywhere — your phone number, your age, prices, distances, time. In SSC CGL,
                    <strong> 8-10 questions directly test number concepts</strong>, and almost ALL questions use numbers somehow.
                </p>

                <div className="mt-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-indigo-400 font-bold mb-2">🎯 What You'll Learn</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-300">
                        <li>✓ Types of numbers (Natural, Whole, Integers...)</li>
                        <li>✓ Divisibility rules (check div by 3, 7, 11 instantly)</li>
                        <li>✓ Finding unit digits (last digit of big powers)</li>
                        <li>✓ Remainders and division tricks</li>
                        <li>✓ Prime numbers and factorization</li>
                        <li>✓ LCM & HCF shortcuts</li>
                    </ul>
                </div>
            </ConceptSection>

            {/* TYPES OF NUMBERS */}
            <ConceptSection id="types" title="The Number Family Tree" icon="🌳">
                <p className="mb-6">
                    Think of numbers like a family. Each generation adds new members:
                </p>

                {/* Animated family tree visualization */}
                <div className="relative my-8 p-6 bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

                    <div className="space-y-6">
                        {/* Natural Numbers */}
                        <div className="relative pl-8 py-4 border-l-2 border-emerald-500 hover:bg-emerald-500/5 transition-colors rounded-r-xl">
                            <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">1</div>
                            <h4 className="text-emerald-400 font-bold text-lg">Natural Numbers (N)</h4>
                            <p className="text-neutral-400 text-sm mb-2">The counting numbers you learned as a baby</p>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <span key={n} className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-mono animate-pulse" style={{ animationDelay: `${n * 0.1}s` }}>
                                        {n}
                                    </span>
                                ))}
                                <span className="px-3 py-1 text-neutral-500">... ∞</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 italic">"One apple, two apples, three apples..."</p>
                        </div>

                        {/* Whole Numbers */}
                        <div className="relative pl-8 py-4 border-l-2 border-blue-500 hover:bg-blue-500/5 transition-colors rounded-r-xl">
                            <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">2</div>
                            <h4 className="text-blue-400 font-bold text-lg">Whole Numbers (W)</h4>
                            <p className="text-neutral-400 text-sm mb-2">Natural numbers + zero (when you have nothing)</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-500/30 rounded-full text-blue-300 text-sm font-mono border border-blue-500">0</span>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <span key={n} className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm font-mono">
                                        {n}
                                    </span>
                                ))}
                                <span className="px-3 py-1 text-neutral-500">... ∞</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 italic">"I have zero chocolates left 😢"</p>
                        </div>

                        {/* Integers */}
                        <div className="relative pl-8 py-4 border-l-2 border-purple-500 hover:bg-purple-500/5 transition-colors rounded-r-xl">
                            <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">3</div>
                            <h4 className="text-purple-400 font-bold text-lg">Integers (Z)</h4>
                            <p className="text-neutral-400 text-sm mb-2">Whole numbers + negative numbers (for debt, temperature below zero)</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 text-neutral-500">-∞ ...</span>
                                {[-3, -2, -1, 0, 1, 2, 3].map(n => (
                                    <span key={n} className={`px-3 py-1 rounded-full text-sm font-mono ${n < 0 ? 'bg-red-500/20 text-red-400' : n === 0 ? 'bg-purple-500/30 text-purple-300 border border-purple-500' : 'bg-purple-500/20 text-purple-400'}`}>
                                        {n > 0 ? `+${n}` : n}
                                    </span>
                                ))}
                                <span className="px-3 py-1 text-neutral-500">... +∞</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 italic">"It's -5°C outside!" or "I owe ₹100 (-100)"</p>
                        </div>

                        {/* Rational Numbers */}
                        <div className="relative pl-8 py-4 border-l-2 border-amber-500 hover:bg-amber-500/5 transition-colors rounded-r-xl">
                            <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white">4</div>
                            <h4 className="text-amber-400 font-bold text-lg">Rational Numbers (Q)</h4>
                            <p className="text-neutral-400 text-sm mb-2">Any number that can be written as a fraction p/q (q ≠ 0)</p>
                            <div className="flex flex-wrap gap-3">
                                {['1/2', '3/4', '-2/3', '0.5', '0.333...', '7'].map((n, i) => (
                                    <span key={i} className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-400 text-sm font-mono">
                                        {n}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 italic">"Half a pizza = 1/2 = 0.5"</p>
                        </div>

                        {/* Irrational Numbers */}
                        <div className="relative pl-8 py-4 border-l-2 border-rose-500 hover:bg-rose-500/5 transition-colors rounded-r-xl">
                            <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-xs font-bold text-white">5</div>
                            <h4 className="text-rose-400 font-bold text-lg">Irrational Numbers</h4>
                            <p className="text-neutral-400 text-sm mb-2">Numbers that CANNOT be written as simple fractions (infinite non-repeating decimals)</p>
                            <div className="flex flex-wrap gap-3">
                                {['√2', '√3', 'π', 'e'].map((n, i) => (
                                    <span key={i} className="px-3 py-1 bg-rose-500/20 rounded-full text-rose-400 text-sm font-mono">
                                        {n}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">
                                <span className="font-mono">√2 = 1.41421356...</span> (goes on forever, never repeats!)
                            </p>
                        </div>
                    </div>
                </div>

                <TipBox variant="note" title="The Big Picture">
                    <div className="text-sm">
                        <p className="mb-2"><strong>Natural ⊂ Whole ⊂ Integers ⊂ Rational ⊂ Real Numbers</strong></p>
                        <p>Each set contains all the numbers from the previous sets, plus new ones!</p>
                    </div>
                </TipBox>

                <CheckUnderstanding
                    question="Which of the following is NOT a rational number?"
                    options={["0.75", "√4", "√5", "-3/7"]}
                    correctIndex={2}
                    explanation="√5 = 2.2360679... (infinite, non-repeating). It cannot be written as p/q. But √4 = 2, which IS rational!"
                />
            </ConceptSection>

            {/* DIVISIBILITY RULES */}
            <ConceptSection id="divisibility" title="Divisibility Rules — Your Superpowers" icon="⚡">
                <p className="mb-4">
                    Imagine you're in an exam. You see <strong>7284</strong>. Is it divisible by 4? By 9? By 11?
                    You can't use a calculator. But with these rules, <span className="text-indigo-400">you'll know in SECONDS!</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
                    {/* Div by 2 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-emerald-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">2</div>
                            <h4 className="text-emerald-400 font-bold">Divisible by 2</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Last digit is <strong className="text-white">even</strong> (0, 2, 4, 6, 8)</p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">1234 ✓</span>
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">1235 ✗</span>
                        </div>
                    </div>

                    {/* Div by 3 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">3</div>
                            <h4 className="text-blue-400 font-bold">Divisible by 3</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Sum of digits divisible by 3</p>
                        <div className="text-xs space-y-1">
                            <p><span className="text-white">123</span> → 1+2+3 = 6 (÷3 ✓)</p>
                            <p><span className="text-white">124</span> → 1+2+4 = 7 (÷3 ✗)</p>
                        </div>
                    </div>

                    {/* Div by 4 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg">4</div>
                            <h4 className="text-purple-400 font-bold">Divisible by 4</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Last <strong className="text-white">2 digits</strong> divisible by 4</p>
                        <div className="text-xs space-y-1">
                            <p><span className="text-white">7316</span> → 16 ÷ 4 = 4 ✓</p>
                            <p><span className="text-white">7318</span> → 18 ÷ 4 = 4.5 ✗</p>
                        </div>
                    </div>

                    {/* Div by 5 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-amber-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg">5</div>
                            <h4 className="text-amber-400 font-bold">Divisible by 5</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Last digit is <strong className="text-white">0 or 5</strong></p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">145 ✓</span>
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">280 ✓</span>
                        </div>
                    </div>

                    {/* Div by 6 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-pink-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-lg">6</div>
                            <h4 className="text-pink-400 font-bold">Divisible by 6</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Divisible by <strong className="text-white">BOTH 2 AND 3</strong></p>
                        <div className="text-xs">
                            <p><span className="text-white">126</span> → Even ✓ AND 1+2+6=9 (÷3) ✓</p>
                        </div>
                    </div>

                    {/* Div by 8 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-cyan-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">8</div>
                            <h4 className="text-cyan-400 font-bold">Divisible by 8</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Last <strong className="text-white">3 digits</strong> divisible by 8</p>
                        <div className="text-xs space-y-1">
                            <p><span className="text-white">7120</span> → 120 ÷ 8 = 15 ✓</p>
                            <p><span className="text-white">7124</span> → 124 ÷ 8 = 15.5 ✗</p>
                        </div>
                    </div>

                    {/* Div by 9 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-orange-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-lg">9</div>
                            <h4 className="text-orange-400 font-bold">Divisible by 9</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Sum of digits divisible by <strong className="text-white">9</strong></p>
                        <div className="text-xs space-y-1">
                            <p><span className="text-white">729</span> → 7+2+9 = 18 (÷9 ✓)</p>
                            <p><span className="text-white">724</span> → 7+2+4 = 13 (÷9 ✗)</p>
                        </div>
                    </div>

                    {/* Div by 10 */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-lime-500/50 transition-all hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-lime-500/20 flex items-center justify-center text-lime-400 font-bold text-lg">10</div>
                            <h4 className="text-lime-400 font-bold">Divisible by 10</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">Last digit is <strong className="text-white">0</strong></p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-lime-500/20 text-lime-400 text-xs rounded">1230 ✓</span>
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">1235 ✗</span>
                        </div>
                    </div>

                    {/* Div by 11 - IMPORTANT */}
                    <div className="group p-5 bg-neutral-900 rounded-xl border border-indigo-500/50 hover:border-indigo-500 transition-all hover:transform hover:scale-105 relative overflow-hidden">
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500 text-xs text-white rounded font-bold">SSC FAVORITE</div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">11</div>
                            <h4 className="text-indigo-400 font-bold">Divisible by 11</h4>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">(Sum of odd positions) − (Sum of even positions) = 0 or 11</p>
                        <div className="text-xs space-y-2 font-mono">
                            <p><span className="text-white">1 2 1 → (1+1) - (2) = 0 ✓</span></p>
                            <p className="text-neutral-500">Positions: 1st, 2nd, 3rd</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={1}
                    difficulty="medium"
                    question="Is 918720 divisible by 6?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>For divisibility by 6:</strong> Must be divisible by BOTH 2 AND 3</p>
                            <p><strong>Check div by 2:</strong> Last digit = 0 (even) ✓</p>
                            <p><strong>Check div by 3:</strong> Sum = 9+1+8+7+2+0 = 27, and 27÷3 = 9 ✓</p>
                            <p className="text-emerald-400">Both conditions satisfied → <strong>YES!</strong></p>
                        </div>
                    }
                    answer="Yes"
                />

                <ExampleCard
                    number={2}
                    difficulty="hard"
                    question="Find the value of * if 7*5462 is divisible by 11."
                    solution={
                        <div className="space-y-2">
                            <p><strong>Number:</strong> 7 * 5 4 6 2</p>
                            <p><strong>Odd positions (1st, 3rd, 5th):</strong> 7 + 5 + 6 = 18</p>
                            <p><strong>Even positions (2nd, 4th, 6th):</strong> * + 4 + 2 = * + 6</p>
                            <p><strong>Difference:</strong> 18 − (* + 6) = 12 − *</p>
                            <p>For div by 11: 12 − * = 0 or 11</p>
                            <p>If 12 − * = 0 → * = 12 (not a single digit ✗)</p>
                            <p>If 12 − * = 11 → * = 1 ✓</p>
                        </div>
                    }
                    answer="* = 1"
                />

                <CheckUnderstanding
                    question="Which of the following is divisible by 8?"
                    options={["73216", "73218", "73214", "73212"]}
                    correctIndex={0}
                    explanation="Check last 3 digits: 216 ÷ 8 = 27. So 73216 is divisible by 8!"
                />
            </ConceptSection>

            {/* UNIT DIGIT - CYCLICITY */}
            <ConceptSection id="unit-digit" title="The Magic of Unit Digits" icon="🔮">
                <p className="mb-4">
                    What's the last digit of <MathText>{`7^{92}`}</MathText>? It looks impossible, but there's a beautiful pattern!
                </p>

                <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-xl border-l-4 border-purple-500 mb-8">
                    <h4 className="text-purple-400 font-bold mb-2">🔑 The Key Insight</h4>
                    <p>
                        When you multiply numbers, the <strong>unit digit of the result</strong> only depends on the
                        <strong> unit digits of the numbers being multiplied!</strong>
                    </p>
                    <p className="mt-2 text-neutral-400 text-sm">
                        7 × 7 = 49 (unit digit 9) <br />
                        17 × 27 = 459 (unit digit 9) — same!
                    </p>
                </div>

                {/* Cyclicity table */}
                <div className="my-8">
                    <h4 className="text-lg font-bold text-white mb-4 text-center">🔄 The Cyclicity Pattern</h4>
                    <p className="text-center text-neutral-400 mb-6">Unit digits repeat in cycles. Memorize these!</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Cycle of 2 */}
                        <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-emerald-500/50 transition-colors">
                            <div className="text-emerald-400 font-bold text-center mb-2">Cycle = 4</div>
                            <div className="space-y-1 text-sm text-center">
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">2¹</span>
                                    <span className="text-white font-mono">2</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">2²</span>
                                    <span className="text-white font-mono">4</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">2³</span>
                                    <span className="text-white font-mono">8</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">2⁴</span>
                                    <span className="text-white font-mono">6</span>
                                </div>
                                <div className="flex justify-between px-4 text-emerald-400">
                                    <span>2⁵</span>
                                    <span className="font-mono">2 ↺</span>
                                </div>
                            </div>
                        </div>

                        {/* Cycle of 3 */}
                        <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-blue-500/50 transition-colors">
                            <div className="text-blue-400 font-bold text-center mb-2">Cycle = 4</div>
                            <div className="space-y-1 text-sm text-center">
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">3¹</span>
                                    <span className="text-white font-mono">3</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">3²</span>
                                    <span className="text-white font-mono">9</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">3³</span>
                                    <span className="text-white font-mono">7</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">3⁴</span>
                                    <span className="text-white font-mono">1</span>
                                </div>
                                <div className="flex justify-between px-4 text-blue-400">
                                    <span>3⁵</span>
                                    <span className="font-mono">3 ↺</span>
                                </div>
                            </div>
                        </div>

                        {/* Cycle of 7 */}
                        <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-purple-500/50 transition-colors">
                            <div className="text-purple-400 font-bold text-center mb-2">Cycle = 4</div>
                            <div className="space-y-1 text-sm text-center">
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">7¹</span>
                                    <span className="text-white font-mono">7</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">7²</span>
                                    <span className="text-white font-mono">9</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">7³</span>
                                    <span className="text-white font-mono">3</span>
                                </div>
                                <div className="flex justify-between px-4">
                                    <span className="text-neutral-500">7⁴</span>
                                    <span className="text-white font-mono">1</span>
                                </div>
                                <div className="flex justify-between px-4 text-purple-400">
                                    <span>7⁵</span>
                                    <span className="font-mono">7 ↺</span>
                                </div>
                            </div>
                        </div>

                        {/* Special: 0, 1, 5, 6 */}
                        <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/50 transition-colors col-span-2">
                            <div className="text-amber-400 font-bold text-center mb-2">🌟 SPECIAL: Cycle = 1</div>
                            <p className="text-neutral-400 text-sm text-center mb-3">These digits NEVER change!</p>
                            <div className="flex justify-center gap-4">
                                {[0, 1, 5, 6].map(n => (
                                    <div key={n} className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl font-bold text-amber-400 mb-1">{n}</div>
                                        <span className="text-xs text-neutral-500">{n}^any = {n}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <FormulaBox title="The Universal Method" variant="secondary">
                    <div className="space-y-2">
                        <p>To find unit digit of <MathText>{`a^n`}</MathText>:</p>
                        <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1">
                            <li>Find cycle length (usually 4 for 2, 3, 7, 8)</li>
                            <li>Divide power by cycle: n ÷ cycle = remainder</li>
                            <li>The answer is: <MathText>{`(\\text{unit digit of } a)^{\\text{remainder}}`}</MathText></li>
                            <li>If remainder is 0, use <MathText>{`a^{\\text{cycle}}`}</MathText></li>
                        </ol>
                    </div>
                </FormulaBox>

                <ExampleCard
                    number={3}
                    difficulty="hard"
                    question="Find the unit digit of 7⁹²"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Step 1:</strong> Unit digit of base = 7, Cycle = 4</p>
                            <p><strong>Step 2:</strong> 92 ÷ 4 = 23 remainder <strong>0</strong></p>
                            <p><strong>Step 3:</strong> Remainder 0 means use 7⁴</p>
                            <p><strong>Step 4:</strong> From cycle, 7⁴ ends in <MathText>{`1`}</MathText></p>
                            <p className="text-purple-400 mt-2"><strong>Unit digit = 1</strong></p>
                        </div>
                    }
                    answer="1"
                />

                <CheckUnderstanding
                    question="What is the unit digit of 3⁹⁹?"
                    options={["3", "9", "7", "1"]}
                    correctIndex={2}
                    explanation="Cycle of 3: 3→9→7→1 (length 4). 99 ÷ 4 = 24 remainder 3. So unit digit = 3³ = 27 → unit digit 7"
                />
            </ConceptSection>

            {/* PRIME NUMBERS */}
            <ConceptSection id="primes" title="Prime Numbers — The Atoms of Math" icon="⚛️">
                <div className="bg-gradient-to-r from-rose-900/20 to-transparent p-6 rounded-xl border-l-4 border-rose-500 mb-6">
                    <p className="text-lg">
                        Just like atoms are building blocks of matter, <strong className="text-rose-400">prime numbers are building blocks of all numbers!</strong>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-rose-400 font-bold mb-3">What is a Prime?</h4>
                        <p className="text-neutral-300 mb-3">A number divisible only by <strong>1 and itself</strong>.</p>
                        <div className="flex flex-wrap gap-2">
                            {[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31].map(p => (
                                <span key={p} className="px-2 py-1 bg-rose-500/20 text-rose-400 rounded text-sm font-mono">{p}</span>
                            ))}
                            <span className="text-neutral-500">...</span>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-neutral-400 font-bold mb-3">What is NOT Prime?</h4>
                        <p className="text-neutral-300 mb-3"><strong>Composite numbers</strong> have more divisors.</p>
                        <div className="flex flex-wrap gap-2">
                            {[4, 6, 8, 9, 10, 12, 14, 15].map(c => (
                                <span key={c} className="px-2 py-1 bg-neutral-800 text-neutral-400 rounded text-sm font-mono">{c}</span>
                            ))}
                            <span className="text-neutral-500">...</span>
                        </div>
                    </div>
                </div>

                <TipBox variant="warning" title="Special Cases">
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li><strong>1 is NOT prime</strong> (only one divisor, not two)</li>
                        <li><strong>2 is the ONLY even prime</strong> (all other evens divisible by 2)</li>
                        <li><strong>Smallest prime = 2</strong></li>
                    </ul>
                </TipBox>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-indigo-500/30">
                    <h4 className="text-indigo-400 font-bold mb-4 text-center">⚡ Quick Prime Check (6k±1 Rule)</h4>
                    <p className="text-center text-neutral-300 mb-4">
                        Every prime greater than 3 is of the form <MathText>{`6k \\pm 1`}</MathText>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="text-center">
                            <span className="text-neutral-500">k=1:</span>
                            <span className="ml-2 text-rose-400">5, 7</span>
                        </div>
                        <div className="text-center">
                            <span className="text-neutral-500">k=2:</span>
                            <span className="ml-2 text-rose-400">11, 13</span>
                        </div>
                        <div className="text-center">
                            <span className="text-neutral-500">k=3:</span>
                            <span className="ml-2 text-rose-400">17, 19</span>
                        </div>
                        <div className="text-center">
                            <span className="text-neutral-500">k=4:</span>
                            <span className="ml-2 text-rose-400">23, 25</span>
                            <span className="text-neutral-500">(25=5² not prime)</span>
                        </div>
                    </div>
                    <p className="text-center text-neutral-500 text-xs mt-4">Note: 6k±1 is necessary but not sufficient. Always verify!</p>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="easy"
                    question="Is 91 a prime number?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Quick check:</strong> 91 = 90 + 1 = 6×15 + 1 ✓ (form 6k+1)</p>
                            <p>But wait, let's verify: Does any prime divide 91?</p>
                            <p>Try 7: 91 ÷ 7 = 13 ✓</p>
                            <p className="text-red-400"><strong>91 = 7 × 13, so NOT prime!</strong></p>
                        </div>
                    }
                    answer="No (91 = 7 × 13)"
                />

                <CheckUnderstanding
                    question="How many prime numbers are there between 10 and 20?"
                    options={["2", "3", "4", "5"]}
                    correctIndex={2}
                    explanation="The primes between 10 and 20 are: 11, 13, 17, 19. That's 4 primes!"
                />
            </ConceptSection>

            {/* REMAINDERS */}
            <ConceptSection id="remainders" title="The Power of Remainders" icon="🎯">
                <p className="mb-4">
                    When 17 is divided by 5, we get 3 with remainder 2. This simple concept solves MANY tricky questions!
                </p>

                <FormulaBox title="The Division Algorithm">
                    <div className="text-center">
                        <MathText className="text-2xl">{`\\text{Dividend} = \\text{Divisor} \\times \\text{Quotient} + \\text{Remainder}`}</MathText>
                        <p className="text-neutral-400 text-sm mt-2">OR</p>
                        <MathText className="text-2xl">{`N = D \\times Q + R \\quad (\\text{where } R < D)`}</MathText>
                    </div>
                </FormulaBox>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-indigo-400 font-bold mb-3">🔢 Same Remainder Family</h4>
                        <p className="text-sm text-neutral-400 mb-3">
                            Numbers that give the same remainder when divided by d are in the same "family"
                        </p>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-white">7, 12, 17, 22...</span> all give remainder 2 when ÷5</p>
                            <p className="text-neutral-500">These are: 5k + 2</p>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-amber-400 font-bold mb-3">⚡ Negative Remainder Trick</h4>
                        <p className="text-sm text-neutral-400 mb-3">
                            Sometimes using negative remainder is faster!
                        </p>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-white">99 ÷ 10</span> → Remainder 9 OR <span className="text-amber-400">-1</span></p>
                            <p className="text-neutral-500">99 = 10×10 - 1</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={5}
                    difficulty="hard"
                    question="What is the remainder when 7⁸⁰ is divided by 5?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Key insight:</strong> 7 gives remainder 2 when divided by 5</p>
                            <p>So 7⁸⁰ mod 5 = 2⁸⁰ mod 5</p>
                            <p><strong>Cycle of 2 mod 5:</strong> 2→4→3→1→2... (cycle = 4)</p>
                            <p>80 ÷ 4 = 20 remainder 0 → same as 2⁴</p>
                            <p>2⁴ = 16, and 16 mod 5 = <strong>1</strong></p>
                        </div>
                    }
                    answer="1"
                />

                <CheckUnderstanding
                    question="When 123456789 is divided by 9, what is the remainder?"
                    options={["0", "3", "6", "9"]}
                    correctIndex={0}
                    explanation="Sum of digits = 1+2+3+4+5+6+7+8+9 = 45. And 45 is divisible by 9, so remainder = 0!"
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!" icon="⚠️">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Thinking 1 is Prime</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            1 has only ONE divisor (itself). Primes need EXACTLY two divisors.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Wrong Divisibility by 4 (Checking Last Digit Only)</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            For 4, check last TWO digits, not just the last digit.
                            <span className="text-white"> 112 → 12÷4=3 ✓</span>, but <span className="text-white">118 → 18÷4=4.5 ✗</span>
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Forgetting Cycle of 4 Exception</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            When power is exactly divisible by 4 (remainder 0), use the 4th power, not the 0th!
                            <span className="text-white"> 2⁸ mod 10 → 8÷4=2 r0 → use 2⁴=16 → unit digit 6</span>
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold">❌ Confusing Divisibility of 6</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            A number divisible by 6 must be divisible by BOTH 2 AND 3, not just one!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Number System Master Reference"
                    rows={[
                        { concept: 'Div by 3', formula: 'Sum of digits ÷ 3' },
                        { concept: 'Div by 4', formula: 'Last 2 digits ÷ 4' },
                        { concept: 'Div by 8', formula: 'Last 3 digits ÷ 8' },
                        { concept: 'Div by 9', formula: 'Sum of digits ÷ 9' },
                        { concept: 'Div by 11', formula: '(Odd pos sum) − (Even pos sum) = 0 or 11' },
                        { concept: 'Unit Digit Cycle', formula: 'Most numbers: cycle of 4' },
                        { concept: 'Special Cycles', formula: '0, 1, 5, 6 → always same' },
                        { concept: 'Prime Check (>3)', formula: 'Form 6k±1' },
                        { concept: 'Sum 1 to n', formula: 'n(n+1)/2' },
                        { concept: 'Sum of first n odds', formula: 'n²' },
                        { concept: 'Sum of first n evens', formula: 'n(n+1)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
