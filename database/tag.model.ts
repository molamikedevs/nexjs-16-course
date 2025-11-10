import { model, models, Schema, Types } from "mongoose";

export interface ITag {
  name: string;
  questions: string;
}

const TagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
