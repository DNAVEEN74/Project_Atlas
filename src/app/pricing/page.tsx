'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircleOutlinedIcon, StarIcon } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function PricingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-amber-500/30 relative overflow-hidden">
            {/* --- HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
                }`}>
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                            <Image src="/logo-final.png" alt="PrepLeague Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">PrepLeague</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/problems" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Problems</Link>
                        <Link href="/sprint" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Sprint</Link>
                        <Link href="/games" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Games</Link>
                        <Link href="/pricing" className="text-sm font-medium text-white transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign in</Link>
                        <Link href="/register" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION (Animated Grid + Formulas) --- */}
            {/* Animated Grid Background - Moved to Root for Full Width */}
            {/* Animated Grid Background - Facded out before Compare Plans */}
            <div className="absolute top-0 left-0 right-0 h-[1200px] pointer-events-none -z-0">
                {/* Perspective Grid */}
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px),
                               linear-gradient(to bottom, #444 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    }}
                />
            </div>

            {/* --- HERO CONTENT --- */}
            <main className="relative w-full px-6 lg:px-12 pt-32 pb-12 max-w-7xl mx-auto z-10">

                {/* Hero Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                        Choose your plan to <br className="hidden md:block" /> continue mastering.
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-8">
                        Start for free. Upgrade anytime to unlock unlimited practice and deep analytics.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">

                    {/* FREE Plan */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group relative flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹0</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">Forever free</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="20 Questions / Day" />
                            <FeatureItem text="1 Sprint / Day" />
                            <FeatureItem text="Unlimited Speed Math Games" highlight />
                            <FeatureItem text="Basic Accuracy Stats" />
                            <FeatureItem text="Access to All Topics" />
                        </div>

                        <Link href="/register" className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all text-center block">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Monthly Plan */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group relative flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Monthly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹99</span>
                                <span className="text-neutral-500 text-sm">/mo</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">No commitment, cancel anytime</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Unlimited Questions & Sprints" highlight />
                            <FeatureItem text="Full Length Mock Tests" highlight />
                            <FeatureItem text="Unlimited Speed Math Games" highlight />
                            <FeatureItem text="Advanced Analytics & Trends" highlight />
                            <FeatureItem text="Predicted Exam Score" highlight />
                            <FeatureItem text="Weak Spot Drills" highlight />
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
                                <span className="text-4xl font-black text-white">₹499</span>
                                <span className="text-neutral-500 text-sm">/yr</span>
                            </div>
                            <p className="text-xs text-amber-500 mt-2 font-medium">Just ₹42/mo • Save 58%</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Everything in Monthly" highlight />
                            <FeatureItem text="Same Premium Features" highlight />
                            <FeatureItem text="Save ₹689 / Year" highlight />
                        </div>

                        <button className="w-full py-4 rounded-xl bg-amber-500 text-black font-black uppercase tracking-wide hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20">
                            Select Yearly
                        </button>
                        <p className="text-[10px] text-center text-neutral-500 mt-4">Billed as one payment of ₹499</p>
                    </div>

                </div>

                {/* Feature Comparison Table */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Compare Plans</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="py-4 px-4 font-normal text-neutral-500 w-1/3">Features</th>
                                    <th className="py-4 px-4 font-bold text-white text-center w-1/6">Free</th>
                                    <th className="py-4 px-4 font-bold text-white text-center w-1/6">Monthly</th>
                                    <th className="py-4 px-4 font-bold text-amber-500 text-center w-1/6">Yearly</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Questions / Day</td>
                                    <td className="py-4 px-4 text-center text-neutral-400">20</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-amber-500 font-bold">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Sprints / Day</td>
                                    <td className="py-4 px-4 text-center text-neutral-400">1</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-amber-500 font-bold">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Full Length Mock Tests</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Speed Math Games</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-amber-500 font-bold">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Speed Analytics</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Weak Spot Drills</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Predicted Score</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Download Sessions (PDF)</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ / Trust */}
                <div className="mt-20 text-center border-t border-neutral-800 pt-12">
                    <div className="flex justify-center gap-4 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholder for payment icons - using text for now as per instructions */}
                        <span className="text-xs font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">UPI</span>
                        <span className="text-xs font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">Cards</span>
                        <span className="text-xs font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">NetBanking</span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-4">
                        100% Secure Payment via Razorpay. 7-Day Money Back Guarantee for new subscribers.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function FeatureItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircleOutlinedIcon className={`text-xl ${highlight ? 'text-amber-500' : 'text-neutral-600'}`} />
            <span className={`text-sm ${highlight ? 'text-white font-medium' : 'text-neutral-400'}`}>{text}</span>
        </div>
    );
}
