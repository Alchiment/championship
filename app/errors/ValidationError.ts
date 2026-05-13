import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    public details?: Record<string, string>
  ) {
    super(message, 400, true);
    this.name = "ValidationError";
  }
}
