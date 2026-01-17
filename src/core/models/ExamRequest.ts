import mongoose from 'mongoose';

const ExamRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        trim: true,
    },
    examName: {
        type: String,
        required: [true, 'Exam name is required'],
        trim: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['PENDING', 'NOTIFIED'],
        default: 'PENDING',
    }
});

export default mongoose.models.ExamRequest || mongoose.model('ExamRequest', ExamRequestSchema);
