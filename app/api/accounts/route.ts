import { NextResponse } from "next/server";
import { ForbiddenError } from "@/lib/errors/http-error";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { User } from "@/database";

import handleError from "@/lib/errors/handlers/error";
import dbConnect from "@/lib/mongoose";

// GET /api/users - Retrieve a list of users
export async function GET() {
  try {
    await dbConnect();

    // Fetch all users from the database
    const accounts = await User.find();

    return NextResponse.json({ success: true, data: accounts }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate incoming data
    const validatedData = AccountSchema.parse(body);

    // Check if account with the same provider and providerAccountId already exists
    const existingAccount = await User.findOne({ 
        provider: validatedData.provider,
        providerAccountId: validatedData.providerAccountId,
    })


    // Throw error if account already exists or create a new one
    if (existingAccount) throw new ForbiddenError("Account already exists");
    const newAccount = await User.create(validatedData);

    // Return newly created user data
    return NextResponse.json({ success: true, data: newAccount }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}