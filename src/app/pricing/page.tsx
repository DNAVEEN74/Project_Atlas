'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { 
  CheckCircleOutlinedIcon, 
  MenuIcon, 
  CloseIcon 
} from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';

export default function PricingPage() {
    const { user, refreshUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const { error: showError } = useToast();
    const [scrolled, setScrolled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentDetails, setPaymentDetails] = useState<{ amount: number; paymentId: string; date: string } | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (document.body.contains(script)) {
              document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (paymentStatus === 'success') {
            const handleSuccess = async () => {
                await refreshUser();
                const redirectTimer = setTimeout(() => {
                    router.push('/dashboard');
                }, 2500);
                return () => clearTimeout(redirectTimer);
            };
            handleSuccess();
        }
    }, [paymentStatus, router, refreshUser]);

    const handlePayment = async (planId: string) => {
        if (!user) {
            showError('Please sign in or register to subscribe.');
            router.push(`/register?redirect=/pricing`);
            return;
        }

        setLoading(true);
        setPaymentStatus('idle');
        setPaymentDetails(null);
        try {
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            if (!res.ok) {
                const error = await res.json();
                if (res.status === 401) {
                    router.push('/login?redirect=/pricing');
                    return;
                }
                throw new Error(error.error || 'Failed to create order');
            }

            const data = await res.json();

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'PrepLeague',
                description: `${planId === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
                image: '/logo-final.png',
                order_id: data.id,
                handler: async function (response: any) {
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
                    color: '#f59e0b',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setErrorMessage(response.error.description || 'Payment failed');
                setPaymentStatus('failed');
                showError('Payment failed: ' + response.error.description);
            });
            rzp.open();

        } catch (error: any) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || 'Something went wrong');
            setPaymentStatus('failed');
            showError(error.message || 'Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    const getPlanButton = (plan: 'free' | 'monthly' | 'yearly') => {
        const currentPlan = user?.subscription?.status === 'ACTIVE' ? user.subscription.plan.toLowerCase() : 'free';

        if (!user) {
            return (
                <button
                    onClick={() => handlePayment(plan)}
                    className={`w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98] ${plan === 'yearly' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                >
                    {plan === 'free' ? 'Join Free' : 'Secure Pro Engine'}
                </button>
            );
        }

        if (currentPlan === plan) {
            return (
                <button
                    disabled
                    className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold cursor-default flex items-center justify-center gap-2"
                >
                    <CheckCircleOutlinedIcon sx={{ fontSize: '1.2rem' }} /> Active Tier
                </button>
            );
        }

        if (plan === 'free') {
            return (
                <button disabled className="w-full py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-600 font-bold cursor-default">
                    Current Limit
                </button>
            );
        }

        if (currentPlan === 'yearly' && plan === 'monthly') {
            return (
                <button disabled className="w-full py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-600 font-bold cursor-default">
                    Included in Yearly
                </button>
            );
        }

        let buttonText = plan === 'monthly' ? 'Upgrade to Monthly' : 'Upgrade to Yearly';
        if (currentPlan === 'free') {
            buttonText = plan === 'monthly' ? 'Unlock Monthly' : 'Unlock Yearly';
        }

        return (
            <button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-[0.98] ${plan === 'yearly'
                        ? 'bg-white text-black hover:bg-neutral-200 shadow-xl'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                    }`}
            >
                {loading ? 'Initiating...' : buttonText}
            </button>
        );
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-neutral-200 selection:bg-amber-500/30 selection:text-white font-sans antialiased overflow-x-hidden">
            
            {/* --- HEADER --- */}
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
              scrolled 
                ? 'bg-[#1a1a1a]/90 backdrop-blur-md border-neutral-800/80 py-3' 
                : 'bg-transparent border-transparent py-5'
            }`}>
              <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
                <div className="flex items-center gap-12">
                  <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
                    <div className="relative w-9 h-9">
                      <Image src="/logo-final.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-xl font-bold text-white tracking-tight">PrepLeague</span>
                    </div>
                  </Link>

                  <nav className="hidden lg:flex items-center gap-2">
                    {[
                      { n: 'Home', h: '/' },
                      { n: 'Problems', h: '/problems' },
                      { n: 'Sprint Mode', h: '/sprint' },
                      { n: 'Pricing', h: '/pricing' }
                    ].map((item) => (
                      <Link 
                        key={item.n} 
                        href={item.h}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${item.n === 'Pricing' ? 'text-white bg-neutral-800/80' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
                      >
                        {item.n}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  {!user ? (
                    <>
                      <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block px-4">Log in</Link>
                      <Link href="/register" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-lg active:scale-95">
                        Get Started
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard" className="px-6 py-2.5 bg-neutral-800 text-white text-sm font-bold rounded-xl hover:bg-neutral-700 transition-all shadow-lg active:scale-95">
                      Dashboard
                    </Link>
                  )}
                  <button className="lg:hidden p-2 text-neutral-400" onClick={() => setShowMobileMenu(true)}>
                    <MenuIcon />
                  </button>
                </div>
              </div>

              {/* Mobile Nav */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="fixed inset-0 z-[200] lg:hidden bg-[#0f0f0f] flex flex-col"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                      <span className="text-xl font-bold text-white">Menu</span>
                      <button onClick={() => setShowMobileMenu(false)} className="text-neutral-400 p-2"><CloseIcon /></button>
                    </div>
                    <nav className="flex flex-col p-6 gap-2">
                      {[
                        { n: 'Home', h: '/' },
                        { n: 'Problems', h: '/problems' },
                        { n: 'Sprint Mode', h: '/sprint' },
                        { n: 'Pricing', h: '/pricing' },
                        { n: 'Login', h: '/login' }
                      ].map((item) => (
                        <Link 
                          key={item.n}
                          href={item.h}
                          onClick={() => setShowMobileMenu(false)}
                          className="px-4 py-4 rounded-xl text-lg font-medium text-neutral-300 hover:bg-neutral-800 transition-all"
                        >
                          {item.n}
                        </Link>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-48 pb-24 px-6 text-center">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="max-w-4xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="inline-block px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-10">
                    Transparent Preparation Paths
                  </div>
                  <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mt-4">
                    Choose the plan that fits your ambition. From essential practice to high-intensity elite performance.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* --- PRICING CARDS --- */}
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

                    {/* FREE TIER */}
                    <div className="p-8 md:p-12 rounded-3xl bg-[#1a1a1a] border border-neutral-800 relative group overflow-hidden flex flex-col h-full transition-all hover:border-neutral-700">
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-white mb-2">Core Experience</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹0</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 font-medium tracking-wide font-mono">FOREVER FREE</p>
                        </div>

                        <div className="space-y-4 mb-12 flex-1">
                            {[
                              { t: '3,000+ Maths & Reasoning PYQs', d: 'Standard filter access.' },
                              { t: 'Daily Practice Sampling', d: '1 Sprint and 2 AI clarifications.' },
                              { t: '365-Day Practice Heatmap', d: 'Basic history and accuracy stats.' },
                              { t: 'Topic-wise Accuracy', d: 'High-level performance metrics.' },
                              { t: 'Supported by ads', d: 'Occasional minimal advertisements.' }
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                        <CheckCircleOutlinedIcon sx={{ fontSize: '1rem' }} />
                                    </div>
                                    <div>
                                        <div className={`text-sm ${i === 4 ? 'text-amber-500/70 font-bold' : 'text-neutral-300 font-bold'}`}>{f.t}</div>
                                        <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-medium">{f.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                           {getPlanButton('free')}
                        </div>
                    </div>

                    {/* MONTHLY TIER */}
                    <div className="p-8 md:p-12 rounded-3xl bg-[#1a1a1a] border border-neutral-800 relative group overflow-hidden flex flex-col h-full transition-all hover:border-neutral-700">
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-white mb-2">Pro Engine</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹99</span>
                                <span className="text-neutral-500 text-sm font-bold">/mo</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 font-medium tracking-wide font-mono">Billed Monthly</p>
                        </div>

                        <div className="space-y-4 mb-12 flex-1">
                            {[
                                { t: 'Unlimited AI Tutor', d: 'Ask as many follow-ups as needed.' },
                                { t: 'Full Performance Engine', d: 'Advanced analytics & heatmaps.' },
                                { t: 'Unlimited Sprints', d: 'Infinite drills to build speed reflexes.' },
                                { t: 'Weak Topic Isolation', d: 'Automated "Weakspot Drills".' },
                                { t: 'Ad-free Experience', d: 'Zero distractions while solving.' }
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <CheckCircleOutlinedIcon className="text-amber-500 mt-0.5" sx={{ fontSize: '1.2rem' }} />
                                    <div>
                                        <div className="text-sm text-white font-bold">{f.t}</div>
                                        <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-medium">{f.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                           {getPlanButton('monthly')}
                        </div>
                    </div>

                    {/* YEARLY TIER (Best Value) */}
                    <div className="p-8 md:p-12 rounded-3xl bg-[#1a1a1a] border border-amber-500/40 relative shadow-2xl shadow-amber-500/5 group overflow-hidden flex flex-col h-full transition-all hover:border-amber-500/60">
                        <div className="absolute top-0 right-0 p-8">
                            <div className="px-2.5 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                Best Value
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-white mb-2">The Pro Engine Elite</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">₹499</span>
                                <span className="text-neutral-500 text-sm font-bold">/yr</span>
                            </div>
                            <p className="text-xs text-amber-500 mt-2 font-bold tracking-wide font-mono uppercase">Just ₹42/month</p>
                        </div>

                        <div className="space-y-4 mb-12 flex-1">
                            {[
                                { t: 'Everything in Monthly', d: 'All pro engine analytical tools.' },
                                { t: 'Priority Support', d: 'Skip the line for technical assistance.' },
                                { t: 'Beta Feature Access', d: 'Try new drill types before anyone else.' },
                                { t: 'Elite Performance Label', d: 'Showcase your commitment to mastery.' }
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <CheckCircleOutlinedIcon className="text-amber-500 mt-0.5" sx={{ fontSize: '1.2rem' }} />
                                    <div>
                                        <div className="text-sm text-white font-bold">{f.t}</div>
                                        <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-medium">{f.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                           {getPlanButton('yearly')}
                           <p className="text-[10px] text-center text-neutral-600 mt-4 font-medium uppercase tracking-tighter">Billed as one payment of ₹499</p>
                        </div>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="mt-40">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Granular Comparison</h2>
                        <p className="text-neutral-500 text-sm">Every detail of your choice, laid out simply.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="py-6 px-6 font-bold text-neutral-600 uppercase tracking-[0.2em] text-[10px] w-1/3">Features</th>
                                    <th className="py-6 px-6 font-bold text-white text-center w-1/6 uppercase tracking-widest text-[10px]">Free</th>
                                    <th className="py-6 px-6 font-bold text-white text-center w-1/6 uppercase tracking-widest text-[10px]">Monthly</th>
                                    <th className="py-6 px-6 font-bold text-amber-500 text-center w-1/6 uppercase tracking-widest text-[10px]">Yearly</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {[
                                  { f: 'Question Access', v: ['3k+ Maths & Reasoning', 'Unlimited', 'Unlimited'] },
                                  { f: 'Daily Sprint Drills', v: ['1 per day', 'Unlimited', 'Unlimited'] },
                                  { f: 'AI Tutor Clarifications', v: ['2 per day', 'Unlimited', 'Unlimited'] },
                                  { f: 'Practice Heatmap', v: ['Basic', 'Premium', 'Premium'] },
                                  { f: 'Topic Performance Stats', v: ['Standard', 'Grains-eye', 'Grains-eye'] },
                                  { f: 'Weakspot Drills', v: ['✗', '✓', '✓'] },
                                  { f: 'Ad-free Experience', v: ['✗', '✓', '✓'] },
                                  { f: 'Priority Support', v: ['✗', '✗', '✓'] }
                                ].map((row, i) => (
                                  <tr key={i} className="hover:bg-neutral-800/30 transition-colors group">
                                    <td className="py-5 px-6 text-neutral-400 group-hover:text-white transition-colors font-medium">{row.f}</td>
                                    {row.v.map((val, j) => (
                                      <td key={j} className={`py-5 px-6 text-center font-mono font-bold ${
                                        val === '✗' ? 'text-neutral-800' : 
                                        val === '✓' ? 'text-emerald-500' :
                                        j === 3 || (j === 2 && row.v[2] === 'Unlimited') ? 'text-amber-500' : 'text-neutral-400'
                                      }`}>
                                        {val}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ / Trust */}
                <div className="mt-32 pt-20 border-t border-neutral-800/50 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      {['RAZORPAY', 'UPI ENABLED', '100% SECURE'].map(t => (
                        <span key={t} className="text-[10px] font-black tracking-[0.25em] text-neutral-400">{t}</span>
                      ))}
                    </div>
                    <p className="text-neutral-500 text-xs font-medium max-w-sm text-center leading-relaxed">
                        Secure infrastructure powered by Razorpay. <br />
                        No hidden charges. No complex cancellation flows.
                    </p>
                </div>
            </main>

            {/* Immersive Payment Status Modal */}
            <AnimatePresence>
                {paymentStatus !== 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={`max-w-md w-full rounded-[2rem] p-1 ${paymentStatus === 'success' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-neutral-800 border border-neutral-700'}`}>
                            <div className="bg-[#0f0f0f] rounded-[1.95rem] p-8 text-center overflow-hidden relative">
                                {paymentStatus === 'success' ? (
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                          <CheckCircleOutlinedIcon sx={{ fontSize: '3rem', color: '#10b981' }} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Payment Executed</h3>
                                        <p className="text-neutral-400 text-sm mb-10">Synchronizing your Pro Engine features...</p>
                                        
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-left space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                              <span className="text-neutral-500 font-bold uppercase tracking-widest">Amount</span>
                                              <span className="text-white font-mono font-bold">₹{paymentDetails?.amount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                              <span className="text-neutral-500 font-bold uppercase tracking-widest">Transaction</span>
                                              <span className="text-white font-mono">{paymentDetails?.paymentId?.slice(-10)}</span>
                                            </div>
                                        </div>

                                        <button onClick={() => router.push('/dashboard')} className="mt-10 w-full py-4 bg-white text-black font-bold rounded-xl text-sm transition-all hover:bg-neutral-200">
                                            Go to Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                          <CloseIcon sx={{ fontSize: '2.5rem', color: '#f43f5e' }} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Payment Interrupted</h3>
                                        <p className="text-neutral-400 text-sm mb-10 leading-relaxed px-4">{errorMessage}</p>
                                        
                                        <button onClick={() => setPaymentStatus('idle')} className="w-full py-4 bg-neutral-800 text-white font-bold rounded-xl text-sm transition-all hover:bg-neutral-700">
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
