/**
 * Somboth API Client
 * Fully typed client communicating with the Somboth Backend API (http://localhost:5000)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Local storage key for JWT token
const TOKEN_KEY = "somboth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = getStoredToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: json.error || `HTTP error ${response.status}`,
      };
    }

    return { success: true, data: json };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to communicate with Somboth backend.",
    };
  }
}

export const api = {
  // Auth API
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const res = await apiRequest<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return res;
    },
    register: async (payload: { name: string; email: string; password: string; role?: string }) => {
      const res = await apiRequest<{ token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return res;
    },
    me: () => apiRequest<{ user: any }>("/auth/me"),
    logout: () => clearStoredToken(),
  },

  // Projects API
  projects: {
    list: () => apiRequest<{ count: number; projects: any[] }>("/projects"),
    get: (id: string) => apiRequest<{ project: any }>(`/projects/${id}`),
    getDashboard: (id: string) => apiRequest<{ dashboard: any }>(`/projects/${id}/dashboard`),
    create: (data: any) =>
      apiRequest<{ project: any }>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, updates: any) =>
      apiRequest<{ project: any }>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    delete: (id: string) =>
      apiRequest(`/projects/${id}`, {
        method: "DELETE",
      }),
  },

  // Guests API
  guests: {
    list: (projectId: string, params?: { status?: string; group?: string; search?: string }) => {
      const query = new URLSearchParams({ projectId, ...(params || {}) }).toString();
      return apiRequest<{ count: number; guests: any[] }>(`/guests?${query}`);
    },
    getStats: (projectId: string) => apiRequest<{ stats: any }>(`/guests/stats?projectId=${projectId}`),
    add: (guest: any) =>
      apiRequest<{ guest: any }>("/guests", {
        method: "POST",
        body: JSON.stringify(guest),
      }),
    update: (id: string, updates: any) =>
      apiRequest<{ guest: any }>(`/guests/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    patchStatus: (id: string, status: "Confirmed" | "Pending" | "Declined") =>
      apiRequest<{ guest: any }>(`/guests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      apiRequest(`/guests/${id}`, {
        method: "DELETE",
      }),
    rsvp: (rsvpData: { projectId: string; guestName: string; status: string; wish?: string; attendeeCount?: number; phone?: string }) =>
      apiRequest("/guests/rsvp", {
        method: "POST",
        body: JSON.stringify(rsvpData),
      }),
  },

  // Expenses API
  expenses: {
    list: (projectId: string, params?: { category?: string; status?: string }) => {
      const query = new URLSearchParams({ projectId, ...(params || {}) }).toString();
      return apiRequest<{ count: number; expenses: any[] }>(`/expenses?${query}`);
    },
    getSummary: (projectId: string) => apiRequest<{ summary: any }>(`/expenses/summary?projectId=${projectId}`),
    add: (expense: any) =>
      apiRequest<{ expense: any }>("/expenses", {
        method: "POST",
        body: JSON.stringify(expense),
      }),
    update: (id: string, updates: any) =>
      apiRequest<{ expense: any }>(`/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    delete: (id: string) =>
      apiRequest(`/expenses/${id}`, {
        method: "DELETE",
      }),
  },

  // Gifts API
  gifts: {
    list: (projectId: string, params?: { currency?: string; group?: string; thankYouSent?: boolean; search?: string }) => {
      const queryParams: any = { projectId };
      if (params?.currency) queryParams.currency = params.currency;
      if (params?.group) queryParams.group = params.group;
      if (params?.thankYouSent !== undefined) queryParams.thankYouSent = String(params.thankYouSent);
      if (params?.search) queryParams.search = params.search;
      const query = new URLSearchParams(queryParams).toString();
      return apiRequest<{ count: number; gifts: any[] }>(`/gifts?${query}`);
    },
    getSummary: (projectId: string) => apiRequest<{ summary: any }>(`/gifts/summary?projectId=${projectId}`),
    add: (gift: any) =>
      apiRequest<{ gift: any }>("/gifts", {
        method: "POST",
        body: JSON.stringify(gift),
      }),
    toggleThankYou: (id: string, thankYouSent?: boolean) =>
      apiRequest<{ gift: any }>(`/gifts/${id}/thank-you`, {
        method: "PATCH",
        body: JSON.stringify(thankYouSent !== undefined ? { thankYouSent } : {}),
      }),
    update: (id: string, updates: any) =>
      apiRequest<{ gift: any }>(`/gifts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    delete: (id: string) =>
      apiRequest(`/gifts/${id}`, {
        method: "DELETE",
      }),
    getExportUrl: (projectId: string) => `${API_BASE_URL}/gifts/export?projectId=${projectId}`,
  },

  // Template API
  template: {
    get: (projectId: string) => apiRequest<{ template: any }>(`/template/${projectId}`),
    save: (projectId: string, templateData: any) =>
      apiRequest<{ template: any }>(`/template/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(templateData),
      }),
    getPublic: (projectId: string) => apiRequest<{ invitation: any }>(`/template/public/${projectId}`),
  },
};
