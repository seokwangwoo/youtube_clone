import { Document, model, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  password2: string;
  name: string;
  avatarUrl?: string;
  socialOnly?: boolean;
  location?: string;
  videos?: string[];
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: { type: String },
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

export const User = model<UserDocument, UserModel>("User", userSchema);
