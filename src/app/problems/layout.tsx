import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Practice SSC CGL Previous Year Questions",
    description: "Solve 3,000+ SSC CGL previous year questions (PYQs). Filter by topic, year, and difficulty. Practice Quantitative Aptitude and Reasoning with step-by-step solutions.",
    keywords: ["SSC CGL PYQ", "SSC CGL questions", "Quantitative Aptitude questions", "Reasoning questions", "previous year questions", "SSC CGL 2024"],
    openGraph: {
        title: "Practice SSC CGL Questions - PrepLeague",
        description: "3,000+ SSC CGL Previous Year Questions with solutions. Practice Quant and Reasoning.",
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

