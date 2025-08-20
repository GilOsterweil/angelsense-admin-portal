import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const apiBaseUrl = secret("AngelSenseAPIBaseURL");

export interface HealthResponse {
  status: "online" | "offline";
  timestamp: string;
}

// Checks the health status of the AngelSense API backend.
export const checkHealth = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/health" },
  async () => {
    try {
      const response = await fetch(`${apiBaseUrl()}/health`, {
        method: "GET",
        timeout: 5000, // 5 second timeout
      });

      const status = response.ok ? "online" : "offline";
      
      return {
        status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "offline",
        timestamp: new Date().toISOString(),
      };
    }
  }
);
