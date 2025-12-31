import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppConfig extends Document {
    _id: any; // "GLOBAL_SETTINGS" - Allow override
    maintenance_mode: boolean;
    ad_settings: {
        enabled: boolean;
        frequency: number;
    };
    benchmarks: {
        verified_threshold: number;
        consensus_required: number;
    };
}

const AppConfigSchema: Schema = new Schema(
    {
        _id: { type: String, required: true },
        maintenance_mode: { type: Boolean, default: false },
        ad_settings: {
            enabled: { type: Boolean, default: true },
            frequency: { type: Number, default: 10 },
        },
        benchmarks: {
            verified_threshold: { type: Number, default: 50 },
            consensus_required: { type: Number, default: 0.9 },
        },
    },
    { _id: false, timestamps: true }
);

const AppConfig: Model<IAppConfig> =
    mongoose.models.AppConfig || mongoose.model<IAppConfig>('AppConfig', AppConfigSchema);

export default AppConfig;
