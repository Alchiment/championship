import { getSession, commitSession, destroySession } from "../../utils/session.server";
import type { Session } from "@remix-run/node";

export interface AuthUser {
  phoneNumber: string;
  isAdmin: boolean;
}

export class AuthService {
  async getSessionUser(request: Request): Promise<AuthUser | null> {
    const session = await getSession(request.headers.get("Cookie"));
    const phoneNumber = session.get("phoneNumber");
    if (!phoneNumber) return null;
    return {
      phoneNumber,
      isAdmin: session.get("isAdmin") === true || session.get("isAdmin") === "true",
    };
  }

  async createSession(user: AuthUser): Promise<{ cookie: string; session: Session }> {
    const session = await getSession();
    session.set("phoneNumber", user.phoneNumber);
    session.set("isAdmin", user.isAdmin);
    return {
      session,
      cookie: await commitSession(session),
    };
  }

  async destroySession(request: Request): Promise<string> {
    const session = await getSession(request.headers.get("Cookie"));
    return destroySession(session);
  }

  async requireAdmin(request: Request): Promise<AuthUser> {
    const user = await this.getSessionUser(request);
    if (!user) {
      throw new Response(null, { status: 401, statusText: "Unauthorized" });
    }
    if (!user.isAdmin) {
      throw new Response(null, { status: 403, statusText: "Forbidden" });
    }
    return user;
  }

  async requireAuth(request: Request): Promise<AuthUser> {
    const user = await this.getSessionUser(request);
    if (!user) {
      throw new Response(null, { status: 401, statusText: "Unauthorized" });
    }
    return user;
  }
}

export const authService = new AuthService();
