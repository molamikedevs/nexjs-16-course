import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-error";
import { ZodError } from "zod/v3";
import logger from "../logger";


export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      detail: errors || null,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status: statusCode })
    : { statusCode, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error(
      {
        err: error,
      },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );
    return formatResponse(responseType, error.statusCode, error.message, error.error);
  }

  if (error instanceof ZodError) {
    logger.error({ err: error }, `Validation Error: ${error.message}`);
    const validationError = new ValidationError(error.flatten().fieldErrors as Record<string, string[]>);
    return formatResponse(responseType, validationError.statusCode, validationError.message, validationError.error);
  }

  if (error instanceof Error) {
    logger.error({ err: error.message });
    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "Unknown Error");
  return formatResponse(responseType, 500, "An unknown error occurred");
};

export default handleError;
