import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyPracticeSession extends Document {
    u_id: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD format
    section: 'QUANT' | 'REASONING';
    question_ids: mongoose.Types.ObjectId[];
    answered_ids: mongoose.Types.ObjectId[];
    is_complete: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DailyPracticeSessionSchema: Schema = new Schema(
    {
        u_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        date: {
            type: String,
            required: true,
            index: true
        },
        section: {
            type: String,
            enum: ['QUANT', 'REASONING'],
            required: true
        },
        question_ids: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        answered_ids: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        is_complete: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

// Compound unique index for user-date-section
DailyPracticeSessionSchema.index(
    { u_id: 1, date: 1, section: 1 },
    { unique: true }
);

const DailyPracticeSession: Model<IDailyPracticeSession> =
    mongoose.models.DailyPracticeSession ||
    mongoose.model<IDailyPracticeSession>('DailyPracticeSession', DailyPracticeSessionSchema);

export default DailyPracticeSession;
