import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGameScore extends Document {
    user_id: mongoose.Types.ObjectId;
    game_id: string;              // "multiplication", "square_roots", etc.
    score: number;
    total_questions: number;
    correct_answers: number;
    time_seconds: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    created_at: Date;
}

const GameScoreSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        game_id: { type: String, required: true },
        score: { type: Number, required: true },
        total_questions: { type: Number, required: true },
        correct_answers: { type: Number, required: true },
        time_seconds: { type: Number, required: true },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            required: true
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Indexes:
// { user_id: 1, created_at: -1 }    — game history
// { game_id: 1, score: -1 }          — leaderboard (future)
GameScoreSchema.index({ user_id: 1, created_at: -1 });
GameScoreSchema.index({ game_id: 1, score: -1 });

const GameScore: Model<IGameScore> =
    mongoose.models.GameScore || mongoose.model<IGameScore>('GameScore', GameScoreSchema);

export default GameScore;
