"use server";

import { FilterQuery } from "mongoose";
import { Answer, Question, User } from "@/database";
import { ActionResponse, ErrorResponse, UserParams } from "@/types/global";
import { GetUserSchema, PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import action from "../handlers/actions";

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