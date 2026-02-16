import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
    user_id: mongoose.Types.ObjectId;
    type: 'SPRINT' | 'QUICK_PRACTICE';

    config: {
        subject: 'QUANT' | 'REASONING';
        patterns: string[];
        difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
        question_count: number;
        time_limit_ms: number;
    };

    // Questions & Attempts
    question_ids: mongoose.Types.ObjectId[];
    attempt_ids: mongoose.Types.ObjectId[];

    // ✅ NEW: Per-Question Status Tracking
    question_status: {
        question_id: mongoose.Types.ObjectId;
        status: 'NOT_ATTEMPTED' | 'CORRECT' | 'INCORRECT' | 'SKIPPED';
        attempt_id?: mongoose.Types.ObjectId;
        time_ms: number;
        order: number;
    }[];

    // ✅ NEW: Pre-computed Stats
    stats: {
        total_questions: number;
        attempted: number;
        correct: number;
        incorrect: number;
        skipped: number;
        not_attempted: number;
        accuracy: number;
        avg_time_ms: number;
        total_time_ms: number;
    };

    topic_performance: {
        topic: string;
        total: number;
        correct: number;
        incorrect: number;  // Added incorrect
        skipped: number;    // Added skipped
        accuracy: number;
        avg_time_ms: number;
    }[];

    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    current_index: number;
    started_at: Date;
    completed_at?: Date;
    expired: boolean;   // Added

    // Legacy fields
    correct_count?: number;
    total_time_ms?: number;

    created_at?: Date;
    updated_at?: Date;
}

const SessionSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['SPRINT', 'QUICK_PRACTICE'],
            required: true
        },

        config: {
            subject: {
                type: String,
                enum: ['QUANT', 'REASONING'],
                required: true
            },
            patterns: [{ type: String }],
            difficulty: {
                type: String,
                enum: ['EASY', 'MEDIUM', 'HARD', 'MIXED'],
                required: true
            },
            question_count: { type: Number, required: true },
            time_limit_ms: { type: Number, required: true },
        },

        question_ids: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
        attempt_ids: [{ type: Schema.Types.ObjectId, ref: 'Attempt' }],

        question_status: [{
            question_id: { type: Schema.Types.ObjectId, required: true },
            status: {
                type: String,
                enum: ['NOT_ATTEMPTED', 'CORRECT', 'INCORRECT', 'SKIPPED'],
                required: true
            },
            attempt_id: { type: Schema.Types.ObjectId },
            time_ms: { type: Number, default: 0 },
            order: { type: Number, required: true }
        }],

        stats: {
            total_questions: { type: Number, default: 0 },
            attempted: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            incorrect: { type: Number, default: 0 },
            skipped: { type: Number, default: 0 },
            not_attempted: { type: Number, default: 0 },
            accuracy: { type: Number, default: 0 },
            avg_time_ms: { type: Number, default: 0 },
            total_time_ms: { type: Number, default: 0 }
        },

        // Legacy fields for backward compatibility (optional, or remove if fully migrating)
        correct_count: { type: Number, default: 0 },
        total_time_ms: { type: Number, default: 0 },

        topic_performance: {
            type: [{
                topic: { type: String, required: true },
                total: { type: Number, required: true },
                correct: { type: Number, required: true },
                incorrect: { type: Number, required: true },
                skipped: { type: Number, default: 0 },
                accuracy: { type: Number, required: true },
                avg_time_ms: { type: Number, required: true }
            }],
            default: []
        },

        status: {
            type: String,
            enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
            default: 'IN_PROGRESS'
        },
        current_index: { type: Number, default: 0 },
        started_at: { type: Date, default: Date.now },
        completed_at: { type: Date },
        expired: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Indexes
SessionSchema.index({ user_id: 1, created_at: -1 });
SessionSchema.index({ user_id: 1, status: 1 });
SessionSchema.index({ user_id: 1, 'config.subject': 1, created_at: -1 });

const Session: Model<ISession> =
    mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
