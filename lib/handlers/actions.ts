"use server";

import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod/v3";
import { auth } from "@/auth";
import { UnauthorizedError, ValidationError } from "../errors/http-error";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

// 1. Check if params exist and validate them against the schema
// 2. If authorize is true, check for a valid session
// 3. Connect to the database
export default async function action<T>({ params, schema, authorize }: ActionOptions<T>) {
  let session: Session | null = null;

  if (schema && params) {
    try {
        schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(error.flatten().fieldErrors as Record<string, string[]>);
      } else {
        return new Error("Schema validation failed");
      }
    }

    if (authorize) {
        session = await auth();
        if (!session) {
          return new UnauthorizedError();
        }
    }
  }
  await dbConnect();

  return { session, params };
}
