'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, EyeOff, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

function ResetPasswordForm() {
    const router = useRouter();
    const { success, error } = useToast();
    const [token, setToken] = useState<string | null>(null);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [errors, setErrors] = useState({ new: '', confirm: '' });

    useEffect(() => {
        // Read token from URL fragment (never sent to server, never in Referer headers)
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const t = params.get('token');
        if (!t) router.push('/forgot-password');
        else setToken(t);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ new: '', confirm: '' });
        let hasError = false;

        if (newPassword.length < 8) {
            setErrors(prev => ({ ...prev, new: 'Password must be at least 8 characters' }));
            hasError = true;
        }
        if (newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirm: 'Passwords do not match' }));
            hasError = true;
        }
        if (hasError) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setIsDone(true);
                success('Password reset successfully!');
                setTimeout(() => router.push('/login'), 2500);
            } else {
                error(data.error || 'Failed to reset password');
            }
        } catch {
            error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
            {/* Ambient glow */}
            <div className="absolute top-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                    {!isDone ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-6 h-6 text-amber-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                                <p className="text-neutral-400 text-sm">Choose a strong password you haven't used before.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, new: '' })); }}
                                            className={`w-full bg-neutral-900 border ${errors.new ? 'border-rose-500' : 'border-neutral-700 focus:border-amber-500'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all pr-10`}
                                            placeholder="Min. 8 characters"
                                        />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.new && <p className="text-xs text-rose-500 mt-1">{errors.new}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirm: '' })); }}
                                            className={`w-full bg-neutral-900 border ${errors.confirm ? 'border-rose-500' : 'border-neutral-700 focus:border-amber-500'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all pr-10`}
                                            placeholder="Repeat your password"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirm && <p className="text-xs text-rose-500 mt-1">{errors.confirm}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating Password...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
                            <p className="text-neutral-400 text-sm mb-6">Redirecting you to login...</p>
                            <Link href="/login" className="text-amber-500 hover:underline text-sm">
                                Click here if not redirected
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
