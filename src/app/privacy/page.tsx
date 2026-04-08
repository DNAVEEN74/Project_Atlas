'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { MenuIcon, CloseIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState('info-collect');
    const [scrolled, setScrolled] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            const sections = [
                'info-collect', 'how-we-use', 'sharing', 'retention',
                'rights', 'security', 'children', 'cookies',
                'links', 'international', 'changes', 'contact', 'compliance'
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
        { id: 'info-collect', label: 'Information We Collect' },
        { id: 'how-we-use', label: 'How We Use Data' },
        { id: 'sharing', label: 'Data Sharing Protocols' },
        { id: 'retention', label: 'Data Retention' },
        { id: 'rights', label: 'Your User Rights' },
        { id: 'security', label: 'Security Infrastructure' },
        { id: 'children', label: "Children's Privacy" },
        { id: 'cookies', label: 'Cookies & Advertising' },
        { id: 'links', label: 'Third-Party Links' },
        { id: 'international', label: 'International Transfers' },
        { id: 'changes', label: 'Policy Transformations' },
        { id: 'contact', label: 'Contact Privacy Team' },
        { id: 'compliance', label: 'Legal Compliance' },
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
                          <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] px-1">Integrity Framework</h4>
                          <nav className="flex flex-col">
                              {sidebarLinks.map((link, i) => (
                                  <button
                                      key={link.id}
                                      onClick={() => scrollToSection(link.id)}
                                      className="group relative flex items-center gap-3 py-2 text-left transition-all"
                                  >
                                      <span className={`text-[10px] font-mono font-bold transition-colors ${activeSection === link.id ? 'text-white' : 'text-neutral-700'}`}>{String(i + 1).padStart(2, '0')}</span>
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
                          Data Sovereignty
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
                            Privacy Policy
                        </h1>
                        <div className="flex items-center gap-3 text-xs font-mono font-bold text-neutral-500">
                            <span>LAST UPDATED:</span>
                            <span className="text-neutral-300 uppercase">FEBRUARY 18, 2026</span>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-neutral max-w-none">
                        <p className="text-lg text-neutral-400 leading-relaxed font-medium mb-12">
                          PrepLeague ("we," "us," or "our") operates prepleague.com. This Privacy Policy details our operational protocols for collecting and protecting your identity while you utilize our preparation engine.
                        </p>

                        <section id="info-collect" className="scroll-mt-32 mb-20">
                            <h2 className="text-xl font-bold text-white mb-6">1. Information We Collect</h2>
                            <p className="text-neutral-500 leading-relaxed mb-10">We collect granular data to optimize your performance engine and secure your preparation history.</p>

                            <div className="grid md:grid-cols-2 gap-6 bg-[#1a1a1a] p-8 rounded-3xl border border-neutral-800">
                                <div>
                                    <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Identity Data</h4>
                                    <ul className="text-sm text-neutral-500 space-y-2 mb-0 list-none p-0">
                                        <li>• Verified name & Email</li>
                                        <li>• Hashed credentials</li>
                                        <li>• Goal benchmarks</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Financial Data</h4>
                                    <ul className="text-sm text-neutral-500 space-y-2 mb-0 list-none p-0">
                                        <li>• Razorpay identifiers</li>
                                        <li>• Billing geography</li>
                                        <li>• Subscription status</li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Engine Metrics</h4>
                                    <ul className="text-sm text-neutral-500 space-y-2 mb-0 list-none p-0 font-mono">
                                        <li>• Precision stats (Accuracy)</li>
                                        <li>• Sprint reflex timing</li>
                                        <li>• Heatmap history</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section id="how-we-use" className="scroll-mt-32 mb-20 text-neutral-400">
                            <h2 className="text-xl font-bold text-white mb-6">2. Utilization Protocol</h2>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">Performance Optimization</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed mt-2">Personalizing your question repository and automating "Weakspot Drills" based on real-time accuracy metrics.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">Analytic Scaling</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed mt-2">Generating predictive scores and visualized heatmaps to trace your growth across 365 days.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">Operational Integrity</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed mt-2">Securing billing flows, preventing fraud, and delivering critical engine updates via transactional emails.</p>
                                </div>
                            </div>
                        </section>

                        <section id="sharing" className="scroll-mt-32 mb-20 text-neutral-400">
                            <h2 className="text-xl font-bold text-white mb-6">3. Data Sharing Protocols</h2>
                            <div className="px-5 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-8">
                                <p className="text-amber-200 text-sm font-bold m-0">Protocol Zero: We do not sell personal identification to third-party data harvesters.</p>
                            </div>
                            <p className="mb-6">We only transmit data to verified infrastructure partners required to maintain the platform:</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                               <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                                  <span className="text-[10px] font-mono font-bold text-neutral-600 block mb-1">PAYMENT ENGINE</span>
                                  <span className="text-sm text-white font-bold">Razorpay</span>
                               </div>
                               <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                                  <span className="text-[10px] font-mono font-bold text-neutral-600 block mb-1">INFRASTRUCTURE</span>
                                  <span className="text-sm text-white font-bold">Vercel</span>
                               </div>
                               <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                                  <span className="text-[10px] font-mono font-bold text-neutral-600 block mb-1">STAGING DATABASE</span>
                                  <span className="text-sm text-white font-bold">MongoDB Atlas</span>
                               </div>
                            </div>
                        </section>

                        <section id="cookies" className="scroll-mt-32 mb-20">
                            <h2 className="text-xl font-bold text-white mb-6">8. Cookies &amp; Advertising</h2>
                            <p className="text-neutral-500 leading-relaxed mb-8">We use cookies and similar tracking technologies to enhance your experience and serve relevant advertising.</p>

                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-neutral-800">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Essential Cookies</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed">Required for core platform functions — authentication sessions, preferences, and security tokens. These cannot be disabled.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-amber-500/10">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Advertising Cookies (Google AdSense)</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                                        PrepLeague uses <strong className="text-neutral-300">Google AdSense</strong> to display advertisements on the free tier. Google and its partners use cookies (including the <strong className="text-neutral-300">DoubleClick cookie</strong>) to serve ads based on your prior visits to this and other websites.
                                    </p>
                                    <ul className="text-sm text-neutral-500 space-y-2 list-none">
                                        <li>• Google's use of advertising cookies enables it and its partners to serve ads based on your visit to PrepLeague and other sites.</li>
                                        <li>• You may <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 underline underline-offset-2">opt out of personalised advertising</a> by visiting Google Ads Settings.</li>
                                        <li>• You can also opt out via <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 underline underline-offset-2">aboutads.info</a>.</li>
                                    </ul>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-neutral-800">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Analytics Cookies</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed">Used to understand how visitors interact with the platform — page views, session lengths, and navigation paths. Data is aggregated and anonymised.</p>
                                </div>

                                <div className="px-5 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
                                    <p className="text-neutral-400 text-sm">You can manage or disable cookies via your browser settings. Note that disabling certain cookies may affect platform functionality.</p>
                                </div>
                            </div>
                        </section>

                        <section id="security" className="scroll-mt-32 mb-20">
                            <h2 className="text-xl font-bold text-white mb-6">6. Security Infrastructure</h2>
                            <div className="p-8 rounded-3xl bg-[#1a1a1a] border border-neutral-800 space-y-6">
                                <div className="flex gap-4">
                                  <div className="w-1 h-auto bg-amber-500 rounded-full" />
                                  <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">Encryption Protocols</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed m-0">All data in transit is shielded via HTTPS/TLS 1.3 headers. Credentials are transformed using adaptive hashing (bcrypt).</p>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="w-1 h-auto bg-emerald-500 rounded-full" />
                                  <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">Financial Safety</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed m-0">Zero local card storage. Every transaction is handled by PCI DSS compliant environments via Razorpay.</p>
                                  </div>
                                </div>
                            </div>
                        </section>

                        <section id="compliance" className="scroll-mt-32 mb-20 text-neutral-400 leading-relaxed">
                            <h2 className="text-xl font-bold text-white mb-6">13. Legal Compliance</h2>
                            <p>PrepLeague operates under the regulatory frameworks of the <strong>Digital Personal Data Protection Act (DPDPA) 2023</strong> and the <strong>IT Act 2000</strong> of India.</p>
                        </section>

                        <section id="contact" className="scroll-mt-32 pt-12 border-t border-neutral-800">
                            <h2 className="text-xl font-bold text-white mb-6">Contact Privacy Team</h2>
                            <p className="text-neutral-500 text-sm mb-4">Direct all sovereignty and data-deletion inquiries to:</p>
                            <div className="font-mono text-xs font-bold text-white">
                                privacy@prepleague.com
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
