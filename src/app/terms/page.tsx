'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { MenuIcon, CloseIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState('agreement');
    const [scrolled, setScrolled] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            const sections = [
                'agreement', 'account', 'subscription', 'usage',
                'intellectual', 'disclaimers', 'liability', 'indemnification',
                'governing', 'general', 'contact', 'acknowledgment'
            ];

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 110,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    const sidebarLinks = [
        { id: 'agreement', label: 'Acceptance of Terms' },
        { id: 'account', label: 'Account & Security' },
        { id: 'subscription', label: 'Subscription & Billing' },
        { id: 'usage', label: 'Platform Usage' },
        { id: 'intellectual', label: 'Intellectual Property' },
        { id: 'disclaimers', label: 'Disclaimers' },
        { id: 'liability', label: 'Limitation of Liability' },
        { id: 'indemnification', label: 'Indemnification' },
        { id: 'governing', label: 'Dispute Resolution' },
        { id: 'general', label: 'General Provisions' },
        { id: 'contact', label: 'Contact Info' },
        { id: 'acknowledgment', label: 'Acknowledgment' },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 selection:bg-amber-500/30 selection:text-white font-sans antialiased">
            
            {/* --- HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
              scrolled 
                ? 'bg-[#1a1a1a]/90 backdrop-blur-md border-neutral-800/80 py-3' 
                : 'bg-transparent border-transparent py-5'
            }`}>
              <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
                <div className="flex items-center gap-12">
                  <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
                    <div className="relative w-9 h-9">
                      <Image src="/logo-final.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-xl font-bold text-white tracking-tight">PrepLeague</span>
                    </div>
                  </Link>

                  <nav className="hidden lg:flex items-center gap-2">
                    {[
                      { n: 'Home', h: '/' },
                      { n: 'Problems', h: '/problems' },
                      { n: 'Sprint Mode', h: '/sprint' },
                      { n: 'Pricing', h: '/pricing' }
                    ].map((item) => (
                      <Link 
                        key={item.n} 
                        href={item.h}
                        className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-full transition-all"
                      >
                        {item.n}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block px-4">Log in</Link>
                  <Link href="/register" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-lg active:scale-95">
                    Get Started
                  </Link>
                  <button className="lg:hidden p-2 text-neutral-400" onClick={() => setShowMobileMenu(true)}>
                    <MenuIcon />
                  </button>
                </div>
              </div>

              {/* Mobile Nav */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="fixed inset-0 z-[200] lg:hidden bg-[#0f0f0f] flex flex-col"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                      <span className="text-xl font-bold text-white">Menu</span>
                      <button onClick={() => setShowMobileMenu(false)} className="text-neutral-400 p-2"><CloseIcon /></button>
                    </div>
                    <nav className="flex flex-col p-6 gap-2">
                      {[
                        { n: 'Home', h: '/' },
                        { n: 'Problems', h: '/problems' },
                        { n: 'Sprint Mode', h: '/sprint' },
                        { n: 'Pricing', h: '/pricing' },
                        { n: 'Login', h: '/login' }
                      ].map((item) => (
                        <Link 
                          key={item.n}
                          href={item.h}
                          onClick={() => setShowMobileMenu(false)}
                          className="px-4 py-4 rounded-xl text-lg font-medium text-neutral-300 hover:bg-neutral-800 transition-all"
                        >
                          {item.n}
                        </Link>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* --- MAIN LAYOUT --- */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-48 pb-32 flex flex-col lg:flex-row gap-20">

                {/* --- SIDEBAR (Sticky) --- */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-32 space-y-8">
                        <div className="space-y-4 pr-10">
                          <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] px-1">Table of Contents</h4>
                          <nav className="flex flex-col">
                              {sidebarLinks.map((link, i) => (
                                  <button
                                      key={link.id}
                                      onClick={() => scrollToSection(link.id)}
                                      className="group relative flex items-center gap-3 py-2 text-left transition-all"
                                  >
                                      <span className={`text-[10px] font-mono font-bold transition-colors ${activeSection === link.id ? 'text-white' : 'text-neutral-700'}`}>0{i + 1}</span>
                                      <span className={`text-sm font-semibold transition-colors ${activeSection === link.id ? 'text-white translate-x-1' : 'text-neutral-500 hover:text-neutral-300'}`}>
                                          {link.label}
                                      </span>
                                  </button>
                              ))}
                          </nav>
                        </div>
                    </div>
                </aside>

                {/* --- CONTENT --- */}
                <main className="flex-1 max-w-3xl">
                    <div className="mb-16">
                        <div className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-10">
                          Legal Framework
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
                            Terms of Service
                        </h1>
                        <div className="flex items-center gap-3 text-xs font-mono font-bold text-neutral-500">
                            <span>LAST UPDATED:</span>
                            <span className="text-neutral-300 uppercase">FEBRUARY 18, 2026</span>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-neutral max-w-none">
                        <p className="text-lg text-neutral-400 leading-relaxed font-medium mb-12">
                            Welcome to PrepLeague. These Terms of Service ("Terms") govern your use of our platform at prepleague.com. By creating an account or accessing our services, you agree to be bound by these terms.
                        </p>

                        <section id="agreement" className="scroll-mt-32 mb-20">
                            <h2 className="text-xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
                            <p className="text-neutral-400 leading-relaxed">
                                By accessing PrepLeague, you agree to these Terms, our Privacy Policy, and all applicable laws. You must be at least 16 years old to use this platform.
                            </p>
                            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mt-8">
                                <p className="text-neutral-500 text-sm m-0 leading-relaxed">
                                    <strong className="text-white uppercase text-[10px] tracking-widest block mb-2">Protocol Note:</strong> We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.
                                </p>
                            </div>
                        </section>

                        <section id="account" className="scroll-mt-32 mb-20">
                            <h2 className="text-xl font-bold text-white mb-6">2. Account Registration and Security</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-neutral-800">
                                    <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Responsibility</h4>
                                    <ul className="text-sm text-neutral-500 space-y-2 mb-0 list-none p-0">
                                        <li>• Provide verified data</li>
                                        <li>• Secure your credentials</li>
                                        <li>• Report unauthorized access</li>
                                        <li>• Zero account sharing</li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-neutral-800">
                                    <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Termination</h4>
                                    <p className="text-sm text-neutral-500 mb-0 leading-relaxed">
                                        We reserve the right to suspend or terminate accounts for violations, fraud, or abuse. You can delete your identity anytime from settings.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="subscription" className="scroll-mt-32 mb-20 text-neutral-400">
                            <h2 className="text-xl font-bold text-white mb-6">3. Subscription Plans and Billing</h2>
                            <p className="mb-8">PrepLeague operates on a tiered access model designed for long-term consistency.</p>

                            <div className="overflow-hidden rounded-2xl border border-neutral-800 mb-8 bg-[#1a1a1a]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-900/50">
                                            <th className="p-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Tier</th>
                                            <th className="p-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Protocol</th>
                                            <th className="p-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Features</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800 text-sm">
                                        <tr>
                                            <td className="p-4 font-bold text-white">Free</td>
                                            <td className="p-4 font-mono">₹0</td>
                                            <td className="p-4 text-neutral-500">1 Sprint/day, 2 AI clarifies</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Monthly</td>
                                            <td className="p-4 font-mono">₹99</td>
                                            <td className="p-4 text-neutral-500">Unlimited access & analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-amber-500">Yearly</td>
                                            <td className="p-4 font-mono">₹499</td>
                                            <td className="p-4 text-neutral-300">Best Value (Ad-free)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="usage" className="scroll-mt-32 mb-20 text-neutral-400 leading-relaxed">
                            <h2 className="text-xl font-bold text-white mb-6">4. Platform Usage</h2>
                            <p>You agree to use PrepLeague only for personal exam preparation and elite performance training.</p>
                            <div className="mt-8 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                <strong className="text-red-400 uppercase text-[10px] tracking-widest block mb-4">Prohibited Actions</strong>
                                <ul className="list-disc pl-5 text-sm text-neutral-500 space-y-2 mb-0">
                                    <li>Data scraping or unauthorized content extraction</li>
                                    <li>Cheating mechanisms or timer manipulation</li>
                                    <li>Reverse engineering the "Engine" logic</li>
                                    <li>Account mirroring or group usage</li>
                                </ul>
                            </div>
                        </section>

                        <section id="intellectual" className="scroll-mt-32 mb-20 text-neutral-400 leading-relaxed">
                            <h2 className="text-xl font-bold text-white mb-6">5. Intellectual Property</h2>
                            <p>All proprietary questions, algorithmic solutions, and UI/UX patterns are the property of PrepLeague (© 2018-2026). Redistribution is strictly prohibited under intellectual property laws.</p>
                        </section>

                        <section id="disclaimers" className="scroll-mt-32 mb-20">
                            <h2 className="text-xl font-bold text-white mb-6">6. Disclaimers</h2>
                            <div className="p-8 rounded-3xl bg-[#1a1a1a] border border-neutral-800">
                                <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-[0.2em]">No Guarantee of Selection</h4>
                                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                                    PrepLeague is a systematic tool. We make NO guarantees about actual exam outcomes or job selection. Your success relies on your own disciplined effort.
                                </p>
                                <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-[0.2em]">Affiliation</h4>
                                <p className="text-sm text-neutral-500 leading-relaxed m-0">
                                    We are a private preparation engine and are not affiliated with the Staff Selection Commission (SSC) or any government entity.
                                </p>
                            </div>
                        </section>

                        <section id="governing" className="scroll-mt-32 mb-20 text-neutral-400 leading-relaxed">
                            <h2 className="text-xl font-bold text-white mb-6">7. Jurisdiction</h2>
                            <p>These terms are governed by the laws of <strong>India</strong>. Disputes are subject to the exclusive jurisdiction of courts in <strong>Hyderabad, Telangana</strong>.</p>
                        </section>

                        <section id="acknowledgment" className="scroll-mt-32 pt-12 border-t border-neutral-800">
                            <p className="text-2xl font-bold text-white leading-tight">
                                By engaging with PrepLeague, you acknowledge that you have integrated these Terms into your preparation framework.
                            </p>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
