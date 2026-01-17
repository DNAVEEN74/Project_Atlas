'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';
import {
    PersonOutlinedIcon,
    EmailOutlinedIcon,
    ArrowForwardIcon,
    CloseIcon,
    SchoolOutlinedIcon
} from '@/components/icons';

interface ExamRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialExam: string;
}

export function ExamRequestModal({ isOpen, onClose, initialExam }: ExamRequestModalProps) {
    const router = useRouter();
    const { success } = useToast();
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [examName, setExamName] = useState(initialExam === 'OTHER' ? '' : initialExam);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/exam-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, examName, fullName }),
            });

            if (!res.ok) throw new Error('Failed to submit request');

            success("Thanks! We've noted your interest and will notify you when this exam is available.");
            router.push('/');
        } catch (error) {
            console.error('Failed to submit exam request:', error);
            // Even if it fails, let's just redirect the user to avoid friction
            success("Thanks! We've noted your interest.");
            router.push('/');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        router.push('/');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[#0f0f0f] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex transform transition-all scale-100 animate-in zoom-in-95 duration-200">

                {/* Left Side - Branding & Info */}
                <div className="w-5/12 bg-[#161616] p-10 border-r border-neutral-800 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/logo-final.png"
                                    alt="PrepLeague"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">PrepLeague</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">Coming Soon!</h2>
                        <p className="text-neutral-400 text-base leading-relaxed">
                            We're currently focusing on <strong className="text-amber-500">SSC CGL</strong> to ensure the highest quality content.
                        </p>
                    </div>

                    <div className="z-10 mt-auto">
                        <p className="text-neutral-500 text-sm leading-relaxed border-t border-neutral-800 pt-6">
                            Tell us what you're preparing for, and we'll prioritize it in our roadmap.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-7/12 p-10 bg-[#0f0f0f] relative flex flex-col justify-center">
                    <button
                        onClick={handleSkip}
                        className="absolute top-6 right-6 p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        <CloseIcon sx={{ fontSize: '1.5rem' }} />
                    </button>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-1">Get Notified</h3>
                        <p className="text-neutral-500 text-sm">We'll let you know when your exam is available.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
                                Target Exam
                            </label>
                            <div className="relative group">
                                <SchoolOutlinedIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-amber-500"
                                    sx={{ fontSize: '1.25rem' }}
                                />
                                <input
                                    type="text"
                                    value={examName}
                                    onChange={(e) => setExamName(e.target.value)}
                                    placeholder="e.g. Bank PO"
                                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
                                Full Name
                            </label>
                            <div className="relative group">
                                <PersonOutlinedIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-amber-500"
                                    sx={{ fontSize: '1.25rem' }}
                                />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <div className="relative group">
                                <EmailOutlinedIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-amber-500"
                                    sx={{ fontSize: '1.25rem' }}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-all"
                            >
                                No thanks, skip
                            </button>
                            <button
                                type="submit"
                                disabled={!examName || !email || isSubmitting}
                                className={`flex-[2] py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${!examName || !email || isSubmitting
                                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 hover:shadow-amber-500/20'
                                    }`}
                            >
                                {isSubmitting ? 'Notifying...' : 'Notify Me'}
                                {!isSubmitting && <ArrowForwardIcon sx={{ fontSize: '1.1rem' }} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
