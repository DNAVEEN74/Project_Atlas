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
import { CasinoIcon, ViewInArIcon, WidgetsIcon, KeyIcon, WarningIcon, CompareArrowsIcon } from '@/components/icons';

export default function DiceCubeContent() {
    return (
        <>
            <ConceptSection id="why" title="Why Dice Questions Seem Confusing">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-lg">
                        <strong>The Problem:</strong> When you see a dice, you can only see <strong>3 faces</strong> at a time.
                        The question asks about the face you <span className="text-violet-400">CAN'T see!</span>
                    </p>
                </div>

                <p className="mb-4">
                    But don't worry! Once you understand the rules, these become the <strong>easiest free marks</strong> in SSC CGL.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-violet-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center"><CasinoIcon className="text-violet-400" fontSize="large" /></div>
                        <h4 className="text-violet-400 font-bold">Standard Dice</h4>
                        <p className="text-xs text-neutral-400">Opposite faces sum to 7</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-violet-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center"><ViewInArIcon className="text-violet-400" fontSize="large" /></div>
                        <h4 className="text-violet-400 font-bold">Unfolded Nets</h4>
                        <p className="text-xs text-neutral-400">11 different patterns</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center hover:border-violet-500/50 transition-all">
                        <div className="text-3xl mb-2 flex justify-center"><WidgetsIcon className="text-violet-400" fontSize="large" /></div>
                        <h4 className="text-violet-400 font-bold">Painted Cubes</h4>
                        <p className="text-xs text-neutral-400">Cut into smaller cubes</p>
                    </div>
                </div>
            </ConceptSection>

            {/* STANDARD DICE */}
            <ConceptSection id="standard" title="The Standard Dice — Rule #1">
                <div className="bg-gradient-to-r from-violet-900/20 to-transparent p-6 rounded-xl border-l-4 border-violet-500 mb-6">
                    <p className="text-2xl font-bold text-violet-400 text-center">
                        Opposite Faces ALWAYS Sum to 7
                    </p>
                    <p className="text-center text-neutral-400 mt-2">This is TRUE for EVERY standard dice in the world!</p>
                </div>

                {/* Visual opposite faces */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-violet-400 font-bold mb-6 text-center text-lg">The Three Opposite Pairs</h4>
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="p-6 bg-black/50 rounded-lg hover:bg-red-500/10 transition-all group">
                            <div className="flex justify-center items-center gap-4">
                                <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl font-bold text-white group-hover:bg-red-500/30 transition-all">
                                    1
                                </div>
                                <span className="text-2xl text-violet-400"><CompareArrowsIcon /></span>
                                <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl font-bold text-white group-hover:bg-red-500/30 transition-all">
                                    6
                                </div>
                            </div>
                            <p className="text-neutral-500 text-sm mt-3">1 + 6 = 7</p>
                        </div>
                        <div className="p-6 bg-black/50 rounded-lg hover:bg-amber-500/10 transition-all group">
                            <div className="flex justify-center items-center gap-4">
                                <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl font-bold text-white group-hover:bg-amber-500/30 transition-all">
                                    2
                                </div>
                                <span className="text-2xl text-amber-400"><CompareArrowsIcon /></span>
                                <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl font-bold text-white group-hover:bg-amber-500/30 transition-all">
                                    5
                                </div>
                            </div>
                            <p className="text-neutral-500 text-sm mt-3">2 + 5 = 7</p>
                        </div>
                        <div className="p-6 bg-black/50 rounded-lg hover:bg-blue-500/10 transition-all group">
                            <div className="flex justify-center items-center gap-4">
                                <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl font-bold text-white group-hover:bg-blue-500/30 transition-all">
                                    3
                                </div>
                                <span className="text-2xl text-blue-400"><CompareArrowsIcon /></span>
                                <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl font-bold text-white group-hover:bg-blue-500/30 transition-all">
                                    4
                                </div>
                            </div>
                            <p className="text-neutral-500 text-sm mt-3">3 + 4 = 7</p>
                        </div>
                    </div>
                </div>

                <TipBox variant="note" title="When to Use This Rule">
                    <p className="text-sm">
                        If the question says <strong>"standard dice"</strong> or <strong>"ordinary dice"</strong>,
                        you can directly use the sum = 7 rule without any calculation!
                    </p>
                </TipBox>

                <ExampleCard
                    number={1}
                    difficulty="easy"
                    question="In a standard dice, if 4 is on top, what is at the bottom?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Rule:</strong> Opposite faces sum to 7</p>
                            <p>Bottom = 7 − Top = 7 − 4 = <strong>3</strong></p>
                        </div>
                    }
                    answer="3"
                />

                <CheckUnderstanding
                    question="On a standard dice, if 2 is on top, what is at the bottom?"
                    options={["1", "3", "5", "6"]}
                    correctIndex={2}
                    explanation="Standard dice: opposite faces sum to 7. So bottom = 7 − 2 = 5"
                />
            </ConceptSection>

            {/* NON-STANDARD DICE */}
            <ConceptSection id="opposite" title="Finding Opposites (Non-Standard Dice)">
                <p className="mb-4">
                    What if the dice is NOT standard? Or has letters/colors instead of numbers?
                    Then we need to use <strong>multiple views</strong> to find opposites.
                </p>

                <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-xl border-l-4 border-purple-500 mb-6">
                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2"><KeyIcon /> The Golden Rule</h4>
                    <p className="text-lg">
                        If two faces are <strong>NEVER shown adjacent</strong> in any view, they are <span className="text-purple-400">OPPOSITE!</span>
                    </p>
                </div>

                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-red-400 font-bold mb-4">Step-by-Step Method</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold shrink-0">1</div>
                            <div>
                                <p className="font-bold text-white">Find the COMMON face</p>
                                <p className="text-sm text-neutral-400">Look for a face that appears in TWO different views</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold shrink-0">2</div>
                            <div>
                                <p className="font-bold text-white">List ADJACENT faces</p>
                                <p className="text-sm text-neutral-400">For each view, note what faces are adjacent to the common face</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold shrink-0">3</div>
                            <div>
                                <p className="font-bold text-white">Compare and Find</p>
                                <p className="text-sm text-neutral-400">A face that appears in one view but NOT the other is OPPOSITE to the unique face from the other view</p>
                            </div>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={2}
                    difficulty="medium"
                    question="View 1: Top=1, Front=2, Right=3. View 2: Top=1, Front=4, Right=2. What is opposite to 3?"
                    solution={
                        <div className="space-y-3">
                            <p><strong>Step 1:</strong> Common face = 1 (on top in both views)</p>
                            <p><strong>Step 2:</strong> Adjacent to 1 in View 1: 2. Adjacent to 1 in View 2: 4, 2</p>
                            <p><strong>Step 3:</strong> 2 is common adjacent. 3 appears in View 1, 4 appears in View 2.</p>
                            <p><strong>Analysis:</strong> When the dice rotated, 3 was replaced by 4 on the visible area. This means they share the same position when the dice rotates.</p>
                            <p className="text-purple-400"><strong>∴ 3 is opposite to 4</strong></p>
                        </div>
                    }
                    answer="4"
                />

                <TipBox title="Quick Elimination">
                    <p className="text-sm">
                        In any view, you can see exactly 3 faces. These 3 faces are ALL adjacent to each other.
                        The face OPPOSITE to any visible face must be one of the 3 faces you CANNOT see!
                    </p>
                </TipBox>
            </ConceptSection>

            {/* UNFOLDED DICE */}
            <ConceptSection id="unfolded" title="Unfolded Dice (Nets)">
                <p className="mb-4">
                    A dice "net" is what you get when you unfold a cube flat. There are <strong>11 different ways</strong> to unfold a cube!
                </p>

                {/* Cross net visualization */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                    <h4 className="text-red-400 font-bold text-center mb-6">The Cross Pattern (Most Common)</h4>

                    <div className="flex justify-center mb-6">
                        <div className="grid grid-cols-4 gap-1">
                            {/* Row 1 - just one cell */}
                            <div className="col-start-2 w-16 h-16 bg-blue-500/30 border-2 border-blue-500 rounded flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            {/* Row 2 - full row */}
                            <div className="w-16 h-16 bg-green-500/30 border-2 border-green-500 rounded flex items-center justify-center text-white font-bold">
                                B
                            </div>
                            <div className="w-16 h-16 bg-yellow-500/30 border-2 border-yellow-500 rounded flex items-center justify-center text-white font-bold">
                                C
                            </div>
                            <div className="w-16 h-16 bg-purple-500/30 border-2 border-purple-500 rounded flex items-center justify-center text-white font-bold">
                                D
                            </div>
                            <div className="w-16 h-16 bg-orange-500/30 border-2 border-orange-500 rounded flex items-center justify-center text-white font-bold">
                                E
                            </div>
                            {/* Row 3 - just one cell */}
                            <div className="col-start-2 w-16 h-16 bg-red-500/30 border-2 border-red-500 rounded flex items-center justify-center text-white font-bold">
                                F
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-lg">
                        <h5 className="text-amber-400 font-bold mb-3">Opposite Pairs in Cross Net:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-neutral-800 rounded-lg">
                                <span className="text-blue-400">A</span>
                                <span className="text-neutral-500 mx-2">↔</span>
                                <span className="text-red-400">F</span>
                                <p className="text-xs text-neutral-500 mt-1">Top and Bottom</p>
                            </div>
                            <div className="p-3 bg-neutral-800 rounded-lg">
                                <span className="text-green-400">B</span>
                                <span className="text-neutral-500 mx-2">↔</span>
                                <span className="text-purple-400">D</span>
                                <p className="text-xs text-neutral-500 mt-1">Skip one square</p>
                            </div>
                            <div className="p-3 bg-neutral-800 rounded-lg">
                                <span className="text-yellow-400">C</span>
                                <span className="text-neutral-500 mx-2">↔</span>
                                <span className="text-orange-400">E</span>
                                <p className="text-xs text-neutral-500 mt-1">Skip one square</p>
                            </div>
                        </div>
                    </div>
                </div>

                <FormulaBox title="The Skip Rule for Nets" variant="secondary">
                    <div className="text-center">
                        <p className="text-lg mb-2">In any row/column of squares:</p>
                        <p className="text-amber-400 font-bold text-xl">Skip one = Opposite!</p>
                        <p className="text-neutral-500 text-sm mt-2">If there's 1 square gap between two squares, they are opposite faces.</p>
                    </div>
                </FormulaBox>

                {/* Different net patterns */}
                <div className="my-8">
                    <h4 className="text-red-400 font-bold mb-4">All 11 Dice Net Patterns</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Pattern 1: 1-4-1 */}
                        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                            <div className="grid grid-cols-4 gap-0.5 w-fit mx-auto mb-2">
                                <div className="col-start-1 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-2 w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-2 w-6 h-6 bg-neutral-700"></div>
                            </div>
                            <p className="text-xs text-center text-neutral-500">1-4-1</p>
                        </div>

                        {/* Pattern 2: 2-3-1 */}
                        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                            <div className="grid grid-cols-4 gap-0.5 w-fit mx-auto mb-2">
                                <div className="col-start-1 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-1 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-2 w-6 h-6 bg-neutral-700"></div>
                            </div>
                            <p className="text-xs text-center text-neutral-500">2-3-1</p>
                        </div>

                        {/* Pattern 3: 2-2-2 */}
                        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                            <div className="grid grid-cols-3 gap-0.5 w-fit mx-auto mb-2">
                                <div className="col-start-1 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-2 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-2 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                            </div>
                            <p className="text-xs text-center text-neutral-500">2-2-2 (Stair)</p>
                        </div>

                        {/* Pattern 4: 3-3 */}
                        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                            <div className="grid grid-cols-3 gap-0.5 w-fit mx-auto mb-2">
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="col-start-2 w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                                <div className="w-6 h-6 bg-neutral-700"></div>
                            </div>
                            <p className="text-xs text-center text-neutral-500">3-3 (L-shape)</p>
                        </div>
                    </div>
                </div>

                <ExampleCard
                    number={3}
                    difficulty="medium"
                    question="In a net: Top row = A, Middle row = B C D E (left to right), Bottom row = F. Which pairs are opposite?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Visualize:</strong> A is above C, F is below C, B-C-D-E are in a horizontal row</p>
                            <p><strong>Apply Skip Rule:</strong></p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>A ↔ F (both touch C from opposite sides)</li>
                                <li>B ↔ D (skip C between them)</li>
                                <li>C ↔ E (C is the center, E is 2 away)</li>
                            </ul>
                        </div>
                    }
                    answer="A-F, B-D, C-E"
                />

                <CheckUnderstanding
                    question="In a straight line net (1-2-3-4-5-6), which faces are opposite?"
                    options={["1-2, 3-4, 5-6", "1-3, 2-4, 5-6", "1-6, 2-5, 3-4", "This net is impossible"]}
                    correctIndex={3}
                    explanation="A straight line of 6 squares CANNOT fold into a cube! You need bends in the net. This is a trap question."
                />
            </ConceptSection>

            {/* PAINTED CUBE PROBLEMS */}
            <ConceptSection id="painted" title="Painted Cube Problems">
                <p className="mb-4">
                    A large cube is painted on ALL faces, then cut into smaller identical cubes.
                    <strong> How many smaller cubes have 0, 1, 2, or 3 painted faces?</strong>
                </p>

                {/* Visual cube breakdown */}
                <div className="my-8 p-6 bg-neutral-900 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-bold mb-4 text-center">If cube is cut into n×n×n smaller cubes:</h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {/* 3 faces painted */}
                        <div className="p-4 bg-black/50 rounded-lg border border-amber-500/30 hover:border-amber-500 transition-all">
                            <div className="w-12 h-12 mx-auto mb-3 relative">
                                <div className="absolute inset-0 bg-amber-500/50 rounded" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-sm" />
                            </div>
                            <p className="text-amber-400 font-bold">3 faces painted</p>
                            <p className="text-neutral-500 text-xs mb-2">Corner cubes</p>
                            <p className="text-3xl text-white font-bold">8</p>
                            <p className="text-xs text-neutral-600">(always exactly 8)</p>
                        </div>

                        {/* 2 faces painted */}
                        <div className="p-4 bg-black/50 rounded-lg border border-green-500/30 hover:border-green-500 transition-all">
                            <div className="w-12 h-6 mx-auto mb-3 bg-green-500/50 rounded" />
                            <p className="text-green-400 font-bold">2 faces painted</p>
                            <p className="text-neutral-500 text-xs mb-2">Edge cubes</p>
                            <p className="text-3xl text-white font-bold">12(n−2)</p>
                            <p className="text-xs text-neutral-600">12 edges total</p>
                        </div>

                        {/* 1 face painted */}
                        <div className="p-4 bg-black/50 rounded-lg border border-blue-500/30 hover:border-blue-500 transition-all">
                            <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/50 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-blue-500/30 rounded" />
                            </div>
                            <p className="text-blue-400 font-bold">1 face painted</p>
                            <p className="text-neutral-500 text-xs mb-2">Face center cubes</p>
                            <p className="text-3xl text-white font-bold">6(n−2)²</p>
                            <p className="text-xs text-neutral-600">6 faces total</p>
                        </div>

                        {/* 0 faces painted */}
                        <div className="p-4 bg-black/50 rounded-lg border border-neutral-500/30 hover:border-neutral-500 transition-all">
                            <div className="w-12 h-12 mx-auto mb-3 border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 bg-neutral-700 rounded" />
                            </div>
                            <p className="text-neutral-400 font-bold">0 faces painted</p>
                            <p className="text-neutral-500 text-xs mb-2">Inside cubes</p>
                            <p className="text-3xl text-white font-bold">(n−2)³</p>
                            <p className="text-xs text-neutral-600">core cube inside</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-neutral-800 rounded-lg text-center">
                        <p className="text-neutral-400 text-sm">
                            <strong className="text-white">Quick Check:</strong>
                            Total = 8 + 12(n−2) + 6(n−2)² + (n−2)³ = n³ ✓
                        </p>
                    </div>
                </div>

                {/* Quick reference table */}
                <div className="overflow-x-auto my-8">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-neutral-400">Cube Size</th>
                                <th className="px-4 py-3 text-amber-400">3 faces</th>
                                <th className="px-4 py-3 text-green-400">2 faces</th>
                                <th className="px-4 py-3 text-blue-400">1 face</th>
                                <th className="px-4 py-3 text-neutral-400">0 faces</th>
                                <th className="px-4 py-3 text-white">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">2×2×2</td>
                                <td className="px-4 py-3 text-amber-400">8</td>
                                <td className="px-4 py-3 text-green-400">0</td>
                                <td className="px-4 py-3 text-blue-400">0</td>
                                <td className="px-4 py-3 text-neutral-400">0</td>
                                <td className="px-4 py-3 text-white">8</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">3×3×3</td>
                                <td className="px-4 py-3 text-amber-400">8</td>
                                <td className="px-4 py-3 text-green-400">12</td>
                                <td className="px-4 py-3 text-blue-400">6</td>
                                <td className="px-4 py-3 text-neutral-400">1</td>
                                <td className="px-4 py-3 text-white">27</td>
                            </tr>
                            <tr className="border-b border-neutral-800">
                                <td className="px-4 py-3 text-white">4×4×4</td>
                                <td className="px-4 py-3 text-amber-400">8</td>
                                <td className="px-4 py-3 text-green-400">24</td>
                                <td className="px-4 py-3 text-blue-400">24</td>
                                <td className="px-4 py-3 text-neutral-400">8</td>
                                <td className="px-4 py-3 text-white">64</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-white">5×5×5</td>
                                <td className="px-4 py-3 text-amber-400">8</td>
                                <td className="px-4 py-3 text-green-400">36</td>
                                <td className="px-4 py-3 text-blue-400">54</td>
                                <td className="px-4 py-3 text-neutral-400">27</td>
                                <td className="px-4 py-3 text-white">125</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <ExampleCard
                    number={4}
                    difficulty="medium"
                    question="A 4×4×4 cube painted red is cut into 1×1×1 cubes. How many have exactly 2 painted faces?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> 12(n−2) where n = 4</p>
                            <p>= 12 × (4−2) = 12 × 2 = <strong>24</strong></p>
                            <p className="text-neutral-400 text-sm mt-2">These are all the edge cubes (excluding the 8 corners).</p>
                        </div>
                    }
                    answer="24"
                />

                <ExampleCard
                    number={5}
                    difficulty="hard"
                    question="Same 4×4×4 cube. How many cubes have NO paint at all?"
                    solution={
                        <div className="space-y-2">
                            <p><strong>Using formula:</strong> (n−2)³ where n = 4</p>
                            <p>= (4−2)³ = 2³ = <strong>8</strong></p>
                            <p className="text-neutral-400 text-sm mt-2">This is a 2×2×2 cube hidden inside!</p>
                        </div>
                    }
                    answer="8"
                />

                <CheckUnderstanding
                    question="A 3×3×3 cube is painted and cut. How many cubes have exactly 1 face painted?"
                    options={["0", "6", "8", "12"]}
                    correctIndex={1}
                    explanation="Formula: 6(n−2)² = 6(3−2)² = 6(1)² = 6. These are the center cubes of each face."
                />
            </ConceptSection>

            {/* COMMON MISTAKES */}
            <ConceptSection id="mistakes" title="Common Mistakes — Avoid These!">
                <div className="space-y-4 my-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Assuming All Dice are Standard</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Only use the "sum = 7" rule when the question explicitly says "standard" or "ordinary" dice!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Wrong Net Folding</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Remember: In a net, adjacent squares become ADJACENT faces when folded, not opposite!
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Forgetting the (n−2) Factor</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            In painted cube problems, subtract 2 from n to exclude corners when counting edges and faces.
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><WarningIcon className="text-red-400" /> Counting Corners in Edge Formula</h4>
                        <p className="text-sm text-neutral-400 mt-1">
                            Corners have 3 painted faces, edges have 2. Don't double count!
                        </p>
                    </div>
                </div>
            </ConceptSection>

            {/* CHEAT SHEET */}
            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="Dice & Cube Master Reference"
                    rows={[
                        { concept: 'Standard Dice', formula: '\\text{Opposite faces sum to } 7' },
                        { concept: 'Corners (3 faces)', formula: '8 \\text{ (always)}' },
                        { concept: 'Edges (2 faces)', formula: '12(n-2)' },
                        { concept: 'Faces (1 face)', formula: '6(n-2)^2' },
                        { concept: 'Inside (0 faces)', formula: '(n-2)^3' },
                        { concept: 'Total small cubes', formula: 'n^3' },
                        { concept: 'Net Skip Rule', formula: '\\text{Skip 1 square = Opposite}' },
                        { concept: 'Non-standard dice', formula: '\\text{Never adjacent = Opposite}' },
                    ]}
                />
            </ConceptSection>
        </>
    );
}
