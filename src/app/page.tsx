"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BoltIcon,
  MenuBookOutlinedIcon,
  CalculateIcon,
  EmojiEventsOutlinedIcon,
  ChevronRightIcon,
  CheckCircleOutlinedIcon,
  TrendingUpIcon,
  PsychologyIcon,
} from '@/components/icons';

// --- Scroll Observer Hook ---
function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState<Set<Element>>(new Set());
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
    }, options);

    elements.forEach((element) => observer.current?.observe(element));

    return () => observer.current?.disconnect();
  }, [elements, options]);

  return [setElements, entries] as const;
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return null; // Or a nice spinner

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/30 overflow-x-hidden font-sans">

      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-105">
              <Image src="/logo-final.png" alt="PrepLeague Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-amber-500 transition-colors">PrepLeague</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#concepts" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Concepts</Link>
            <Link href="#problems" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Problems</Link>
            <Link href="#sprint" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Sprint</Link>
            <Link href="/pricing" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white hover:text-neutral-300 transition-colors hidden sm:block">Log In</Link>
            <Link href="/register" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-amber-500/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animation-delay-2000" />

          {/* Floating Math Symbols */}
          <div className="absolute top-1/4 left-1/4 text-neutral-800 text-6xl font-serif italic opacity-20 animate-float">∫</div>
          <div className="absolute bottom-1/3 right-1/4 text-neutral-800 text-4xl font-serif opacity-20 animate-float animation-delay-1000">∑</div>
          <div className="absolute top-1/3 right-[15%] text-neutral-800 text-5xl font-mono opacity-20 animate-float animation-delay-500">π</div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-[11px] font-bold uppercase tracking-widest mb-10 backdrop-blur-sm shadow-xl animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Join 10,000+ Active Aspirants
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.95] animate-fade-in-up animation-delay-100">
            Crack CGL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600">With Science.</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
            Stop guessing. Start <span className="text-amber-500 font-bold">engineering</span> your success.
            Adaptive drills, mental models, and relentless analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center animate-fade-in-up animation-delay-300">
            <Link href="/register" className="group relative w-full sm:w-auto px-10 py-5 bg-amber-500 text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start 7-Day Free Trial <ChevronRightIcon className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link href="#concepts" className="w-full sm:w-auto px-10 py-5 bg-neutral-900/50 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2">
              <BoltIcon fontSize="small" className="text-neutral-400" /> See How It Work
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce opacity-50">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-neutral-800 to-neutral-200"></div>
          </div>
        </div>
      </section>

      {/* --- FEATURE 1: CONCEPTS (The Foundation) - Visual LEFT --- */}
      <section id="concepts" className="py-32 px-6 relative border-t border-white/5 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual Mockup (Left) */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-violet-500/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            {/* Concept Card */}
            <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 shadow-2xl transform group-hover:-rotate-y-2 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-xs font-bold rounded-lg uppercase">Mental Model</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-xs">Profit & Loss</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase border border-emerald-500/20">Free</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">The Multiplying Factor</h3>
              <div className="bg-[#151515] rounded-xl p-6 border border-white/5 font-mono text-sm text-neutral-300 mb-6">
                Final = Initial × (1 ± r/100)
              </div>
              <div className="flex gap-3">
                <div className="h-2 bg-violet-500 rounded-full w-12"></div>
                <div className="h-2 bg-white/10 rounded-full w-12"></div>
                <div className="h-2 bg-white/10 rounded-full w-12"></div>
              </div>
            </div>
            {/* Floating Tooltip Mockup */}
            <div className="absolute -right-8 top-20 bg-white text-black p-4 rounded-xl shadow-xl max-w-[200px] text-xs font-medium transform rotate-3 hidden md:block animate-float">
              "Don't memorize formulas. Understand relationships."
              <div className="absolute -left-2 top-4 w-4 h-4 bg-white transform rotate-45"></div>
            </div>
          </div>

          {/* Text Content (Right) */}
          <div>
            <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500 mb-8 border border-violet-500/20">
              <MenuBookOutlinedIcon sx={{ fontSize: '2.5rem' }} />
            </div>
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
              Free for Everyone
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Intuition Over<br /><span className="text-violet-500">Memorization.</span></h2>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              We've made our entire library of concept explanations <b>completely free</b>.
              No registration required. Just pure, world-class learning.
            </p>
            <ul className="space-y-4 mb-10">
              {['Visual proofs & Mental models', 'Real-world analogies', 'Zero barriers to entry'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircleOutlinedIcon className="text-violet-500" fontSize="small" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/explanations" className="inline-flex items-center gap-2 text-violet-500 font-bold hover:gap-3 transition-all">
              Explore Concepts <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURE 2: PROBLEMS (The Practice) - Text LEFT --- */}
      <section id="problems" className="py-32 px-6 relative border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content (Left) */}
          <div className="order-2 lg:order-1">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20">
              <CalculateIcon sx={{ fontSize: '2.5rem' }} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Daily Practice.<br /><span className="text-emerald-500">Unstoppable Growth.</span></h2>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Consistency beats intensity. Our system sets dynamic daily targets for you based on
              your exam date. 10,000+ TCS-pattern questions at your fingertips.
            </p>
            <ul className="space-y-4 mb-10">
              {['Adaptive Daily Targets', 'Detailed Step-by-Step Solutions', 'TCS Pattern Coverage (2018-2024)'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircleOutlinedIcon className="text-emerald-500" fontSize="small" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/problems" className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:gap-3 transition-all">
              Start Solving <ChevronRightIcon />
            </Link>
          </div>

          {/* Visual Mockup (Right) */}
          <div className="order-1 lg:order-2 relative group perspective-1000">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>

            {/* Daily Target Card */}
            <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 shadow-2xl transform group-hover:rotate-y-2 transition-all duration-500">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Today's Target</div>
                  <div className="text-2xl font-black text-white">20 Questions</div>
                </div>
                <div className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">
                  Active
                </div>
              </div>

              {/* Progress Ring Mockup */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 rounded-full border-8 border-neutral-800 flex items-center justify-center">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0a]"></div>
                  <span className="text-xl font-bold text-white">12<span className="text-neutral-500 text-sm">/20</span></span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="36" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="226" strokeDashoffset="90" className="opacity-100" />
                  </svg>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Quant</span>
                    <span className="text-white">8/10</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full"><div className="w-4/5 h-full bg-emerald-500 rounded-full"></div></div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Reasoning</span>
                    <span className="text-white">4/10</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full"><div className="w-2/5 h-full bg-violet-500 rounded-full"></div></div>
                </div>
              </div>

              {/* Problem Snippet */}
              <div className="bg-[#151515] rounded-xl p-4 border border-white/5 opacity-80">
                <div className="h-2 bg-white/10 rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-white/10 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">Correct</span>
                  <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-500 text-[10px]">+ 2.0 Marks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE 3: SPRINT MODE (The Speed) - Visual LEFT --- */}
      <section id="sprint" className="py-32 px-6 relative border-t border-white/5 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual Mockup (Left) - *Flipped* */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            {/* Timer Card */}
            <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 shadow-2xl transform group-hover:rotate-y-2 transition-all duration-500">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <span className="text-neutral-500 text-sm font-mono uppercase">Sprint: Algebra</span>
                <div className="font-mono text-3xl font-bold text-amber-500 animate-pulse">00:14<span className="text-sm text-neutral-600 ml-1">s</span></div>
              </div>
              {/* Dummy Question */}
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10">
                {[1, 2, 3, 4].map(opt => (
                  <div key={opt} className={`h-12 rounded-xl flex items-center px-4 font-mono text-sm ${opt === 2 ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-neutral-500 border border-white/5'}`}>
                    Option {String.fromCharCode(64 + opt)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Content (Right) - *Flipped* */}
          <div>
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-8 border border-amber-500/20">
              <BoltIcon sx={{ fontSize: '2.5rem' }} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Speed is a Skill.<br /><span className="text-amber-500">Train it.</span></h2>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              The exam isn't just about knowing the answer—it's about knowing it <i>fast</i>.
              Our high-intensity Sprint Mode simulates exam pressure to build your mental reflexes.
            </p>
            <ul className="space-y-4 mb-10">
              {['Timed sets (10-60 mins)', 'Category-specific drills', 'Instant speed analytics'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircleOutlinedIcon className="text-amber-500" fontSize="small" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/sprint" className="inline-flex items-center gap-2 text-amber-500 font-bold hover:gap-3 transition-all">
              Enter Sprint Mode <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURE 4: ANALYTICS (The Intelligence) - Text LEFT --- */}
      <section id="analytics" className="py-32 px-6 relative border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content (Left) */}
          <div className="order-2 lg:order-1">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20">
              <TrendingUpIcon sx={{ fontSize: '2.5rem' }} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">It Finds Your<br /><span className="text-emerald-500">Weak Spots.</span></h2>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Stop practicing what you already know. Our analytics engine dissects your performance
              to find exactly where you're losing marks.
            </p>
            <ul className="space-y-4 mb-10">
              {['Accuracy heatmaps', 'Time-per-question tracking', 'Pattern recognition'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircleOutlinedIcon className="text-emerald-500" fontSize="small" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:gap-3 transition-all">
              View Dashboard <ChevronRightIcon />
            </Link>
          </div>

          {/* Visual Mockup (Right) */}
          <div className="order-1 lg:order-2 relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>

            {/* Graph Card */}
            <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex justify-between items-end mb-8 h-32 gap-3 items-end">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                  <div key={i} className="w-full bg-white/5 rounded-t-lg relative group-hover:bg-white/10 transition-colors" style={{ height: `${h}%` }}>
                    {h === 30 && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        Weak
                      </div>
                    )}
                    {h === 30 && (
                      <div className="absolute top-0 left-0 w-full bg-red-500/50 h-full rounded-t-lg animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-[#151515] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                    <TrendingUpIcon fontSize="small" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 uppercase font-bold">Focus Area</div>
                    <div className="text-white font-bold">Geometry</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200">
                  Fix This
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE 5: GAMES (The Fun) - Visual LEFT --- */}
      <section id="games" className="py-32 px-6 relative border-t border-white/5 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual Mockup */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-rose-500/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>

            {/* Gamification Card */}
            <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 shadow-2xl transform group-hover:-rotate-y-2 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-white/10"></div>
                  <div>
                    <div className="text-white font-bold">You</div>
                    <div className="text-xs text-neutral-500">Level 5 Aspirant</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-orange-500 font-black text-xl flex items-center gap-1">
                    <span className="animate-pulse">🔥</span> 12
                  </span>
                  <span className="text-[10px] text-neutral-600 uppercase font-bold tracking-wider">Day Streak</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#151515] rounded-xl p-4 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <EmojiEventsOutlinedIcon fontSize="small" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white font-bold">Daily Target</span>
                      <span className="text-rose-500">80%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-1.5">
                      <div className="bg-rose-500 h-1.5 rounded-full w-[80%]"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#151515] rounded-xl p-4 border border-white/5 flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-600">
                    <CheckCircleOutlinedIcon fontSize="small" />
                  </div>
                  <div className="text-sm text-neutral-500 font-medium">Weekly Challenge</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20">
              <EmojiEventsOutlinedIcon sx={{ fontSize: '2.5rem' }} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Addictive by<br /><span className="text-rose-500">Design.</span></h2>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Willpower is finite. Habits are forever. We use game mechanics to hook you on
              improving your score, making consistency automatic.
            </p>
            <ul className="space-y-4 mb-10">
              {['Daily streaks & XP', 'Global leaderboards', 'Target-based challenges'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircleOutlinedIcon className="text-rose-500" fontSize="small" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/games" className="inline-flex items-center gap-2 text-rose-500 font-bold hover:gap-3 transition-all">
              Start Playing <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 bg-[#0f0f0f] relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            Ready to <span className="text-amber-500">Ascend?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            Join thousands of students who have upgraded their preparation.
            7 days free. Cancel anytime.
          </p>
          <Link
            href="/register"
            className="inline-flex px-12 py-6 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            Start Free Trial
          </Link>
          <p className="mt-8 text-sm text-neutral-600">No credit card required for trial.</p>
        </div>
        {/* Background noise texture overlay would go here */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 bg-[#0a0a0a] border-t border-neutral-900/50 text-neutral-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Image src="/logo-final.png" alt="Logo" width={24} height={24} />
            <span>© 2025 PrepLeague</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes fade-in-up {
             from { opacity: 0; transform: translateY(30px); }
             to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
      `}</style>
    </main>
  );
}
