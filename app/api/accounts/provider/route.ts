import { NotFoundError, ValidationError } from "@/lib/errors/http-error";
import { NextRequest, NextResponse } from "next/server";
import { AccountSchema, UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { Account } from "@/database";

import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  // Extract providerAccountId from request body
  const { providerAccountId } = await request.json();

  try {
    await dbConnect();

    // Validate providerAccountId
    const validatedProvider = AccountSchema.partial().safeParse({ providerAccountId });
    if (!validatedProvider.success) throw new ValidationError(validatedProvider.error.flatten().fieldErrors);

    // Find user by providerAccountId and handle not found case
    const user = await Account.findOne({ providerAccountId });
    if (!user) throw new NotFoundError("Account");

    // Return user data
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}