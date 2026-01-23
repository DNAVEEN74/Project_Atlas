"use client";

import React, { useEffect, useState } from 'react';
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
  MenuBookOutlinedIcon,
  BoltIcon,
  PlayArrowIcon,
  ChevronRightIcon,
  CheckCircleOutlinedIcon,
} from '@/components/icons';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Cycle through features for animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const features = [
    {
      icon: <BoltIcon sx={{ fontSize: '2.5rem' }} />,
      title: "Sprint Mode",
      description: "High-intensity timed practice sessions. Choose topics, difficulty, and question count to simulate real exam pressure.",
      color: "amber",
      link: "/sprint"
    },
    {
      icon: <MenuBookOutlinedIcon sx={{ fontSize: '2.5rem' }} />,
      title: "Concept Explanations",
      description: "World-class lessons for 41 topics. Deep mental models, solved examples, interactive quizzes, and cheat sheets.",
      color: "violet",
      link: "/explanations"
    },
    {
      icon: <CalculateIcon sx={{ fontSize: '2.5rem' }} />,
      title: "Practice Problems",
      description: "Filter by topic, difficulty, and status. Detailed solutions for every question. Track your progress.",
      color: "emerald",
      link: "/problems"
    },
    {
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: '2.5rem' }} />,
      title: "Games & Challenges",
      description: "Gamified learning with target-based challenges. Compete with yourself and climb the leaderboard.",
      color: "rose",
      link: "/games"
    }
  ];

  const topics = {
    quant: [
      'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest',
      'Time & Work', 'Ratio & Proportion', 'Algebra', 'Trigonometry',
      'Geometry', 'Mensuration', 'Number System', 'Data Interpretation'
    ],
    reasoning: [
      'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Syllogism',
      'Series', 'Analogy', 'Classification', 'Sitting Arrangement',
      'Clock & Calendar', 'Dice & Cube', 'Mirror Image', 'Venn Diagram'
    ]
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-amber-500/30 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Logo */}
          <div className="relative w-32 h-32 mx-auto mb-8 animate-in fade-in zoom-in duration-700">
            <Image
              src="/logo-final.png"
              alt="PrepLeague Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 animate-gradient">
              PrepLeague
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-neutral-300 font-medium max-w-3xl mx-auto mb-4">
            Master <span className="text-amber-400 font-bold">SSC CGL</span> with
            Intelligent Practice
          </p>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-12">
            Adaptive problems, smart analytics, concept explanations, and gamified challenges.
            Everything you need to crack the exam.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:-translate-y-1 flex items-center gap-3"
            >
              <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />
              Start Free
              <ChevronRightIcon className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold text-lg rounded-2xl hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <LoginIcon sx={{ fontSize: '1.3rem' }} />
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '41', label: 'Topics Covered' },
              { value: '24', label: 'Quant Patterns' },
              { value: '17', label: 'Reasoning Patterns' },
              { value: '∞', label: 'Practice Questions' },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neutral-700 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-amber-500 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-amber-500/20">
              Platform Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to <span className="text-amber-400">Succeed</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Built specifically for SSC CGL preparation with proven methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <Link
                key={i}
                href={feature.link}
                className={`group relative bg-neutral-900 rounded-3xl p-8 border border-neutral-800 hover:border-${feature.color}-500/30 transition-all hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                {/* Icon */}
                <div className={`w-16 h-16 bg-${feature.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${feature.color}-500/20 transition-colors`}>
                  <span className={`text-${feature.color}-500`}>{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow */}
                <div className="absolute bottom-8 right-8 w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                  <ChevronRightIcon className="text-neutral-400 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS SECTION */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-violet-500/10 text-violet-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-violet-500/20">
              Complete Syllabus
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comprehensive <span className="text-violet-400">Coverage</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Every topic from Quantitative Aptitude and Reasoning, explained and practiced.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quant Topics */}
            <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <CalculateIcon className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Quantitative Aptitude</h3>
                  <p className="text-sm text-neutral-500">24 Pattern Categories</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.quant.map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/20">
                    {topic}
                  </span>
                ))}
                <span className="px-3 py-1.5 bg-neutral-800 text-neutral-500 text-sm rounded-full">
                  +12 more
                </span>
              </div>
            </div>

            {/* Reasoning Topics */}
            <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
                  <PsychologyIcon className="text-violet-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Reasoning Ability</h3>
                  <p className="text-sm text-neutral-500">17 Pattern Categories</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.reasoning.map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 bg-violet-500/10 text-violet-400 text-sm rounded-full border border-violet-500/20">
                    {topic}
                  </span>
                ))}
                <span className="px-3 py-1.5 bg-neutral-800 text-neutral-500 text-sm rounded-full">
                  +5 more
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-emerald-500/20">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Path to <span className="text-emerald-400">Success</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Learn Concepts',
                description: 'Read our world-class explanations with mental models, formulas, and solved examples.',
                icon: <MenuBookOutlinedIcon sx={{ fontSize: '2rem' }} />
              },
              {
                step: '02',
                title: 'Practice & Sprint',
                description: 'Solve problems at your pace or take timed sprints to build exam-day speed.',
                icon: <BoltIcon sx={{ fontSize: '2rem' }} />
              },
              {
                step: '03',
                title: 'Track & Improve',
                description: 'Analyze your performance with heatmaps, accuracy charts, and weak area detection.',
                icon: <TrendingUpIcon sx={{ fontSize: '2rem' }} />
              }
            ].map((item, i) => (
              <div key={i} className="relative bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                  Step {item.step}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mt-4 mb-6 text-emerald-500">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl p-12 border border-amber-500/20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of aspirants who are preparing smarter with PrepLeague.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:-translate-y-1"
              >
                <PersonIcon sx={{ fontSize: '1.3rem' }} />
                Create Free Account
              </Link>
              <p className="text-neutral-600 text-sm mt-6">
                No credit card required • Free forever for core features
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo-final.png" alt="PrepLeague" width={32} height={32} />
            <span className="text-neutral-500 text-sm">© 2025 PrepLeague. Built for SSC CGL aspirants.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/explanations" className="hover:text-white transition-colors">Explanations</Link>
            <Link href="/problems" className="hover:text-white transition-colors">Problems</Link>
            <Link href="/sprint" className="hover:text-white transition-colors">Sprint</Link>
            <Link href="/games" className="hover:text-white transition-colors">Games</Link>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
                @keyframes scroll {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(8px); opacity: 0.5; }
                }
                .animate-scroll {
                    animation: scroll 2s ease-in-out infinite;
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
    </main>
  );
}
