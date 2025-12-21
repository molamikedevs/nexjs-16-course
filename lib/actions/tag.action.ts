import { ActionResponse, ErrorResponse, GetTagQuestionsParams, PaginationSearchParams, QuestionParams, TagParams } from "@/types/global";
import action from "../handlers/actions";
import { GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { Question, Tag } from "@/database";
import { th } from "zod/v4/locales";

export async function getTags(params: PaginationSearchParams): Promise<ActionResponse<{ tags: TagParams[]; isNext: boolean }>> {
   // 1. Validate input parameters and check if they are correct
    const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 2. Destructure validated parameters and set limit and skip for pagination
  const { page = 1, pageSize = 10, query, filter } = params!;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

  // 3. Build filter query based on search and filter parameters
    const filterQuery: FilterQuery<typeof Tag> = {};
    if (query) {
    filterQuery.$or = [ {name: { $regex: query, $options: "i" } } ];
  }

    // 4. Determine sorting option based on filter parameter
  let sortOption = {};
    switch (filter) {
    case "popular":
      sortOption = { questions: -1 };
      break;
    case "recent":
      sortOption = { createdAt: -1 };
      break;
    case "oldest":
      sortOption = { createdAt: 1 };
      break;
    case "name":
        sortOption = { name: 1 };
    default:
      sortOption = { questions: -1 };
  }

    try {
        // 5. Fetch tags from the database with pagination and sorting
        const totalTags = await Tag.countDocuments(filterQuery);
        const tags = await Tag.find(filterQuery)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)

        // 6. Determine if there is a next page
        const isNext = totalTags > skip + tags.length;

        // 7. Return the result with success status and data
        return { success: true, data: { tags: JSON.parse(JSON.stringify(tags, null, 2)), isNext } };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }

}


export async function getTagQuestions(params: GetTagQuestionsParams): Promise<ActionResponse<{tag: TagParams; questions: QuestionParams[]; isNext: boolean }>> {
   // 1. Validate input parameters and check if they are correct
    const validationResult = await action({
      params,
      schema: GetTagQuestionsSchema,
      authorize: false,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    // 2. Destructure validated parameters and set limit and skip for pagination
    const { page = 1, pageSize = 10, query, tagId } = params!;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    try {
      // 3. Fetch tag details
        const tag = await Tag.findById(tagId);
        if (!tag) {
          throw new Error("Tag not found");
        }
         // 4. Build filter query based on search and filter parameters
        const filterQuery: FilterQuery<typeof Question> = {
          tags: { $in: [tagId] }
        };
            if (query) {
                filterQuery.title = { $regex: query, $options: "i" };
          }

        // 5. Fetch tags from the database with pagination and sorting
        const totalQuestions = await Question.countDocuments(filterQuery);
        const questions = await Question.find(filterQuery)
            .select('_id title author createdAt upVotes downVotes answers views')
            .populate([
              {path: 'author', select: 'name image' },
              {path: 'tags', select: 'name' }
            ])
            .skip(skip)
            .limit(limit)

        // 6. Determine if there is a next page
        const isNext = totalQuestions > skip + questions.length;

        // 7. Return the result with success status and data
        return { success: true, data: { tag: JSON.parse(JSON.stringify(tag, null, 2)), questions: JSON.parse(JSON.stringify(questions, null, 2)), isNext } };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }

}
