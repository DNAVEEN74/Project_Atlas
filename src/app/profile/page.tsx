'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PersonIcon,
    StarIcon,
    EditIcon,
    TrackChangesOutlinedIcon,
    HistoryIcon,
    CloseIcon,
    EyeIcon,
    EyeOffIcon
} from '@/components/icons';
import { CustomSelect } from '@/components/ui/CustomSelect';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import mongoose from 'mongoose';

// Fallback icons if not present
const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const ReceiptIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

function CheckIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    )
}

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    plan_id: string;
    date: string;
    order_id: string;
}

const REFUND_REASONS = [
    'Accidental purchase',
    'Content not as expected',
    'Technical issues',
    'Other'
];

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { success, error } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Transaction History State
    const [showHistory, setShowHistory] = useState(false);
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Refund Request State
    const [showRefund, setShowRefund] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [customRefundReason, setCustomRefundReason] = useState('');
    const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

    // Cancel Subscription State
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Change Password State
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({ current: '', new: '' });

    const [formData, setFormData] = useState({
        name: '',
        targetExam: 'SSC_CGL',
        targetYear: 2025,
        dailyQuantGoal: 5,
        dailyReasoningGoal: 5,
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                targetExam: user.targetExam || 'SSC_CGL',
                targetYear: user.targetYear || 2025,
                dailyQuantGoal: user.dailyQuantGoal || 5,
                dailyReasoningGoal: user.dailyReasoningGoal || 5,
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                success('Profile updated successfully!');
                await refreshUser();
                setIsEditing(false);
            } else {
                error(data.error || 'Failed to update profile');
            }
        } catch (err) {
            error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/user/upload-avatar', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, avatar_url: data.url }));
                success('Avatar uploaded! Click Save to apply changes.');
            } else {
                error(data.error || 'Upload failed');
            }
        } catch (err) {
            error('Upload error. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch('/api/payments/history');
            const data = await res.json();
            if (data.success) {
                setTransactions(data.payments);
            }
        } catch (error) {
            console.error('Failed to fetch history');
        } finally {
            setLoadingHistory(false);
        }
    };

    const openHistory = () => {
        setShowHistory(true);
        fetchHistory();
    };

    const formatDate = (dateString?: Date | string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleRefundSubmit = async () => {
        if (!refundReason) {
            error("Please select a reason");
            return;
        }
        setIsSubmittingRefund(true);
        try {
            const res = await fetch('/api/payments/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason: refundReason,
                    custom_reason: customRefundReason
                })
            });
            const data = await res.json();
            if (res.ok) {
                success("Refund request submitted successfully");
                setShowRefund(false);
                setRefundReason('');
                setCustomRefundReason('');
            } else {
                error(data.error || "Failed to submit refund request");
            }
        } catch (err) {
            error("Something went wrong");
        } finally {
            setIsSubmittingRefund(false);
        }
    };

    const handleCancelSubscription = async () => {
        setIsCancelling(true);
        try {
            const res = await fetch('/api/payments/cancel', {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                success('Subscription cancelled successfully. Changes will reflect shortly.');
                await refreshUser();
                setShowCancelConfirm(false);
            } else {
                error(data.error || 'Failed to cancel subscription');
            }
        } catch (err) {
            error('Something went wrong');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordErrors({ current: '', new: '' });
        let hasError = false;

        if (!passwordData.currentPassword) {
            setPasswordErrors(prev => ({ ...prev, current: 'Current password is required' }));
            hasError = true;
        }

        if (!passwordData.newPassword) {
            setPasswordErrors(prev => ({ ...prev, new: 'New password is required' }));
            hasError = true;
        } else if (passwordData.newPassword.length < 6) {
            setPasswordErrors(prev => ({ ...prev, new: 'Password must be at least 6 characters' }));
            hasError = true;
        }

        if (hasError) return;

        setIsChangingPassword(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            if (res.ok) {
                success("Password changed successfully");
                setShowChangePassword(false);
                setPasswordData({ currentPassword: '', newPassword: '' });
            } else {
                if (data.error === 'Incorrect current password') {
                    setPasswordErrors(prev => ({ ...prev, current: 'Incorrect current password' }));
                } else {
                    error(data.error || "Failed to change password");
                }
            }
        } catch (err) {
            error("Something went wrong");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const isPremium = user?.subscription?.status === 'ACTIVE' || user?.subscription?.status === 'CANCELLED';
    const isMonthly = user?.subscription?.plan === 'MONTHLY';
    const planAmount = user?.subscription?.plan === 'YEARLY' ? '₹499/year' : '₹99/month';
    const refundAmount = user?.subscription?.plan === 'YEARLY' ? '499.00' : '99.00';

    // Check if within 7 days
    const isEligibleForRefund = isPremium && user?.subscription?.start_date && (
        (new Date().getTime() - new Date(user.subscription.start_date).getTime()) < (7 * 24 * 60 * 60 * 1000)
    ) && user?.subscription?.status !== 'CANCELLED';

    // Check if eligible for cancellation (Premium, Active, and NOT eligible for refund - though logic allows cancel even if eligible for refund, usually refund is preferred)
    // We display Cancel button if Premium AND Active AND Not Eligible For Refund
    // Actually, user might want to cancel instead of refund even if eligible? 
    // Let's stick to the logic: If Eligible for Refund -> Show Refund. Else If Active -> Show Cancel.

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans selection:bg-amber-500/30">
            <Header activePage="dashboard" />

            <main className="max-w-5xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <header className="mb-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                            <p className="text-neutral-400">Manage your personal information and subscription details.</p>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-neutral-700 hover:border-neutral-600"
                            >
                                <EditIcon sx={{ fontSize: '1.1rem' }} />
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-neutral-700 hover:border-neutral-600"
                            >
                                <XIcon className="w-5 h-5" />
                                Cancel Editing
                            </button>
                        )}
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Details */}
                            <section className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 relative z-20">
                                <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-2">
                                    <PersonIcon className="text-amber-500" />
                                    Personal Details
                                </h2>

                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Avatar Column */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative group w-32 h-32">
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700">
                                                {formData.avatar_url ? (
                                                    <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.name?.[0]?.toUpperCase() || 'U'
                                                )}
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-full cursor-pointer backdrop-blur-sm"
                                                >
                                                    {isUploading ? (
                                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <UploadIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                    )}
                                                </button>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                        {isEditing && <p className="text-xs text-neutral-500 text-center">Click to change</p>}
                                    </div>

                                    {/* Fields Column */}
                                    <div className="flex-1 space-y-5">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                                                />
                                            ) : (
                                                <p className="text-lg font-medium text-white">{user?.name}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                                            <p className="text-base text-neutral-300 font-mono bg-neutral-900/50 px-3 py-2 rounded-lg border border-neutral-800/50 inline-block">
                                                {user?.email}
                                            </p>
                                        </div>

                                        {/* Password - Change Link */}
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Password</label>
                                            <div className="flex items-center gap-4">
                                                <p className="text-base text-neutral-300 font-mono tracking-widest">••••••••</p>
                                                <button
                                                    onClick={() => setShowChangePassword(true)}
                                                    className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline transition-all"
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                            {/* Target Exam */}
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Target Exam</label>
                                                {isEditing ? (
                                                    <CustomSelect
                                                        value={formData.targetExam}
                                                        onChange={(val) => setFormData({ ...formData, targetExam: val })}
                                                        options={[
                                                            { value: 'SSC_CGL', label: 'SSC CGL' },
                                                            { value: 'SSC_CHSL', label: 'SSC CHSL' },
                                                            { value: 'BANK_PO', label: 'Bank PO' }
                                                        ]}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg text-sm font-bold text-amber-500 border border-amber-500/20">
                                                        🎯 {user?.targetExam?.replace('_', ' ') || 'SSC CGL'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Target Year */}
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Target Year</label>
                                                {isEditing ? (
                                                    <CustomSelect
                                                        value={formData.targetYear.toString()}
                                                        onChange={(val) => setFormData({ ...formData, targetYear: parseInt(val) })}
                                                        options={[2025, 2026, 2027].map(y => ({ value: y.toString(), label: y.toString() }))}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 border border-neutral-700">
                                                        📅 {user?.targetYear || 2025}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Goals Config */}
                            <section className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 relative z-10">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <TrackChangesOutlinedIcon className="text-amber-500" sx={{ fontSize: '1.2rem' }} />
                                    Daily Practice Goals
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Quant Goal */}
                                    <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                                        <label className="block text-xs font-semibold text-amber-500 mb-3 uppercase tracking-wider">Quant Questions</label>
                                        <div className="flex items-center justify-between">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="100"
                                                    value={formData.dailyQuantGoal}
                                                    onChange={(e) => setFormData({ ...formData, dailyQuantGoal: parseInt(e.target.value) })}
                                                    className="w-24 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-center text-white focus:border-amber-500 focus:outline-none font-bold"
                                                />
                                            ) : (
                                                <span className="text-3xl font-bold text-white">{user?.dailyQuantGoal || 5}</span>
                                            )}
                                            <span className="text-xs text-neutral-500">per day</span>
                                        </div>
                                    </div>

                                    {/* Reasoning Goal */}
                                    <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                                        <label className="block text-xs font-semibold text-violet-500 mb-3 uppercase tracking-wider">Reasoning Questions</label>
                                        <div className="flex items-center justify-between">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="100"
                                                    value={formData.dailyReasoningGoal}
                                                    onChange={(e) => setFormData({ ...formData, dailyReasoningGoal: parseInt(e.target.value) })}
                                                    className="w-24 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-center text-white focus:border-violet-500 focus:outline-none font-bold"
                                                />
                                            ) : (
                                                <span className="text-3xl font-bold text-white">{user?.dailyReasoningGoal || 5}</span>
                                            )}
                                            <span className="text-xs text-neutral-500">per day</span>
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95"
                                        >
                                            {isLoading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                                            Save All Changes
                                        </button>
                                    </div>
                                )}
                            </section>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            {/* Subscription Card */}
                            <section className={`rounded-3xl p-8 relative overflow-hidden border flex flex-col h-fit bg-[#1a1a1a] ${isPremium ? 'border-emerald-500/30' : 'border-neutral-800'}`}>
                                {isPremium && (
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <StarIcon sx={{ fontSize: '12rem' }} className="text-emerald-500" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <StarIcon className={isPremium ? "text-emerald-500" : "text-neutral-500"} />
                                        Subscription
                                    </h2>
                                    {isPremium && (
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${user?.subscription?.status === 'CANCELLED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {user?.subscription?.status === 'CANCELLED' ? 'Cancelled' : 'Active'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="mb-6">
                                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Current Plan</p>
                                        <span className={`text-3xl font-bold ${isPremium ? 'text-white' : 'text-neutral-300'}`}>
                                            {isPremium ? `${user?.subscription?.plan} Plan` : 'Free Plan'}
                                        </span>
                                    </div>

                                    {isPremium ? (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-400">Started On</span>
                                                    <span className="text-white font-medium">{formatDate(user?.subscription?.start_date)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-400">
                                                        {user?.subscription?.status === 'CANCELLED' ? 'Access Expires On' : 'Renews On'}
                                                    </span>
                                                    <span className={`${user?.subscription?.status === 'CANCELLED' ? 'text-amber-500' : 'text-emerald-400'} font-medium`}>
                                                        {formatDate(user?.subscription?.end_date)}
                                                    </span>
                                                </div>

                                                {user?.subscription?.status === 'ACTIVE' && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-neutral-400">Amount</span>
                                                            <span className="text-white font-medium">{planAmount}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-neutral-400">Payment</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-white font-medium">•••• 4242 (Visa)</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-neutral-400">Next Charge</span>
                                                            <span className="text-white font-medium">
                                                                {user?.subscription?.plan === 'YEARLY' ? '₹499' : '₹99'} on {formatDate(user?.subscription?.end_date)}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {isMonthly && user?.subscription?.status === 'ACTIVE' && (
                                                <Link
                                                    href="/pricing"
                                                    className="block w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-amber-500 text-center font-bold rounded-xl transition-all border border-amber-500/20 hover:border-amber-500/40 text-sm"
                                                >
                                                    Upgrade to Yearly (Save 17%)
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                                                Unlock unlimited sprints, detailed analytics, and ad-free experience.
                                            </p>
                                            <Link
                                                href="/pricing"
                                                className="block w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-center font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
                                            >
                                                Upgrade to Premium
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {isEligibleForRefund ? (
                                    <button
                                        onClick={() => setShowRefund(true)}
                                        className="mb-4 mt-2 w-full py-2 text-xs font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all"
                                    >
                                        Request Refund (Within 7 Days)
                                    </button>
                                ) : (
                                    isPremium && user?.subscription?.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => setShowCancelConfirm(true)}
                                            className="mb-4 mt-2 w-full py-2 text-xs font-semibold text-neutral-500 hover:text-white hover:bg-neutral-800 border border-transparent hover:border-neutral-700 rounded-xl transition-all hover:bg-neutral-800"
                                        >
                                            Cancel Subscription
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={openHistory}
                                    className="mt-6 w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors border-t border-neutral-800 pt-6"
                                >
                                    <HistoryIcon sx={{ fontSize: '1.1rem' }} />
                                    View Transaction History
                                </button>
                            </section>
                        </div>
                    </div>
                </motion.div>

                {/* Transaction History Modal */}
                <AnimatePresence>
                    {showHistory && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowHistory(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 m-auto w-full max-w-2xl h-[600px] bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                            >
                                <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <ReceiptIcon className="w-6 h-6 text-amber-500" />
                                        Transaction History
                                    </h3>
                                    <button onClick={() => setShowHistory(false)} className="text-neutral-400 hover:text-white transition-colors">
                                        <CloseIcon sx={{ fontSize: '1.5rem' }} />
                                        {!CloseIcon && <XIcon className='w-6 h-6' />}
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                    {loadingHistory ? (
                                        <div className="flex justify-center items-center h-40">
                                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : transactions.length > 0 ? (
                                        <div className="space-y-4">
                                            {transactions.map(tx => (
                                                <div key={tx.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-bold text-white text-lg">
                                                                {tx.currency} {tx.amount.toFixed(2)}
                                                            </span>
                                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                {tx.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-neutral-400 flex items-center gap-2">
                                                            <span>{tx.plan_id.toUpperCase()} Plan</span>
                                                            <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                                                            <span>{formatDate(tx.date)}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-neutral-500 font-mono mb-1">Ref: {tx.order_id.slice(-8)}...</p>
                                                        {tx.status === 'SUCCESS' && (
                                                            <div className="text-xs text-emerald-500 flex items-center justify-end gap-1">
                                                                Paid <CheckIcon sx={{ fontSize: '0.8rem' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-600">
                                                <ReceiptIcon className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-lg font-medium text-white mb-2">No Transactions Yet</h4>
                                            <p className="text-neutral-500 max-w-xs mx-auto">
                                                When you subscribe to a plan, your payment Invoice and details will appear here.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Refund Modal */}
                <AnimatePresence>
                    {showRefund && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowRefund(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 m-auto w-full max-w-md h-fit bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                            >
                                <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white">Request Refund</h3>
                                    <button onClick={() => setShowRefund(false)} className="text-neutral-400 hover:text-white">
                                        <XIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-neutral-400">
                                        You'll receive <span className="text-white font-bold">₹{refundAmount}</span> back to your original payment method within <span className="text-white font-bold">5-7 business days</span>.
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-2">
                                        Please let us know why you'd like a refund.
                                    </p>

                                    <div className="space-y-2">
                                        {REFUND_REASONS.map((reason) => (
                                            <label key={reason} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all">
                                                <input
                                                    type="radio"
                                                    name="refundReason"
                                                    value={reason}
                                                    checked={refundReason === reason}
                                                    onChange={(e) => setRefundReason(e.target.value)}
                                                    className="w-4 h-4 text-amber-500 bg-neutral-800 border-neutral-600 focus:ring-amber-500"
                                                />
                                                <span className="text-sm text-white">{reason}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {refundReason === 'Other' && (
                                        <textarea
                                            value={customRefundReason}
                                            onChange={(e) => setCustomRefundReason(e.target.value)}
                                            placeholder="Please tell us more..."
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 h-24 resize-none"
                                        />
                                    )}

                                    <div className="pt-2">
                                        <button
                                            onClick={handleRefundSubmit}
                                            disabled={isSubmittingRefund || !refundReason}
                                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmittingRefund ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Cancel Confirmation Modal */}
                <AnimatePresence>
                    {showCancelConfirm && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCancelConfirm(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 flex flex-col p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription?</h3>
                                <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                                    Are you sure? Your subscription will <strong>not renew</strong> on {formatDate(user?.subscription?.end_date)}.
                                    You can still practice until then.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCancelConfirm(false)}
                                        className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={handleCancelSubscription}
                                        disabled={isCancelling}
                                        className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Change Password Modal */}
                <AnimatePresence>
                    {showChangePassword && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowChangePassword(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl z-50 flex flex-col p-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Change Password</h3>
                                    <button onClick={() => setShowChangePassword(false)} className="text-neutral-400 hover:text-white">
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => {
                                                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                                                    if (passwordErrors.current) setPasswordErrors(prev => ({ ...prev, current: '' }));
                                                }}
                                                className={`w-full bg-neutral-900 border ${passwordErrors.current ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-700 focus:border-amber-500'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all pr-10`}
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                            >
                                                {showCurrentPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.current && (
                                            <p className="text-xs text-rose-500 mt-1">{passwordErrors.current}</p>
                                        )}
                                        <div className="flex justify-end mt-1">
                                            <Link href="/forgot-password" className="text-xs text-amber-500 hover:underline">
                                                Forgot Password?
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => {
                                                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                                                    if (passwordErrors.new) setPasswordErrors(prev => ({ ...prev, new: '' }));
                                                }}
                                                className={`w-full bg-neutral-900 border ${passwordErrors.new ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-700 focus:border-amber-500'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all pr-10`}
                                                placeholder="Min. 6 characters"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                            >
                                                {showNewPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.new && (
                                            <p className="text-xs text-rose-500 mt-1">{passwordErrors.new}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isChangingPassword}
                                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 mt-4"
                                    >
                                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}
