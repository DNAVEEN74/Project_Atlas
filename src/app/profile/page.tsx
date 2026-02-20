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
    CloseIcon
} from '@/components/icons';
import { CustomSelect } from '@/components/ui/CustomSelect';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

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

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    plan_id: string;
    date: string;
    order_id: string;
}

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

    const isPremium = user?.subscription?.status === 'ACTIVE';
    const isMonthly = user?.subscription?.plan === 'MONTHLY';

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
                            <section className={`rounded-3xl p-8 relative overflow-hidden border flex flex-col h-full bg-[#1a1a1a] ${isPremium ? 'border-emerald-500/30' : 'border-neutral-800'}`}>
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
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
                                            Active
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
                                                    <span className="text-neutral-400">Renews On</span>
                                                    <span className="text-emerald-400 font-medium">{formatDate(user?.subscription?.end_date)}</span>
                                                </div>
                                            </div>

                                            {isMonthly && (
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
                                        <CloseIcon sx={{ fontSize: '1.5rem' }} /> {/* Falling back to CloseIcon or standard X */}
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
                                                                {tx.currency} {(tx.amount / 100).toFixed(2)}
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
            </main>
        </div>
    );
}

// CheckIcon wrapper if not imported - though it should be
function CheckIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    )
}

