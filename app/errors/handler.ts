import { AppError } from "./AppError";
import { ValidationError } from "./ValidationError";

export interface ErrorResponse {
  message: string;
  status: number;
  details?: Record<string, string>;
}

export function handleError(error: unknown, isAdmin: boolean = false): ErrorResponse {
  if (error instanceof AppError) {
    if (error.isPublic || isAdmin) {
      return {
        message: error.message,
        status: error.statusCode,
        ...(error instanceof ValidationError && error.details
          ? { details: error.details }
          : {}),
      };
    }
    return {
      message: "Something went wrong. Please try again later.",
      status: error.statusCode,
    };
  }

  if (error instanceof Error) {
    if (isAdmin) {
      return {
        message: error.message,
        status: 500,
      };
    }
    return {
      message: "Something went wrong. Please try again later.",
      status: 500,
    };
  }

  return {
    message: "Something went wrong. Please try again later.",
    status: 500,
  };
}
