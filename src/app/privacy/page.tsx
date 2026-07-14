'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { MenuIcon, CloseIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState('data-collection');
    const [scrolled, setScrolled] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            const sections = [
                'data-collection', 'data-usage', 'data-sharing',
                'cookies', 'security', 'compliance', 'contact'
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
        { id: 'data-collection', label: 'Data Collection' },
        { id: 'data-usage', label: 'Data Usage' },
        { id: 'data-sharing', label: 'Data Sharing' },
        { id: 'cookies', label: 'Cookies & Advertising' },
        { id: 'security', label: 'Security Infrastructure' },
        { id: 'compliance', label: 'Legal Compliance' },
        { id: 'contact', label: 'Contact Privacy Team' },
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
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Data Protection</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
                            Privacy Policy
                        </h1>
                        <div className="flex items-center min-h-[48px] px-4 rounded-[16px] bg-[#111111] border border-[#1f1f1f] w-fit">
                            <span className="text-xs font-mono font-bold text-neutral-500 mr-3">LAST UPDATED:</span>
                            <span className="text-xs font-mono font-bold text-emerald-500 uppercase">FEBRUARY 18, 2026</span>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <p className="text-base text-neutral-400 leading-relaxed font-medium">
                            At PrepLeague, we treat your preparation data with absolute sovereignty. This Privacy Policy details the strict protocols governing how we collect, store, and utilize your information to optimize your exam performance.
                        </p>

                        <section id="data-collection" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">1. Data Collection</h2>
                            <div className="p-2 bg-[#111111] border border-[#1f1f1f] rounded-[24px]">
                                <ul className="flex flex-col m-0 p-0 list-none gap-2">
                                    <li className="flex flex-col min-h-[72px] p-4 gap-1 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Identity Vectors</div>
                                        <div className="text-sm text-neutral-400 leading-relaxed">Name, email, and authentication tokens provided during registration.</div>
                                    </li>
                                    <li className="flex flex-col min-h-[72px] p-4 gap-1 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Performance Telemetry</div>
                                        <div className="text-sm text-neutral-400 leading-relaxed">Response times, accuracy metrics, concept mastery levels, and behavioral patterns within the platform.</div>
                                    </li>
                                    <li className="flex flex-col min-h-[72px] p-4 gap-1 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">Technical Telemetry</div>
                                        <div className="text-sm text-neutral-400 leading-relaxed">IP address, browser signatures, and device metrics required for security verification and session continuity.</div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section id="data-usage" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">2. Data Usage</h2>
                            <p className="text-neutral-400 leading-relaxed text-base mb-6">Your telemetry is strictly used to calibrate the PrepLeague Engine. We analyze your performance to:</p>
                            
                            <ul className="flex flex-col m-0 p-0 list-none gap-2">
                                <li className="flex items-center min-h-[56px] px-4 gap-4 bg-[#111111] border border-[#1f1f1f] rounded-[16px]">
                                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-neutral-300">Deploy adaptive question serving (adjusting difficulty dynamically)</div>
                                </li>
                                <li className="flex items-center min-h-[56px] px-4 gap-4 bg-[#111111] border border-[#1f1f1f] rounded-[16px]">
                                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-neutral-300">Generate personalized sprint mode trajectories</div>
                                </li>
                                <li className="flex items-center min-h-[56px] px-4 gap-4 bg-[#111111] border border-[#1f1f1f] rounded-[16px]">
                                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-neutral-300">Calculate global ranking percentiles against other candidates</div>
                                </li>
                            </ul>
                        </section>

                        <section id="data-sharing" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">3. Data Sharing</h2>
                            <div className="flex items-start min-h-[72px] p-4 gap-4 bg-amber-500/[0.05] border border-amber-500/10 rounded-[24px] mb-8">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mt-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1">Protocol Zero</div>
                                    <div className="text-sm text-amber-200/80 leading-relaxed">We do not sell personal identification to third-party data harvesters.</div>
                                </div>
                            </div>
                            
                            <p className="text-neutral-400 mb-6 text-base">We only transmit data to verified infrastructure partners required to maintain the platform:</p>
                            
                            <div className="grid sm:grid-cols-3 gap-4">
                               <div className="bg-[#111111] border border-[#1f1f1f] p-5 rounded-[24px] hover:bg-[#141414] transition-colors">
                                  <span className="text-[10px] font-mono font-bold text-neutral-500 block mb-2 tracking-widest">AI ENGINE</span>
                                  <span className="text-sm text-white font-bold">Google Gemini</span>
                               </div>
                               <div className="bg-[#111111] border border-[#1f1f1f] p-5 rounded-[24px] hover:bg-[#141414] transition-colors">
                                  <span className="text-[10px] font-mono font-bold text-neutral-500 block mb-2 tracking-widest">INFRASTRUCTURE</span>
                                  <span className="text-sm text-white font-bold">Vercel</span>
                               </div>
                               <div className="bg-[#111111] border border-[#1f1f1f] p-5 rounded-[24px] hover:bg-[#141414] transition-colors">
                                  <span className="text-[10px] font-mono font-bold text-neutral-500 block mb-2 tracking-widest">STAGING DATABASE</span>
                                  <span className="text-sm text-white font-bold">MongoDB Atlas</span>
                               </div>
                            </div>
                        </section>

                        <section id="cookies" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">4. Cookies & Advertising</h2>
                            <p className="text-neutral-400 leading-relaxed text-base mb-8">We use cookies and similar tracking technologies to enhance your experience and serve relevant advertising.</p>

                            <ul className="flex flex-col m-0 p-2 list-none gap-2 bg-[#111111] border border-[#1f1f1f] rounded-[24px]">
                                <li className="flex flex-col min-h-[72px] p-4 gap-2 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                    <div className="text-sm font-bold text-white uppercase tracking-widest">Essential Cookies</div>
                                    <div className="text-sm text-neutral-400 leading-relaxed">Required for core platform functions — authentication sessions, preferences, and security tokens. These cannot be disabled.</div>
                                </li>
                                <li className="flex flex-col min-h-[72px] p-4 gap-4 bg-amber-500/[0.02] border border-amber-500/10 transition-colors rounded-[16px]">
                                    <div>
                                      <div className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1">Advertising Cookies (Google AdSense)</div>
                                      <div className="text-sm text-neutral-400 leading-relaxed">PrepLeague uses Google AdSense to display advertisements. Google uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits.</div>
                                    </div>
                                    <div className="bg-[#0a0a0a] rounded-[16px] border border-[#1f1f1f] p-4">
                                      <ul className="flex flex-col list-none m-0 p-0 gap-2">
                                        <li className="flex items-start gap-3">
                                          <span className="text-amber-500 font-black text-sm mt-0.5">·</span>
                                          <span className="text-sm text-neutral-400">Google's use of advertising cookies enables it to serve ads based on your visit to PrepLeague.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                          <span className="text-amber-500 font-black text-sm mt-0.5">·</span>
                                          <span className="text-sm text-neutral-400">You may <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 underline underline-offset-2">opt out of personalised advertising</a> by visiting Google Ads Settings.</span>
                                        </li>
                                      </ul>
                                    </div>
                                </li>
                                <li className="flex flex-col min-h-[72px] p-4 gap-2 hover:bg-[#1a1a1a] transition-colors rounded-[16px]">
                                    <div className="text-sm font-bold text-white uppercase tracking-widest">Analytics Cookies</div>
                                    <div className="text-sm text-neutral-400 leading-relaxed">Used to understand how visitors interact with the platform — page views, session lengths, and navigation paths. Data is aggregated and anonymised.</div>
                                </li>
                            </ul>
                        </section>

                        <section id="security" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">5. Security Infrastructure</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex flex-col min-h-[100px] p-6 gap-3 bg-[#111111] border border-[#1f1f1f] rounded-[24px]">
                                    <div className="flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      <div className="text-sm font-bold text-white uppercase tracking-widest">Encryption Protocols</div>
                                    </div>
                                    <div className="text-sm text-neutral-400 leading-relaxed">All data in transit is shielded via HTTPS/TLS 1.3 headers. Credentials are transformed using adaptive hashing (bcrypt).</div>
                                </div>
                                <div className="flex flex-col min-h-[100px] p-6 gap-3 bg-[#111111] border border-[#1f1f1f] rounded-[24px]">
                                    <div className="flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                      <div className="text-sm font-bold text-white uppercase tracking-widest">Data Minimization</div>
                                    </div>
                                    <div className="text-sm text-neutral-400 leading-relaxed">We only collect and retain data necessary for platform functionality. No payment or financial data is stored locally.</div>
                                </div>
                            </div>
                        </section>

                        <section id="compliance" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">6. Legal Compliance</h2>
                            <p className="text-neutral-400 leading-relaxed text-base">PrepLeague operates under the regulatory frameworks of the <strong>Digital Personal Data Protection Act (DPDPA) 2023</strong> and the <strong>IT Act 2000</strong> of India.</p>
                        </section>

                        <section id="contact" className="scroll-mt-32 pt-12 border-t border-[#1f1f1f]">
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Contact Privacy Team</h2>
                            <p className="text-neutral-400 text-base mb-6">Direct all sovereignty and data-deletion inquiries to:</p>
                            <div className="inline-flex items-center min-h-[48px] px-6 rounded-full bg-[#111111] border border-[#1f1f1f]">
                                <span className="font-mono text-sm font-bold text-white tracking-widest">privacy@prepleague.com</span>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
