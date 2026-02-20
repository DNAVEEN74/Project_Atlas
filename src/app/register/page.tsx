"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { ExamRequestModal } from '@/components/ui/ExamRequestModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LockOutlinedIcon,
    EmailOutlinedIcon,
    PersonOutlinedIcon,
    ArrowBackIcon,
    TrackChangesOutlinedIcon,
    EditIcon,
    SchoolIcon,
    CalendarTodayOutlinedIcon
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
    const { warning: notifyWarning, error: notifyError, success: notifySuccess } = useToast();
    const otpRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Form state
    const [name, setName] = useState('');
    const [showExamRequestModal, setShowExamRequestModal] = useState(false);
    const [pendingExam, setPendingExam] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [targetExam, setTargetExam] = useState('SSC_CGL');
    const [targetYear, setTargetYear] = useState(2025);
    const [dailyQuantGoal, setDailyQuantGoal] = useState(10);
    const [dailyReasoningGoal, setDailyReasoningGoal] = useState(10);
    const [customQuantGoal, setCustomQuantGoal] = useState('');
    const [customReasoningGoal, setCustomReasoningGoal] = useState('');
    const [showCustomQuant, setShowCustomQuant] = useState(false);
    const [showCustomReasoning, setShowCustomReasoning] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // OTP state
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [otpResendCountdown, setOtpResendCountdown] = useState(0);

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            router.push('/problems');
        }
    }, [user, loading, router]);

    // Countdown timer for OTP resend
    React.useEffect(() => {
        if (otpResendCountdown <= 0) return;
        const id = setInterval(() => setOtpResendCountdown(c => c - 1), 1000);
        return () => clearInterval(id);
    }, [otpResendCountdown]);

    const handleOtpInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...otpDigits];
        newDigits[index] = value.slice(-1);
        setOtpDigits(newDigits);
        setOtpError('');
        if (value && index < 5) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const sendOtp = async () => {
        setIsSendingOtp(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                notifySuccess('OTP sent to your email');
                setOtpResendCountdown(60);
                return true;
            } else {
                setError(data.error || 'Failed to send OTP');
                return false;
            }
        } catch {
            setError('Network error. Please try again.');
            return false;
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (!agreedToTerms) { setError('You must agree to the Terms of Service and Privacy Policy'); return; }

        setIsLoading(true);
        const sent = await sendOtp();
        setIsLoading(false);
        if (sent) {
            setStep('otp');
            setTimeout(() => otpRefs[0].current?.focus(), 100);
        }
    };

    const handleOtpVerify = async () => {
        const otp = otpDigits.join('');
        if (otp.length < 6) { setOtpError('Please enter all 6 digits'); return; }

        setIsVerifyingOtp(true);
        setOtpError('');
        try {
            // Verify OTP
            const verifyRes = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                setOtpError(verifyData.error || 'Invalid OTP');
                return;
            }

            // OTP verified — create account
            const result = await register({
                email,
                password,
                name,
                targetExam,
                targetYear,
                dailyQuantGoal: showCustomQuant ? parseInt(customQuantGoal) || 5 : dailyQuantGoal,
                dailyReasoningGoal: showCustomReasoning ? parseInt(customReasoningGoal) || 5 : dailyReasoningGoal,
            });

            if (result.success) {
                notifySuccess('Account created! Welcome to PrepLeague 🎉');
                router.push('/problems');
            } else {
                setOtpError(result.error || 'Registration failed');
            }
        } catch {
            setOtpError('Something went wrong. Please try again.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        if (otpResendCountdown > 0) return;
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        await sendOtp();
        otpRefs[0].current?.focus();
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
                            <Image src="/logo-final.png" alt="PrepLeague Logo" fill className="object-contain drop-shadow-lg" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1">PrepLeague</h1>
                    </Link>
                    <p className="text-neutral-400">Start your preparation journey</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'form' ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Register Card */}
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white text-center mb-6">Create New Account</h2>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <form onSubmit={handleFormSubmit} className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
                                        <div className="relative group">
                                            <PersonOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600" placeholder="Your Name" required />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                                        <div className="relative group">
                                            <EmailOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600" placeholder="your@email.com" required />
                                        </div>
                                    </div>

                                    {/* Target Exam & Year */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-400 mb-2">Target Exam</label>
                                            <CustomSelect
                                                value={targetExam}
                                                onChange={(value) => {
                                                    if (value !== 'SSC_CGL') {
                                                        const selectedOption = EXAM_OPTIONS.find(opt => opt.value === value);
                                                        setPendingExam(selectedOption ? selectedOption.label : value);
                                                        setShowExamRequestModal(true);
                                                        return;
                                                    }
                                                    setTargetExam(value);
                                                }}
                                                options={EXAM_OPTIONS}
                                                icon={<SchoolIcon sx={{ fontSize: '1.2rem' }} />}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-400 mb-2">Target Year</label>
                                            <CustomSelect
                                                value={targetYear.toString()}
                                                onChange={(value) => setTargetYear(parseInt(value))}
                                                options={YEAR_OPTIONS.map(year => ({ value: year.toString(), label: year.toString() }))}
                                                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem' }} />}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Daily Practice Goals */}
                                    <div className="space-y-5 p-5 bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 rounded-2xl border border-neutral-800/80 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <TrackChangesOutlinedIcon className="text-amber-500" sx={{ fontSize: '2rem' }} />
                                            <div>
                                                <span className="text-sm font-semibold text-white">Daily Practice Goals</span>
                                                <p className="text-[11px] text-neutral-500">We'll remind you to practice this many questions each day.</p>
                                            </div>
                                        </div>

                                        {/* Quant Goal */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Quantitative Aptitude</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {[5, 10, 15, 20, 25].map(num => (
                                                    <button key={num} type="button" onClick={() => { setDailyQuantGoal(num); setShowCustomQuant(false); }} className={`min-w-[44px] px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${!showCustomQuant && dailyQuantGoal === num ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 scale-105' : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white'}`}>{num}</button>
                                                ))}
                                                <button type="button" onClick={() => setShowCustomQuant(!showCustomQuant)} className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${showCustomQuant ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white'}`}><EditIcon sx={{ fontSize: '1rem' }} /> Custom</button>
                                            </div>
                                            {showCustomQuant && (
                                                <div className="flex items-center gap-3 mt-1">
                                                    <input type="number" min="1" max="50" value={customQuantGoal} onChange={(e) => setCustomQuantGoal(e.target.value)} placeholder="Enter value" className="w-28 px-4 py-2.5 bg-neutral-800 border border-amber-500/30 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none placeholder-neutral-600" />
                                                    <span className="text-xs text-neutral-500">Max 50</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-neutral-800/50"></div>

                                        {/* Reasoning Goal */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                                                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Reasoning</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {[5, 10, 15, 20, 25].map(num => (
                                                    <button key={num} type="button" onClick={() => { setDailyReasoningGoal(num); setShowCustomReasoning(false); }} className={`min-w-[44px] px-3 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${!showCustomReasoning && dailyReasoningGoal === num ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25 scale-105' : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white'}`}>{num}</button>
                                                ))}
                                                <button type="button" onClick={() => setShowCustomReasoning(!showCustomReasoning)} className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${showCustomReasoning ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white'}`}><EditIcon sx={{ fontSize: '1rem' }} /> Custom</button>
                                            </div>
                                            {showCustomReasoning && (
                                                <div className="flex items-center gap-3 mt-1">
                                                    <input type="number" min="1" max="50" value={customReasoningGoal} onChange={(e) => setCustomReasoningGoal(e.target.value)} placeholder="Enter value" className="w-28 px-4 py-2.5 bg-neutral-800 border border-violet-500/30 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none placeholder-neutral-600" />
                                                    <span className="text-xs text-neutral-500">Max 50</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
                                        <div className="relative group">
                                            <LockOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600" placeholder="••••••••" required minLength={6} />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm Password</label>
                                        <div className="relative group">
                                            <LockOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder-neutral-600" placeholder="••••••••" required />
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="flex items-start gap-3">
                                        <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-neutral-800 text-amber-500 focus:ring-amber-500" />
                                        <label htmlFor="terms" className="text-sm text-neutral-400">
                                            I agree to PrepLeague's{' '}
                                            <Link href="/terms" className="text-amber-500 hover:text-amber-400">Terms of Service</Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-amber-500 hover:text-amber-400">Privacy Policy</Link>
                                        </label>
                                    </div>

                                    <button type="submit" disabled={isLoading || isSendingOtp} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isLoading || isSendingOtp ? 'Sending Verification Code...' : 'Continue'}
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                                    <p className="text-neutral-400 text-sm">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">Login here</Link>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* OTP Card */}
                            <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                                <button onClick={() => setStep('form')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm transition-colors">
                                    <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back
                                </button>

                                <div className="text-center mb-8">
                                    <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📬</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                                    <p className="text-neutral-400 text-sm">
                                        We sent a 6-digit code to<br />
                                        <span className="text-white font-semibold">{email}</span>
                                    </p>
                                </div>

                                {/* OTP Input */}
                                <div className="flex justify-center gap-3 mb-6">
                                    {otpDigits.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={otpRefs[i]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpInput(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            onPaste={(e) => {
                                                const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                                if (paste.length === 6) {
                                                    setOtpDigits(paste.split(''));
                                                    otpRefs[5].current?.focus();
                                                }
                                                e.preventDefault();
                                            }}
                                            className={`w-12 h-14 text-center text-2xl font-bold bg-neutral-900 border-2 ${otpError ? 'border-rose-500' : digit ? 'border-amber-500' : 'border-neutral-700'} rounded-xl text-white focus:outline-none focus:border-amber-500 transition-all`}
                                        />
                                    ))}
                                </div>

                                {otpError && (
                                    <p className="text-center text-rose-400 text-sm mb-4">{otpError}</p>
                                )}

                                <button
                                    onClick={handleOtpVerify}
                                    disabled={isVerifyingOtp || otpDigits.join('').length < 6}
                                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    {isVerifyingOtp ? 'Verifying...' : 'Verify & Create Account'}
                                </button>

                                <div className="text-center">
                                    {otpResendCountdown > 0 ? (
                                        <p className="text-neutral-500 text-sm">Resend in <span className="text-amber-500 font-semibold">{otpResendCountdown}s</span></p>
                                    ) : (
                                        <button onClick={handleResendOtp} disabled={isSendingOtp} className="text-sm text-neutral-400 hover:text-amber-500 transition-colors disabled:opacity-50">
                                            {isSendingOtp ? 'Resending...' : "Didn't receive it? Resend code"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm">
                        <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back to Home
                    </Link>
                </div>
            </div>

            <ExamRequestModal
                isOpen={showExamRequestModal}
                onClose={() => setShowExamRequestModal(false)}
                initialExam={pendingExam}
            />
        </div>
    );
}
