'use server'

import mongoose from "mongoose";
import Interaction, { IInteractionDoc } from "@/database/interaction.model";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { CreateInteractionSchema } from "../validation";
import { CreateInteractionParams, UpdateReputationParams } from "@/types/action";
import { User } from "@/database";
import action from "../handlers/actions";
import handleError from "../handlers/error";

export async function createInteraction(params: CreateInteractionParams): Promise<ActionResponse<IInteractionDoc>> {
    const validationResult = await action({
        params,
        schema: CreateInteractionSchema,
        authorize: true,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { action: actionType, actionId, actionTarget, authorId} = validationResult.params!;
    const userId = validationResult?.session?.user?.id!;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [interaction] = await Interaction.create([
            {
                user: userId,
                action: actionType,
                actionId,
                actionTarget,
            }
        ], { session });

        await updateReputation({
            interaction,
            session,
            performerId: userId,
            authorId,
        })

        await session.commitTransaction();
        return {
            success: true,
            data: interaction,
        }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

async function updateReputation(params: UpdateReputationParams) {
    const { interaction, session, performerId, authorId } = params;
    const { action, actionType } = interaction;

    let performerPoints = 0;
    let authorPoints = 0;

    switch (action) {
        case "upVotes":
            performerPoints = 2;
            authorPoints = 10
            break;
        case "downVotes":
            performerPoints = -1;
            authorPoints = -2;
            break;
        case "post":
            authorPoints = actionType === "question" ? 5 : 10;
            break;
        case "delete":
            authorPoints = actionType === "question" ? -5 : -10;
            break;
    }

    // Update performer reputation
    if (performerId === authorId) {
        await User.findByIdAndUpdate(
            performerId,
            { $inc: { reputation: authorPoints } },
            { session }
        )
        return;
    }

    await User.bulkWrite(
        [
           {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
        ],
        { session }
    )
}