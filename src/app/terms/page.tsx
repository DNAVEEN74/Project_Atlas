'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState('agreement');

    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                'agreement', 'account', 'subscription', 'usage',
                'intellectual', 'disclaimers', 'liability', 'indemnification',
                'governing', 'general', 'contact', 'acknowledgment'
            ];

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    const sidebarLinks = [
        { id: 'agreement', label: '1. Acceptance of Terms' },
        { id: 'account', label: '2. Account & Security' },
        { id: 'subscription', label: '3. Subscription & Billing' },
        { id: 'usage', label: '4. Platform Usage' },
        { id: 'intellectual', label: '5. Intellectual Property' },
        { id: 'disclaimers', label: '6. Disclaimers' },
        { id: 'liability', label: '7. Limitation of Liability' },
        { id: 'indemnification', label: '8. Indemnification' },
        { id: 'governing', label: '9. Dispute Resolution' },
        { id: 'general', label: '10. General Provisions' },
        { id: 'contact', label: '11. Contact Info' },
        { id: 'acknowledgment', label: '12. Acknowledgment' },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-amber-500/30 font-sans">
            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 py-3">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
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
                        <Link href="/pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign in</Link>
                        <Link href="/register" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- MAIN LAYOUT --- */}
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col lg:flex-row gap-12">

                {/* --- SIDEBAR (Sticky) --- */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-28 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider pl-3">Table of Contents</h4>
                        <nav className="space-y-1">
                            {sidebarLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors ${activeSection === link.id
                                        ? 'bg-neutral-800 text-white font-medium'
                                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                                        }`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* --- CONTENT --- */}
                <main className="flex-1 min-w-0">
                    <div className="mb-12 border-b border-neutral-800 pb-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                            Terms of Service
                        </h1>
                        <p className="text-neutral-400 text-lg">
                            Last Updated: <span className="text-neutral-200">February 18, 2026</span>
                        </p>
                    </div>

                    <div className="prose prose-invert prose-neutral max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-a:text-amber-500 hover:prose-a:text-amber-400">
                        <p className="lead text-xl text-neutral-300">
                            Welcome to PrepLeague. These Terms of Service ("Terms") govern your use of the PrepLeague platform at prepleague.com. By creating an account, you agree to these terms.
                        </p>

                        <div className="h-8"></div>

                        <section id="agreement">
                            <h2>1. Acceptance of Terms</h2>
                            <p>By accessing PrepLeague, you agree to these Terms, our Privacy Policy, and all applicable laws. You must be at least 16 years old to use this platform.</p>
                            <div className="bg-neutral-900 border-l-4 border-amber-500 p-4 rounded-r-xl my-6">
                                <p className="text-neutral-300 text-sm m-0">
                                    <strong>Note:</strong> We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.
                                </p>
                            </div>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="account">
                            <h2>2. Account Registration and Security</h2>
                            <div className="grid md:grid-cols-2 gap-6 my-6">
                                <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 shadow-sm">
                                    <h4 className="text-white font-medium mt-0 mb-3">Your Responsibilities</h4>
                                    <ul className="text-sm text-neutral-400 space-y-2 mb-0">
                                        <li>Provide accurate information</li>
                                        <li>Maintain password confidentiality</li>
                                        <li>Notify us of unauthorized access</li>
                                        <li>Do not share accounts</li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 shadow-sm">
                                    <h4 className="text-white font-medium mt-0 mb-3">Termination</h4>
                                    <p className="text-sm text-neutral-400 mb-0">
                                        We may suspend or terminate accounts for violations, fraud, or abuse. You can delete your account anytime from settings.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="subscription">
                            <h2>3. Subscription Plans and Billing</h2>

                            <h3 className="text-neutral-200 mt-6 mb-3">3.1 Plans & Pricing</h3>
                            <div className="overflow-hidden rounded-2xl border border-neutral-800 mb-6 shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-neutral-900 text-white">
                                        <tr>
                                            <th className="p-4 font-semibold first:rounded-tl-2xl">Plan</th>
                                            <th className="p-4 font-semibold">Price</th>
                                            <th className="p-4 font-semibold last:rounded-tr-2xl">Key Features</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        <tr>
                                            <td className="p-4 font-medium text-white">Free</td>
                                            <td className="p-4 text-neutral-400">₹0</td>
                                            <td className="p-4 text-neutral-400">20 Qs/day, 1 Sprint/day</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium text-white">Monthly</td>
                                            <td className="p-4 text-neutral-400">₹99/mo</td>
                                            <td className="p-4 text-neutral-400">Unlimited Access, Analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium text-white">Yearly</td>
                                            <td className="p-4 text-neutral-400">₹499/yr</td>
                                            <td className="p-4 text-neutral-400">Best Value (Save 58%)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-neutral-200 mt-8 mb-3">3.2 Renewal & Cancellation</h3>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                                <li><strong>Auto-Renewal:</strong> Subscriptions renew automatically unless cancelled.</li>
                                <li><strong>Cancellation:</strong> Cancel anytime from Account Settings. Access continues until the billing period ends.</li>
                                <li><strong>Refunds:</strong> 7-Day Money-Back Guarantee for <strong>new</strong> Premium subscribers. No refunds after 7 days or for renewals.</li>
                            </ul>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="usage">
                            <h2>4. Platform Usage</h2>
                            <p>You agree to use PrepLeague only for personal exam preparation.</p>

                            <div className="space-y-4 mt-6">
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <strong className="block text-red-400 mb-1">Prohibited Actions</strong>
                                    <ul className="list-disc pl-5 text-sm text-neutral-400 space-y-1">
                                        <li>Sharing account credentials</li>
                                        <li>Redistributing content or using scrapers</li>
                                        <li>Cheating or manipulating usage timers</li>
                                        <li>Attempting to hack the platform</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="intellectual">
                            <h2>5. Intellectual Property</h2>
                            <p>All questions, solutions, code, and branding are property of PrepLeague (© 2026). You are granted a limited license for personal use only. Redistribution is strictly prohibited.</p>

                            <h4 className="text-white font-medium mt-6">DMCA / Copyright</h4>
                            <p className="text-sm">If you believe content infringes your copyright, email <a href="mailto:legal@prepleague.com">legal@prepleague.com</a> with details. We respond within 72 hours.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="disclaimers">
                            <h2>6. Disclaimers</h2>
                            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-sm">
                                <p className="font-medium text-white mt-0">No Guarantee of Results</p>
                                <p className="text-sm text-neutral-400 mb-4">
                                    PrepLeague is a practice tool. We make NO guarantees about your actual exam scores, improvement, or job selection. Your success depends on your own effort.
                                </p>
                                <p className="font-medium text-white mt-0">Availability & Accuracy</p>
                                <p className="text-sm text-neutral-400 m-0">
                                    We strive for 99.9% uptime and accurate content but do not guarantee error-free operation. We are not affiliated with SSC.
                                </p>
                            </div>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="liability">
                            <h2>7. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by law, PrepLeague is not liable for indirect damages, lost data, or failure to achieve specific results. Our total liability is limited to the amount you paid in the last 12 months or ₹1,000.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="indemnification">
                            <h2>8. Indemnification</h2>
                            <p>You agree to hold PrepLeague harmless from any claims or damages arising from your violation of these terms or misuse of the platform.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="governing">
                            <h2>9. Governing Law & Dispute Resolution</h2>
                            <p>These terms are governed by the laws of <strong>India</strong>. Disputes are subject to the exclusive jurisdiction of courts in <strong>Hyderabad, Telangana</strong>.</p>
                            <p>Please contact us first to resolve any issues. You agree to resolve disputes individually, waiving any class action rights.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="general">
                            <h2>10. General Provisions</h2>
                            <p>These Terms + Privacy Policy constitute the entire agreement. If any part is invalid, the rest remains in effect. We may assign our rights to successors.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="contact">
                            <h2>11. Contact Us</h2>
                            <p className="mb-2">For legal inquiries:</p>
                            <p className="m-0"><strong>Email:</strong> <a href="mailto:legal@prepleague.com">legal@prepleague.com</a></p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="acknowledgment">
                            <h2>12. Acknowledgment</h2>
                            <p className="text-xl text-white font-medium">By using PrepLeague, you acknowledge that you have read, understood, and agreed to these Terms.</p>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
