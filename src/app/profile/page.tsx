'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    EditIcon,
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


export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { success, error } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);


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



    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans selection:bg-amber-500/30">
            <Header activePage="dashboard" />

            <main className="max-w-5xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Profile Settings</h1>
                            <p className="text-sm text-neutral-400">Manage your personal information and account settings.</p>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-[#1a1a1a] hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-all border border-neutral-800 hover:border-neutral-700"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-neutral-400 hover:text-white text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading && <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-5 flex flex-col">
                            {/* Account Information Card */}
                            <section className="bg-[#141414] border border-neutral-800 rounded-2xl p-6 flex flex-col">
                                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Account Information</h2>
                                
                                <div className="flex flex-col gap-4">
                                    {/* Avatar */}
                                    <div className="flex justify-center mb-2">
                                        <div className="relative group w-28 h-28">
                                            <div className="w-full h-full rounded-2xl bg-neutral-900 flex items-center justify-center text-4xl font-bold text-white overflow-hidden border border-neutral-800">
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
                                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-2xl cursor-pointer backdrop-blur-sm"
                                                >
                                                    {isUploading ? (
                                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <UploadIcon className="w-8 h-8 text-white" />
                                                    )}
                                                </button>
                                            )}
                                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-400 mb-1.5">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                />
                                            ) : (
                                                <div className="px-4 py-2.5 bg-neutral-900/50 border border-transparent rounded-xl text-sm text-white font-medium">
                                                    {user?.name}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-400 mb-1.5">Email Address</label>
                                            <div className="px-4 py-2.5 bg-neutral-900/50 border border-transparent rounded-xl text-sm text-neutral-400 font-mono truncate">
                                                {user?.email}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-400 mb-1.5">Password</label>
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                                                <span className="text-neutral-400 font-mono tracking-widest text-sm">••••••••</span>
                                                <button
                                                    onClick={() => setShowChangePassword(true)}
                                                    className="text-xs font-bold text-neutral-300 hover:text-white transition-colors bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg shrink-0"
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Academic Target Card */}
                            <section className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Exam Configuration</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Target Exam</label>
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
                                            <div className="px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-sm text-white font-medium">
                                                {user?.targetExam?.replace('_', ' ') || 'SSC CGL'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Target Year</label>
                                        {isEditing ? (
                                            <CustomSelect
                                                value={formData.targetYear.toString()}
                                                onChange={(val) => setFormData({ ...formData, targetYear: parseInt(val) })}
                                                options={[2025, 2026, 2027].map(y => ({ value: y.toString(), label: y.toString() }))}
                                                className="w-full"
                                            />
                                        ) : (
                                            <div className="px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-sm text-white font-medium">
                                                {user?.targetYear || 2025}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Daily Goals Card */}
                            <section className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Daily Practice Goals</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                        <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">Quant Target</label>
                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="100"
                                                    value={formData.dailyQuantGoal}
                                                    onChange={(e) => setFormData({ ...formData, dailyQuantGoal: parseInt(e.target.value) })}
                                                    className="w-20 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-center text-white focus:border-amber-500 focus:outline-none font-bold"
                                                />
                                            ) : (
                                                <span className="text-3xl font-black text-white">{user?.dailyQuantGoal || 5}</span>
                                            )}
                                            <span className="text-xs text-neutral-500 font-medium leading-tight">Questions <br/>Per Day</span>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                        <label className="block text-xs font-bold text-violet-500 uppercase tracking-widest mb-4">Reasoning Target</label>
                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="100"
                                                    value={formData.dailyReasoningGoal}
                                                    onChange={(e) => setFormData({ ...formData, dailyReasoningGoal: parseInt(e.target.value) })}
                                                    className="w-20 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-center text-white focus:border-violet-500 focus:outline-none font-bold"
                                                />
                                            ) : (
                                                <span className="text-3xl font-black text-white">{user?.dailyReasoningGoal || 5}</span>
                                            )}
                                            <span className="text-xs text-neutral-500 font-medium leading-tight">Questions <br/>Per Day</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </motion.div>

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
