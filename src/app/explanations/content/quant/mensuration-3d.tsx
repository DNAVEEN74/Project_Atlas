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

export default function Mensuration3DContent() {
    return (
        <LessonLayout>
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-neutral-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6rem] select-none">🧊</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-500 text-xs font-bold uppercase tracking-widest mb-2 border border-violet-500/20">
                        Phase 04: Visual Maths
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Mensuration 3D</h1>
                    <p className="text-neutral-400 text-lg">Volume and Surface Area of solids.</p>
                </div>
            </div>

            <ConceptSection id="formulas" title="Essential Solids" icon="📦">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Cube (a)</h4>
                        <div className="space-y-1 text-sm text-neutral-300">
                            <p>Volume = a³</p>
                            <p>TSA = 6a²</p>
                            <p>Diagonal = a√3</p>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Cuboid (l,b,h)</h4>
                        <div className="space-y-1 text-sm text-neutral-300">
                            <p>Volume = lbh</p>
                            <p>TSA = 2(lb+bh+hl)</p>
                            <p>Diagonal = √(l²+b²+h²)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Sphere (r)</h4>
                        <div className="space-y-1 text-sm text-neutral-300">
                            <p>Volume = (4/3)πr³</p>
                            <p>TSA = 4πr²</p>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="cones" title="Cylinder & Cone" icon="🔺">
                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Cylinder (r, h)</h4>
                        <div className="space-y-1 text-sm text-neutral-300">
                            <p>Volume = πr²h</p>
                            <p>CSA = 2πrh</p>
                            <p>TSA = 2πr(r+h)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                        <h4 className="text-violet-400 font-bold mb-3">Cone (r, h, l)</h4>
                        <div className="space-y-1 text-sm text-neutral-300">
                            <p>Volume = (1/3)πr²h</p>
                            <p>CSA = πrl</p>
                            <p>l = √(r² + h²)</p>
                        </div>
                    </div>
                </div>
            </ConceptSection>

            <ConceptSection id="summary" title="Cheat Sheet">
                <CheatSheet
                    title="3D Formulas"
                    rows={[
                        { concept: 'Hemisphere Vol', formula: '(2/3)πr³' },
                        { concept: 'Hemisphere TSA', formula: '3πr²' },
                        { concept: 'Frustum Vol', formula: '(1/3)πh(R²+r²+Rr)' },
                    ]}
                />
            </ConceptSection>
        </LessonLayout>
    );
}
