import { User } from "@/database";
import handleError from "@/lib/errors/handlers/error";
import { ValidationError } from "@/lib/errors/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

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

    // Check for existing user by email and username
    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

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