import { Schema, model, Document, Model } from "mongoose";

export interface VideoDocument extends Document {
  title: string;
  description: string;
  createdAt: Date;
  hashtags: string;
  meta: {
    views: number;
    rating: number;
  };
}

export interface VideoModel extends Model<VideoDocument> {
  formatHashtags(hashtags: string): string[];
}

const videoSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
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
