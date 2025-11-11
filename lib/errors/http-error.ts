/* A custom error classes to handle HTTP errors in a Next.js application */
export class RequestError extends Error {
  statusCode: number;
  error?: Record<string, string[]>;

  constructor(message: string, statusCode: number, error?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(message, 422, fieldErrors);
    this.name = "ValidationError";
    this.error = fieldErrors;
  }

  // Helper method to format field errors into a readable message
  static formatFieldErrors(fieldErrors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(fieldErrors).map(([field, messages]) => {
      const fileName = field.charAt(0).toUpperCase() + field.slice(1);

      if (messages[0] === "Required") {
        return `${fileName} is required`;
      }
    });
    return formattedMessages.join("; ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}
