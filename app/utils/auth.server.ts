import { authService } from "../infrastructure/auth/auth.service";

export async function requireAdmin(request: Request) {
  return authService.requireAdmin(request);
}

export async function getAuthUser(request: Request) {
  return authService.getSessionUser(request);
}
