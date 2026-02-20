import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRefundRequest extends Document {
    user_id: mongoose.Types.ObjectId;
    razorpay_payment_id: string;
    amount: number;
    reason: string;
    custom_reason?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: Date;
    updated_at: Date;
}

const RefundRequestSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        razorpay_payment_id: { type: String, required: true },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        custom_reason: { type: String },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const RefundRequest: Model<IRefundRequest> =
    mongoose.models.RefundRequest || mongoose.model<IRefundRequest>('RefundRequest', RefundRequestSchema);

export default RefundRequest;
