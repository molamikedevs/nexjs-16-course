import { NextResponse } from "next/server";
import { ForbiddenError } from "@/lib/errors/http-error";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { Account } from "@/database";

import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";

// GET /api/accounts - Retrieve a list of accounts
export async function GET() {
  try {
    await dbConnect();

    // Fetch all accounts from the database
    const accounts = await Account.find();

    return NextResponse.json({ success: true, data: accounts }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST /api/accounts - Create a new account
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate incoming data
    const validatedData = AccountSchema.parse(body);

    // Check if account with the same provider and providerAccountId already exists
    const existingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });

    // Throw error if account already exists or create a new one
    if (existingAccount) throw new ForbiddenError("Account already exists");
    const newAccount = await Account.create(validatedData);

    // Return newly created user data
    return NextResponse.json({ success: true, data: newAccount }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}