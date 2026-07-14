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
                'agreement', 'account', 'platform-access', 'usage',
                'intellectual', 'disclaimers', 'governing', 'acknowledgment'
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
        { id: 'platform-access', label: 'Platform Access' },
        { id: 'usage', label: 'Platform Usage' },
        { id: 'intellectual', label: 'Intellectual Property' },
        { id: 'disclaimers', label: 'Disclaimers' },
        { id: 'governing', label: 'Jurisdiction' },
        { id: 'acknowledgment', label: 'Acknowledgment' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/30 selection:text-white font-sans antialiased">
            
            {/* --- HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
              scrolled 
                ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-[#1f1f1f] py-3' 
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
                      { n: 'Sprint Mode', h: '/sprint' }
                    ].map((item) => (
                      <Link 
                        key={item.n} 
                        href={item.h}
                        className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded-full transition-all"
                      >
                        {item.n}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block px-4">Log in</Link>
                  <Link href="/register" className="px-6 py-2.5 bg-amber-500 text-black text-sm font-bold rounded-[20px] hover:bg-amber-400 transition-all shadow-lg active:scale-95">
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
                    className="fixed inset-0 z-[200] lg:hidden bg-[#0a0a0a] flex flex-col"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-[#1f1f1f]">
                      <span className="text-xl font-bold text-white">Menu</span>
                      <button onClick={() => setShowMobileMenu(false)} className="text-neutral-400 p-2"><CloseIcon /></button>
                    </div>
                    <nav className="flex flex-col p-6 gap-2">
                      {[
                        { n: 'Home', h: '/' },
                        { n: 'Problems', h: '/problems' },
                        { n: 'Sprint Mode', h: '/sprint' },
                        { n: 'Login', h: '/login' }
                      ].map((item) => (
                        <Link 
                          key={item.n}
                          href={item.h}
                          onClick={() => setShowMobileMenu(false)}
                          className="px-4 py-4 rounded-xl text-lg font-medium text-neutral-300 hover:bg-[#1a1a1a] transition-all"
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
                    <div className="sticky top-32 bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-4 space-y-4">
                        <div className="px-4 pt-2 pb-1">
                          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Table of Contents</h4>
                        </div>
                        <nav className="flex flex-col list-none m-0 p-0 gap-1">
                              {sidebarLinks.map((link, i) => (
                                  <li key={link.id} className="m-0 p-0">
                                      <button
                                          onClick={() => scrollToSection(link.id)}
                                          className={`w-full flex items-center min-h-[56px] px-4 gap-4 rounded-[16px] text-left transition-colors ${
                                              activeSection === link.id 
                                                ? 'bg-amber-500/10 text-amber-500' 
                                                : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200'
                                          }`}
                                      >
                                          <div className={`flex-shrink-0 text-xs font-mono font-bold transition-colors ${activeSection === link.id ? 'text-amber-500' : 'text-neutral-500'}`}>0{i + 1}</div>
                                          <div className="flex-1 text-sm font-medium">
                                              {link.label}
                                          </div>
                                      </button>
                                  </li>
                              ))}
                        </nav>
                    </div>
                </aside>

                {/* --- CONTENT --- */}
                <main className="flex-1 max-w-3xl">
                    <div className="mb-16">
                        {/* M3 Chip */}
                        <div className="inline-flex items-center min-h-[32px] px-4 rounded-full bg-[#141414] border border-[#1f1f1f] mb-8">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Legal Framework</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
                            Terms of Service
                        </h1>
                        <div className="flex items-center min-h-[48px] px-4 rounded-[16px] bg-[#111111] border border-[#1f1f1f] w-fit">
                            <span className="text-xs font-mono font-bold text-neutral-500 mr-3">LAST UPDATED:</span>
                            <span className="text-xs font-mono font-bold text-amber-500 uppercase">FEBRUARY 18, 2026</span>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <p className="text-base text-neutral-400 leading-relaxed font-medium">
                            Welcome to PrepLeague. These Terms of Service ("Terms") govern your use of our platform at prepleague.com. By creating an account or accessing our services, you agree to be bound by these terms.
                        </p>

                        <section id="agreement" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">1. Acceptance of Terms</h2>
                            <p className="text-neutral-400 leading-relaxed text-base mb-6">
                                By accessing PrepLeague, you agree to these Terms, our Privacy Policy, and all applicable laws. You must be at least 16 years old to use this platform.
                            </p>
                            <div className="flex items-start min-h-[72px] p-4 gap-4 bg-[#111111] border border-[#1f1f1f] rounded-[24px]">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mt-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Protocol Note</div>
                                    <div className="text-sm text-neutral-400 leading-relaxed">We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.</div>
                                </div>
                            </div>
                        </section>

                        <section id="account" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">2. Account Registration and Security</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-2 rounded-[24px] bg-[#111111] border border-[#1f1f1f]">
                                    <div className="px-4 py-3 mb-2">
                                      <h4 className="text-white font-bold text-sm uppercase tracking-widest">Responsibility</h4>
                                    </div>
                                    <ul className="flex flex-col m-0 p-0 list-none gap-1">
                                        <li className="flex items-center min-h-[56px] px-4 gap-4 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                                            </div>
                                            <div className="flex-1 text-sm font-medium text-neutral-300">Provide verified data</div>
                                        </li>
                                        <li className="flex items-center min-h-[56px] px-4 gap-4 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                                            </div>
                                            <div className="flex-1 text-sm font-medium text-neutral-300">Secure your credentials</div>
                                        </li>
                                        <li className="flex items-center min-h-[56px] px-4 gap-4 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                                            </div>
                                            <div className="flex-1 text-sm font-medium text-neutral-300">Report unauthorized access</div>
                                        </li>
                                        <li className="flex items-center min-h-[56px] px-4 gap-4 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                                            </div>
                                            <div className="flex-1 text-sm font-medium text-neutral-300">Zero account sharing</div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-[24px] bg-[#111111] border border-[#1f1f1f]">
                                    <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Termination</h4>
                                    <p className="text-sm text-neutral-400 mb-0 leading-relaxed">
                                        We reserve the right to suspend or terminate accounts for violations, fraud, or abuse. You can delete your identity anytime from settings.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="platform-access" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">3. Platform Access</h2>
                            <p className="text-neutral-400 leading-relaxed text-base">
                                PrepLeague is an elite platform with daily usage limits to ensure fair access for all users. Features and limits may change as the platform evolves.
                            </p>
                        </section>

                        <section id="usage" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">4. Platform Usage</h2>
                            <p className="text-neutral-400 leading-relaxed text-base mb-8">You agree to use PrepLeague only for personal exam preparation and elite performance training.</p>
                            
                            <div className="p-2 bg-red-500/[0.03] border border-red-500/10 rounded-[24px]">
                                <div className="flex items-center min-h-[56px] px-4 gap-3">
                                  <div className="w-2 h-2 rounded-full bg-red-500" />
                                  <strong className="text-red-400 text-xs font-bold uppercase tracking-widest">Prohibited Actions</strong>
                                </div>
                                <ul className="flex flex-col m-0 p-0 list-none gap-1">
                                    <li className="flex items-start min-h-[56px] py-3 px-4 gap-4 hover:bg-red-500/5 transition-colors rounded-[16px]">
                                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-neutral-300 leading-relaxed">Data scraping or unauthorized content extraction</div>
                                    </li>
                                    <li className="flex items-start min-h-[56px] py-3 px-4 gap-4 hover:bg-red-500/5 transition-colors rounded-[16px]">
                                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-neutral-300 leading-relaxed">Cheating mechanisms or timer manipulation</div>
                                    </li>
                                    <li className="flex items-start min-h-[56px] py-3 px-4 gap-4 hover:bg-red-500/5 transition-colors rounded-[16px]">
                                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-neutral-300 leading-relaxed">Reverse engineering the "Engine" logic</div>
                                    </li>
                                    <li className="flex items-start min-h-[56px] py-3 px-4 gap-4 hover:bg-red-500/5 transition-colors rounded-[16px]">
                                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-neutral-300 leading-relaxed">Account mirroring or group usage</div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section id="intellectual" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">5. Intellectual Property</h2>
                            <p className="text-neutral-400 leading-relaxed text-base">All proprietary questions, algorithmic solutions, and UI/UX patterns are the property of PrepLeague (© 2018-2026). Redistribution is strictly prohibited under intellectual property laws.</p>
                        </section>

                        <section id="disclaimers" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">6. Disclaimers</h2>
                            <ul className="flex flex-col m-0 p-2 list-none gap-2 bg-[#111111] border border-[#1f1f1f] rounded-[24px]">
                                <li className="flex items-start min-h-[88px] p-4 gap-4 rounded-[16px] hover:bg-[#141414] transition-colors">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mt-1">
                                        <span className="text-white text-xs font-bold">1</span>
                                    </div>
                                    <div className="flex flex-col gap-1 justify-center">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">No Guarantee of Selection</div>
                                        <div className="text-sm text-neutral-400 leading-relaxed">PrepLeague is a systematic tool. We make NO guarantees about actual exam outcomes or job selection. Your success relies on your own disciplined effort.</div>
                                    </div>
                                </li>
                                <li className="flex items-start min-h-[88px] p-4 gap-4 rounded-[16px] hover:bg-[#141414] transition-colors">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mt-1">
                                        <span className="text-white text-xs font-bold">2</span>
                                    </div>
                                    <div className="flex flex-col gap-1 justify-center">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Affiliation</div>
                                        <div className="text-sm text-neutral-400 leading-relaxed">We are a private preparation engine and are not affiliated with the Staff Selection Commission (SSC) or any government entity.</div>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section id="governing" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">7. Jurisdiction</h2>
                            <p className="text-neutral-400 leading-relaxed text-base">These terms are governed by the laws of <strong>India</strong>. Disputes are subject to the exclusive jurisdiction of courts in <strong>Hyderabad, Telangana</strong>.</p>
                        </section>

                        <section id="acknowledgment" className="scroll-mt-32 pt-12 border-t border-[#1f1f1f]">
                            <p className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
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
