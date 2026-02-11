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

// --- Scroll Reveal Hook ---
function useScrollReveal() {
  const [revealedElements, setRevealedElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-reveal-id');
            if (id) {
              setRevealedElements((prev) => new Set(prev).add(id));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const registerElement = (element: HTMLElement | null, id: string) => {
    if (element && observerRef.current) {
      element.setAttribute('data-reveal-id', id);
      observerRef.current.observe(element);
    }
  };

  const isRevealed = (id: string) => revealedElements.has(id);

  return { registerElement, isRevealed };
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const { registerElement, isRevealed } = useScrollReveal();

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

  // Trigger hero animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/30 overflow-x-hidden font-sans">

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
            <Link href="/problems" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Problems</Link>
            <Link href="/sprint" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Sprint</Link>
            <Link href="/pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign in</Link>
            <Link href="/register" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION (Stedi-inspired) --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className={`max-w-5xl mx-auto text-center relative z-10 transition-all duration-1000 ease-out ${heroLoaded ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-4'
          }`}>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.02em] mb-8 leading-[1.1]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            Preparation meets
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">precision</span>
          </h1>

          {/* Tagline */}
          <p className={`text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-14 leading-relaxed transition-all duration-1000 delay-200 ${heroLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}>
            Stop guessing. Start engineering your success. Adaptive drills, mental models, and relentless analytics.
          </p>

          {/* CTA Section */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}>
            <Link
              href="/register"
              className="px-8 py-3.5 bg-amber-500 text-black font-bold text-base rounded-full hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              Get Started Free
            </Link>
            <Link
              href="/problems"
              className="px-8 py-3.5 bg-transparent border border-white/20 text-white font-medium text-base rounded-full hover:bg-white/5 transition-all"
            >
              Browse Problems
            </Link>
          </div>
        </div>

        {/* Features at bottom - absolute positioned like Stedi */}
        <div className={`absolute bottom-12 left-0 right-0 text-center transition-all duration-1000 delay-500 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-neutral-600 uppercase tracking-widest mb-5">What you get</p>
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-white tracking-tight">1,000+</div>
              <div className="text-[11px] text-neutral-500 mt-1">TCS Pattern PYQs</div>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-white tracking-tight">2018–2024</div>
              <div className="text-[11px] text-neutral-500 mt-1">Years Covered</div>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="text-center">
              <div className="text-lg sm:text-xl font-semibold text-amber-400 tracking-tight">Free</div>
              <div className="text-[11px] text-neutral-500 mt-1">Concept Library</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE 1: CONCEPTS (REMOVED) --- */}
      {/* 
      <section
        ref={(el) => registerElement(el, 'concepts')}
        className="py-32 px-6 border-t border-white/5"
      >
        ...
      </section> 
      */}

      {/* --- FEATURE 2: PROBLEMS --- */}
      <section
        ref={(el) => registerElement(el, 'problems')}
        className="py-32 px-6 bg-[#0c0c0c] border-t border-white/5"
      >
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isRevealed('problems') ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
          }`}>
          {/* Text (Left on desktop) */}
          <div className="lg:order-1 order-2">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
              <CalculateIcon sx={{ fontSize: '1.5rem' }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Daily practice.<br /><span className="text-emerald-400">Unstoppable growth.</span>
            </h2>
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              Consistency beats intensity. Dynamic daily targets based on your exam date. 1,000+ TCS-pattern questions from 2018-2024.
            </p>
            <ul className="space-y-3 mb-8">
              {['Adaptive daily targets', 'Step-by-step solutions', 'Pattern-wise coverage'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300 text-sm">
                  <CheckCircleOutlinedIcon className="text-emerald-400" sx={{ fontSize: '1rem' }} /> {item}
                </li>
              ))}
            </ul>
            <Link href="/problems" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
              Start Solving <ChevronRightIcon />
            </Link>
          </div>

          {/* Visual (Right on desktop) */}
          <div className="lg:order-2 order-1 relative">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">Today's Target</div>
                  <div className="text-2xl font-black text-white">20 Questions</div>
                </div>
                <div className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md text-xs font-bold">
                  Active
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Quant</span><span className="text-white">8/10</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full">
                    <div className="w-4/5 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Reasoning</span><span className="text-white">4/10</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full">
                    <div className="w-2/5 h-full bg-violet-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE 3: SPRINT MODE --- */}
      <section
        ref={(el) => registerElement(el, 'sprint')}
        className="py-32 px-6 border-t border-white/5"
      >
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isRevealed('sprint') ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
          }`}>
          {/* Visual */}
          <div className="relative">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <span className="text-neutral-500 text-sm font-mono uppercase">Sprint: Algebra</span>
                <div className="font-mono text-3xl font-bold text-amber-500">00:14<span className="text-sm text-neutral-600 ml-1">s</span></div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(opt => (
                  <div key={opt} className={`h-12 rounded-lg flex items-center px-4 font-mono text-sm ${opt === 2 ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-neutral-500 border border-white/5'}`}>
                    Option {String.fromCharCode(64 + opt)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6">
              <BoltIcon sx={{ fontSize: '1.5rem' }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Speed is a skill.<br /><span className="text-amber-400">Train it.</span>
            </h2>
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              The exam isn't just about knowing—it's about knowing fast. High-intensity Sprint Mode builds mental reflexes under pressure.
            </p>
            <ul className="space-y-3 mb-8">
              {['Timed sets (10-60 mins)', 'Category-specific drills', 'Instant speed analytics'].map(item => (
                <li key={item} className="flex items-center gap-3 text-neutral-300 text-sm">
                  <CheckCircleOutlinedIcon className="text-amber-400" sx={{ fontSize: '1rem' }} /> {item}
                </li>
              ))}
            </ul>
            <Link href="/sprint" className="inline-flex items-center gap-2 text-amber-400 font-semibold hover:gap-3 transition-all">
              Enter Sprint Mode <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURE 4: ANALYTICS --- */}
      <section
        ref={(el) => registerElement(el, 'analytics')}
        className="py-32 px-6 bg-[#0c0c0c] border-t border-white/5"
      >
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isRevealed('analytics') ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
          }`}>
          {/* Text */}
          <div className="lg:order-1 order-2">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
              <TrendingUpIcon sx={{ fontSize: '1.5rem' }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              It finds your<br /><span className="text-emerald-400">weak spots.</span>
            </h2>
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              Stop practicing what you already know. Our analytics engine dissects your performance to find exactly where you're losing marks.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
              View Dashboard <ChevronRightIcon />
            </Link>
          </div>

          {/* Visual */}
          <div className="lg:order-2 order-1 relative">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-end mb-8 h-28 gap-2">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                  <div key={i} className="w-full bg-white/5 rounded-t relative" style={{ height: `${h}%` }}>
                    {h === 30 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        Weak
                      </div>
                    )}
                    {h === 30 && <div className="absolute inset-0 bg-rose-500/40 rounded-t" />}
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <TrendingUpIcon sx={{ fontSize: '1rem' }} />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase font-bold">Focus Area</div>
                    <div className="text-white font-bold text-sm">Geometry</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-md hover:bg-neutral-200">
                  Fix This
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section
        ref={(el) => registerElement(el, 'cta')}
        className="py-32 px-6 border-t border-white/5"
      >
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isRevealed('cta') ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
          }`}>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to <span className="text-amber-400">ascend?</span>
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
            Join thousands who upgraded their preparation. Free to start. Cancel anytime.
          </p>
          <Link
            href="/register"
            className="inline-flex px-10 py-5 bg-white text-black font-bold text-lg rounded-lg hover:bg-neutral-200 transition-all shadow-lg"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 px-6 bg-[#0c0c0c] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
            Frequently Asked <span className="text-amber-400">Questions</span>
          </h2>
          <p className="text-neutral-400 text-center mb-12">
            Everything you need to know about PrepLeague
          </p>

          <div className="space-y-4">
            {[
              {
                q: "What is PrepLeague?",
                a: "PrepLeague is a free platform for SSC CGL and Bank exam prep. 1,000+ PYQs from 2018-2024, concept explanations, speed drills, and analytics."
              },
              {
                q: "Is PrepLeague free to use?",
                a: "Yes! Concept explanations and problem practice are free. Advanced analytics are available with premium."
              },
              {
                q: "What exams does PrepLeague cover?",
                a: "SSC CGL, SSC CHSL, IBPS PO, SBI PO, and more. TCS-pattern questions from 2018-2024."
              },
              {
                q: "How is PrepLeague different?",
                a: "Intuition over memorization. Visual mental models, adaptive targets, Sprint Mode for speed, detailed analytics."
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-[#111] border border-neutral-800/50 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <h3 className="text-base font-semibold text-white pr-4">{faq.q}</h3>
                  <span className="text-amber-400 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "What is PrepLeague?", "acceptedAnswer": { "@type": "Answer", "text": "PrepLeague is a free platform for SSC CGL and Bank exam prep with 1,000+ PYQs." } },
                { "@type": "Question", "name": "Is PrepLeague free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Core features are free. Premium unlocks advanced analytics." } }
              ]
            })
          }}
        />
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 px-6 bg-[#0a0a0a] border-t border-neutral-900/50 text-neutral-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-60">
            <Image src="/logo-final.png" alt="PrepLeague Logo" width={20} height={20} />
            <span>© 2025 PrepLeague</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
