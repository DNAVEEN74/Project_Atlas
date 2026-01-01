import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Question - Behavioral probe for the inference system
 * 
 * Questions are not just content, they are:
 * - Pattern-linked for knowledge mapping
 * - Option-tagged for mistake inference
 * - Calibrated by real user behavior
 */

export type QuestionStatus = 'COLD' | 'OBSERVATION' | 'CALIBRATION' | 'VERIFIED';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SpeedCategory = 'QUICK' | 'STANDARD' | 'COMPLEX';

export interface IQuestionOption {
    id: string;
    text: string;
    is_correct: boolean;
    inf_tag?: string; // Mistake tag (e.g., "IGNORED_BASE_CHANGE")

    // Option can have an image (diagram, graph, etc.)
    image?: string; // GridFS file ID or base64
}

export interface IMistakeDistribution {
    tag: string;
    percentage: number;
}

export interface IQuestion extends Document {
    p_id?: mongoose.Types.ObjectId; // Pattern ID
    status: QuestionStatus;
    difficulty: QuestionDifficulty;

    content: {
        text: string;
        options: IQuestionOption[];

        // Flags for media presence
        has_diagram?: boolean;
        has_table?: boolean;
    };

    // Speed expectations for inference calibration
    benchmarks: {
        golden_ms: number; // Expected solve time in ms
        shortcut_expected: boolean; // Is a trick essential?
        brute_force_acceptable: boolean; // Is brute-force okay?
        speed_category: SpeedCategory;
    };

    // Source metadata (optional - for content management)
    metadata?: {
        source_exam?: string; // e.g., "SSC CGL 2023"
        year?: number;
        original_paper?: string; // e.g., "Tier 1 - Shift 2"
        question_number?: number; // Original question number in paper
    };

    // Media references (IDs from Media collection)
    media_ids?: mongoose.Types.ObjectId[]; // Array of Media document IDs

    // Simple verification flag (you're the only reviewer)
    is_verified?: boolean; // Ready for practice mode (default: false)

    // Version control and batch tracking
    version?: number; // Increment on updates
    import_batch?: string; // e.g., "2024-01-SSC-CGL-Tier1"

    // Crowd-sourced calibration (evolves over time)
    calibration?: {
        avg_time_ms: number;
        attempt_count: number;
        accuracy_rate: number;
        mistake_distribution: IMistakeDistribution[];
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
                    inf_tag: { type: String },
                },
            ],
        },
        benchmarks: {
            golden_ms: { type: Number, default: 60000 },
            shortcut_expected: { type: Boolean, default: false },
            brute_force_acceptable: { type: Boolean, default: true },
            speed_category: {
                type: String,
                enum: ['QUICK', 'STANDARD', 'COMPLEX'],
                default: 'STANDARD',
            },
        },
        metadata: {
            source_exam: { type: String },
            year: { type: Number },
            original_paper: { type: String },
            question_number: { type: Number },
        },
        calibration: {
            avg_time_ms: { type: Number, default: 0 },
            attempt_count: { type: Number, default: 0 },
            accuracy_rate: { type: Number, default: 0, min: 0, max: 1 },
            mistake_distribution: [
                {
                    tag: { type: String },
                    percentage: { type: Number, min: 0, max: 100 },
                },
            ],
        },
    },
    { timestamps: true }
);

// Non-negotiable compound index
QuestionSchema.index({ p_id: 1, status: 1 });
// For difficulty-based queries
QuestionSchema.index({ difficulty: 1, status: 1 });

const Question: Model<IQuestion> =
    mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
