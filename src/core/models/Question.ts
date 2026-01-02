import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Question - Behavioral probe for the inference system
 * 
 * Clean schema focused on:
 * - Question content and options
 * - Pattern linking for knowledge mapping
 * - Manual review workflow for images
 * - Source tracking
 */

export type QuestionStatus = 'COLD' | 'OBSERVATION' | 'CALIBRATION' | 'VERIFIED';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SpeedCategory = 'QUICK' | 'STANDARD' | 'COMPLEX';
export type QuestionSection = 'REASONING' | 'QUANT';

export interface IQuestionOption {
    id: string;           // "opt_1", "opt_2", "opt_3", "opt_4"
    text: string;         // Option text
    is_correct: boolean;  // Is this the correct answer?
    inf_tag?: string;     // Mistake tag (e.g., "IGNORED_BASE_CHANGE")
    image?: string;       // Image URL/ID if option has image
}

export interface IQuestionContent {
    text: string;                    // Question text
    options: IQuestionOption[];      // 4 options
    correct_option_id: string;       // "opt_1", "opt_2", "opt_3", or "opt_4"
    image?: string;                  // Main question image (diagram, table, etc.)
}

export interface IQuestionSource {
    exam: string;          // "SSC CGL 2024"
    year: number;          // 2024
    paper: string;         // "Tier 1 - 09.09.2024"
    section: QuestionSection;  // REASONING, GENERAL_AWARENESS, or QUANT
    question_number: number;   // 1-25 (resets per section)
    file_name: string;     // PDF filename for manual review
}

export interface IQuestion extends Document {
    // Core content
    content: IQuestionContent;

    // Pattern linking
    p_id?: mongoose.Types.ObjectId;

    // Question status
    status: QuestionStatus;
    difficulty: QuestionDifficulty;

    // Speed benchmarks for inference
    benchmarks: {
        golden_ms: number;
        shortcut_expected: boolean;
        brute_force_acceptable: boolean;
        speed_category: SpeedCategory;
    };

    // Source tracking
    source: IQuestionSource;

    // Review workflow
    needs_image_review: boolean;  // TRUE if question/options have images that need manual upload
    is_verified: boolean;         // Ready for practice mode

    // Versioning
    version: number;
    import_batch: string;         // "SSC-CGL-2024_Tier-1"

    // Calibration from real users
    calibration?: {
        avg_time_ms: number;
        attempt_count: number;
        accuracy_rate: number;
        mistake_distribution: Array<{ tag: string; percentage: number }>;
    };

    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
    {
        content: {
            text: { type: String, required: true },
            options: [
                {
                    id: { type: String, required: true },
                    text: { type: String, required: true },
                    is_correct: { type: Boolean, required: true },
                    inf_tag: { type: String },
                    image: { type: String },
                },
            ],
            correct_option_id: { type: String, required: true },
            image: { type: String },  // Main question image
        },

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

        source: {
            exam: { type: String, required: true },
            year: { type: Number, required: true },
            paper: { type: String, required: true },
            section: {
                type: String,
                enum: ['REASONING', 'QUANT'],
                required: true
            },
            question_number: { type: Number, required: true },
            file_name: { type: String, required: true },
        },

        // Review flags
        needs_image_review: { type: Boolean, default: false },
        is_verified: { type: Boolean, default: false },

        // Versioning
        version: { type: Number, default: 1 },
        import_batch: { type: String },

        // Calibration (filled by user attempts)
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

// Indexes
QuestionSchema.index({ p_id: 1, status: 1 });
QuestionSchema.index({ difficulty: 1, status: 1 });
QuestionSchema.index({ needs_image_review: 1, is_verified: 1 }); // For filtering review queue
QuestionSchema.index({ 'source.file_name': 1 }); // For finding by PDF file
QuestionSchema.index({ 'source.section': 1 }); // For filtering by section

const Question: Model<IQuestion> =
    mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
