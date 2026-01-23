import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * SprintAttempt - Stores sprint session data for analytics
 * 
 * Sprint Mode provides timed exam simulation with:
 * - Subject and topic filtering
 * - Difficulty-based timing
 * - Per-question tracking
 */

export type SprintSubject = 'QUANT' | 'REASONING';
export type SprintDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SprintStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface ISprintAnswer {
    questionId: mongoose.Types.ObjectId;
    selectedOption: string;  // "opt_1", "opt_2", etc.
    isCorrect: boolean;
    timeTaken: number;  // ms for this question
}

export interface ISprintAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    date: string;           // YYYY-MM-DD
    subject: SprintSubject;
    topics: string[];       // Pattern names/codes
    difficulty: SprintDifficulty;
    questionCount: number;
    questionIds: mongoose.Types.ObjectId[];
    answers: ISprintAnswer[];
    correctCount: number;
    totalTimeSpent: number; // ms
    totalTimeAllowed: number; // ms (based on difficulty)
    status: SprintStatus;
    currentIndex: number;   // For resumption (though not used in Phase-1)
    createdAt: Date;
}

const SprintAttemptSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        date: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            enum: ['QUANT', 'REASONING'],
            required: true
        },
        topics: [{
            type: String
        }],
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            required: true
        },
        questionCount: {
            type: Number,
            required: true
        },
        questionIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        answers: [{
            questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
            selectedOption: { type: String },
            isCorrect: { type: Boolean },
            timeTaken: { type: Number, default: 0 }
        }],
        correctCount: {
            type: Number,
            default: 0
        },
        totalTimeSpent: {
            type: Number,
            default: 0
        },
        totalTimeAllowed: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
            default: 'IN_PROGRESS'
        },
        currentIndex: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// Index for efficient user sprint history queries
SprintAttemptSchema.index({ userId: 1, createdAt: -1 });
// Index for finding active sprints
SprintAttemptSchema.index({ userId: 1, status: 1 });
// Index for analytics by subject/difficulty
SprintAttemptSchema.index({ userId: 1, subject: 1, difficulty: 1 });

const SprintAttempt: Model<ISprintAttempt> =
    mongoose.models.SprintAttempt || mongoose.model<ISprintAttempt>('SprintAttempt', SprintAttemptSchema);

export default SprintAttempt;
