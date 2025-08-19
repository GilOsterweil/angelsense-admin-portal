import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const apiBaseUrl = secret("AngelSenseAPIBaseURL");
const apiKey = secret("AngelSenseAPIKey");

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subscriptionStatus: "active" | "inactive" | "suspended";
  deviceCount: number;
  joinDate: string;
  lastActivity: string;
}

export interface ListCustomersRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended";
}

export interface ListCustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

// Retrieves all customers with optional filtering and pagination.
export const listCustomers = api<ListCustomersRequest, ListCustomersResponse>(
  { expose: true, method: "GET", path: "/customers", auth: true },
  async (req) => {
    const params = new URLSearchParams();
    if (req.page) params.append("page", req.page.toString());
    if (req.limit) params.append("limit", req.limit.toString());
    if (req.search) params.append("search", req.search);
    if (req.status) params.append("status", req.status);

    const response = await fetch(`${apiBaseUrl()}/customers?${params}`, {
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return await response.json();
  }
);

export interface GetCustomerRequest {
  id: string;
}

// Retrieves a specific customer by ID.
export const getCustomer = api<GetCustomerRequest, Customer>(
  { expose: true, method: "GET", path: "/customers/:id", auth: true },
  async (req) => {
    const response = await fetch(`${apiBaseUrl()}/customers/${req.id}`, {
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }

    return await response.json();
  }
);
