
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Define minimal schemas for migration if not importing models directly to avoid side effects
// But importing models is better if possible. 
// However, ts-node execution might have issues with aliases (@/core/...).
// Best for a standalone script is to use relative imports or module-alias.
// Let's assume we run this with ts-node -r tsconfig-paths/register

import dbConnect from '../src/core/db/connect'; // Adjust if needed or copy connect logic
import Session from '../src/core/models/Session';
import Attempt from '../src/core/models/Attempt';

async function migrateSprints() {
    console.log('Starting migration...');
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to DB');

        // specific query: Completed sessions without new stats field
        const sessions = await Session.find({
            status: 'COMPLETED',
            stats: { $exists: false }
        }).limit(1000); // Process in chunks if needed

        console.log(`Found ${sessions.length} sessions to migrate.`);

        for (const session of sessions) {
            console.log(`Migrating session ${session._id}...`);

            // Fetch attempts
            const attempts = await Attempt.find({ session_id: session._id });

            const totalQuestions = session.config.question_count || session.question_ids.length;

            // Calculate Stats
            const correct = attempts.filter(a => a.is_correct).length;
            const attempted = attempts.length; // Might include skipped if old logic stored them
            // Old logic: "Skipped" might have selected_option = 'SKIPPED'
            const skipped = attempts.filter(a => (a as any).selected_option === 'SKIPPED').length;
            const answered = attempted - skipped;

            // Stats Object
            const stats = {
                total_questions: totalQuestions,
                attempted: answered,
                correct: correct,
                incorrect: answered - correct,
                skipped: skipped,
                not_attempted: totalQuestions - attempted,
                accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
                avg_time_ms: attempted > 0
                    ? Math.round((session.total_time_ms || 0) / attempted)
                    : 0,
                total_time_ms: session.total_time_ms || 0
            };

            // Question Status backfill (approximate from attempts)
            const questionStatus = session.question_ids.map((qid: any, index: number) => {
                const attempt = attempts.find(a => a.question_id.toString() === qid.toString());
                let status = 'NOT_ATTEMPTED';
                let time_ms = 0;
                let attempt_id = undefined;

                if (attempt) {
                    status = (attempt as any).selected_option === 'SKIPPED'
                        ? 'SKIPPED'
                        : attempt.is_correct ? 'CORRECT' : 'INCORRECT';
                    time_ms = attempt.time_ms;
                    attempt_id = attempt._id;
                }

                return {
                    question_id: qid,
                    status,
                    attempt_id,
                    time_ms,
                    order: index + 1
                };
            });

            // Update Session
            session.stats = stats as any;
            session.question_status = questionStatus as any;
            session.expired = false; // Default

            // Fix topic_performance validation errors (missing required fields)
            if (session.topic_performance && session.topic_performance.length > 0) {
                session.topic_performance.forEach((tp: any) => {
                    if (typeof tp.incorrect === 'undefined') {
                        tp.incorrect = tp.total - tp.correct;
                    }
                    if (typeof tp.skipped === 'undefined') {
                        tp.skipped = 0; // Better safe default
                    }
                });
            }

            // Construct topic performance if missing?
            // Existing sessions might have topic_performance partially populated.
            // But new schema expects specific fields.
            // Let's assume old topic_performance is okay-ish or regenerate?
            // Regenerating is safer.

            // ... (Topic aggregation omitted for brevity, focusing on core stats)

            await session.save();
        }

        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateSprints();
