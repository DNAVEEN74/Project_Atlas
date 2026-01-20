import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGameAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    gameId: string;
    category: 'QUANT' | 'REASONING';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    score: number;
    metrics: {
        totalQuestions: number;
        correctAnswers: number;
        timeTaken: number; // in seconds
    };
    createdAt: Date;
}

const GameAttemptSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        gameId: {
            type: String,
            required: true,
            index: true
        },
        category: {
            type: String,
            enum: ['QUANT', 'REASONING'],
            required: true
        },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            required: true,
            default: 'MEDIUM'
        },
        score: {
            type: Number,
            required: true
        },
        metrics: {
            totalQuestions: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            timeTaken: { type: Number, default: 0 }
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// Index for efficiency: User/Game stats lookup
GameAttemptSchema.index({ userId: 1, gameId: 1, createdAt: -1 });
// Index for category trends
GameAttemptSchema.index({ userId: 1, category: 1, createdAt: -1 });

const GameAttempt: Model<IGameAttempt> =
    mongoose.models.GameAttempt || mongoose.model<IGameAttempt>('GameAttempt', GameAttemptSchema);

export default GameAttempt;
