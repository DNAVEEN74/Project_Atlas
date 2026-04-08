'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'pl_cookie_consent';

export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(COOKIE_KEY);
            if (!stored) {
                // Small delay so it doesn't flash on first paint
                const timer = setTimeout(() => setVisible(true), 1200);
                return () => clearTimeout(timer);
            }
        } catch {
            // localStorage not available (SSR / private mode)
        }
    }, []);

    const accept = () => {
        try {
            localStorage.setItem(COOKIE_KEY, 'accepted');
        } catch { /* ignore */ }
        setVisible(false);
    };

    const decline = () => {
        try {
            localStorage.setItem(COOKIE_KEY, 'declined');
        } catch { /* ignore */ }
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 32, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    role="dialog"
                    aria-label="Cookie consent"
                    className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2.5rem)] max-w-2xl"
                >
                    <div className="bg-[#1a1a1a]/95 backdrop-blur-md border border-neutral-800 rounded-2xl px-5 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Icon */}
                        <svg className="shrink-0 w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity=".3"/>
                            <circle cx="8.5" cy="10.5" r="1.5"/>
                            <circle cx="13.5" cy="8" r="1"/>
                            <circle cx="15" cy="13.5" r="1.5"/>
                            <circle cx="9.5" cy="14.5" r="1"/>
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.5 15a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm3-5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 13.5 12zm-5-1a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 8.5 11zm4.5-3a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"/>
                        </svg>

                        {/* Text */}
                        <p className="flex-1 text-sm text-neutral-400 leading-relaxed">
                            We use cookies to personalise content and ads, and to analyse traffic.{' '}
                            <a
                                href="/privacy#cookies"
                                className="text-neutral-300 underline underline-offset-2 hover:text-amber-500 transition-colors"
                            >
                                Read our policy
                            </a>
                            .
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                            <button
                                onClick={decline}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-300 transition-colors rounded-xl hover:bg-neutral-800"
                            >
                                Decline
                            </button>
                            <button
                                onClick={accept}
                                id="cookie-accept-btn"
                                className="flex-1 sm:flex-none px-5 py-2 text-sm font-bold bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-colors active:scale-[0.98]"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
