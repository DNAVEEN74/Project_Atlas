import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sprint Mode - Timed Practice Tests",
    description: "Test your speed and accuracy with timed sprint sessions. High-intensity practice for SSC CGL, CHSL, and Bank exams. Customize topic, difficulty, and question count.",
    keywords: ["SSC mock test", "Timed practice", "Sprint test", "Speed test", "SSC CGL test", "Aptitude test"],
    openGraph: {
        title: "Sprint Mode - Timed Tests - PrepLeague",
        description: "High-intensity timed practice sessions for competitive exam preparation.",
        type: "website",
    },
};

export default function SprintLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
