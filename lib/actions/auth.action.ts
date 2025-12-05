"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { AuthCredentials } from "@/types/action";
import { SignUpSchema } from "../validation";


import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "../handlers/error";
import action from "../handlers/actions";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {

  //1. Validate the input data
  const validationResult = await action({ params, schema: SignUpSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  //2. Start a mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //3. Check for existing user by email and username
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }

    //4. Check for existing username
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    //5. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //6. Create new user and account documents
    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    //7. Commit the transaction
    await session.commitTransaction();


    //8. Sign in the user after successful registration
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    // Handle any errors that occur during the transaction
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    // End the mongoose session
    await session.endSession();
  }
}
