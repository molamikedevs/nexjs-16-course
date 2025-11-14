import { NotFoundError, ValidationError } from "@/lib/errors/http-error";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/database";

import handleError from "@/lib/errors/handlers/error";
import dbConnect from "@/lib/mongoose";

// GET /api/accounts/:id - Retrieve a user by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Extract user ID from params
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        // Find account by ID
        const account = await User.findById(id);
        
        // If account not found, throw NotFoundError
        if (!account) throw new NotFoundError("Account");

        // Return account data
        return NextResponse.json({ success: true, data: account }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// DELETE /api/accounts/:id - Delete a user by ID
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    
    // Extract user ID from params and validate
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        // Delete user by ID If user not found, throw NotFoundError
        const deletedAccount = await User.findByIdAndDelete(id);
        if (!deletedAccount) throw new NotFoundError("Account");


        // Return deleted account data
        return NextResponse.json({ success: true, data: deletedAccount }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// PUT /api/accounts/:id - Update a user by ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    
    // Extract user ID from params and validate
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const body = await request.json();

        // Validate incoming data
        const validatedData = AccountSchema.partial().safeParse(body);

        // If validation fails, throw ValidationError
        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);
        

        // Update user by ID with validated data
        const updatedAccount = await User.findByIdAndUpdate(id, validatedData.data, { new: true });
        
        // If user not found, throw NotFoundError
        if (!updatedAccount) throw new NotFoundError("Account");

        // Return updated account data
        return NextResponse.json({ success: true, data: updatedAccount }, { status: 200 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}