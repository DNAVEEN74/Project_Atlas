'use client';

import React from 'react';
import Link from 'next/link';
import {
    HomeIcon,
    ExploreIcon,
    ErrorIcon,
} from '@/components/icons';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden selection:bg-amber-500/30">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
                }}
            />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                {/* Logo - Glass Container for white-background image */}
                <div className="mb-14 animate-fade-in group">
                    <div className="relative w-24 h-24 mx-auto p-4 bg-[#1a1a1a] rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <div className="relative w-full h-full overflow-hidden rounded-[1.2rem]">
                            <Image
                                src="/logo-final.png"
                                alt="PrepLeague"
                                fill
                                className="object-contain"
                            />
                        </div>
                        {/* Soft glow */}
                        <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full -z-10 animate-pulse" />
                    </div>
                </div>

                {/* 404 Text with Smooth Float */}
                <div className="relative group mb-4">
                    <h1 className="text-[12rem] md:text-[16rem] font-black text-white leading-none tracking-tighter select-none animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        404
                    </h1>
                    <div className="absolute inset-0 text-amber-500/10 blur-3xl animate-pulse pointer-events-none flex items-center justify-center -z-10">
                        <span className="text-[12rem] md:text-[16rem] font-black tracking-tighter">404</span>
                    </div>
                </div>

                <div className="max-w-md mb-12 animate-fade-in-up">
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">
                        Lost in the Void
                    </h2>
                    <p className="text-neutral-500 text-lg leading-relaxed font-medium">
                        Even the brightest stars lose their way sometimes.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 items-center animate-fade-in-up [animation-delay:200ms]">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                    >
                        <HomeIcon className="text-xl" />
                        Return to Base
                    </Link>

                    <Link
                        href="/problems"
                        className="group flex items-center gap-3 px-12 py-5 bg-[#1a1a1a]/80 backdrop-blur-3xl border border-white/5 text-white font-black rounded-2xl hover:border-amber-500/20 hover:bg-neutral-900 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <ExploreIcon className="text-xl text-amber-500 group-hover:rotate-12 transition-transform" />
                        Explore Problems
                    </Link>
                </div>
            </div>
        </div>
    );
}



