"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose, { ClientSession } from "mongoose";
import { siteConfig } from "@/config/site";
import { CreateVoteParams, HasVotedParams, HasVotedResponse, UpdateVoteCountParams } from "@/types/action";
import { createInteraction } from "./interaction.action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { CreateVoteSchema, HasVotedSchema, UpdateVoteCountSchema } from "../validation";
import { Answer, Question, Vote } from "@/database";
import action from "../handlers/actions";
import handleError from "../handlers/error";

export async function updateVoteCount(params: UpdateVoteCountParams, session?: ClientSession): Promise<ActionResponse> {
  // 1. Validate input parameters and authorize
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 2. Extract validated data and determine model and vote field
  const { targetId, voteType, targetType, change } = validationResult.params!;
  const model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upVotes" ? "upVotes" : "downVotes";

  try {
    // 3. Update the vote count dynamically and return the result
    // The 'session' argument ensures this runs within a transaction
    const result = await model.findByIdAndUpdate(
      targetId,
      // Atomic operator $inc prevents race conditions
      // Dynamic key [voteField] allows reusability (upvotes vs downvotes)
      { $inc: { [voteField]: change } },
      { new: true, session }
    );
    if (!result) throw new Error("Failed to update vote count");
    return { success: true, data: result };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(params: CreateVoteParams): Promise<ActionResponse> {
  // 1. Validate input parameters and authorize
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 2. Extract validated data and get user ID if no userId
  // return unauthorized
  const { targetId, voteType, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  // 3. Start a mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const Model = targetType === "question" ? Question : Answer;
    const contentDoc = await Model.findById(targetId).session(session);
    if (!contentDoc) throw new Error(`${targetType} not found`);

    const contentAuthorId = contentDoc.author.toString();
    // 4. Check for existing vote by the user on the target if there is
    // update or remove it accordingly by calling the voteCount action, else create a new vote
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If user is voting again with the same vote type, remove the vote
        await existingVote.deleteOne({ session });
        await updateVoteCount(
          {
            targetId,
            voteType,
            targetType,
            change: -1,
          },
          session
        );
      } else {
        // If user is changing their vote, update voteType and adjust counts
        await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session });
        await updateVoteCount(
          {
            targetId,
            voteType: existingVote.voteType,
            targetType,
            change: -1,
          },
          session
        );
        await updateVoteCount(
          {
            targetId,
            voteType,
            targetType,
            change: 1,
          },
          session
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        { session }
      );
      await updateVoteCount({ targetId, voteType, targetType, change: 1 }, session);
    }

    // 5. Commit the transaction and revalidate the path
    await session.commitTransaction();

    after(async () => {
      await createInteraction({
        action: voteType,
        actionId: contentDoc._id.toString(),
        actionTarget: targetType,
        authorId: userId as string,
      });
    });
    revalidatePath(siteConfig.ROUTES.QUESTION(targetId));

    // 6. Return success response
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function hasVoted(params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> {
  // 1. Validate input parameters and authorize
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 2. Extract validated data and get user ID if no userId
  // return unauthorized
  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });
    if (!vote) {
      return {
        success: false,
        data: {
          hasUpVoted: false,
          hasDownVoted: false,
        },
      };
    } else {
      return {
        success: true,
        data: {
          hasUpVoted: vote?.type === "upvote",
          hasDownVoted: vote?.type === "downvote",
        },
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}