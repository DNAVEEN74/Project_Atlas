import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Practice SSC CGL & CHSL Previous Year Questions",
    description: "Solve 10,000+ SSC CGL, CHSL, and Bank exam previous year questions (PYQs). Filter by topic, year, and difficulty. Practice Quantitative Aptitude and Reasoning with instant solutions.",
    keywords: ["SSC CGL PYQ", "SSC CHSL questions", "Bank exam practice", "Quantitative Aptitude questions", "Reasoning questions", "previous year questions"],
    openGraph: {
        title: "Practice SSC CGL Questions - PrepLeague",
        description: "10,000+ SSC Previous Year Questions with solutions. Practice Quant and Reasoning.",
        type: "website",
    },
};

export default function ProblemsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            {children}
        </div>
    )
}

