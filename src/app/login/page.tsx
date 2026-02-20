"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LockOutlinedIcon,
    EmailOutlinedIcon,
    ArrowBackIcon
} from '@/components/icons';

export default function LoginPage() {
    const router = useRouter();
    const { login, user, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/problems');
        } else {
            setError(result.error || 'Login failed');
        }
        setIsLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <div className="relative w-20 h-20 mx-auto mb-4 group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo-final.png"
                                alt="PrepLeague Logo"
                                fill
                                className="object-contain drop-shadow-lg"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1">PrepLeague</h1>
                    </Link>
                    <p className="text-neutral-400">Welcome back! Ready to practice?</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white text-center mb-6">Welcome back!</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                            <div className="relative group">
                                <EmailOutlinedIcon
                                    sx={{ fontSize: '1.25rem' }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-neutral-400">Password</label>
                                <Link href="/forgot-password" className="text-sm text-neutral-500 hover:text-amber-500 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <LockOutlinedIcon
                                    sx={{ fontSize: '1.25rem' }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                        <p className="text-neutral-400 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm">
                        <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
