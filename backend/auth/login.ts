import { api, Cookie } from "encore.dev/api";
import { secret } from "encore.dev/config";

const jwtSecret = secret("JWTSecret");

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "support" | "manager";
  };
  session: Cookie<"session">;
}

// Simple JWT creation for demo purposes
// In production, use a proper JWT library
function createJWT(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (24 * 60 * 60); // 24 hours
  
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: exp
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  
  // In production, use proper HMAC signing
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${jwtSecret()}`);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Demo users - in production, this would be in a database
const demoUsers = [
  {
    id: "1",
    email: "admin@angelsense.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const
  },
  {
    id: "2",
    email: "support@angelsense.com",
    password: "support123",
    name: "Support Agent",
    role: "support" as const
  },
  {
    id: "3",
    email: "manager@angelsense.com",
    password: "manager123",
    name: "Support Manager",
    role: "manager" as const
  }
];

// Authenticates a user and returns a session token.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    const user = demoUsers.find(u => u.email === req.email && u.password === req.password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = createJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      session: {
        value: token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      }
    };
  }
);
