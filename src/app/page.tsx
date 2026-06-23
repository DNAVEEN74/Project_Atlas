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
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${scrolled
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
                { n: 'Sprint Mode', h: '/sprint' }
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
              The Elite Practice Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
              Unlock your Full <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">Quant & Reasoning Potential.</span>
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
                Join PrepLeague
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

      {/* --- STATS BAR (Commented out for now) ---
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
      */}

      {/* --- MAIN FEATURES --- */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-40">

          {/* Feature: Problems Repository */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="bg-[#111] border border-neutral-800 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/50">
                   <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                   </div>
                   <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Query: SSC_CGL_2018_2024</div>
                </div>
                <div className="space-y-3">
                  {[
                    { t: 'Percentage Essentials', d: 'Medium', y: '2024', active: true },
                    { t: 'Algebra Reflexes', d: 'Hard', y: '2023', active: false },
                    { t: 'Speed & Distance', d: 'Easy', y: '2024', active: false }
                  ].map((q, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${q.active ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-neutral-900 border border-neutral-800'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${q.active ? 'bg-blue-500' : 'bg-neutral-700'}`}></div>
                        <div className={`text-sm font-bold uppercase tracking-wide ${q.active ? 'text-white' : 'text-neutral-400'}`}>{q.t}</div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md ${q.active ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-800 text-neutral-500'}`}>{q.d}</span>
                         <span className="text-xs text-neutral-500 font-mono">{q.y}</span>
                      </div>
                    </div>
                  ))}
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
                Every <span className="text-blue-500 italic">Real Question</span> at your fingertips.
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-medium">
                Our focused collection of 3,000+ real Quantitative & Reasoning questions allows you to filter by topic, difficulty, and year. Master the same patterns that appear year after year.
              </p>
              <Link href="/problems" className="inline-flex items-center gap-3 text-blue-500 font-bold hover:gap-5 transition-all group">
                Browse Problems <ChevronRightIcon className="group-hover:translate-x-1" />
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
                Enter Sprint Mode <ChevronRightIcon className="group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group transform transition-transform group-hover:-rotate-y-2 group-hover:rotate-x-2">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-amber-500/20 transition-all duration-700"></div>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer-home group-hover:block hidden pointer-events-none"></div>
                <div className="flex justify-between items-center mb-10 border-b border-neutral-800/60 pb-8 relative z-10">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest font-mono flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Live Sprint
                     </span>
                     <span className="text-xs text-white font-bold tracking-wide">Set 04: Quantitative Logic</span>
                  </div>
                  <div className="text-4xl font-mono font-black text-amber-500 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">00:14<span className="text-sm text-amber-500/50 ml-1">s</span></div>
                </div>
                <div className="space-y-4 relative z-10">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-14 rounded-2xl flex items-center justify-between px-6 text-sm font-bold border transition-all ${i === 2 ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02] transform' : 'bg-neutral-900/50 border-neutral-800 text-neutral-500 hover:bg-neutral-800'
                      }`}>
                      <span>Option {String.fromCharCode(64 + i)}</span>
                      {i === 2 && <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded uppercase tracking-widest">Selected</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature: AI Tutor */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform group-hover:translate-y-[-5px]">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-violet-500/20 transition-all duration-700"></div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <PsychologyOutlinedIcon fontSize="small" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-white font-bold text-sm">PrepLeague AI</span>
                       <span className="text-violet-400/70 text-[10px] uppercase tracking-widest font-mono">Tutor Engine Active</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex flex-col items-end">
                     <div className="p-4 bg-neutral-800 border border-neutral-700/50 rounded-2xl rounded-tr-sm text-sm text-neutral-200 font-medium leading-relaxed max-w-[85%] shadow-lg">
                       "Can you explain why we used the Pythagoras theorem here?"
                     </div>
                     <span className="text-[9px] text-neutral-600 font-mono mt-2 mr-1">10:42 AM</span>
                  </div>
                  <div className="flex flex-col items-start">
                     <div className="p-4 bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/30 rounded-2xl rounded-tl-sm text-sm text-white font-medium leading-relaxed max-w-[90%] shadow-[0_0_20px_rgba(139,92,246,0.15)] relative">
                       "Step 2 follows based on the right-angled property of triangle ABC. Since we are given two sides and it's a right triangle, Pythagoras is the most efficient way to find the hypotenuse before applying trig ratios."
                       <div className="absolute -left-2 -top-2 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(139,92,246,0.8)]">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                       </div>
                     </div>
                     <span className="text-[9px] text-violet-400/50 font-mono mt-2 ml-1">10:42 AM</span>
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
              <div className="bg-[#111] border border-neutral-800 rounded-2xl p-10 shadow-xl flex flex-col items-center gap-10">
                {/* Main Diagnostic Ring */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-neutral-800" />
                    <circle
                      cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={552.9}
                      strokeDashoffset={552.9 * (1 - 0.7)}
                      className="text-amber-500 transition-all duration-1000"
                    />
                    <g transform="rotate(90 96 96)">
                      <text x="96" y="100" textAnchor="middle" className="text-5xl font-mono font-bold fill-white tracking-tighter">
                        70<tspan className="fill-amber-500 text-2xl">%</tspan>
                      </text>
                      <text x="96" y="125" textAnchor="middle" className="text-[9px] fill-neutral-500 font-bold uppercase tracking-[0.2em]">
                        Daily Pulse
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Subject Splits */}
                <div className="w-full space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      <span>Quant Potential</span>
                      <span className="text-white font-mono">8/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[80%] rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      <span>Reasoning Reflex</span>
                      <span className="text-white font-mono">6/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-500 w-[60%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Analytics */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group perspective-1000">
              <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform group-hover:rotate-y-[-2deg] group-hover:rotate-x-2">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                <div className="grid grid-cols-7 gap-3 mb-10">
                  {[...Array(28)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-md transition-all duration-500 hover:scale-110 ${i % 4 === 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                      i % 2 === 0 ? 'bg-emerald-500/30' : 'bg-neutral-800/80 border border-neutral-700/50'
                      }`} />
                  ))}
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-5 text-left">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <TrackChangesOutlinedIcon />
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest mb-1">Consistency</div>
                      <div className="text-white font-black text-lg">Target: 88% Accuracy</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-black text-sm uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">On Track</div>
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
                Our analytics engine identifies your weak Quant & Reasoning topics before they become failures. Visualize your practice consistency across every single day of the year.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-3 text-emerald-500 font-bold hover:gap-5 transition-all group">
                Open Data Dashboard <ChevronRightIcon className="group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- PLATFORM FEATURES (Core Experience) --- */}
      <section className="py-32 px-6 bg-[#0a0a0a] border-y border-neutral-900 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            The Complete Core Experience
          </div>
          
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6">
            Elite Preparation. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              Zero Compromise.
            </span>
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-20 font-medium leading-relaxed">
            Everything you need to master your exams, packaged into an incredibly powerful platform without the paywalls.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
             {/* Left tall card */}
             <div className="md:col-span-1 rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8 hover:bg-neutral-900/60 transition-all group backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/5">
                   <PsychologyOutlinedIcon />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI-Powered Clarifications</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                   Stuck on a tricky reasoning problem? Our integrated AI tutor gives you step-by-step contextual hints without giving away the direct answer.
                </p>
                <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-950 inline-block px-3 py-1 rounded-full border border-neutral-800">
                   {process.env.NEXT_PUBLIC_DAILY_AI_QUESTION_LIMIT || 3} Uses Daily
                </div>
             </div>

             {/* Middle stacked cards */}
             <div className="md:col-span-1 space-y-6 flex flex-col">
                 <div className="flex-1 rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8 hover:bg-neutral-900/60 transition-all group backdrop-blur-sm relative overflow-hidden">
                    <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/5">
                       <TrackChangesOutlinedIcon />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Deep Analytics Heatmap</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                       Visualize your 365-day practice consistency and identify weak topics instantly.
                    </p>
                 </div>
                 <div className="flex-1 rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8 hover:bg-neutral-900/60 transition-all group backdrop-blur-sm relative overflow-hidden">
                    <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center text-violet-400 mb-5 shadow-lg shadow-violet-500/5">
                       <BoltIcon />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">High-Intensity Sprints</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                       Timed precision drills designed to significantly improve your exam-day speed.
                    </p>
                 </div>
             </div>

             {/* Right tall card */}
             <div className="md:col-span-1 rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8 hover:bg-neutral-900/60 transition-all group backdrop-blur-sm relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/5">
                   <MenuBookOutlinedIcon />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3,000+ Verified PYQs</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                   Gain absolute mastery with an extensive library of verified Previous Year Questions across all Quant and Reasoning topics.
                </p>
                <div className="mt-auto pt-6 border-t border-neutral-800">
                   <Link href="/register" className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black font-bold rounded-xl text-center hover:bg-neutral-200 transition-all shadow-xl active:scale-[0.98]">
                      Start Practicing <ChevronRightIcon className="w-4 h-4" />
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
            Join the elite community and start mastering your <span className="text-white">Quant & Reasoning</span> goals today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link
              href="/register"
              className="px-12 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              Start Practicing
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
