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

    question_ids: mongoose.Types.ObjectId[];           // fetched at session start
    attempt_ids: mongoose.Types.ObjectId[];            // populated as user answers
    correct_count: number;
    total_time_ms: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    current_index: number;              // for browser-close resumption

    created_at: Date;
    completed_at?: Date;
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
        correct_count: { type: Number, default: 0 },
        total_time_ms: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
            default: 'IN_PROGRESS'
        },
        current_index: { type: Number, default: 0 },

        completed_at: { type: Date },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Index: { user_id: 1, created_at: -1 }  — session history
SessionSchema.index({ user_id: 1, created_at: -1 });

const Session: Model<ISession> =
    mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
