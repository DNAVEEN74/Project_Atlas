import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPattern extends Document {
    p_code: string; // Unique human-readable code e.g. "QUANT_PERC"
    name: string;   // The pattern/topic name e.g. "Percentage"
    trick_ids: string[]; // Array of strings (Trick IDs)
}

const PatternSchema: Schema = new Schema(
    {
        p_code: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, unique: true, index: true },
        trick_ids: [{ type: String }],
    },
    { timestamps: true }
);

const Pattern: Model<IPattern> =
    mongoose.models.Pattern || mongoose.model<IPattern>('Pattern', PatternSchema);

export default Pattern;
