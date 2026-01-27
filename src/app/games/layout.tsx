import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Speed Drills & Math Games for Aptitude Training",
    description: "Sharpen your calculation speed with interactive math games and speed drills. Practice mental math, simplification, and reasoning puzzles to ace SSC CGL and Bank exams.",
    keywords: ["Math games", "Speed drills", "Mental math practice", "Aptitude training", "Calculation speed", "SSC preparation games"],
    openGraph: {
        title: "Speed Drills & Math Games - PrepLeague",
        description: "Interactive games to build calculation speed for competitive exams.",
        type: "website",
    },
};

export default function GamesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
