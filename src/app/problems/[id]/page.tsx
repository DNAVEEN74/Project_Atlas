
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
    const snippet = question.content.text.replace(/<[^>]*>/g, '').substring(0, 50) + '...';

    return {
        title: `Question: ${snippet} - PrepLeague`,
        description: `Practice this SSC CGL question on PrepLeague. Topic: ${question.pattern?.topic || 'General'}.`,
    };
}

export default async function ProblemPage({ params }: Props) {
    const { id } = await params;
    // We can pre-fetch data here if we want to pass initial data to Client Component
    // For now, the Client Component does its own fetching, but we handle the SEO shell here.

    return <ProblemClient />;
}
