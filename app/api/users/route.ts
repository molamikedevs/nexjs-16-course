import { ValidationError } from "@/lib/errors/http-error";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { User } from "@/database";

import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";

// GET /api/users - Retrieve a list of users
export async function GET() {
  try {
    await dbConnect();

    // Fetch all users from the database
    const users = await User.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = UserSchema.safeParse(body);

    // If validation fails, throw ValidationError
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    // Destructure email and username from validated data
    const { email, username } = validatedData.data;

    // Check for existing user with same email
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    // Check for existing user with same username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("Username already exists");

    // Create new user
    const newUser = await User.create(validatedData.data);

    // Return newly created user data
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
