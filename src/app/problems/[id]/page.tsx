
import { Metadata } from 'next';
import connectDB from '@/core/db/connect';
import Question from '@/core/models/Question';
import ProblemClient from './ProblemClient';

interface Props {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getQuestion(id: string) {
    try {
        await connectDB();
        const question = await Question.findById(id).lean();
        return question;
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id } = await params;
    const question: any = await getQuestion(id);

    if (!question) {
        return {
            title: 'Question Not Found - PrepLeague',
        };
    }

    // Create a snippet for the title (first 50 chars)
    const snippet = (question.text || '').replace(/<[^>]*>/g, '').substring(0, 50) + '...';

    return {
        title: `Question: ${snippet} - PrepLeague`,
        description: `Practice this SSC CGL question on PrepLeague. Topic: ${question.pattern || 'General'}.`,
    };
}

export default async function ProblemPage({ params, searchParams }: Props) {
    const { id } = await params;
    const searchParamsValue = await searchParams;
    const section = (searchParamsValue?.section as string) || 'QUANT';

    // Fetch data server-side
    // We already have getQuestion from metadata, but we should reuse or call it
    const question = await getQuestion(id);

    // We also need navigation data ideally, but that might be complex to dup here without API logic.
    // For now, let's just pass the question which is the critical part for Immediate Content Paint + SEO.
    // Client will fetch navigation if missing or we can try to fetch it here if we import logic.
    // Since navigation depends on query params/filters, it's easier to let client fetch it or stub it.
    // If we pass null for navigation, client will fetch it.

    // Transform _id to id if necessary (lean() returns _id)
    let initialQuestion: any = null;
    if (question) {
        initialQuestion = {
            ...question,
            id: (question as any)._id.toString(),
            options: question.options?.map((opt: any) => ({
                id: opt.id,
                text: opt.text,
                image: opt.image || ''
            })) || []
        };
        // Ensure other ObjectIds are strings if needed
        if (initialQuestion._id) delete initialQuestion._id;
    }

    return <ProblemClient initialQuestion={initialQuestion} />;
}
