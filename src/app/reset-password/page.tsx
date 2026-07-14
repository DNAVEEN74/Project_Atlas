'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, EyeOff, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { success, error } = useToast();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [errors, setErrors] = useState({ new: '', confirm: '' });

    useEffect(() => {
        if (!token) router.push('/forgot-password');
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ new: '', confirm: '' });
        let hasError = false;

        if (newPassword.length < 6) {
            setErrors(prev => ({ ...prev, new: 'Password must be at least 6 characters' }));
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

            <div className="w-full max-w-md relative z-10">
                {/* M3 Surface Container */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-[24px] p-8">
                    {!isDone ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/10">
                                    <Lock className="w-6 h-6 text-amber-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                                <p className="text-neutral-400 text-sm">Choose a strong password you haven't used before.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, new: '' })); }}
                                            className={`w-full bg-[#0a0a0a] border ${errors.new ? 'border-rose-500' : 'border-[#1f1f1f] focus:border-amber-500'} rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all pr-10 placeholder-neutral-600`}
                                            placeholder="Min. 6 characters"
                                        />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.new && <p className="text-xs text-rose-500 mt-1.5">{errors.new}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirm: '' })); }}
                                            className={`w-full bg-[#0a0a0a] border ${errors.confirm ? 'border-rose-500' : 'border-[#1f1f1f] focus:border-amber-500'} rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all pr-10 placeholder-neutral-600`}
                                            placeholder="Repeat your password"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirm && <p className="text-xs text-rose-500 mt-1.5">{errors.confirm}</p>}
                                </div>

                                {/* M3 Filled Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-amber-500 text-black font-bold text-base rounded-[20px] hover:bg-amber-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-500/10"
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
