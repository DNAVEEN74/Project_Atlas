import { MetadataRoute } from 'next';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://prepleague.com';

    // Static routes
    const routes = [
        '',
        '/problems',
        '/sprint',
        '/games',
        '/dashboard',
        '/pricing',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    let questionRoutes: MetadataRoute.Sitemap = [];

    try {
        await dbConnect();

        // Fetch last 5000 active questions
        // Using 'status' or 'is_live' depending on schema. 
        // Based on recent refactor plan: "Remove benchmarks, calibration, status (replace with is_live)"
        // So I should look for is_live.
        // But if I haven't verified if migration ran, I'll check both or just 'is_live' if schema was updated.
        // Schema file view will confirm.

        const questions = await Question.find({ is_live: true })
            .select('_id updatedAt')
            .sort({ createdAt: -1 })
            .limit(5000)
            .lean();

        questionRoutes = questions.map((q: any) => ({
            url: `${baseUrl}/problems/${q._id}`,
            lastModified: q.updatedAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    return [...routes, ...questionRoutes];
}
