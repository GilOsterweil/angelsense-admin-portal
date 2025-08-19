import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const apiBaseUrl = secret("AngelSenseAPIBaseURL");
const apiKey = secret("AngelSenseAPIKey");

export interface Device {
  id: string;
  customerId: string;
  deviceName: string;
  deviceType: "gps-tracker" | "smartwatch";
  serialNumber: string;
  status: "active" | "inactive" | "lost" | "maintenance";
  batteryLevel: number;
  lastLocation: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  };
  activationDate: string;
}

export interface ListDevicesRequest {
  customerId?: string;
  status?: "active" | "inactive" | "lost" | "maintenance";
  page?: number;
  limit?: number;
}

export interface ListDevicesResponse {
  devices: Device[];
  total: number;
  page: number;
  limit: number;
}

// Retrieves all devices with optional filtering and pagination.
export const listDevices = api<ListDevicesRequest, ListDevicesResponse>(
  { expose: true, method: "GET", path: "/devices" },
  async (req) => {
    const params = new URLSearchParams();
    if (req.customerId) params.append("customerId", req.customerId);
    if (req.status) params.append("status", req.status);
    if (req.page) params.append("page", req.page.toString());
    if (req.limit) params.append("limit", req.limit.toString());

    const response = await fetch(`${apiBaseUrl()}/devices?${params}`, {
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch devices: ${response.statusText}`);
    }

    return await response.json();
  }
);

export interface GetDeviceRequest {
  id: string;
}

// Retrieves a specific device by ID.
export const getDevice = api<GetDeviceRequest, Device>(
  { expose: true, method: "GET", path: "/devices/:id" },
  async (req) => {
    const response = await fetch(`${apiBaseUrl()}/devices/${req.id}`, {
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch device: ${response.statusText}`);
    }

    return await response.json();
  }
);
