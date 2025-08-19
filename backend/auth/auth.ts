import { authHandler } from "encore.dev/auth";
import { APIError, Header, Cookie } from "encore.dev/api";
import { secret } from "encore.dev/config";

const jwtSecret = secret("JWTSecret");

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string;
  name: string;
  role: "admin" | "support" | "manager";
}

// Simple JWT verification for demo purposes
// In production, use a proper JWT library
function verifyJWT(token: string): AuthData {
  try {
    // This is a simplified JWT verification
    // In production, use a proper JWT library like jsonwebtoken
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return {
      userID: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role || "support"
    };
  } catch (err) {
    throw new Error('Invalid token');
  }
}

const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const token = params.authorization?.replace("Bearer ", "") ?? params.session?.value;
    
    if (!token) {
      throw APIError.unauthenticated("missing authentication token");
    }

    try {
      return verifyJWT(token);
    } catch (err) {
      throw APIError.unauthenticated("invalid authentication token");
    }
  }
);

export default auth;
