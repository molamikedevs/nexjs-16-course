"use server";

import { revalidatePath } from "next/cache";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { CollectionBaseSchema } from "../validation";
import { siteConfig } from "@/config/site";
import { Collection, Question } from "@/database";
import action from "../handlers/actions";
import handleError from "../handlers/error";

export async function toggleSaveQuestion(params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    const collection = await Collection.findOne({ author: userId, question: questionId });
    if (collection) {
      await collection.deleteOne();
        revalidatePath(siteConfig.ROUTES.QUESTION(questionId));
        return {
        success: true,
        data: { saved: false },
      };
    }
    await Collection.create({ author: userId, question: questionId });
    revalidatePath(siteConfig.ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: { saved: true },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}


export async function hasSavedQuestion(params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  try {
    const collection = await Collection.findOne({ author: userId, question: questionId });
    return {
      success: true,
      data: { saved: !!collection },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
