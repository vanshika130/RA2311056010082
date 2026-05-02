// src/api/client.ts

const BASE_URL = "https://api.campusnotify.edu/v1";

function getHeaders(withAuth = true): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Client-Version": "1.0.0",
    "X-Request-ID": crypto.randomUUID(),
  };
  if (withAuth) {
    const token = localStorage.getItem("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = true
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(withAuth), ...(options.headers || {}) },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || "An unexpected error occurred.");
  }

  return json;
}

export const authAPI = {
  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, device_id: "web-browser" }),
    }, false),

  logout: () => request("/auth/logout", { method: "POST" }),

  refresh: (refresh_token: string) =>
    request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    }, false),
};

export const notificationsAPI = {
  getAll: (params: Record<string, string | number | boolean> = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/notifications${query ? `?${query}` : ""}`);
  },

  getById: (id: string) => request(`/notifications/${id}`),

  markRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: (type?: string) =>
    request("/notifications/read-all", {
      method: "PATCH",
      body: JSON.stringify(type ? { type } : {}),
    }),

  delete: (id: string) =>
    request(`/notifications/${id}`, { method: "DELETE" }),

  registerDeviceToken: (token: string) =>
    request("/notifications/device-token", {
      method: "POST",
      body: JSON.stringify({ token, platform: "web", device_id: "web-browser" }),
    }),
};

export function createNotificationStream(
  token: string,
  onNotification: (data: Record<string, unknown>) => void,
  onPing?: () => void
): EventSource {
  const url = `${BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`;
  const source = new EventSource(url);

  source.addEventListener("notification", (e) => {
    try {
      onNotification(JSON.parse(e.data));
    } catch {
      console.error("Failed to parse SSE notification");
    }
  });

  source.addEventListener("ping", () => onPing?.());

  source.onerror = () => {
    source.close();
    setTimeout(() => {
      createNotificationStream(token, onNotification, onPing);
    }, 5000);
  };

  return source;
}
