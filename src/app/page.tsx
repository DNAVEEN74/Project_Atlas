"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BoltIcon,
  ChevronRightIcon,
  CheckCircleOutlinedIcon,
  MenuIcon,
  CloseIcon,
  TrendingUpIcon,
  TrackChangesOutlinedIcon,
  MenuBookOutlinedIcon,
  PsychologyOutlinedIcon,
} from '@/components/icons';
import Footer from '@/components/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-neutral-200 selection:bg-amber-500/30 selection:text-white font-sans antialiased overflow-x-hidden">
      
      <style jsx global>{`
        .animate-shimmer-home {
          animation: shimmer 3s infinite linear;
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>

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

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-20">
        <div className="absolute top-1/4 right-[10%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-[10%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-800/30 border border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-10">
              The Systematic Aspirants Engine
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
              Unlock your Full <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">Maths & Reasoning Potential.</span>
            </h1>

            <p className="text-base md:text-lg text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              3,000+ real Quantitative & Reasoning PYQs. High-intensity Sprint drills. Precise analytics.
              <span className="block mt-2">Built for aspirants who prioritize <span className="text-white font-semibold underline decoration-amber-500/30 underline-offset-4">elite performance.</span></span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-xl active:scale-[0.98]"
              >
                Join PrepLeague Free
              </Link>
              <Link
                href="/problems"
                className="w-full sm:w-auto px-10 py-4 bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-800 transition-all active:scale-[0.98]"
              >
                Explore Problems
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-20 px-6 bg-[#0f0f0f] border-y border-neutral-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { l: 'QUESTIONS SOLVED', v: '15,400+', c: 'text-amber-500' },
            { l: 'PYQ REPOSITORY', v: '3,000+', c: 'text-blue-500' },
            { l: 'CONCEPT CLARIFIED', v: '5,200+', c: 'text-violet-500' },
            { l: 'EXAM COVERAGE', v: '2018-24', c: 'text-neutral-400' },
          ].map((s, i) => (
            <div key={i} className="group cursor-default">
              <div className={`text-3xl md:text-4xl font-mono font-bold tracking-tighter mb-2 ${s.c}`}>{s.v}</div>
              <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MAIN FEATURES --- */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-40">
          
          {/* Feature: Problems Repository */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-10 shadow-2xl">
                <div className="space-y-4 opacity-80">
                   {[
                    { t: 'Percentage Essentials', d: 'Medium • 2024', y: 'SSC CGL' },
                    { t: 'Algebra Reflexes', d: 'Hard • 2023', y: 'SSC CGL' },
                    { t: 'Speed & Distance', d: 'Easy • 2024', y: 'SSC CGL' }
                   ].map((q, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-neutral-800 rounded-xl">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                           <div className="text-xs font-bold text-white uppercase">{q.t}</div>
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">{q.d}</div>
                      </div>
                   ))}
                </div>
                <div className="absolute -bottom-6 right-6 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                   Filtered by: 2018-2024
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 border border-blue-500/10">
                  <MenuBookOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                </div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Problem Repository</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-snug">
                Every <span className="text-blue-500">Real Question</span> at your fingertips.
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium">
                Our focused collection of 3,000+ real Quantitative & Reasoning questions allows you to filter by topic, difficulty, and year. Master the same patterns that appear year after year.
              </p>
              <Link href="/problems" className="inline-flex items-center gap-3 text-blue-500 font-bold hover:gap-5 transition-all group">
                Browse Repository <ChevronRightIcon className="group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Feature: Sprint */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/10">
                  <BoltIcon sx={{ fontSize: '1.4rem' }} />
                </div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Sprint Mode</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-snug">
                Train your reflexes <br />not just your <span className="text-amber-500 italic">memory.</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium">
                Speed is the ultimate separator. Our high-intensity <span className="text-white">Sprint Mode</span> builds mental agility under pressure with category-specific timed drills.
              </p>
              <Link href="/sprint" className="inline-flex items-center gap-3 text-amber-500 font-bold hover:gap-5 transition-all group">
                Enter Training Room <ChevronRightIcon className="group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-10 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer-home group-hover:block hidden"></div>
                <div className="flex justify-between items-center mb-10 border-b border-neutral-800/50 pb-8">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest font-mono">Set 04: Quantitative Logic</span>
                  <div className="text-3xl font-mono font-bold text-amber-500 tabular-nums">00:14<span className="text-xs text-neutral-600 ml-1">s</span></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-12 rounded-xl flex items-center px-5 text-sm font-semibold border ${
                      i === 2 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                    }`}>
                      Option {String.fromCharCode(64 + i)} {i === 2 && '• SELECT'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature: AI Tutor */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative bg-[#1a1a1a] border border-violet-500/20 rounded-2xl p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <PsychologyOutlinedIcon />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest">
                    AI Clarification
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl rounded-bl-none text-xs text-neutral-400 font-medium leading-relaxed max-w-[90%]">
                    "Can you explain why we used the Pythagoras theorem here?"
                  </div>
                  <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl rounded-br-none text-xs text-neutral-200 font-medium leading-relaxed ml-auto max-w-[90%]">
                    "Step 2 follows based on the right-angled property of triangle ABC..."
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-500 border border-violet-500/10">
                  <PsychologyOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                </div>
                <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">AI Clarification Tutor</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-snug">
                Understand the <span className="text-violet-500 italic">"Why"</span> <br />behind every solution.
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium">
                Stuck on a concept? Ask our <span className="text-white">AI Tutor</span> to explain logic, offer hints, or solve any specific doubts about the question.
              </p>
              <div className="text-sm font-bold text-violet-400 flex items-center gap-2">
                <CheckCircleOutlinedIcon className="w-4 h-4" /> conceptual clarity at your command.
              </div>
            </div>
          </div>

          {/* Feature: Daily Targets */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/10">
                  <BoltIcon sx={{ fontSize: '1.4rem' }} />
                </div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Daily Target Rituals</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-snug">
                Consistency is the only <br />
                <span className="text-amber-500 italic">unfair advantage.</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium">
                Set your own pace. Whether it's 10 questions or 100, the Engine tracks your daily momentum and keeps you accountable to your own ambition. No more guesswork—just progress.
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-white mb-1">14/20</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Questions Today</div>
                </div>
                <div className="h-8 w-px bg-neutral-800" />
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-amber-500 mb-1">7 Days</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Current Streak</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-10 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-center py-10">
                   <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-neutral-800" />
                        <motion.circle 
                          cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" 
                          strokeDasharray={552.92}
                          initial={{ strokeDashoffset: 552.92 }}
                          whileInView={{ strokeDashoffset: 552.92 * (1 - 0.7) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="text-amber-500" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-mono font-bold text-white">70%</span>
                         <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Daily Goal</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Analytics */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-10 shadow-2xl">
                 <div className="grid grid-cols-7 gap-2 mb-10">
                    {[...Array(28)].map((_, i) => (
                      <div key={i} className={`aspect-square rounded-[3px] transition-all ${
                        i % 4 === 0 ? 'bg-emerald-500/80 shadow-lg shadow-emerald-500/10' : 
                        i % 2 === 0 ? 'bg-emerald-500/20' : 'bg-neutral-800'
                      }`} />
                    ))}
                 </div>
                 <div className="flex items-center justify-between p-5 bg-[#0f0f0f] border border-neutral-800 rounded-xl">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                        <TrackChangesOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Consistency</div>
                        <div className="text-white font-bold text-sm">Target Accuracy: 88%</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-xs uppercase tracking-tighter pr-2">On Track</div>
                 </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                  <TrendingUpIcon sx={{ fontSize: '1.4rem' }} />
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Precision Analytics</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-snug">
                Trace every <span className="text-emerald-500 italic">second</span> of your journey.
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium">
                Our Pro Engine identifies your weak Maths & Reasoning topics before they become failures. Visualize your practice consistency across every single day of the year.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-3 text-emerald-500 font-bold hover:gap-5 transition-all group">
                Open Data Dashboard <ChevronRightIcon className="group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- PREPARATION PATHS (Tiers Comparison) --- */}
      <section className="py-32 px-6 bg-[#161616] border-y border-neutral-800/80">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-10">
            Choose your path
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-16">
            Elite Preparation. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Zero Compromise.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left items-stretch">
            
            {/* TIER 1: CORE EXPERIENCE (FREEMIUM) */}
            <div className="p-8 md:p-12 rounded-3xl bg-[#1a1a1a] border border-neutral-800 relative group overflow-hidden flex flex-col h-full transition-all hover:border-neutral-700">
               <div className="absolute top-0 right-0 p-6">
                 <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Standard Tier</div>
               </div>
               
               <h3 className="text-2xl font-bold text-white mb-4">Core Experience</h3>
               <p className="text-neutral-500 text-sm mb-10 leading-relaxed font-medium h-10">
                 Essential tools for every aspirant to start their journey.
               </p>
               
               <div className="space-y-4 mb-12 flex-1">
                  {[
                    { t: '3,000+ Maths & Reasoning PYQs', d: 'Filter by topic and year.' },
                    { t: 'Daily Practice Limits', d: '1 Sprint Drill and 2 AI clarifications.' },
                    { t: '365-Day Practice Heatmap', d: 'Basic visibility into your history.' },
                    { t: 'Topic-wise Accuracy Stats', d: 'See performance across categories.' },
                    { t: 'Supported by minimal ads', d: 'Helping keep research free for all.' }
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} />
                      </div>
                      <div>
                         <div className={`text-sm ${i === 4 ? 'text-amber-500/70 font-bold' : 'text-neutral-300 font-bold'}`}>{f.t}</div>
                         <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-medium">{f.d}</div>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-auto pt-6">
                 <Link href="/register" className="block w-full py-4 bg-neutral-800 text-neutral-400 font-bold rounded-xl text-center hover:bg-neutral-700 transition-all active:scale-[0.98]">
                   Start Free Preparation
                 </Link>
               </div>
            </div>

            {/* TIER 2: PRO ENGINE (PREMIUM) */}
            <div className="p-8 md:p-12 rounded-3xl bg-[#1a1a1a] border border-amber-500/40 relative shadow-2xl shadow-amber-500/5 group overflow-hidden flex flex-col h-full transition-all hover:border-amber-500/60">
               <div className="absolute top-0 right-0 p-6">
                 <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded">Best for Selection</div>
               </div>
               
               <h3 className="text-2xl font-bold text-white mb-4">The Pro Engine</h3>
               <p className="text-amber-500/70 text-sm mb-10 leading-relaxed font-bold h-10">
                 Elite data tools for aspirants who refuse to stay in the average.
               </p>
               
               <div className="space-y-4 mb-12 flex-1">
                  {[
                    { t: 'Unlimited AI Tutor', d: 'Infinite clarifications for conceptual clarity.' },
                    { t: 'Full Performance Engine', d: 'Advanced Heatmaps and predictive score.' },
                    { t: 'Weak Topic Isolation', d: 'Automated "Weakspot Drills" to fix failures.' },
                    { t: 'Unlimited Sprint Training', d: 'High intensity timed drills without limits.' },
                    { t: 'Ad-free Experience', d: 'Focus entirely on solving questions.' }
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <CheckCircleOutlinedIcon className="text-amber-500 mt-0.5" sx={{ fontSize: '1.2rem' }} />
                      <div>
                         <div className="text-sm text-white font-bold">{f.t}</div>
                         <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-medium">{f.d}</div>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-auto pt-6">
                 <Link href="/pricing" className="block w-full py-4 bg-white text-black font-bold rounded-xl text-center hover:bg-neutral-200 transition-all shadow-xl active:scale-[0.98]">
                   Unlock Pro Engine
                 </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative py-48 px-6 text-center overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold text-white mb-8">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">Ascend?</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-xl mx-auto font-medium">
            Join the elite community and start mastering your <span className="text-white">Maths & Reasoning</span> goals today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              href="/register" 
              className="px-12 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/login" 
              className="text-neutral-400 font-bold hover:text-white transition-all flex items-center gap-2 group"
            >
              Sign in to account <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
