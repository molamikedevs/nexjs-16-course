"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { ActionResponse, AnswerParams, ErrorResponse } from "@/types/global";
import { AnswerServerSchema, GetAnswersSchema } from "../validation";
import { Question } from "@/database";
import { siteConfig } from "@/config/site";
import Answer, { IAnswerDoc } from "@/database/answer.model";
import action from "../handlers/actions";
import handleError from "../handlers/error";

export async function createAnswer(params: CreateAnswerParams): Promise<ActionResponse<IAnswerDoc>> {
  // 1. Validate and authorize
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  // 2. Handle validation errors
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 3. Extract validated data and get user ID
  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  // 4. Start a mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 5. Verify that the question exists
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    // 6. Create the new answer and associate it with the user and question
    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session }
    );
    if (!newAnswer) throw new Error("Failed to create answer");

    // 7. Increment the answer count on the question
    // Save changes and commit the transaction
    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();

    // 8. Revalidate the question page to reflect the new answer
    revalidatePath(siteConfig.ROUTES.QUESTION(questionId));

    // 9. Return the newly created answer
    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getAnswers(
  params: GetAnswersParams
): Promise<ActionResponse<{ answers: AnswerParams[]; totalAnswers: number; isNext: boolean }>> {
  // 1. Validate input parameters
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });
  // 2. Handle validation errors
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 3. Extract validated data
  const { page = 1, pageSize = 10, questionId, filter } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  // 4. Fetch answers from the database through sorting, pagination, and filtering
  let sortOption = {};
  switch (filter) {
    case "latest":
      sortOption = { createdAt: -1 };
      break;
    case "oldest":
      sortOption = { createdAt: 1 };
      break;
    case "popular":
      sortOption = { upVotes: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  try {
    // 5. Get total count and paginated answers
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // 6. Determine if there is a next page
    const isNext = totalAnswers > skip + answers.length;

    // 7. Return success response with answers and total count
    return { success: true, data: { answers: JSON.parse(JSON.stringify(answers)), totalAnswers, isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
