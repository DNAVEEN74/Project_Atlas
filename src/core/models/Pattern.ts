import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPattern extends Document {
    code: string;             // "percentage" — unique slug
    name: string;             // "Percentage" — display name
    subject: 'QUANT' | 'REASONING';
    question_count: number;   // denormalized, updated on import
    display_order: number;
}

const PatternSchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        subject: {
            type: String,
            enum: ['QUANT', 'REASONING'],
            required: true
        },
        question_count: { type: Number, default: 0 },
        display_order: { type: Number, default: 0 },
    },
    { timestamps: false }
);

const Pattern: Model<IPattern> =
    mongoose.models.Pattern || mongoose.model<IPattern>('Pattern', PatternSchema);

export default Pattern;
