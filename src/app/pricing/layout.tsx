import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PrepLeague Pro Pricing — SSC CGL Exam Prep Plans',
    description: 'Upgrade to PrepLeague Pro and get unlimited Sprint training, full analytics, unlimited AI Tutor, and an ad-free experience. Monthly at ₹99 or Yearly at ₹499.',
    keywords: ['PrepLeague pricing', 'SSC CGL pro plan', 'exam prep subscription', 'PrepLeague pro', 'competitive exam premium'],
    openGraph: {
        title: 'PrepLeague Pro — Unlock Elite SSC CGL Preparation',
        description: 'Unlimited access to AI Tutor, advanced analytics, and sprint drills. From ₹99/month.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PrepLeague Pro — Unlock Elite SSC CGL Preparation',
        description: 'Unlimited access to AI Tutor, advanced analytics, and sprint drills. From ₹99/month.',
    },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
