import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import { getPatternBySlug, getAllPatternSlugs } from '@/data/explanations-data';
import { PatternContent } from './content-loader';

// Generate static params for all patterns to enable static generation where possible/useful
export async function generateStaticParams() {
    const slugs = getAllPatternSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pattern = getPatternBySlug(slug);

    if (!pattern) {
        return {
            title: 'Topic Not Found | PrepLeague',
            description: 'The requested explanation topic could not be found.',
        };
    }

    return {
        title: pattern.seo.title,
        description: pattern.seo.description,
        keywords: pattern.seo.keywords,
        openGraph: {
            title: pattern.seo.title,
            description: pattern.seo.description,
            type: 'article',
            section: pattern.category === 'quant' ? 'Quantitative Aptitude' : 'Reasoning',
            tags: pattern.seo.keywords,
        },
    };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pattern = getPatternBySlug(slug);

    if (!pattern) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] pb-20">
            {/* Main Header */}
            <Header activePage="explanations" />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
                {/* 
                  We have removed the standard header/title shell here.
                  The content components (e.g., percentage.tsx) now control the full layout.
                  This allows for immersive hero sections and custom sidebar layouts.
                */}
                <PatternContent slug={slug} />
            </main>
        </div>
    );
}
