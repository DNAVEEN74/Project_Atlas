import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
    user_id: mongoose.Types.ObjectId;
    question_id: mongoose.Types.ObjectId;
    reason: string;
    description?: string;

    status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
    admin_notes?: string;

    created_at: Date;
    updated_at: Date;
}

const ReportSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        reason: { type: String, required: true },
        description: { type: String },

        status: {
            type: String,
            enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'],
            default: 'PENDING',
        },
        admin_notes: { type: String },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Indexes:
// { question_id: 1, status: 1 }       — find reports for a question
// { user_id: 1, created_at: -1 }      — user's report history
// { status: 1, created_at: 1 }        — admin review queue (oldest pending first)
ReportSchema.index({ question_id: 1, status: 1 });
ReportSchema.index({ user_id: 1, created_at: -1 });
ReportSchema.index({ status: 1, created_at: 1 });

const Report: Model<IReport> =
    mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;
