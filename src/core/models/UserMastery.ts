import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * User Mastery - Per-user, per-pattern proficiency tracking
 * 
 * This is the HEART of Training Mode:
 * - Tracks accuracy and speed per pattern
 * - Aggregates mistake patterns over time
 * - Enables personalized learning recommendations
 */

export type SpeedRating = 'FAST' | 'NORMAL' | 'SLOW';

export interface ITopMistake {
    tag: string;
    count: number;
    last_seen: Date;
}

export interface IUserMastery {
    _id: string; // Composite: "userId_patternId"
    u_id: mongoose.Types.ObjectId;
    p_id: mongoose.Types.ObjectId; // Pattern reference

    // Aggregate performance stats
    stats: {
        total_attempts: number;
        correct_count: number;
        accuracy: number; // Computed: correct/total (0-1)
        avg_time_ms: number;
        best_time_ms: number;
        streak: number; // Current consecutive correct
        last_attempt: Date;
    };

    // Inference aggregates
    inference: {
        top_mistakes: ITopMistake[]; // Top 3 mistake tags for this pattern
        speed_rating: SpeedRating;
        confidence_trend: number; // -1 to 1 (declining to improving)
        needs_trick: boolean; // Recommends trick learning
    };

    // Learning progress
    learning: {
        trick_learned: boolean;
        trick_practiced_count: number;
        last_trick_practice: Date | null;
    };

    createdAt: Date;
    updatedAt: Date;
}

const UserMasterySchema: Schema = new Schema(
    {
        _id: { type: String, required: true }, // Composite key
        u_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        p_id: {
            type: Schema.Types.ObjectId,
            ref: 'Pattern',
            required: true,
            index: true,
        },

        stats: {
            total_attempts: { type: Number, default: 0 },
            correct_count: { type: Number, default: 0 },
            accuracy: { type: Number, default: 0, min: 0, max: 1 },
            avg_time_ms: { type: Number, default: 0 },
            best_time_ms: { type: Number, default: 0 },
            streak: { type: Number, default: 0 },
            last_attempt: { type: Date },
        },

        inference: {
            top_mistakes: [
                {
                    tag: { type: String },
                    count: { type: Number, default: 0 },
                    last_seen: { type: Date },
                },
            ],
            speed_rating: {
                type: String,
                enum: ['FAST', 'NORMAL', 'SLOW'],
                default: 'NORMAL',
            },
            confidence_trend: { type: Number, default: 0, min: -1, max: 1 },
            needs_trick: { type: Boolean, default: false },
        },

        learning: {
            trick_learned: { type: Boolean, default: false },
            trick_practiced_count: { type: Number, default: 0 },
            last_trick_practice: { type: Date, default: null },
        },
    },
    { _id: false, timestamps: true }
);

// Compound index for efficient queries
UserMasterySchema.index({ 'stats.accuracy': 1 });
UserMasterySchema.index({ 'inference.needs_trick': 1 });

const UserMastery: Model<IUserMastery> =
    mongoose.models.UserMastery ||
    mongoose.model<IUserMastery>('UserMastery', UserMasterySchema);

export default UserMastery;
