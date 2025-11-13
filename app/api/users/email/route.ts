import { User } from "@/database";
import handleError from "@/lib/errors/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/errors/http-error";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email } = await request.json();

    try {
        const validatedEmail = UserSchema.partial().safeParse({ email });

        if (!validatedEmail.success) throw new ValidationError(validatedEmail.error.flatten().fieldErrors);

        const user = await User.findOne({ email });
        if (!user) throw new NotFoundError("User");

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}