import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In to PrepLeague',
    description: 'Log in to your PrepLeague account to continue your SSC CGL, CHSL, and Bank exam preparation.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
