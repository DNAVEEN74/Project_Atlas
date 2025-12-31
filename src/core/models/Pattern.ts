import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPattern extends Document {
    p_code: string; // Unique human-readable code e.g. "QUANT_PERC_001"
    name: string;
    topic: string;
    subtopic: string;
    trick_ids: string[]; // Array of strings (Trick IDs), not ObjectIds per doc example
}

const PatternSchema: Schema = new Schema(
    {
        p_code: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        topic: { type: String, required: true, index: true },
        subtopic: { type: String, required: true },
        trick_ids: [{ type: String }], // References Tricks by ID string
    },
    { timestamps: true }
);

const Pattern: Model<IPattern> =
    mongoose.models.Pattern || mongoose.model<IPattern>('Pattern', PatternSchema);

export default Pattern;
