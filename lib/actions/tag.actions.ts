import { ActionResponse, ErrorResponse, PaginationSearchParams, TagParams } from "@/types/global";
import action from "../handlers/actions";
import { PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { Tag } from "@/database";

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
    filterQuery.name = { $regex: query, $options: "i" };
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