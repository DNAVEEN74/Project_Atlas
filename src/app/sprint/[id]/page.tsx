
import React from 'react';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import Session from '@/core/models/Session';
import Question from '@/core/models/Question';
import Attempt from '@/core/models/Attempt';
import { getCurrentUser } from '@/lib/auth';
import SprintClient from './SprintClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SprintSessionPage({ params }: PageProps) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

    await dbConnect();
    const { id: sessionId } = await params;

    // Validate that sessionId is a valid MongoDB ObjectId (prevents CastError for routes like /sprint/setup)
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        redirect('/sprint');
    }

    // Fetch Session
    const session = await Session.findOne({ _id: sessionId, user_id: user.userId }).lean();

    if (!session) {
        redirect('/sprint'); // Session not found
    }

    if (session.status === 'COMPLETED' || session.status === 'ABANDONED') {
        redirect(`/sprint/${sessionId}/summary`);
    }

    // Fetch Questions
    // We need to fetch all questions for this session to pass to client
    const questions = await Question.find({ _id: { $in: session.question_ids } }).lean();

    // Order questions based on session.question_ids
    const questionsMap = new Map(questions.map(q => [q._id.toString(), q]));
    const orderedQuestions = session.question_ids
        .map((id: any) => questionsMap.get(id.toString()))
        .filter(Boolean)
        .map((q: any) => ({
            ...q,
            _id: q._id.toString(), // Convert ObjectId to string for client
            // source might be object, ensure serializability if needed
            // options usually have _id too
            options: q.options?.map((opt: any) => ({
                ...opt,
                _id: opt._id ? opt._id.toString() : undefined,
                id: opt.id // Keep original ID (A, B, C, D)
            }))
        }));

    // Fetch Attempts (for restoring state)
    const attempts = await Attempt.find({ session_id: sessionId }).lean();
    const serializedAttempts = attempts.map(a => ({
        ...a,
        _id: a._id.toString(),
        question_id: a.question_id.toString(),
        session_id: (a.session_id as any)?.toString(),
        user_id: a.user_id.toString()
    }));

    // Serialize Session
    const serializedSession = {
        ...session,
        _id: session._id.toString(),
        user_id: session.user_id.toString(),
        question_ids: session.question_ids.map((id: any) => id.toString()),
        attempt_ids: session.attempt_ids?.map((id: any) => id.toString()) || [],
        started_at: session.started_at ? session.started_at.toISOString() : null,
        created_at: (session as any).created_at ? (session as any).created_at.toISOString() : null,
        updated_at: (session as any).updated_at ? (session as any).updated_at.toISOString() : null,
        completed_at: session.completed_at ? session.completed_at.toISOString() : null,
        question_status: session.question_status?.map((qs: any) => ({
            question_id: qs.question_id.toString(),
            status: qs.status,
            time_ms: qs.time_ms,
            order: qs.order,
            attempt_id: qs.attempt_id ? qs.attempt_id.toString() : undefined
        })),
        topic_performance: session.topic_performance?.map((tp: any) => ({
            ...tp,
            _id: tp._id ? tp._id.toString() : undefined
        }))
    };

    return (
        <SprintClient
            session={serializedSession}
            questions={orderedQuestions}
            initialAttempts={serializedAttempts}
            userId={user.userId}
        />
    );
}
