import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookmark extends Document {
    user_id: mongoose.Types.ObjectId;
    question_id: mongoose.Types.ObjectId;
    created_at: Date;
}

const BookmarkSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Indexes:
// { user_id: 1, question_id: 1 } unique   — can't bookmark twice
// { user_id: 1, created_at: -1 }          — fetch bookmarks list
BookmarkSchema.index({ user_id: 1, question_id: 1 }, { unique: true });
BookmarkSchema.index({ user_id: 1, created_at: -1 });

const Bookmark: Model<IBookmark> =
    mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

export default Bookmark;
