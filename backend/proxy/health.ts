import { api } from "encore.dev/api";

export interface HealthResponse {
  status: "online" | "offline";
  timestamp: string;
}

// Checks the health status of the AngelSense API backend.
export const checkHealth = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/health" },
  async () => {
    // Since this endpoint is being called successfully, the backend is online
    return {
      status: "online",
      timestamp: new Date().toISOString(),
    };
  }
);
