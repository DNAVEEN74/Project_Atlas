import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttempt extends Document {
    u_id: mongoose.Types.ObjectId; // User ID
    q_id: mongoose.Types.ObjectId; // Question ID
    p_id?: mongoose.Types.ObjectId; // Pattern ID
    is_correct: boolean;
    t_ms: number; // Time taken in ms
    inf_snapshot?: {
        mistake?: string;
        conf?: number;
    };
    createdAt: Date;
}

const AttemptSchema: Schema = new Schema(
    {
        u_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        q_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        p_id: { type: Schema.Types.ObjectId, ref: 'Pattern' },
        is_correct: { type: Boolean, required: true },
        t_ms: { type: Number, required: true },
        inf_snapshot: {
            mistake: { type: String },
            conf: { type: Number },
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } } // Append-only (mostly)
);

const Attempt: Model<IAttempt> =
    mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
