import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    u_id: string; // Auth0 ID
    email: string;
    config: {
        mode: 'PRACTICE' | 'TRAINING';
        is_premium: boolean;
    };
    dash: {
        total_solved: number;
        streak: number;
        heatmap: {
            date: string;
            count: number;
            intensity: number;
        }[];
        // heatmap data stored separately or summarized here? Overview said heatmap in dash, but daily logs separate.
        // We will keep a summary here for fast load.
        last_active: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        u_id: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true },
        config: {
            mode: {
                type: String,
                enum: ['PRACTICE', 'TRAINING'],
                default: 'PRACTICE',
            },
            is_premium: { type: Boolean, default: false },
        },
        dash: {
            total_solved: { type: Number, default: 0 },
            streak: { type: Number, default: 0 },
            heatmap: [
                {
                    date: { type: String },
                    count: { type: Number },
                    intensity: { type: Number },
                },
            ],
            last_active: { type: Date, default: Date.now },
        },
    },
    { timestamps: true }
);

// Prevent overwriting model during compile in development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
