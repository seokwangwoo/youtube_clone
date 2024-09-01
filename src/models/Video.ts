import { Schema, model, Document, Model } from "mongoose";

export interface VideoDocument extends Document {
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  hashtags: string;
  fileUrl: string;
  meta: {
    views: number;
    rating: number;
  };
  owner: string;
}

export interface VideoModel extends Model<VideoDocument> {
  formatHashtags(hashtags: string): string[];
}

const videoSchema = new Schema({
  title: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags: string) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

export const Video: VideoModel = model<VideoDocument, VideoModel>(
  "Video",
  videoSchema,
);
