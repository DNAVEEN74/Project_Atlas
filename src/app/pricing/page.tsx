'use client';

import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-amber-500/30">
            {/* Minimal Header (Standalone) */}
            <nav className="w-full px-6 lg:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                        {/* We use an img tag here for simplicity if Next/Image isn't imported, but assuming standard Next.js usage, we'll use a span with background or just img */}
                        <img src="/logo-final.png" alt="PrepLeague" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xl tracking-tight group-hover:text-amber-500 transition-colors">PrepLeague</span>
                </Link>
                <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    Log In
                </Link>
            </nav>

            <main className="w-full px-6 lg:px-12 py-12 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <CheckCircleOutlineIcon fontSize="inherit" />
                        First 7 Days Free
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                        Choose your plan to <br className="hidden md:block" /> continue mastering.
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-8">
                        Your first 7 days are on us. Browse our flexible plans below to unlock uninterrupted access to all drills and analytics.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">

                    {/* Monthly Plan */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group relative flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Monthly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹200</span>
                                <span className="text-neutral-500 text-sm">/mo</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">Flexible, billed monthly</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Unlimited Practice Drills" />
                            <FeatureItem text="Detailed Analytics" />
                            <FeatureItem text="Cancel Anytime" />
                        </div>

                        <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all">
                            Select Monthly
                        </button>
                    </div>

                    {/* Yearly Plan (Best Value) */}
                    <div className="bg-[#1a1a1a] border-2 border-amber-500 rounded-3xl p-8 shadow-2xl shadow-amber-500/10 relative transform md:-translate-y-4 flex flex-col h-full">
                        <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                            <div className="bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                Best Value
                            </div>
                        </div>

                        <div className="mb-8 mt-2">
                            <h3 className="text-lg font-bold text-white mb-2">Yearly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹1200</span>
                                <span className="text-neutral-500 text-sm">/yr</span>
                            </div>
                            <p className="text-xs text-amber-500 mt-2 font-medium">Just ₹100/mo • Save 50%</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Unlimited Practice Drills" highlight />
                            <FeatureItem text="Advanced Analytics & Trends" highlight />
                            <FeatureItem text="Priority Support" highlight />
                            <FeatureItem text="Early Access to New Games" highlight />
                        </div>

                        <button className="w-full py-4 rounded-xl bg-amber-500 text-black font-black uppercase tracking-wide hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20">
                            Select Yearly
                        </button>
                        <p className="text-[10px] text-center text-neutral-500 mt-4">Billed as one payment of ₹1200</p>
                    </div>

                    {/* 6-Month Plan */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group relative flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Bi-Annual</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹700</span>
                                <span className="text-neutral-500 text-sm">/6mo</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">₹116/mo • Save 42%</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Unlimited Practice Drills" />
                            <FeatureItem text="Detailed Analytics" />
                            <FeatureItem text="Cancel Anytime" />
                        </div>

                        <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all">
                            Select Bi-Annual
                        </button>
                    </div>

                </div>

                {/* FAQ / Trust */}
                <div className="mt-20 text-center border-t border-neutral-800 pt-12">
                    <p className="text-neutral-500 text-sm mb-4">
                        100% Secure Payment. 7-Day Money Back Guarantee for new subscribers.
                    </p>
                </div>
            </main>
        </div>
    );
}

function FeatureItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircleOutlineIcon className={`text-xl ${highlight ? 'text-amber-500' : 'text-neutral-600'}`} />
            <span className={`text-sm ${highlight ? 'text-white font-medium' : 'text-neutral-400'}`}>{text}</span>
        </div>
    );
}
