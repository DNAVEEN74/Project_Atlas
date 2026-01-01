import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Media - Centralized storage for all images/diagrams
 * 
 * Why separate collection?
 * - Keeps Question documents lightweight
 * - Easy migration to S3 later (just update storage_url)
 * - Reusable media across questions
 * - Better caching and CDN integration
 */

export type MediaType = 'question_diagram' | 'option_image' | 'table' | 'graph' | 'other';
export type StorageType = 'gridfs' | 'cloudflare_r2';

export interface IMedia extends Document {
    // Storage information
    storage_type: StorageType;
    gridfs_id?: string;        // GridFS file ID (current)
    storage_url?: string;      // S3/R2 URL (future migration)

    // Media metadata
    media_type: MediaType;
    content_type: string;      // image/png, image/jpeg, etc.
    file_size: number;         // In bytes
    width?: number;
    height?: number;

    // References
    question_id?: mongoose.Types.ObjectId;  // Which question uses this
    option_id?: string;                     // Which option (if applicable)

    // Descriptive info
    alt_text?: string;         // For accessibility
    description?: string;      // What the image shows

    createdAt: Date;
    updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
    {
        storage_type: {
            type: String,
            enum: ['gridfs', 'cloudflare_r2'],
            default: 'gridfs',
            required: true,
        },
        gridfs_id: { type: String, index: true },
        storage_url: { type: String },
        checksum: { type: String }, // MD5 hash

        media_type: {
            type: String,
            enum: ['question_diagram', 'option_image', 'table', 'graph', 'other'],
            required: true,
        },
        content_type: { type: String, required: true },
        file_size: { type: Number, required: true },
        width: { type: Number },
        height: { type: Number },

        question_id: { type: Schema.Types.ObjectId, ref: 'Question', index: true },
        option_id: { type: String },

        alt_text: { type: String },
        description: { type: String },
    },
    { timestamps: true }
);

// Compound index for efficient queries
MediaSchema.index({ question_id: 1, media_type: 1 });

const Media: Model<IMedia> =
    mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
