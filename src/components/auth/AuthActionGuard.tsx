"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CloseIcon, CheckCircleOutlinedIcon } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';

interface AuthActionGuardProps {
    children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
    onAction?: () => void;
}

export function AuthActionGuard({ children, onAction }: AuthActionGuardProps) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
        } else {
            if (onAction) {
                onAction();
            }
            if (children.props.onClick) {
                children.props.onClick(e);
            }
        }
    };

    return (
        <>
            {React.cloneElement(children, { onClick: handleClick })}

            {showModal && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm bg-[#0a0a0a] border border-neutral-800/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/30 transition-colors duration-500"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-violet-600/20 transition-colors duration-500"></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white bg-transparent hover:bg-neutral-800/50 rounded-full transition-colors z-20"
                        >
                            <CloseIcon sx={{ fontSize: '1.2rem' }} />
                        </button>

                        <div className="relative z-10 p-8 flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-2xl relative z-10">🔒</span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                Unlock Full Access
                            </h2>
                            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                                Create your free account to track your progress.
                            </p>

                            {/* Features */}
                            <div className="w-full space-y-3 mb-8 text-left pl-4">
                                {[
                                    'Bookmark important questions',
                                    'Track accuracy & solve time',
                                    'Maintain your daily streak'
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-sm text-neutral-300">
                                        <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} className="text-emerald-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="w-full space-y-3">
                                <Link
                                    href="/register"
                                    className="block w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    href="/login"
                                    className="block w-full py-3.5 bg-neutral-800/50 text-white font-bold rounded-xl border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all"
                                >
                                    Log In
                                </Link>
                            </div>

                            <p className="mt-6 text-[10px] text-neutral-600 uppercase tracking-widest font-bold">
                                No Credit Card Required
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
