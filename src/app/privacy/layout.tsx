import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy — PrepLeague',
    description: 'Read how PrepLeague collects, uses, and protects your personal data in compliance with the Digital Personal Data Protection Act (DPDPA) 2023 and IT Act 2000.',
    openGraph: {
        title: 'Privacy Policy — PrepLeague',
        description: 'How PrepLeague collects and protects your personal data.',
        type: 'website',
    },
    alternates: {
        canonical: '/privacy',
    },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
