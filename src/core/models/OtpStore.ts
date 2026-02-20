import mongoose, { Schema, Document, Model } from 'mongoose';

// Temporary OTP store for pre-registration email verification
export interface IOtpStore extends Document {
    email: string;
    otp_hash: string;
    expires_at: Date;
    created_at: Date;
}

const OtpStoreSchema = new Schema<IOtpStore>({
    email: { type: String, required: true, lowercase: true, trim: true },
    otp_hash: { type: String, required: true },
    expires_at: { type: Date, required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
});

// TTL index: auto-delete expired docs after 10 minutes
OtpStoreSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const OtpStore: Model<IOtpStore> = mongoose.models.OtpStore || mongoose.model<IOtpStore>('OtpStore', OtpStoreSchema);

export default OtpStore;
