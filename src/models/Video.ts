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
  formatCreatedBefore(createdAt: Date): string;
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

videoSchema.static("formatCreatedBefore", function (createdAt: Date) {
  const diffTime = Date.now() - createdAt.getTime();
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else if (diffSeconds > 0) {
    return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
  }

  return "just now";
});

export const Video: VideoModel = model<VideoDocument, VideoModel>(
  "Video",
  videoSchema,
);
