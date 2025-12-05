import { model, models, Schema, Types, Document, Model } from "mongoose";

export interface IQuestion {
  title: string;
  description: string;
  tags: Types.ObjectId[];
  author: Types.ObjectId;
  upVotes: number;
  downVotes: number;
  answers: number;
  views: number;
}

export interface IQuestionDoc extends IQuestion, Document {}

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Check if the model already exists to avoid recompilation issues
const Question = (models?.Question as Model<IQuestionDoc>) || model<IQuestionDoc>("Question", QuestionSchema);

export default Question;
