"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LoginIcon,
  PersonIcon,
  CalculateIcon,
  EmojiEventsOutlinedIcon,
  TrendingUpIcon,
  SpeedIcon,
  PsychologyIcon,
  MenuBookOutlinedIcon
} from '@/components/icons';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-neutral-200 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24 relative z-10">
          <div className="relative w-40 h-40 mx-auto mb-6 animate-in fade-in zoom-in duration-700">
            <Image
              src="/logo-final.png"
              alt="PrepLeague Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">
                PrepLeague
              </span>
            </h1>
            <p className="text-2xl text-neutral-300 font-medium max-w-2xl mx-auto">
              The Ultimate Platform for <span className="text-amber-400">Quantitative Aptitude</span> Mastery
            </p>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Master exam concepts with adaptive practice, detailed analytics, and intelligent mistake tracking tailored for SSC CGL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all w-full sm:w-auto hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-2">
                <LoginIcon /> Start Practicing
              </div>
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-[#1a1a1a] border border-neutral-700 text-neutral-300 font-bold text-lg rounded-xl hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all w-full sm:w-auto hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-2">
                <PersonIcon /> Create Account
              </div>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="group bg-[#1a1a1a] rounded-3xl p-8 border border-neutral-800 hover:border-amber-500/30 transition-all hover:bg-neutral-800/80 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <CalculateIcon sx={{ fontSize: '8rem' }} />
            </div>
            <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
              <CalculateIcon sx={{ fontSize: '2rem' }} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Adaptive Practice</h2>
            <p className="text-neutral-400 leading-relaxed">
              Questions that adjust to your skill level. Start easy and build your way up to advanced problem solving.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-[#1a1a1a] rounded-3xl p-8 border border-neutral-800 hover:border-violet-500/30 transition-all hover:bg-neutral-800/80 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <PsychologyIcon sx={{ fontSize: '8rem' }} />
            </div>
            <div className="w-14 h-14 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors">
              <PsychologyIcon sx={{ fontSize: '2rem' }} className="text-violet-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Smart Analytics</h2>
            <p className="text-neutral-400 leading-relaxed">
              Visualize your progress with heatmaps and performance charts. Identify weak spots instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-[#1a1a1a] rounded-3xl p-8 border border-neutral-800 hover:border-emerald-500/30 transition-all hover:bg-neutral-800/80 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <EmojiEventsOutlinedIcon sx={{ fontSize: '8rem' }} />
            </div>
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUpIcon sx={{ fontSize: '2rem' }} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">League Rankings</h2>
            <p className="text-neutral-400 leading-relaxed">
              Compete with peers and climb the leaderboard. Maintain streaks to stay at the top of your game.
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-20 border-t border-neutral-800 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">2025</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Target Year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">SSC CGL</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Focused Exam</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Free</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">To Start</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Beta</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Live Now</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
