import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password_hash: string;

    profile: {
        name: string;
        username?: string;
        avatar_url?: string;
    };

    // Target exam info (onboarding data)
    target: {
        exam: 'SSC_CGL' | 'SSC_CHSL' | 'SSC_MTS' | 'BANK_PO' | 'BANK_CLERK' | 'RRB_NTPC' | 'OTHER';
        year: number;
    };

    config: {
        mode: 'PRACTICE' | 'TRAINING';
        is_premium: boolean;
    };

    preferences: {
        notifications_enabled: boolean;
        email_digest: boolean;
        difficulty_preference?: 'EASY' | 'MEDIUM' | 'HARD';
        daily_quant_goal: number;
        daily_reasoning_goal: number;
    };

    // Dashboard summary data
    dash: {
        total_solved: number;
        total_correct: number;
        streak: number;
        max_streak: number;
        heatmap: {
            date: string; // YYYY-MM-DD format
            count: number;
            intensity: number; // 0-4 for color intensity
        }[];
        last_active: Date;
    };

    // Bookmarked questions
    bookmarks: mongoose.Types.ObjectId[];

    // Game stats
    games: {
        gameId: string;
        bestScore: number;
        attempts: number;
        lastPlayed: Date;
    }[];

    is_email_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password_hash: { type: String, required: true },

        profile: {
            name: { type: String, required: true },
            username: { type: String, unique: true, sparse: true },
            avatar_url: { type: String },
        },

        target: {
            exam: {
                type: String,
                enum: ['SSC_CGL', 'SSC_CHSL', 'SSC_MTS', 'BANK_PO', 'BANK_CLERK', 'RRB_NTPC', 'OTHER'],
                default: 'SSC_CGL',
            },
            year: { type: Number, default: 2025 },
        },

        config: {
            mode: {
                type: String,
                enum: ['PRACTICE', 'TRAINING'],
                default: 'PRACTICE',
            },
            is_premium: { type: Boolean, default: false },
        },

        preferences: {
            notifications_enabled: { type: Boolean, default: true },
            email_digest: { type: Boolean, default: false },
            difficulty_preference: {
                type: String,
                enum: ['EASY', 'MEDIUM', 'HARD'],
            },
            daily_quant_goal: { type: Number, default: 5, min: 1, max: 50 },
            daily_reasoning_goal: { type: Number, default: 5, min: 1, max: 50 },
        },

        dash: {
            total_solved: { type: Number, default: 0 },
            total_correct: { type: Number, default: 0 },
            streak: { type: Number, default: 0 },
            max_streak: { type: Number, default: 0 },
            heatmap: [
                {
                    date: { type: String },
                    count: { type: Number },
                    intensity: { type: Number, min: 0, max: 4 },
                },
            ],
            last_active: { type: Date, default: Date.now },
        },

        bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Question' }],

        games: [
            {
                gameId: { type: String, required: true },
                bestScore: { type: Number, default: 0 },
                attempts: { type: Number, default: 0 },
                lastPlayed: { type: Date, default: Date.now },
            }
        ],

        is_email_verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Prevent overwriting model during compile in development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
