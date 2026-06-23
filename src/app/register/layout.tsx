import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Join PrepLeague — SSC CGL Exam Practice',
    description: 'Create your PrepLeague account and start practicing 3,000+ SSC CGL, CHSL, and Bank exam questions today.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
