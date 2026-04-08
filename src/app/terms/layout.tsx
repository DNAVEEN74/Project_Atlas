import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service — PrepLeague',
    description: 'Review the Terms of Service for PrepLeague. Understand your rights, account policies, subscription billing, and usage guidelines for our SSC CGL exam preparation platform.',
    openGraph: {
        title: 'Terms of Service — PrepLeague',
        description: 'Terms and conditions governing your use of PrepLeague.',
        type: 'website',
    },
    alternates: {
        canonical: '/terms',
    },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
