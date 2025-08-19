import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: "admin" | "support" | "manager";
}

// Retrieves the current user's information.
export const me = api<void, UserInfo>(
  { auth: true, expose: true, method: "GET", path: "/auth/me" },
  async () => {
    const auth = getAuthData()!;
    return {
      id: auth.userID,
      email: auth.email,
      name: auth.name,
      role: auth.role
    };
  }
);
