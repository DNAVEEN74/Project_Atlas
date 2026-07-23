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

/* ─────────────────────────────────────────────
   M3 Dark Theme × PrepLeague Color System
   Matches existing app pages (problems, dashboard)
   ─────────────────────────────────────────────
   surface:            #0a0a0a   (main bg — matches Header/Problems)
   surfaceContainer:   #111111   (slightly elevated)
   surfaceContHigh:    #141414   (cards — matches problems page)
   surfaceContHighest: #1a1a1a   (elevated panels)
   outlineVariant:     #1f1f1f   (borders — matches app-wide)
   outline:            #2b2b2b   (stronger borders)
   onSurface:          white     (primary text)
   onSurfaceVariant:   neutral-400  (secondary text)
   muted:              neutral-500  (tertiary text)
   primary:            amber-500    (accent)
   ───────────────────────────────────────────── */

// M3 emphasized easing
const m3Easing = [0.2, 0, 0, 1] as const;

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
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/25 selection:text-white font-sans antialiased overflow-x-hidden">

      {/* ━━━ M3 TOP APP BAR ━━━ */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
        ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f1f1f]/50'
        : 'bg-transparent border-b border-transparent'
        }`}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
              <div className="relative w-9 h-9">
                <Image src="/logo-final.png" alt="Logo" fill className="object-contain" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white tracking-tight">PrepLeague</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { n: 'Home', h: '/' },
                { n: 'Problems', h: '/problems' },
                { n: 'Sprint Mode', h: '/sprint' }
              ].map((item) => (
                <Link
                  key={item.n}
                  href={item.h}
                  className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all duration-200"
                >
                  {item.n}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-amber-500 text-black text-sm font-bold rounded-[20px] hover:bg-amber-400 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-amber-500/10">
              Get Started
            </Link>
            <button className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors" onClick={() => setShowMobileMenu(true)}>
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* M3 Navigation Drawer (Mobile) */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Scrim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setShowMobileMenu(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: m3Easing }}
                className="fixed top-0 right-0 bottom-0 z-[200] lg:hidden w-64 bg-[#1a1a1a] border-l border-neutral-800 flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button onClick={() => setShowMobileMenu(false)} className="text-neutral-400 hover:text-white p-1">
                    <CloseIcon />
                  </button>
                </div>
                <nav className="flex flex-col p-4 gap-2">
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
                      className="px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-all"
                    >
                      {item.n}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-6">
                  <Link
                    href="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-center px-6 py-3.5 bg-amber-500 text-black font-bold rounded-[20px] hover:bg-amber-400 transition-all active:scale-[0.97]"
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ━━━ M3 HERO SECTION ━━━ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 pt-16">
        {/* Subtle tonal gradient */}
        <div className="absolute top-1/4 right-[10%] w-[300px] h-[300px] bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-[10%] w-[300px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-float" />

        <div className="max-w-[800px] mx-auto text-center relative z-10 pt-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            {/* M3 Chip */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: m3Easing } } }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-[#1f1f1f] text-xs font-medium text-neutral-500 mb-10 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              The Elite Practice Platform
            </motion.div>

            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: m3Easing } } }} className="text-4xl sm:text-5xl md:text-[3.75rem] font-bold tracking-tight mb-6 leading-[1.1] text-white">
              Unlock your Full <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Quant & Reasoning Potential.</span>
            </motion.h1>

            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: m3Easing } } }} className="text-base md:text-lg text-neutral-400 max-w-[640px] mx-auto mb-10 leading-relaxed">
              3,000+ real Quantitative & Reasoning PYQs. High-intensity Sprint drills. Precise analytics.
              <span className="block mt-2">Built for aspirants who prioritize <span className="text-white font-semibold">elite performance.</span></span>
            </motion.p>

            {/* M3 Button Pair: Filled + Tonal */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: m3Easing } } }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-4 bg-amber-500 text-black font-bold text-sm rounded-[20px] hover:bg-amber-400 hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-amber-500/10"
              >
                Join PrepLeague
              </Link>
              <Link
                href="/problems"
                className="w-full sm:w-auto px-10 py-4 bg-amber-500/10 text-amber-500 font-bold text-sm rounded-[20px] border border-amber-500/20 hover:bg-amber-500/15 transition-all duration-200 active:scale-[0.97]"
              >
                Explore Problems
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ M3 FEATURE SECTIONS ━━━ */}
      <section className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto space-y-32">

          {/* ── Feature: Problems Repository ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: m3Easing }} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mock UI Card */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-7">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1f1f1f]">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2b2b2b]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2b2b2b]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2b2b2b]" />
                </div>
                <div className="text-xs font-mono text-neutral-600">SSC CGL 2018–2024</div>
              </div>
              <div className="space-y-2.5">
                {[
                  { t: 'Percentage Essentials', d: 'Medium', y: '2024', active: true },
                  { t: 'Algebra Reflexes', d: 'Hard', y: '2023', active: false },
                  { t: 'Speed & Distance', d: 'Easy', y: '2024', active: false }
                ].map((q, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${q.active
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-[#141414] border border-[#1f1f1f] hover:bg-[#1a1a1a] hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20'
                    } cursor-pointer`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${q.active ? 'bg-blue-500' : 'bg-neutral-700'}`} />
                      <span className={`text-sm font-medium ${q.active ? 'text-white' : 'text-neutral-400'}`}>{q.t}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${q.active
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-[#1a1a1a] text-neutral-500'
                        }`}>{q.d}</span>
                      <span className="text-xs text-neutral-600 font-mono">{q.y}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Copy */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                  <MenuBookOutlinedIcon sx={{ fontSize: '1.25rem' }} />
                </div>
                <span className="text-sm font-medium text-blue-500">Problem Repository</span>
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-white mb-5 leading-snug tracking-tight">
                Every <span className="text-blue-500 italic">Real Question</span> at your fingertips.
              </h2>
              <p className="text-base text-neutral-400 mb-8 leading-relaxed">
                Our focused collection of 3,000+ real Quantitative & Reasoning questions allows you to filter by topic, difficulty, and year. Master the same patterns that appear year after year.
              </p>
              <Link href="/problems" className="inline-flex items-center gap-2 text-blue-500 font-semibold text-sm hover:gap-3 transition-all group">
                Browse Problems <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* ── Feature: Sprint ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: m3Easing }} className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/10">
                  <BoltIcon sx={{ fontSize: '1.25rem' }} />
                </div>
                <span className="text-sm font-medium text-amber-500">Sprint Mode</span>
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-white mb-5 leading-snug tracking-tight">
                Train your reflexes <br />not just your <span className="text-amber-500 italic">memory.</span>
              </h2>
              <p className="text-base text-neutral-400 mb-8 leading-relaxed">
                Speed is the ultimate separator. Our high-intensity <span className="text-white">Sprint Mode</span> builds mental agility under pressure with category-specific timed drills.
              </p>
              <Link href="/sprint" className="inline-flex items-center gap-2 text-amber-500 font-semibold text-sm hover:gap-3 transition-all group">
                Enter Sprint Mode <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            {/* Mock Sprint UI */}
            <div className="order-1 lg:order-2">
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#1f1f1f]">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-amber-500 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Live Sprint
                    </span>
                    <span className="text-sm text-white font-medium">Set 04: Quantitative Logic</span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-amber-500 tabular-nums tracking-tighter">00:14<span className="text-sm text-amber-500/50 ml-0.5">s</span></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-14 rounded-2xl flex items-center justify-between px-5 text-sm font-medium border transition-all duration-200 ${i === 2
                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                      : 'bg-[#141414] border-[#1f1f1f] text-neutral-500 hover:bg-[#1a1a1a] hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20'
                      } cursor-pointer`}>
                      <span>Option {String.fromCharCode(64 + i)}</span>
                      {i === 2 && <span className="text-[11px] bg-amber-500 text-black px-2.5 py-0.5 rounded-full font-bold">Selected</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Feature: AI Tutor ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: m3Easing }} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mock Chat UI */}
            <div className="group">
              <div className="bg-[#111111] border border-violet-500/15 rounded-[24px] p-7 transition-transform duration-300 group-hover:translate-y-[-4px]">
                <div className="flex items-center justify-between mb-7 pb-4 border-b border-[#1f1f1f]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400 border border-violet-500/20">
                      <PsychologyOutlinedIcon fontSize="small" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">PrepLeague AI</span>
                      <span className="text-violet-400/60 text-xs font-medium">Tutor Engine Active</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex flex-col items-end">
                    <div className="p-4 bg-[#1a1a1a] border border-[#1f1f1f] rounded-2xl rounded-tr-sm text-sm text-neutral-300 leading-relaxed max-w-[85%]">
                      &quot;Can you explain why we used the Pythagoras theorem here?&quot;
                    </div>
                    <span className="text-[10px] text-neutral-600 mt-2 mr-1">10:42 AM</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl rounded-tl-sm text-sm text-neutral-200 leading-relaxed max-w-[90%] relative">
                      &quot;Step 2 follows based on the right-angled property of triangle ABC. Since we are given two sides and it&apos;s a right triangle, Pythagoras is the most efficient way to find the hypotenuse before applying trig ratios.&quot;
                      <div className="absolute -left-1.5 -top-1.5 w-3.5 h-3.5 bg-violet-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>
                    <span className="text-[10px] text-violet-400/40 mt-2 ml-1">10:42 AM</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Copy */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 border border-violet-500/10">
                  <PsychologyOutlinedIcon sx={{ fontSize: '1.25rem' }} />
                </div>
                <span className="text-sm font-medium text-violet-500">AI Clarification Tutor</span>
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-white mb-5 leading-snug tracking-tight">
                Understand the <span className="text-violet-500 italic">&quot;Why&quot;</span> <br />behind every solution.
              </h2>
              <p className="text-base text-neutral-400 mb-8 leading-relaxed">
                Stuck on a concept? Ask our <span className="text-white">AI Tutor</span> to explain logic, offer hints, or solve any specific doubts about the question.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-400">
                <CheckCircleOutlinedIcon className="w-4 h-4" /> Conceptual clarity at your command.
              </div>
            </div>
          </motion.div>

          {/* ── Feature: Daily Targets ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: m3Easing }} className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/10">
                  <BoltIcon sx={{ fontSize: '1.25rem' }} />
                </div>
                <span className="text-sm font-medium text-amber-500">Daily Target Rituals</span>
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-white mb-5 leading-snug tracking-tight">
                Consistency is the only <br />
                <span className="text-amber-500 italic">unfair advantage.</span>
              </h2>
              <p className="text-base text-neutral-400 mb-8 leading-relaxed">
                Set your own pace. Whether it&apos;s 10 questions or 100, the Engine tracks your daily momentum and keeps you accountable to your own ambition. No more guesswork—just progress.
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-white mb-1">14/20</div>
                  <div className="text-xs text-neutral-500 font-medium">Questions Today</div>
                </div>
                <div className="h-8 w-px bg-[#1f1f1f]" />
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-amber-500 mb-1">7 Days</div>
                  <div className="text-xs text-neutral-500 font-medium">Current Streak</div>
                </div>
              </div>
            </div>
            {/* Diagnostic Ring Card */}
            <div className="order-1 lg:order-2">
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-8 flex flex-col items-center gap-8">
                {/* Main Ring */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="80" fill="transparent" stroke="#1f1f1f" strokeWidth="7" />
                    <circle
                      cx="88" cy="88" r="80" fill="transparent" stroke="currentColor" strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={502.6}
                      strokeDashoffset={502.6 * (1 - 0.7)}
                      className="text-amber-500 transition-all duration-1000"
                    />
                    <g transform="rotate(90 88 88)">
                      <text x="88" y="92" textAnchor="middle" className="text-4xl font-mono font-bold fill-white tracking-tighter">
                        70<tspan className="fill-amber-500 text-xl">%</tspan>
                      </text>
                      <text x="88" y="114" textAnchor="middle" className="text-[10px] fill-neutral-500 font-medium">
                        Daily Pulse
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Subject Progress Bars */}
                <div className="w-full space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-neutral-400">
                      <span>Quant Potential</span>
                      <span className="text-white font-mono">8/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[80%] rounded-full transition-all duration-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-neutral-400">
                      <span>Reasoning Reflex</span>
                      <span className="text-white font-mono">6/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-500 w-[60%] rounded-full transition-all duration-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Feature: Analytics ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: m3Easing }} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Heatmap Card */}
            <div className="group">
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-8 transition-transform duration-300 group-hover:translate-y-[-4px]">
                <div className="grid grid-cols-7 gap-2.5 mb-8">
                  {[...Array(28)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-md transition-all duration-300 hover:scale-110 ${i % 4 === 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                      i % 2 === 0 ? 'bg-emerald-500/25' : 'bg-[#1f1f1f]'
                      }`} />
                  ))}
                </div>
                <div className="flex items-center justify-between p-5 bg-emerald-500/[0.07] border border-emerald-500/15 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <TrackChangesOutlinedIcon fontSize="small" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-500/70 font-medium mb-0.5">Consistency</div>
                      <div className="text-white font-bold text-sm">Target: 88% Accuracy</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/15">On Track</div>
                </div>
              </div>
            </div>
            {/* Copy */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                  <TrendingUpIcon sx={{ fontSize: '1.25rem' }} />
                </div>
                <span className="text-sm font-medium text-emerald-500">Precision Analytics</span>
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-white mb-5 leading-snug tracking-tight">
                Trace every <span className="text-emerald-500 italic">second</span> of your journey.
              </h2>
              <p className="text-base text-neutral-400 mb-8 leading-relaxed">
                Our analytics engine identifies your weak Quant & Reasoning topics before they become failures. Visualize your practice consistency across every single day of the year.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-emerald-500 font-semibold text-sm hover:gap-3 transition-all group">
                Open Data Dashboard <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ━━━ M3 CORE EXPERIENCE SECTION ━━━ */}
      <section className="py-24 px-6 bg-[#080808] border-y border-[#1f1f1f]/50 relative overflow-hidden">
        {/* Very subtle ambient */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          {/* M3 Chip Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-[#1f1f1f] text-xs font-medium text-amber-500 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            The Complete Core Experience
          </div>

          <h2 className="text-3xl md:text-[3.25rem] font-bold text-white mb-5 tracking-tight leading-tight">
            Elite Preparation. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Zero Compromise.</span>
          </h2>
          <p className="text-neutral-400 text-base md:text-lg max-w-[600px] mx-auto mb-16 leading-relaxed font-medium">
            Everything you need to master your exams, packaged into an incredibly powerful platform without the paywalls.
          </p>

          {/* M3 Card Grid */}
          <div className="grid md:grid-cols-3 gap-5 text-left">
            {/* Left card */}
            <div className="rounded-[24px] bg-[#111111] border border-[#1f1f1f] p-7 hover:bg-[#141414] hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.04] rounded-full blur-3xl group-hover:bg-amber-500/[0.07] transition-all" />
              <div className="w-11 h-11 bg-[#1f1f1f] rounded-xl flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                <PsychologyOutlinedIcon />
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5">AI-Powered Clarifications</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-5">
                Stuck on a tricky reasoning problem? Our integrated AI tutor gives you step-by-step contextual hints without giving away the direct answer.
              </p>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#1f1f1f] text-xs font-medium text-neutral-600">
                {process.env.NEXT_PUBLIC_DAILY_AI_QUESTION_LIMIT || 3} Uses Daily
              </div>
            </div>

            {/* Middle stacked cards */}
            <div className="space-y-5 flex flex-col">
              <div className="flex-1 rounded-[24px] bg-[#111111] border border-[#1f1f1f] p-7 hover:bg-[#141414] hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
                <div className="w-10 h-10 bg-[#1f1f1f] rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                  <TrackChangesOutlinedIcon fontSize="small" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Deep Analytics Heatmap</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Visualize your 365-day practice consistency and identify weak topics instantly.
                </p>
              </div>
              <div className="flex-1 rounded-[24px] bg-[#111111] border border-[#1f1f1f] p-7 hover:bg-[#141414] hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 group">
                <div className="w-10 h-10 bg-[#1f1f1f] rounded-xl flex items-center justify-center text-violet-400 mb-4">
                  <BoltIcon fontSize="small" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">High-Intensity Sprints</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Timed precision drills designed to significantly improve your exam-day speed.
                </p>
              </div>
            </div>

            {/* Right card */}
            <div className="rounded-[24px] bg-[#111111] border border-[#1f1f1f] p-7 hover:bg-[#141414] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/[0.04] rounded-full blur-3xl group-hover:bg-blue-500/[0.07] transition-all" />
              <div className="w-11 h-11 bg-[#1f1f1f] rounded-xl flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                <MenuBookOutlinedIcon />
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5">3,000+ Verified PYQs</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                Gain absolute mastery with an extensive library of verified Previous Year Questions across all Quant and Reasoning topics.
              </p>
              <div className="mt-auto pt-5 border-t border-[#1f1f1f]">
                <Link href="/register" className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-500 text-black font-bold text-sm rounded-[20px] hover:bg-amber-400 transition-all active:scale-[0.97] shadow-lg shadow-amber-500/10">
                  Start Practicing <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ M3 FINAL CTA ━━━ */}
      <section className="relative py-36 px-6 text-center overflow-hidden">
        {/* Very subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: m3Easing }} className="max-w-[700px] mx-auto relative z-10">
          <h2 className="text-4xl md:text-[3.5rem] font-bold text-white mb-6 tracking-tight leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Ascend?</span>
          </h2>
          <p className="text-base md:text-lg text-neutral-400 mb-10 max-w-[520px] mx-auto leading-relaxed font-medium">
            Join the elite community and start mastering your <span className="text-white">Quant & Reasoning</span> goals today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-12 py-5 bg-amber-500 text-black font-bold text-base rounded-[20px] hover:bg-amber-400 hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-amber-500/10"
            >
              Start Practicing
            </Link>
            <Link
              href="/login"
              className="text-neutral-400 font-semibold text-sm hover:text-white transition-all flex items-center gap-1.5 group px-4 py-2 hover:bg-neutral-800 rounded-full"
            >
              Sign in to account <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
