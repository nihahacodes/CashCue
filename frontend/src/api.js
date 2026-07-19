// Single place for the backend URL.
// In development this reads from .env.local → VITE_API_URL=http://localhost:5000
// In production Vercel reads from the env vars you set in the dashboard.
// NEVER hardcode localhost anywhere else in the codebase.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Helper: make an authenticated request ────────────────────────────────────
// Pass the Firebase user object and it automatically adds the token header.
// Usage: await apiRequest(user, "/transactions", { method: "POST", body: {...} })

export async function apiRequest(user, path, options = {}) {
  // Get a fresh ID token (Firebase refreshes it automatically if expired)
  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // backend verifies this
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(err.message || "Request failed");
  }

  return response.json();
}
