import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * User Attempt - Immutable audit trail of all question attempts
 * 
 * This is append-only by design:
 * - Preserves complete learning history
 * - ML-ready for training data
 * - Debuggable inference snapshots
 */

export type SpeedFlag = 'FAST' | 'NORMAL' | 'SLOW' | 'TIMEOUT';
export type RecommendedAction = 'NONE' | 'OFFER_TRICK' | 'OFFER_EXPLANATION' | 'SILENT';

export interface IInferenceSnapshot {
    primary_mistake?: string; // Main mistake tag
    secondary_mistake?: string; // Alternative hypothesis
    confidence: number; // 0-1 (inference certainty)
    speed_flag: SpeedFlag;
    recommended_action: RecommendedAction;
}

export interface IValidation {
    was_inference_correct: boolean;
    user_selected_mistake?: string; // If inference was wrong, what user says
    collected_at: Date;
}

export interface IAttempt extends Document {
    u_id: mongoose.Types.ObjectId; // User ID
    q_id: mongoose.Types.ObjectId; // Question ID
    p_id?: mongoose.Types.ObjectId; // Pattern ID
    is_correct: boolean;
    t_ms: number; // Time taken in ms
    option_selected: string; // Which option ID user picked

    // Full inference output
    inf_snapshot?: IInferenceSnapshot;

    // Validation signal (rare, high-value user feedback)
    validation?: IValidation;

    createdAt: Date;
}

const AttemptSchema: Schema = new Schema(
    {
        u_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        q_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        p_id: { type: Schema.Types.ObjectId, ref: 'Pattern' },
        is_correct: { type: Boolean, required: true },
        t_ms: { type: Number, required: true },
        option_selected: { type: String, required: true },

        inf_snapshot: {
            primary_mistake: { type: String },
            secondary_mistake: { type: String },
            confidence: { type: Number, min: 0, max: 1, default: 0 },
            speed_flag: {
                type: String,
                enum: ['FAST', 'NORMAL', 'SLOW', 'TIMEOUT'],
                default: 'NORMAL',
            },
            recommended_action: {
                type: String,
                enum: ['NONE', 'OFFER_TRICK', 'OFFER_EXPLANATION', 'SILENT'],
                default: 'NONE',
            },
        },

        validation: {
            was_inference_correct: { type: Boolean },
            user_selected_mistake: { type: String },
            collected_at: { type: Date },
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } } // Append-only
);

// Non-negotiable compound index for efficient queries
AttemptSchema.index({ u_id: 1, q_id: 1 });
// For pattern-based analytics
AttemptSchema.index({ p_id: 1, is_correct: 1 });

const Attempt: Model<IAttempt> =
    mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
