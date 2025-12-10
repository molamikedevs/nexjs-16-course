"use server";

import mongoose from "mongoose";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from "../validation";
import { ActionResponse, ErrorResponse, QuestionParams } from "@/types/global";
import { CreateQuestionParams, EditQuestionParams, GetQuestionsParams } from "@/types/action";
import action from "../handlers/actions";
import handleError from "../handlers/error";
import Tag, { ITagDoc } from "@/database/tag.model";
import Question, { IQuestionDoc } from "@/database/question.model";
import { TagQuestion } from "@/database";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<QuestionParams>> {
  // 1. Validate and authorize the request
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Extract validated params and user ID
  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  // 2. Start mongoose session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Create the question within the transaction
    const [question] = await Question.create([{ title, content, author: userId }], { session });
    if (!question) {
      throw new Error("Failed to create question");
    }

    // 4. Handle tags: upsert tags, create TagQuestion entries, and associate tags with the question
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocument = [];
    for (const tag of tags) {
      const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${safeTag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
        { upsert: true, new: true, session }
      );

      // Push tag and TagQuestion document to respective arrays
      tagIds.push(existingTag!._id);
      tagQuestionDocument.push({ tag: existingTag!._id, question: question._id });
    }
    await TagQuestion.insertMany(tagQuestionDocument, { session });
    await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session });
    // 5. Commit the transaction
    await session.commitTransaction();

    // 6. Return success response and serialize the question object
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestionDoc>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== userId) {
      throw new Error("You are not authorized to edit this question");
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // Determine tags to add and remove
    const tagsToAdd = tags.filter(
      (tag) => !question.tags.some((t: ITagDoc) => t.name.toLowerCase() === tag.toLowerCase())
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) => !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    // Add new tags
    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const newTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (newTag) {
          newTagDocuments.push({ tag: newTag._id, question: questionId });
          question.tags.push(newTag._id);
        }
      }
    }

    // Remove tags
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany({ _id: { $in: tagIdsToRemove } }, { $inc: { questions: -1 } }, { session });

      await TagQuestion.deleteMany({ tag: { $in: tagIdsToRemove }, question: questionId }, { session });

      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) => !tagIdsToRemove.some((id: mongoose.Types.ObjectId) => id.equals(tag._id))
      );
    }

    // Insert new TagQuestion documents
    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    // Save the updated question
    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(params: GetQuestionsParams): Promise<ActionResponse<QuestionParams>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new Error("Question not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
