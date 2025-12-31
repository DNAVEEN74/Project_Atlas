import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestionOption {
    id: string;
    text: string;
    is_correct: boolean;
    inf_tag?: string; // Tag for inference (e.g. "IGNORED_BASE_CHANGE")
}

export interface IQuestion extends Document {
    p_id?: mongoose.Types.ObjectId; // Pattern ID (optional for now)
    status: 'COLD' | 'OBSERVATION' | 'CALIBRATION' | 'VERIFIED';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    content: {
        text: string;
        options: IQuestionOption[];
    };
    benchmarks: {
        golden_ms: number; // expected time in ms
    };
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
    {
        p_id: { type: Schema.Types.ObjectId, ref: 'Pattern' },
        status: {
            type: String,
            enum: ['COLD', 'OBSERVATION', 'CALIBRATION', 'VERIFIED'],
            default: 'COLD',
            index: true,
        },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            default: 'MEDIUM',
        },
        content: {
            text: { type: String, required: true },
            options: [
                {
                    id: { type: String, required: true },
                    text: { type: String, required: true },
                    is_correct: { type: Boolean, required: true },
                    inf_tag: { type: String }, // Optional
                },
            ],
        },
        benchmarks: {
            golden_ms: { type: Number, default: 60000 },
        },
    },
    { timestamps: true }
);

const Question: Model<IQuestion> =
    mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
