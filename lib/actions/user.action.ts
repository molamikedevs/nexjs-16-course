"use server";

import { FilterQuery, PipelineStage, Types } from "mongoose";
import { Answer, Question, User } from "@/database";
import { ActionResponse, AnswerParams, ErrorResponse, QuestionParams, TagParams, UserParams } from "@/types/global";
import { GetUserSchema, GetUserTagsSchema, PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import action from "../handlers/actions";
import { count } from "console";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: UserParams[]; isNext: boolean }>> {
  const validationResult = action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof User> = {};
  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }];
  }

  let sortOption = {};
  switch (filter) {
    case "newest":
      sortOption = { createdAt: -1 };
      break;
    case "oldest":
      sortOption = { createdAt: 1 };
      break;
    case "popular":
      sortOption = { reputation: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery).sort(sortOption).skip(skip).limit(limit).lean();
    const isNext = skip + users.length < totalUsers;
    return { success: true, data: { users: JSON.parse(JSON.stringify(users)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(
  params: GetUserParams
): Promise<ActionResponse<{ user: UserParams; totalQuestions: number; totalAnswers: number }>> {
  const validationResult = action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params!;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });

    return { success: true, data: { user: JSON.parse(JSON.stringify(user)), totalQuestions, totalAnswers } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(
  params: GetUserQuestionsParams
): Promise<ActionResponse<{ questions: QuestionParams[]; isNext: boolean }>> {
  const validationResult = action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("author", "name image")
      .populate("tags", "name")
      .skip(skip)
      .limit(limit);
    const isNext = skip + questions.length < totalQuestions;
    return { success: true, data: { questions: JSON.parse(JSON.stringify(questions)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserAnswers(
  params: GetUserAnswersParams
): Promise<ActionResponse<{ answers: AnswerParams[]; isNext: boolean }>> {
  const validationResult = action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId }).populate("author", "_id name image").skip(skip).limit(limit);
    const isNext = skip + answers.length < totalAnswers;
    return { success: true, data: { answers: JSON.parse(JSON.stringify(answers)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserTags(
  params: GetUserTagsParams
): Promise<ActionResponse<{ tags: { _id: string; name: string; count: number }[] }>> {
  const validationResult = action({
    params,
    schema: GetUserTagsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params!;

  try {
    const pipeLine: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeLine);
    return { success: true, data: { tags: JSON.parse(JSON.stringify(tags)) } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

