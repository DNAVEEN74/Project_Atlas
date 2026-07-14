'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { error } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setIsSent(true);
            } else {
                const data = await res.json();
                error(data.error || 'Something went wrong');
            }
        } catch {
            error('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">

            <div className="w-full max-w-md relative z-10">
                <Link href="/login" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                {/* M3 Surface Container */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-8">
                    <AnimatePresence mode="wait">
                        {!isSent ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/10">
                                        <Mail className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                                    <p className="text-neutral-400 text-sm">
                                        No worries! Enter your email and we'll send you a reset link.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder-neutral-600"
                                            placeholder="name@example.com"
                                            autoFocus
                                        />
                                    </div>

                                    {/* M3 Filled Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-amber-500 text-black font-bold text-base rounded-[20px] hover:bg-amber-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-500/10"
                                    >
                                        {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                                <h2 className="text-xl font-bold mb-2">Check Your Inbox</h2>
                                <p className="text-neutral-400 text-sm mb-6">
                                    If <span className="text-white font-medium">{email}</span> is registered, we've sent a password reset link. It expires in <strong className="text-amber-500">15 minutes</strong>.
                                </p>
                                <p className="text-neutral-500 text-xs mb-4">Didn't receive it? Check your spam folder.</p>
                                <button
                                    onClick={() => setIsSent(false)}
                                    className="text-sm text-amber-500 hover:underline"
                                >
                                    Try a different email
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
