import { AppError } from "./AppError";

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, true);
    this.name = "AuthError";
  }
}
