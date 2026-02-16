import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';
import Session from '@/core/models/Session';
import { getCurrentUser } from '@/lib/auth';
import { DIFFICULTY_CONFIG } from '@/lib/sprint-config';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { subject, difficulty, topics, questionCount } = body;

        if (!subject || !difficulty || !questionCount) {
            return NextResponse.json({ success: false, error: 'Subject, difficulty, and question count are required' }, { status: 400 });
        }

        // Build query
        const query: any = {
            subject,
            is_live: true, // Ensure we only get live questions
        };

        // Handle topics
        if (topics && topics.length > 0 && !topics.includes('ALL')) {
            query.topic = { $in: topics }; // Assuming 'topic' field in Question model
            // If the field is 'pattern', change to: query.pattern = { $in: topics };
            // Let's verify commonly used field. Previous code used query.topic.
        }

        // Difficulty handling
        if (difficulty !== 'MIXED') {
            query.difficulty = difficulty;
        }

        // Fetch questions using aggregation for random selection
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: questionCount } }
        ]);

        if (questions.length < questionCount) {
            // If not enough questions, return what we have or error?
            // Proceeding with available questions if > 0
            if (questions.length === 0) {
                return NextResponse.json({ success: false, error: 'No questions found for the selected criteria' }, { status: 404 });
            }
        }

        // Calculate total time
        const timePerQ = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG]?.timePerQ || 60;
        const totalTimeAllowed = questions.length * timePerQ * 1000; // in ms

        // Create Session with pre-initialized data
        const session = await Session.create({
            user_id: user.userId,
            type: 'SPRINT',
            config: {
                subject,
                patterns: topics || [],
                difficulty,
                question_count: questions.length,
                time_limit_ms: totalTimeAllowed
            },
            question_ids: questions.map(q => q._id),
            // Initialize question status for tracking order and progress
            question_status: questions.map((q, index) => ({
                question_id: q._id,
                status: 'NOT_ATTEMPTED',
                time_ms: 0,
                order: index + 1
            })),
            stats: {
                total_questions: questions.length,
                attempted: 0,
                correct: 0,
                incorrect: 0,
                skipped: 0,
                not_attempted: questions.length,
                accuracy: 0,
                avg_time_ms: 0,
                total_time_ms: 0
            },
            started_at: new Date(),
            status: 'IN_PROGRESS'
        });

        return NextResponse.json({
            success: true,
            sessionId: session._id, // Returning _id as sessionId
            questions, // Frontend needs full question data
            totalTimeAllowed,
            subject,
            difficulty,
            session // Including full session object if needed
        });

    } catch (error) {
        console.error('Error creating sprint session:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// Keep GET for compatibility or remove?
// The doc doesn't specify GET /api/sprint. The previous implementation had it.
// I'll keep it simple and just implement POST as that's what the UI uses for setup -> session transition.

