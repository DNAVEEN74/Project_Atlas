import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyActivity extends Document {
    user_id: mongoose.Types.ObjectId;
    date: string;                 // "YYYY-MM-DD"
    questions_solved: number;
    questions_correct: number;
    time_spent_ms: number;
    sessions_completed: number;
    games_played: number;
    quant_solved: number;
    reasoning_solved: number;
}

const DailyActivitySchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: String, required: true }, // "YYYY-MM-DD"
        questions_solved: { type: Number, default: 0 },
        questions_correct: { type: Number, default: 0 },
        time_spent_ms: { type: Number, default: 0 },
        sessions_completed: { type: Number, default: 0 },
        games_played: { type: Number, default: 0 },
        quant_solved: { type: Number, default: 0 },
        reasoning_solved: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Indexes:
// { user_id: 1, date: 1 } unique     — one doc per user per day
// { user_id: 1, date: -1 }           — heatmap query
DailyActivitySchema.index({ user_id: 1, date: 1 }, { unique: true });
DailyActivitySchema.index({ user_id: 1, date: -1 });

const DailyActivity: Model<IDailyActivity> =
    mongoose.models.DailyActivity || mongoose.model<IDailyActivity>('DailyActivity', DailyActivitySchema);

export default DailyActivity;
