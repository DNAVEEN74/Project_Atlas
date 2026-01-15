"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LockOutlinedIcon,
    EmailOutlinedIcon,
    PersonOutlinedIcon,
    ArrowBackIcon
} from '@/components/icons';

const EXAM_OPTIONS = [
    { value: 'SSC_CGL', label: 'SSC CGL' },
    { value: 'SSC_CHSL', label: 'SSC CHSL' },
    { value: 'SSC_MTS', label: 'SSC MTS' },
    { value: 'BANK_PO', label: 'Bank PO' },
    { value: 'BANK_CLERK', label: 'Bank Clerk' },
    { value: 'RRB_NTPC', label: 'RRB NTPC' },
    { value: 'OTHER', label: 'Other' },
];

const YEAR_OPTIONS = [2025, 2026, 2027];

export default function RegisterPage() {
    const router = useRouter();
    const { register, user, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [targetExam, setTargetExam] = useState('SSC_CGL');
    const [targetYear, setTargetYear] = useState(2025);
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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const result = await register({
            email,
            password,
            name,
            targetExam,
            targetYear,
        });

        if (result.success) {
            router.push('/problems');
        } else {
            setError(result.error || 'Registration failed');
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
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-lg relative z-10">
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
                    <p className="text-neutral-400">Start your preparation journey</p>
                </div>

                {/* Register Card */}
                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white text-center mb-6">Create New Account</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
                            <div className="relative group">
                                <PersonOutlinedIcon
                                    sx={{ fontSize: '1.25rem' }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors"
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Target Exam & Year */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">Target Exam</label>
                                <div className="relative">
                                    <select
                                        value={targetExam}
                                        onChange={(e) => setTargetExam(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white appearance-none cursor-pointer"
                                    >
                                        {EXAM_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">Target Year</label>
                                <div className="relative">
                                    <select
                                        value={targetYear}
                                        onChange={(e) => setTargetYear(parseInt(e.target.value))}
                                        className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white appearance-none cursor-pointer"
                                    >
                                        {YEAR_OPTIONS.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
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
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm Password</label>
                            <div className="relative group">
                                <LockOutlinedIcon
                                    sx={{ fontSize: '1.25rem' }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                        <p className="text-neutral-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">
                                Login here
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
