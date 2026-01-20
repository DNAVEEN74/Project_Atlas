import mongoose from 'mongoose';

export interface IQuestionReport extends mongoose.Document {
    u_id: mongoose.Types.ObjectId;
    q_id: mongoose.Types.ObjectId;
    reason: string;
    description?: string;
    status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
    created_at: Date;
    updated_at: Date;
}

const QuestionReportSchema = new mongoose.Schema({
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    q_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'],
        default: 'PENDING'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.models.QuestionReport || mongoose.model<IQuestionReport>('QuestionReport', QuestionReportSchema);
