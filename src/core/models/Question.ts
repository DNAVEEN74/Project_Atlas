import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
    text: string;
    image?: string;                     // R2 URL
    options: Array<{
        id: string;                       // "A","B","C","D"
        text: string;
        image?: string;
    }>;
    correct_option: string;             // "A"|"B"|"C"|"D"
    solution?: string;

    subject: 'QUANT' | 'REASONING';
    pattern: string;                    // "percentage", "geometry_circles"
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';

    source: {
        exam: string;                     // "SSC CGL 2024"
        year: number;
        shift: string;                    // "Tier 1 - 09.09.2024 Shift 1"
    };

    stats: {                            // updated periodically via aggregation
        attempt_count: number;
        accuracy_rate: number;            // 0-1
        avg_time_ms: number;
    };

    is_live: boolean;                   // replaces COLD/OBSERVATION/CALIBRATION/VERIFIED
    needs_review: boolean;
    created_at: Date;
}

const QuestionSchema: Schema = new Schema(
    {
        text: { type: String, required: true },
        image: { type: String },
        options: [
            {
                id: { type: String, required: true }, // "A","B","C","D"
                text: { type: String, required: true },
                image: { type: String },
            },
        ],
        correct_option: { type: String, required: true },
        solution: { type: String },

        subject: {
            type: String,
            enum: ['QUANT', 'REASONING'],
            required: true
        },
        pattern: { type: String, required: true, index: true },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            required: true
        },

        source: {
            exam: { type: String, required: true },
            year: { type: Number, required: true },
            shift: { type: String, required: true },
        },

        stats: {
            attempt_count: { type: Number, default: 0 },
            accuracy_rate: { type: Number, default: 0 },
            avg_time_ms: { type: Number, default: 0 },
        },

        is_live: { type: Boolean, default: false, index: true },
        needs_review: { type: Boolean, default: true, index: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Indexes:
// { is_live: 1, subject: 1, pattern: 1, difficulty: 1 }  — browse query
QuestionSchema.index({ is_live: 1, subject: 1, pattern: 1, difficulty: 1 });
// { is_live: 1, 'source.year': -1 }                      — year filter
QuestionSchema.index({ is_live: 1, 'source.year': -1 });
// { needs_review: 1, is_live: 1 }                         — admin queue
QuestionSchema.index({ needs_review: 1, is_live: 1 });

const Question: Model<IQuestion> =
    mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
