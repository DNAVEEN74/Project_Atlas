import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Conceptual Explanations - Quant & Reasoning",
    description: "Master SSC CGL Quantitative Aptitude and Reasoning with structured conceptual explanations. Learn Percentage, Ratio, Algebra, Syllogism, and 40+ topics with visual guides.",
    keywords: ["SSC CGL concepts", "Quantitative Aptitude explanations", "Reasoning concepts", "Aptitude learning", "SSC preparation guide"],
    openGraph: {
        title: "Conceptual Explanations - PrepLeague",
        description: "Structured learning paths for SSC CGL Quant and Reasoning with 40+ topic deep dives.",
        type: "website",
    },
};

export default function ExplanationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
