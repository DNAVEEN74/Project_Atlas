'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircleOutlinedIcon, StarIcon } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function PricingPage() {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [loading, setLoading] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentDetails, setPaymentDetails] = useState<{ amount: number; paymentId: string; date: string } | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.removeChild(script);
        };
    }, []);

    // Trigger confetti on success
    useEffect(() => {
        if (paymentStatus === 'success') {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            // zIndex set to 200 to appear above the modal
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            // Auto-redirect to dashboard after 3 seconds
            const redirectTimer = setTimeout(() => {
                window.location.href = '/dashboard';
            }, 3000);

            return () => {
                clearInterval(interval);
                clearTimeout(redirectTimer);
            };
        }
    }, [paymentStatus]);

    const handlePayment = async (planId: string) => {
        setLoading(true);
        setPaymentStatus('idle');
        setPaymentDetails(null);
        try {
            // 1. Create Order
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            if (!res.ok) {
                const error = await res.json();
                if (res.status === 401) {
                    window.location.href = '/login?redirect=/pricing';
                    return;
                }
                throw new Error(error.error || 'Failed to create order');
            }

            const data = await res.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'PrepLeague',
                description: `${planId === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
                image: '/logo-final.png',
                order_id: data.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: planId,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            setPaymentDetails({
                                amount: data.amount / 100,
                                paymentId: response.razorpay_payment_id,
                                date: new Date().toLocaleString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                })
                            });
                            setPaymentStatus('success');
                        } else {
                            setErrorMessage(verifyData.message || 'Verification failed');
                            setPaymentStatus('failed');
                        }
                    } catch (verifyError) {
                        console.error('Verification error:', verifyError);
                        setErrorMessage('Payment verification failed');
                        setPaymentStatus('failed');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: '#f59e0b', // Amber-500
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setErrorMessage(response.error.description || 'Payment failed');
                setPaymentStatus('failed');
            });
            rzp.open();

        } catch (error: any) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || 'Something went wrong');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-amber-500/30 relative overflow-hidden">
            {/* --- HEADER --- */}
            {!user && (
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
                    }`}>
                    <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                                <Image src="/logo-final.png" alt="PrepLeague Logo" fill className="object-contain" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">PrepLeague</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Home</Link>
                            <Link href="/problems" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Problems</Link>
                            <Link href="/sprint" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Sprint</Link>
                            <Link href="/games" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Games</Link>
                            <Link href="/pricing" className="text-sm font-medium text-white transition-colors">Pricing</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign in</Link>
                            <Link href="/register" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>
            )}

            {/* --- HERO SECTION (Animated Grid + Formulas) --- */}
            <div className="absolute top-0 left-0 right-0 h-[1200px] pointer-events-none -z-0">
                {/* Perspective Grid */}
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px),
                               linear-gradient(to bottom, #444 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    }}
                />
            </div>

            {/* --- HERO CONTENT --- */}
            <main className="relative w-full px-6 lg:px-12 pt-32 pb-12 max-w-7xl mx-auto z-10">

                {/* Hero Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                        Choose your plan to <br className="hidden md:block" /> continue mastering.
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-8">
                        Start for free. Upgrade anytime to unlock unlimited practice and deep analytics.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">

                    {/* FREE Plan */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group relative flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹0</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">Forever free</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="20 Questions / Day" />
                            <FeatureItem text="1 Sprint / Day" />
                            <FeatureItem text="Unlimited Speed Math Games" highlight />
                            <FeatureItem text="Basic Accuracy Stats" />
                            <FeatureItem text="Access to All Topics" />
                        </div>

                        <Link href="/register" className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all text-center block">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Monthly Plan */}
                    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group relative flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Monthly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹99</span>
                                <span className="text-neutral-500 text-sm">/mo</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">No commitment, cancel anytime</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Unlimited Questions & Sprints" highlight />
                            <FeatureItem text="Full Length Mock Tests" highlight />
                            <FeatureItem text="Unlimited Speed Math Games" highlight />
                            <FeatureItem text="Advanced Analytics & Trends" highlight />
                            <FeatureItem text="Predicted Exam Score" highlight />
                            <FeatureItem text="Weak Spot Drills" highlight />
                        </div>

                        <button
                            onClick={() => handlePayment('monthly')}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Processing...' : 'Select Monthly'}
                        </button>
                    </div>

                    {/* Yearly Plan (Best Value) */}
                    <div className="bg-[#1a1a1a] border-2 border-amber-500 rounded-3xl p-8 shadow-2xl shadow-amber-500/10 relative transform md:-translate-y-4 flex flex-col h-full">
                        <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                            <div className="bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                Best Value
                            </div>
                        </div>

                        <div className="mb-8 mt-2">
                            <h3 className="text-lg font-bold text-white mb-2">Yearly</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹499</span>
                                <span className="text-neutral-500 text-sm">/yr</span>
                            </div>
                            <p className="text-xs text-amber-500 mt-2 font-medium">Just ₹42/mo • Save 58%</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Everything in Monthly" highlight />
                            <FeatureItem text="Same Premium Features" highlight />
                            <FeatureItem text="Save ₹690 / Year" highlight />
                        </div>

                        <button
                            onClick={() => handlePayment('yearly')}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-amber-500 text-black font-black uppercase tracking-wide hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Processing...' : 'Select Yearly'}
                        </button>
                        <p className="text-[10px] text-center text-neutral-500 mt-4">Billed as one payment of ₹499</p>
                    </div>

                </div>

                {/* Feature Comparison Table */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Compare Plans</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="py-4 px-4 font-normal text-neutral-500 w-1/3">Features</th>
                                    <th className="py-4 px-4 font-bold text-white text-center w-1/6">Free</th>
                                    <th className="py-4 px-4 font-bold text-white text-center w-1/6">Monthly</th>
                                    <th className="py-4 px-4 font-bold text-amber-500 text-center w-1/6">Yearly</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Questions / Day</td>
                                    <td className="py-4 px-4 text-center text-neutral-400">20</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-amber-500 font-bold">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Sprints / Day</td>
                                    <td className="py-4 px-4 text-center text-neutral-400">1</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-amber-500 font-bold">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Full Length Mock Tests</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Speed Math Games</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-white">Unlimited</td>
                                    <td className="py-4 px-4 text-center text-amber-500 font-bold">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Speed Analytics</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Weak Spot Drills</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Predicted Score</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 text-neutral-300">Download Sessions (PDF)</td>
                                    <td className="py-4 px-4 text-center text-neutral-600">✗</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                    <td className="py-4 px-4 text-center text-emerald-500">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ / Trust */}
                <div className="mt-20 text-center border-t border-neutral-800 pt-12">
                    <div className="flex justify-center gap-4 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholder for payment icons - using text for now as per instructions */}
                        <span className="text-xs font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">UPI</span>
                        <span className="text-xs font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">Cards</span>
                        <span className="text-xs font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">NetBanking</span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-4">
                        100% Secure Payment via Razorpay. 7-Day Money Back Guarantee for new subscribers.
                    </p>
                </div>
            </main>

            {/* Immersive Payment Status Modal */}
            <AnimatePresence>
                {paymentStatus !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        {/* 
                            Logic for different Modal Styles based on Status 
                            Success -> Razorpay Green Style
                            Failed -> Dark Red Style
                        */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className={`relative rounded-3xl p-1 max-w-md w-full shadow-2xl overflow-hidden ${paymentStatus === 'success' ? 'bg-[#0cce6b]' : 'bg-[#1a1a1a] border border-neutral-800'}`}
                        >
                            {paymentStatus === 'success' ? (
                                // --- SUCCESS STATE (Razorpay Style) ---
                                <div className="relative bg-[#0cce6b] rounded-[22px] p-8 text-center min-h-[400px] flex flex-col items-center justify-center">

                                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        Payment Successful!
                                    </h3>

                                    <p className="text-white/80 font-medium mb-8">
                                        Redirecting you to dashboard...
                                    </p>

                                    {/* Receipt Card */}
                                    <div className="bg-white rounded-xl w-full p-6 text-left shadow-lg transition-transform duration-300">
                                        <div className="flex justify-between items-start mb-4 border-b border-neutral-100 pb-4">
                                            <div>
                                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Amount Paid</p>
                                                <p className="text-3xl font-black text-neutral-900">₹{paymentDetails?.amount || '--'}</p>
                                            </div>
                                            <div className="bg-emerald-100 p-2 rounded-lg">
                                                <Image src="/logo-final.png" width={24} height={24} alt="Logo" className="object-contain" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-500">Payment ID</span>
                                                <span className="font-mono text-neutral-900">{paymentDetails?.paymentId ? `...${paymentDetails.paymentId.slice(-6)}` : '...'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-500">Date</span>
                                                <span className="text-neutral-900 font-medium">{paymentDetails?.date ? new Date(paymentDetails.date).toLocaleDateString() : 'Just now'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.location.href = '/dashboard'}
                                        className="mt-8 text-white font-bold text-sm hover:underline opacity-80 hover:opacity-100"
                                    >
                                        Click here if not redirected
                                    </button>
                                </div>
                            ) : (
                                // --- FAILURE STATE (Dark Style) ---
                                <div className="relative bg-[#121212] rounded-[22px] p-8 text-center overflow-hidden">
                                    {/* Background Glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-rose-500/10 to-transparent blur-3xl -z-10" />

                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg bg-gradient-to-br from-rose-400 to-red-600 text-white shadow-rose-500/20">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Payment Failed
                                    </h3>

                                    <p className="text-neutral-400 mb-8 leading-relaxed">
                                        {errorMessage}
                                    </p>

                                    <button
                                        onClick={() => setPaymentStatus('idle')}
                                        className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg bg-neutral-800 text-white hover:bg-neutral-700 hover:shadow-lg"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

function FeatureItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircleOutlinedIcon className={`text-xl ${highlight ? 'text-amber-500' : 'text-neutral-600'}`} />
            <span className={`text-sm ${highlight ? 'text-white font-medium' : 'text-neutral-400'}`}>{text}</span>
        </div>
    );
}
