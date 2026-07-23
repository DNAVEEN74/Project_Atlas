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
    CalendarTodayOutlinedIcon,
    VisibilityIcon,
    VisibilityOffIcon
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
    const { success: notifySuccess } = useToast();
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Multi-step state
    const [step, setStep] = useState<'account' | 'preferences' | 'otp'>('account');
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

    const handleAccountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (!agreedToTerms) { setError('You must agree to the Terms of Service and Privacy Policy'); return; }

        setStep('preferences');
    };

    const handlePreferencesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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

            // OTP verified - create account
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
                notifySuccess('Account created! Welcome to PrepLeague!');
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
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Logo & Title */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <div className="relative w-16 h-16 mx-auto mb-5 group-hover:scale-105 transition-transform">
                            <Image src="/logo-final.png" alt="PrepLeague Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#E6E1E5] mb-1.5">Join PrepLeague</h1>
                    </Link>
                    <p className="text-[#938F99] text-sm">Start your preparation journey</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 'account' ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Register Card — M3 Surface Container */}
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-8">
                                <h2 className="text-lg font-bold text-[#E6E1E5] text-center mb-6">Create New Account</h2>

                                {error && (
                                    <div className="mb-6 p-4 bg-[#93000A]/30 border border-[#FFB4AB]/20 rounded-2xl text-[#FFB4AB] text-sm flex items-center gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-[#FFB4AB]/15 flex items-center justify-center text-xs font-bold shrink-0">!</span>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleAccountSubmit} className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Full Name</label>
                                        <div className="relative group">
                                            <PersonOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938F99] group-focus-within:text-[#FFB951] transition-colors" />
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl focus:border-[#FFB951] focus:outline-none focus:ring-1 focus:ring-[#FFB951]/30 transition-all text-[#E6E1E5] placeholder-[#938F99]" placeholder="Your Name" required />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Email Address</label>
                                        <div className="relative group">
                                            <EmailOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938F99] group-focus-within:text-[#FFB951] transition-colors" />
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl focus:border-[#FFB951] focus:outline-none focus:ring-1 focus:ring-[#FFB951]/30 transition-all text-[#E6E1E5] placeholder-[#938F99]" placeholder="your@email.com" required />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Password</label>
                                        <div className="relative group">
                                            <LockOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938F99] group-focus-within:text-[#FFB951] transition-colors" />
                                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl focus:border-[#FFB951] focus:outline-none focus:ring-1 focus:ring-[#FFB951]/30 transition-all text-[#E6E1E5] placeholder-[#938F99]" placeholder="********" required minLength={6} />
                                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#938F99] hover:text-[#FFB951] transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                                                {showPassword ? <VisibilityOffIcon sx={{ fontSize: '1.1rem' }} /> : <VisibilityIcon sx={{ fontSize: '1.1rem' }} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Confirm Password</label>
                                        <div className="relative group">
                                            <LockOutlinedIcon sx={{ fontSize: '1.25rem' }} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938F99] group-focus-within:text-[#FFB951] transition-colors" />
                                            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl focus:border-[#FFB951] focus:outline-none focus:ring-1 focus:ring-[#FFB951]/30 transition-all text-[#E6E1E5] placeholder-[#938F99]" placeholder="********" required />
                                            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#938F99] hover:text-[#FFB951] transition-colors" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                                                {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: '1.1rem' }} /> : <VisibilityIcon sx={{ fontSize: '1.1rem' }} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="flex items-start gap-3">
                                        <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-[#1f1f1f] bg-[#0a0a0a] text-[#FFB951] focus:ring-[#FFB951]" />
                                        <label htmlFor="terms" className="text-sm text-[#CAC4D0]">
                                            I agree to PrepLeague&apos;s{' '}
                                            <Link href="/terms" className="text-[#FFB951] hover:text-[#FFDE9C]">Terms of Service</Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-[#FFB951] hover:text-[#FFDE9C]">Privacy Policy</Link>
                                        </label>
                                    </div>

                                    {/* Password Validation UI */}
                                    {password.length > 0 && (
                                        <div className="flex gap-4 mt-2">
                                            <span className={`text-xs ${password.length >= 6 ? 'text-emerald-500' : 'text-[#938F99]'}`}>✓ 6+ chars</span>
                                            <span className={`text-xs ${confirmPassword && password === confirmPassword ? 'text-emerald-500' : 'text-[#938F99]'}`}>✓ Match</span>
                                        </div>
                                    )}

                                    {/* M3 Filled Button */}
                                    <button type="submit" className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-[20px] transition-all active:scale-[0.98] shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:-translate-y-0.5">
                                        Next Step
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-[#1f1f1f] text-center">
                                    <p className="text-[#938F99] text-sm">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-[#FFB951] font-medium hover:text-[#FFDE9C] transition-colors">Login here</Link>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : step === 'preferences' ? (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-8">
                                <button type="button" onClick={() => setStep('account')} className="flex items-center gap-2 text-[#938F99] hover:text-[#E6E1E5] mb-6 text-sm transition-colors font-medium">
                                    <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back
                                </button>
                                <h2 className="text-lg font-bold text-[#E6E1E5] text-center mb-6">Your Preferences</h2>
                                
                                {error && (
                                    <div className="mb-6 p-4 bg-[#93000A]/30 border border-[#FFB4AB]/20 rounded-2xl text-[#FFB4AB] text-sm flex items-center gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-[#FFB4AB]/15 flex items-center justify-center text-xs font-bold shrink-0">!</span>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handlePreferencesSubmit} className="space-y-5">
                                    {/* Target Exam & Year */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Target Exam</label>
                                            <CustomSelect value={targetExam} onChange={(value) => { if (value !== 'SSC_CGL') { const selectedOption = EXAM_OPTIONS.find(opt => opt.value === value); setPendingExam(selectedOption ? selectedOption.label : value); setShowExamRequestModal(true); return; } setTargetExam(value); }} options={EXAM_OPTIONS} icon={<SchoolIcon sx={{ fontSize: '1.2rem' }} />} className="w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#CAC4D0] mb-2">Target Year</label>
                                            <CustomSelect value={targetYear.toString()} onChange={(value) => setTargetYear(parseInt(value))} options={YEAR_OPTIONS.map(year => ({ value: year.toString(), label: year.toString() }))} icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem' }} />} className="w-full" />
                                        </div>
                                    </div>

                                    {/* Daily Practice Goals */}
                                    <div className="space-y-5 p-5 bg-[#1D192B] rounded-2xl border border-transparent">
                                        <div className="flex items-center gap-3">
                                            <TrackChangesOutlinedIcon className="text-[#FFB951]" sx={{ fontSize: '2rem' }} />
                                            <div>
                                                <span className="text-sm font-semibold text-[#E6E1E5]">Daily Practice Goals</span>
                                                <p className="text-[11px] text-[#938F99]">We'll remind you to practice this many questions each day.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#FFB951]"></div>
                                                <label className="text-xs font-semibold text-[#CAC4D0] uppercase tracking-wide">Quantitative Aptitude</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {[5, 10, 15, 20, 25].map(num => (
                                                    <button key={num} type="button" onClick={() => { setDailyQuantGoal(num); setShowCustomQuant(false); }} className={`min-w-[44px] px-3 py-2 text-sm font-bold rounded-[14px] transition-all duration-200 ${!showCustomQuant && dailyQuantGoal === num ? 'bg-[#FFB951] text-[#452B00] shadow-sm scale-105' : 'bg-[#0a0a0a] text-[#938F99] border border-[#1f1f1f] hover:bg-[#141414] hover:text-[#E6E1E5]'}`}>{num}</button>
                                                ))}
                                                <button type="button" onClick={() => setShowCustomQuant(!showCustomQuant)} className={`px-4 py-2 text-sm font-semibold rounded-[14px] transition-all duration-200 flex items-center gap-1.5 ${showCustomQuant ? 'bg-[#FFB951] text-[#452B00]' : 'bg-[#0a0a0a] text-[#938F99] border border-[#1f1f1f] hover:bg-[#141414] hover:text-[#E6E1E5]'}`}><EditIcon sx={{ fontSize: '1rem' }} /> Custom</button>
                                            </div>
                                            {showCustomQuant && (
                                                <div className="flex items-center gap-3 mt-1">
                                                    <input type="number" min="1" max="50" value={customQuantGoal} onChange={(e) => setCustomQuantGoal(e.target.value)} placeholder="Enter value" className="w-28 px-4 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl text-[#E6E1E5] text-sm focus:border-[#FFB951] focus:outline-none placeholder-[#938F99]" />
                                                    <span className="text-xs text-[#938F99]">Max 50</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-[#1f1f1f]"></div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D0BCFF]"></div>
                                                <label className="text-xs font-semibold text-[#CAC4D0] uppercase tracking-wide">Reasoning</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {[5, 10, 15, 20, 25].map(num => (
                                                    <button key={num} type="button" onClick={() => { setDailyReasoningGoal(num); setShowCustomReasoning(false); }} className={`min-w-[44px] px-3 py-2 text-sm font-bold rounded-[14px] transition-all duration-200 ${!showCustomReasoning && dailyReasoningGoal === num ? 'bg-[#D0BCFF] text-[#381E72] shadow-sm scale-105' : 'bg-[#0a0a0a] text-[#938F99] border border-[#1f1f1f] hover:bg-[#141414] hover:text-[#E6E1E5]'}`}>{num}</button>
                                                ))}
                                                <button type="button" onClick={() => setShowCustomReasoning(!showCustomReasoning)} className={`px-4 py-2 text-sm font-semibold rounded-[14px] transition-all duration-200 flex items-center gap-1.5 ${showCustomReasoning ? 'bg-[#D0BCFF] text-[#381E72]' : 'bg-[#0a0a0a] text-[#938F99] border border-[#1f1f1f] hover:bg-[#141414] hover:text-[#E6E1E5]'}`}><EditIcon sx={{ fontSize: '1rem' }} /> Custom</button>
                                            </div>
                                            {showCustomReasoning && (
                                                <div className="flex items-center gap-3 mt-1">
                                                    <input type="number" min="1" max="50" value={customReasoningGoal} onChange={(e) => setCustomReasoningGoal(e.target.value)} placeholder="Enter value" className="w-28 px-4 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl text-[#E6E1E5] text-sm focus:border-[#D0BCFF] focus:outline-none placeholder-[#938F99]" />
                                                    <span className="text-xs text-[#938F99]">Max 50</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isLoading || isSendingOtp} className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-[20px] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:-translate-y-0.5">
                                        {isLoading || isSendingOtp ? 'Sending Code...' : 'Continue'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* OTP Card — M3 Surface Container */}
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-[24px] p-8">
                                <button onClick={() => setStep('form')} className="flex items-center gap-2 text-[#938F99] hover:text-[#E6E1E5] mb-6 text-sm transition-colors font-medium">
                                    <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back
                                </button>

                                <div className="text-center mb-8">
                                    <div className="w-14 h-14 bg-[#FFB951]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FFB951]/10">
                                        <span className="text-xl font-bold text-[#FFB951]">OTP</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-[#E6E1E5] mb-2">Check your inbox</h2>
                                    <p className="text-[#938F99] text-sm">
                                        We sent a 6-digit code to<br />
                                        <span className="text-[#E6E1E5] font-semibold">{email}</span>
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
                                            className={`w-12 h-14 text-center text-2xl font-bold bg-[#0a0a0a] border-2 ${otpError ? 'border-[#FFB4AB]' : digit ? 'border-[#FFB951]' : 'border-[#1f1f1f]'} rounded-2xl text-[#E6E1E5] focus:outline-none focus:border-[#FFB951] transition-all`}
                                        />
                                    ))}
                                </div>

                                {otpError && (
                                    <p className="text-center text-[#FFB4AB] text-sm mb-4">{otpError}</p>
                                )}

                                {/* M3 Filled Button */}
                                <button
                                    onClick={handleOtpVerify}
                                    disabled={isVerifyingOtp || otpDigits.join('').length < 6}
                                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-[20px] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:-translate-y-0.5 mb-4"
                                >
                                    {isVerifyingOtp ? 'Verifying...' : 'Verify & Create Account'}
                                </button>

                                <div className="text-center">
                                    {otpResendCountdown > 0 ? (
                                        <p className="text-[#938F99] text-sm">Resend in <span className="text-[#FFB951] font-semibold">{otpResendCountdown}s</span></p>
                                    ) : (
                                        <button onClick={handleResendOtp} disabled={isSendingOtp} className="text-sm text-[#938F99] hover:text-[#FFB951] transition-colors disabled:opacity-50">
                                            {isSendingOtp ? 'Resending...' : "Didn't receive it? Resend code"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back to Home */}
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }} className="text-center mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#938F99] hover:text-[#E6E1E5] transition-colors text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: '1rem' }} /> Back to Home
                    </Link>
                </motion.div>
            </motion.div>

            <ExamRequestModal
                isOpen={showExamRequestModal}
                onClose={() => setShowExamRequestModal(false)}
                initialExam={pendingExam}
            />
        </div>
    );
}
