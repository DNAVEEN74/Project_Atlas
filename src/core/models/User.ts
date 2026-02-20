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
    target_year: number; // e.g., 2025
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
    sprint_configs: {
        name: string;
        subject: 'QUANT' | 'REASONING';
        topics: string[];
        difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
        question_count: number;
        created_at: Date;
        last_used?: Date;
    }[];
    role: 'USER' | 'ADMIN';
    razorpay_customer_id?: string;
    subscription?: {
        plan: 'MONTHLY' | 'YEARLY';
        status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
        start_date: Date;
        end_date: Date;
    };
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

        target_year: {
            type: Number,
            default: 2025,
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

        sprint_configs: {
            type: [{
                name: { type: String, required: true },
                subject: { type: String, enum: ['QUANT', 'REASONING'], required: true },
                topics: [{ type: String }],
                difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD', 'MIXED'], required: true },
                question_count: { type: Number, required: true, min: 5, max: 20 },
                created_at: { type: Date, default: Date.now },
                last_used: { type: Date }
            }],
            default: [],
            validate: {
                validator: function (configs: any[]) {
                    return configs.length <= 5;
                },
                message: 'Maximum 5 sprint configurations allowed'
            }
        },

        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },

        razorpay_customer_id: { type: String },
        subscription: {
            plan: { type: String, enum: ['MONTHLY', 'YEARLY'] },
            status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'] },
            start_date: { type: Date },
            end_date: { type: Date },
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Prevent overwriting model during compile in development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
