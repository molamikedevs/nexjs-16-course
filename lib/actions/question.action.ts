'use server';

import mongoose  from "mongoose";
import { AskQuestionSchema } from "../validation";
import { ActionResponse, ErrorResponse, QuestionParams } from "@/types/global";
import { CreateQuestionParams } from "@/types/action";
import action from "../handlers/actions";
import { Question, Tag, TagQuestion } from "@/database";
import handleError from "../handlers/error";



export async function createQuestion(
    params: CreateQuestionParams
): Promise<ActionResponse<QuestionParams>> {

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
          const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existingTag = await Tag.findOneAndUpdate({
                name: { $regex: new RegExp(`^${safeTag}$`, "i") } },
                { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
                { upsert: true, new: true, session }
            );

            // Push tag and TagQuestion document to respective arrays
            tagIds.push(existingTag!._id);
            tagQuestionDocument.push({ tag: existingTag!._id, question: question._id });
        }
        await TagQuestion.insertMany(tagQuestionDocument, { session });
        await Question.findByIdAndUpdate(
            question._id,
            { $push: { tags: { $each: tagIds } } },
            { session }
        );
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