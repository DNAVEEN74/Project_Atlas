import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttempt extends Document {
    user_id: mongoose.Types.ObjectId;                  // indexed
    question_id: mongoose.Types.ObjectId;              // indexed
    session_id?: mongoose.Types.ObjectId;              // null = individual, set = sprint

    selected_option: string;            // "A","B","C","D"
    is_correct: boolean;
    time_ms: number;

    // Denormalized from Question (avoids joins on analytics queries)
    subject: 'QUANT' | 'REASONING';
    pattern: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';

    created_at: Date;
}

const AttemptSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
        session_id: { type: Schema.Types.ObjectId, ref: 'Session' },

        selected_option: { type: String, required: true },
        is_correct: { type: Boolean, required: true },
        time_ms: { type: Number, required: true },

        subject: {
            type: String,
            enum: ['QUANT', 'REASONING'],
            required: true
        },
        pattern: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            required: true
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Indexes (each maps to a real feature):
// { user_id: 1, created_at: -1 }              — submission history
AttemptSchema.index({ user_id: 1, created_at: -1 });
// { user_id: 1, question_id: 1 }              — check if solved (problem list badges)
AttemptSchema.index({ user_id: 1, question_id: 1 });
// { user_id: 1, pattern: 1, is_correct: 1 }   — topic-wise accuracy
AttemptSchema.index({ user_id: 1, pattern: 1, is_correct: 1 });
// { user_id: 1, subject: 1, is_correct: 1 }   — subject-wise split
AttemptSchema.index({ user_id: 1, subject: 1, is_correct: 1 });
// { question_id: 1, is_correct: 1 }            — question crowd stats
AttemptSchema.index({ question_id: 1, is_correct: 1 });
// { session_id: 1 }                            — sprint results
AttemptSchema.index({ session_id: 1 });
// { user_id: 1, session_id: 1 }                — check if user attempted in this session
AttemptSchema.index({ user_id: 1, session_id: 1 });
// { session_id: 1, pattern: 1, is_correct: 1 } — session-specific topic performance
AttemptSchema.index({ session_id: 1, pattern: 1, is_correct: 1 });

const Attempt: Model<IAttempt> =
    mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
