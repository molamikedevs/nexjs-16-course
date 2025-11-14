import { NotFoundError, ValidationError } from "@/lib/errors/http-error";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/database";
import handleError from "@/lib/errors/handlers/error";

export async function POST(request: NextRequest) {
  // Extract email from request body
  const { email } = await request.json();

  try {
    // Validate email
    const validatedEmail = UserSchema.partial().safeParse({ email });
    if (!validatedEmail.success) throw new ValidationError(validatedEmail.error.flatten().fieldErrors);

    // Find user by email and handle not found case
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    // Return user data
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
