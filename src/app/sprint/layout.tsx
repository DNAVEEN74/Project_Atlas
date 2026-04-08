import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sprint Mode - Timed SSC CGL Practice Tests",
    description: "Test your speed and accuracy with timed sprint sessions. High-intensity Quant & Reasoning drills for SSC CGL. Customize topic, difficulty, and question count.",
    keywords: ["SSC CGL mock test", "Timed practice", "Sprint test", "Speed test", "SSC CGL test", "Aptitude test"],
    openGraph: {
        title: "Sprint Mode - Timed Tests - PrepLeague",
        description: "High-intensity timed practice sessions for SSC CGL Quant & Reasoning preparation.",
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
