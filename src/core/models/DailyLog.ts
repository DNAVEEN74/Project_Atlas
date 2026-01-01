import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyLog extends Document {
    _id: any; // Allow string ID override
    u_id: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    q_list: {
        q_id: mongoose.Types.ObjectId;
        is_correct: boolean;
        t_ms: number;
    }[];
}

const DailyLogSchema: Schema = new Schema(
    {
        _id: { type: String, required: true }, // Custom ID strategy
        u_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        date: { type: String, required: true, index: -1 }, // Reverse sort for recent history
        q_list: [
            {
                q_id: { type: Schema.Types.ObjectId, ref: 'Question' },
                is_correct: { type: Boolean },
                t_ms: { type: Number },
            },
        ],
    },
    { _id: false, timestamps: true } // We handle _id manually
);

// Non-negotiable compound index for calendar queries
DailyLogSchema.index({ u_id: 1, date: -1 });

const DailyLog: Model<IDailyLog> =
    mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);

export default DailyLog;
