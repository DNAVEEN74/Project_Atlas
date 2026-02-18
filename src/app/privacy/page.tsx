'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState('info-collect');

    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                'info-collect', 'how-we-use', 'sharing', 'retention',
                'rights', 'security', 'children', 'cookies',
                'links', 'international', 'changes', 'contact', 'compliance'
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
        { id: 'info-collect', label: '1. Information We Collect' },
        { id: 'how-we-use', label: '2. How We Use It' },
        { id: 'sharing', label: '3. Data Sharing' },
        { id: 'retention', label: '4. Data Retention' },
        { id: 'rights', label: '5. Your Rights' },
        { id: 'security', label: '6. Security' },
        { id: 'children', label: "7. Children's Privacy" },
        { id: 'cookies', label: '8. Cookies Policy' },
        { id: 'links', label: '9. Third-Party Links' },
        { id: 'international', label: '10. International Transfers' },
        { id: 'changes', label: '11. Changes to Policy' },
        { id: 'contact', label: '12. Contact Us' },
        { id: 'compliance', label: '13. Compliance' },
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
                            Privacy Policy
                        </h1>
                        <p className="text-neutral-400 text-lg">
                            Last Updated: <span className="text-neutral-200">February 18, 2026</span>
                        </p>
                    </div>

                    <div className="prose prose-invert prose-neutral max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-a:text-amber-500 hover:prose-a:text-amber-400">
                        <p className="lead text-xl text-neutral-300">
                            PrepLeague ("we," "us," or "our") operates prepleague.com. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our SSC CGL exam preparation platform.
                        </p>
                        <p>
                            By using PrepLeague, you agree to the collection and use of information in accordance with this policy.
                        </p>

                        <div className="h-8"></div>

                        <section id="info-collect">
                            <h2>1. Information We Collect</h2>

                            <h3 className="text-neutral-200 mt-6 mb-3">1.1 Information You Provide</h3>
                            <div className="grid md:grid-cols-2 gap-6 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 my-6 shadow-sm">
                                <div>
                                    <h4 className="text-white font-medium mb-2">Account Information</h4>
                                    <ul className="text-sm text-neutral-400 space-y-1">
                                        <li>Name & Email address</li>
                                        <li>Password (encrypted)</li>
                                        <li>Exam details (target date)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Payment Information</h4>
                                    <ul className="text-sm text-neutral-400 space-y-1">
                                        <li>Payment method (via Razorpay)</li>
                                        <li>Billing address</li>
                                        <li>Transaction history</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Practice Data</h4>
                                    <ul className="text-sm text-neutral-400 space-y-1">
                                        <li>Questions attempted</li>
                                        <li>Time spent & Speed</li>
                                        <li>Session history & Bookmarks</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Optional</h4>
                                    <ul className="text-sm text-neutral-400 space-y-1">
                                        <li>Profile photo</li>
                                        <li>Educational background</li>
                                        <li>Target score goals</li>
                                    </ul>
                                </div>
                            </div>

                            <h3 className="text-neutral-200 mt-8 mb-3">1.2 Automatically Collected Information</h3>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                                <li><strong>Usage Data:</strong> Pages visited, features used, device type, IP address, session duration.</li>
                                <li><strong>Performance Data:</strong> Accuracy by topic, speed analytics, streaks, progress over time.</li>
                                <li><strong>Cookies:</strong> Authentication (required), Preferences, and Analytics cookies.</li>
                            </ul>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="how-we-use">
                            <h2>2. How We Use Your Information</h2>
                            <p>We use your data to power the core functionality of PrepLeague and improve your learning experience.</p>

                            <div className="space-y-6 mt-6">
                                <div>
                                    <h4 className="text-white font-medium">Provide Core Services</h4>
                                    <p className="text-neutral-400 text-sm mt-1">Creating accounts, delivering personalized questions, tracking progress, and calculating predicted scores.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Improve Your Experience</h4>
                                    <p className="text-neutral-400 text-sm mt-1">Recommending questions based on weak areas, adjusting daily targets, and showing speed benchmarks.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Platform Operations & Security</h4>
                                    <p className="text-neutral-400 text-sm mt-1">Processing payments, preventing fraud, and sending important account notifications.</p>
                                </div>
                            </div>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="sharing">
                            <h2>3. How We Share Your Information</h2>
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-6">
                                <p className="text-amber-200 text-sm font-medium m-0">We DO NOT sell your personal information to third parties.</p>
                            </div>
                            <p>We may share information with trusted service providers:</p>
                            <ul className="grid sm:grid-cols-2 gap-4 not-prose my-6">
                                <li className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                                    <strong className="block text-white mb-1">Razorpay</strong>
                                    <span className="text-sm text-neutral-500">Payment processing (PCI DSS compliant)</span>
                                </li>
                                <li className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                                    <strong className="block text-white mb-1">Vercel</strong>
                                    <span className="text-sm text-neutral-500">Web hosting and infrastructure</span>
                                </li>
                                <li className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                                    <strong className="block text-white mb-1">MongoDB Atlas</strong>
                                    <span className="text-sm text-neutral-500">Database hosting (Mumbai region)</span>
                                </li>
                                <li className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-sm">
                                    <strong className="block text-white mb-1">Email Providers</strong>
                                    <span className="text-sm text-neutral-500">For transactional emails only</span>
                                </li>
                            </ul>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="retention">
                            <h2>4. Data Retention</h2>
                            <p>We retain your data while your account is active. Practice history is kept indefinitely to show your progress.</p>
                            <ul>
                                <li><strong>Deleted Accounts:</strong> Personal info removed within 30 days. Anonymized data may be kept for stats.</li>
                                <li><strong>Legal Records:</strong> Payment records kept for 7 years as required by Indian tax law.</li>
                            </ul>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="rights">
                            <h2>5. Your Rights and Choices</h2>
                            <p>Under India's Digital Personal Data Protection Act (DPDPA) 2023, you have the right to:</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm">
                                    <h4 className="text-white m-0">Access & Portability</h4>
                                    <p className="text-sm text-neutral-400 mt-2 m-0">Request a copy of your data or export your practice history.</p>
                                </div>
                                <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm">
                                    <h4 className="text-white m-0">Correction & Deletion</h4>
                                    <p className="text-sm text-neutral-400 mt-2 m-0">Update your profile or request full account deletion.</p>
                                </div>
                                <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm">
                                    <h4 className="text-white m-0">Opt-Out & Withdraw</h4>
                                    <p className="text-sm text-neutral-400 mt-2 m-0">Unsubscribe from emails or disable optional data collection.</p>
                                </div>
                            </div>
                            <p className="mt-6">
                                To exercise these rights, contact us at: <a href="mailto:privacy@prepleague.com">privacy@prepleague.com</a>
                            </p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="security">
                            <h2>6. Data Security</h2>
                            <p>We implement industry-standard security measures:</p>
                            <ul className="list-disc pl-5 mb-4">
                                <li>All data encrypted in transit (HTTPS/TLS)</li>
                                <li>Passwords hashed using bcrypt</li>
                                <li>Database access restricted and encrypted at rest</li>
                                <li>Payment data processed via PCI DSS compliant Razorpay (we never store card details)</li>
                            </ul>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="children">
                            <h2>7. Children's Privacy</h2>
                            <p>PrepLeague is intended for users aged 16 and above. We do not knowingly collect information from children under 16. If we discover such data, we will delete it immediately.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="cookies">
                            <h2>8. Cookies Policy</h2>
                            <p>We use Essential cookies (for login/security), Functional cookies (preferences), and Analytics cookies. You can manage optional cookies in your browser settings.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="links">
                            <h2>9. Third-Party Links</h2>
                            <p>We are not responsible for the privacy practices of external sites (e.g., official SSC website) linked from PrepLeague.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="international">
                            <h2>10. International Transfers</h2>
                            <p>Your data is primarily stored in India (Mumbai). Any international transfers ensure appropriate safeguards and compliance with local laws.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="changes">
                            <h2>11. Changes to This Policy</h2>
                            <p>We may update this policy. Significant changes will be notified via email or a prominent platform notice.</p>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="contact">
                            <h2>12. Contact Us</h2>
                            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-sm">
                                <p className="mt-0">For privacy questions:</p>
                                <p className="mb-1"><strong>Email:</strong> privacy@prepleague.com</p>
                                <p className="mb-1"><strong>Support:</strong> support@prepleague.com</p>
                                <p className="m-0"><strong>Address:</strong> PrepLeague, Hyderabad, Telangana, India</p>
                            </div>
                        </section>

                        <hr className="border-neutral-800 my-12" />

                        <section id="compliance">
                            <h2>13. Compliance</h2>
                            <p>PrepLeague complies with the Digital Personal Data Protection Act (DPDPA) 2023, IT Act 2000, and other relevant Indian laws. </p>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
