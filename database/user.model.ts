import { model, models, Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolioUrl?: string;
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolioUrl: { type: String },
  },
  { timestamps: true }
);

// Check if the model already exists to avoid recompilation issues
const User = models?.User || model<IUser>("User", UserSchema);

export default User;
