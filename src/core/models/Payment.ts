import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
    user_id: mongoose.Types.ObjectId;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'FAILED';
    plan_id: string; // 'monthly' | 'yearly'
    created_at: Date;
}

const PaymentSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        razorpay_order_id: { type: String, required: true },
        razorpay_payment_id: { type: String, required: true },
        razorpay_signature: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        status: {
            type: String,
            enum: ['SUCCESS', 'FAILED'],
            default: 'SUCCESS'
        },
        plan_id: { type: String, required: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const Payment: Model<IPayment> =
    mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
