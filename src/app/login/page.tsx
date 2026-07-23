"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    LockOutlinedIcon,
    EmailOutlinedIcon,
    ArrowBackIcon,
    VisibilityIcon,
    VisibilityOffIcon
} from '@/components/icons';

export default function LoginPage() {
    const router = useRouter();
    const { login, user, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            router.replace('/problems');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || loading) return;
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.replace('/problems');
            router.refresh();
            return;
        } else {
            setError(result.error || 'Login failed');
        }
        setIsLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB951]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-float" />

            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo & Title */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <div className="relative w-16 h-16 mx-auto mb-5 group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo-final.png"
                                alt="PrepLeague Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-[#E6E1E5] mb-1.5">Sign in to PrepLeague</h1>
                    </Link>
                    <p className="text-[#938F99] text-sm">Welcome back! Ready to practice?</p>
                </motion.div>

                {/* Login Card — M3 Surface Container */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-8">

                    {error && (
                        <div className="mb-6 p-4 bg-[#93000A]/30 border border-[#FFB4AB]/20 rounded-2xl text-[#FFB4AB] text-sm flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#FFB4AB]/15 flex items-center justify-center text-xs font-bold shrink-0">!</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Email Address</label>
                            <div className="relative group">
                                <EmailOutlinedIcon
                                    sx={{ fontSize: '1.25rem' }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938F99] group-focus-within:text-[#FFB951] transition-colors"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl focus:border-[#FFB951] focus:outline-none focus:ring-1 focus:ring-[#FFB951]/30 transition-all text-[#E6E1E5] placeholder-[#938F99]"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-[#CAC4D0]">Password</label>
                                <Link href="/forgot-password" className="text-sm text-[#938F99] hover:text-[#FFB951] transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <LockOutlinedIcon
                                    sx={{ fontSize: '1.25rem' }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938F99] group-focus-within:text-[#FFB951] transition-colors"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl focus:border-[#FFB951] focus:outline-none focus:ring-1 focus:ring-[#FFB951]/30 transition-all text-[#E6E1E5] placeholder-[#938F99]"
                                    placeholder="********"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#938F99] hover:text-[#FFB951] transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <VisibilityOffIcon sx={{ fontSize: '1.1rem' }} />
                                    ) : (
                                        <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* M3 Filled Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-[20px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:-translate-y-0.5"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 pt-6 border-t border-[#1f1f1f] text-center">
                        <p className="text-[#938F99] text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-[#FFB951] font-medium hover:text-[#FFDE9C] transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }} className="text-center mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#938F99] hover:text-[#E6E1E5] transition-colors text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
