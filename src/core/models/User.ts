import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;                    // unique, indexed
    password_hash: string;
    profile: {
        name: string;
        username: string;               // unique, indexed
        avatar_url?: string;
    };
    target_exam: 'SSC_CGL';
    config: { is_premium: boolean; };
    preferences: {
        daily_quant_goal: number;       // 5-100
        daily_reasoning_goal: number;   // 5-100
    };
    stats: {
        total_solved: number;
        total_correct: number;
        current_streak: number;
        max_streak: number;
        last_active_date: string;       // "YYYY-MM-DD"
    };
    role: 'USER' | 'ADMIN';
    created_at: Date;
    updated_at: Date;
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
            username: { type: String, required: true, unique: true, index: true },
            avatar_url: { type: String },
        },

        target_exam: {
            type: String,
            enum: ['SSC_CGL'],
            default: 'SSC_CGL',
        },

        config: {
            is_premium: { type: Boolean, default: false },
        },

        preferences: {
            daily_quant_goal: { type: Number, default: 5, min: 5, max: 100 },
            daily_reasoning_goal: { type: Number, default: 5, min: 5, max: 100 },
        },

        stats: {
            total_solved: { type: Number, default: 0 },
            total_correct: { type: Number, default: 0 },
            current_streak: { type: Number, default: 0 },
            max_streak: { type: Number, default: 0 },
            last_active_date: { type: String, default: () => new Date().toISOString().split('T')[0] },
        },

        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Prevent overwriting model during compile in development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
