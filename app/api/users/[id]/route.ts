import { User } from "@/database";
import handleError from "@/lib/errors/handlers/error";
import { NotFoundError } from "@/lib/errors/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users/:id - Retrieve a user by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Extract user ID from params
    const { id } = await params;
    if (!id) throw new NotFoundError("User");

    try {
        await dbConnect();

        // Find user by ID
        const user = await User.findById(id);
        
        // If user not found, throw NotFoundError
        if (!user) throw new NotFoundError("User");

        // Return user data
        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// DELETE /api/users/:id - Delete a user by ID
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    
    // Extract user ID from params and validate
    const { id } = await params;
    if (!id) throw new NotFoundError("User");

    try {
        await dbConnect();
        // Delete user by ID If user not found, throw NotFoundError
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new NotFoundError("User");


        // Return deleted user data
        return NextResponse.json({ success: true, data: deletedUser }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// PUT /api/users/:id - Update a user by ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    
    // Extract user ID from params and validate
    const { id } = await params;
    if (!id) throw new NotFoundError("User");

    try {
        await dbConnect();
        const body = await request.json();

        // Validate incoming data
        const validatedData = UserSchema.partial().parse(body);

        // Update user by ID with validated data
        const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true });
        
        // If user not found, throw NotFoundError
        if (!updatedUser) throw new NotFoundError("User");

        // Return updated user data
        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}