import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Mistake Taxonomy - Centralized registry of all valid mistake types
 * 
 * This powers the inference system by providing:
 * - Fixed vocabulary for mistake classification
 * - AI prompt hints for personalized explanations
 * - Analytics on mistake patterns across the platform
 */

export type MistakeCategory = 'CONCEPTUAL' | 'CALCULATION' | 'SPEED' | 'BEHAVIORAL';

export interface IMistakeTaxonomy {
    _id: string; // e.g., "IGNORED_BASE_CHANGE", "RATIO_FLIP_ERROR"
    category: MistakeCategory;
    name: string; // Human-readable name
    description: string; // What this mistake means
    common_patterns: string[]; // Pattern codes where this is common
    severity: number; // 1-5 (impacts recommendation priority)
    ai_prompt_hint: string; // How AI should address this mistake
    is_active: boolean; // Soft-delete for taxonomy evolution
    createdAt: Date;
    updatedAt: Date;
}

const MistakeTaxonomySchema: Schema = new Schema(
    {
        _id: { type: String, required: true }, // Custom ID (mistake tag)
        category: {
            type: String,
            enum: ['CONCEPTUAL', 'CALCULATION', 'SPEED', 'BEHAVIORAL'],
            required: true,
            index: true,
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        common_patterns: [{ type: String }], // Pattern codes
        severity: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 3,
        },
        ai_prompt_hint: { type: String, required: true },
        is_active: { type: Boolean, default: true, index: true },
    },
    { _id: false, timestamps: true }
);

const MistakeTaxonomy: Model<IMistakeTaxonomy> =
    mongoose.models.MistakeTaxonomy ||
    mongoose.model<IMistakeTaxonomy>('MistakeTaxonomy', MistakeTaxonomySchema);

export default MistakeTaxonomy;
