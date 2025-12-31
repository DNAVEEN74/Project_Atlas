import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrick extends Document {
    _id: any; // Custom ID e.g. "TRICK_PERC_RATIO" - Allow override
    p_id: mongoose.Types.ObjectId; // Links back to Pattern
    title: string;
    logic_steps: string[];
    ai_instructions: string;
}

const TrickSchema: Schema = new Schema(
    {
        _id: { type: String, required: true }, // Custom ID strategy
        p_id: { type: Schema.Types.ObjectId, ref: 'Pattern', required: true, index: true },
        title: { type: String, required: true },
        logic_steps: [{ type: String, required: true }],
        ai_instructions: { type: String, required: true },
    },
    { _id: false, timestamps: true } // We handle _id manually
);

const Trick: Model<ITrick> =
    mongoose.models.Trick || mongoose.model<ITrick>('Trick', TrickSchema);

export default Trick;
