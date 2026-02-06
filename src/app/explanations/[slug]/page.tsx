import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPatternBySlug, getAllPatternSlugs } from '@/data/explanations-data';
import { PatternContentWrapper } from './PatternContentWrapper';

// Generate static params for all patterns
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

    return <PatternContentWrapper slug={slug} pattern={pattern} />;
}
