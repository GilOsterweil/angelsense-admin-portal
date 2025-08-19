import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const apiBaseUrl = secret("AngelSenseAPIBaseURL");
const apiKey = secret("AngelSenseAPIKey");

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "general" | "device";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface ListTicketsRequest {
  page?: number;
  limit?: number;
  status?: "open" | "in-progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: "technical" | "billing" | "general" | "device";
  assignedTo?: string;
}

export interface ListTicketsResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
}

// Retrieves all support tickets with optional filtering and pagination.
export const listTickets = api<ListTicketsRequest, ListTicketsResponse>(
  { expose: true, method: "GET", path: "/tickets" },
  async (req) => {
    const params = new URLSearchParams();
    if (req.page) params.append("page", req.page.toString());
    if (req.limit) params.append("limit", req.limit.toString());
    if (req.status) params.append("status", req.status);
    if (req.priority) params.append("priority", req.priority);
    if (req.category) params.append("category", req.category);
    if (req.assignedTo) params.append("assignedTo", req.assignedTo);

    const response = await fetch(`${apiBaseUrl()}/tickets?${params}`, {
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }

    return await response.json();
  }
);

export interface GetTicketRequest {
  id: string;
}

// Retrieves a specific support ticket by ID.
export const getTicket = api<GetTicketRequest, Ticket>(
  { expose: true, method: "GET", path: "/tickets/:id" },
  async (req) => {
    const response = await fetch(`${apiBaseUrl()}/tickets/${req.id}`, {
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ticket: ${response.statusText}`);
    }

    return await response.json();
  }
);

export interface UpdateTicketRequest {
  id: string;
  status?: "open" | "in-progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
}

// Updates a support ticket.
export const updateTicket = api<UpdateTicketRequest, Ticket>(
  { expose: true, method: "PATCH", path: "/tickets/:id" },
  async (req) => {
    const { id, ...updateData } = req;
    
    const response = await fetch(`${apiBaseUrl()}/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ticket: ${response.statusText}`);
    }

    return await response.json();
  }
);
