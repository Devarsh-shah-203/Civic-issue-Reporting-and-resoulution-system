import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";

// In production this calls POST /auth/refresh on the real backend.
// Wired here against the mock auth service so the rest of the app
// (interceptors, hooks) doesn't need to change when the backend lands.
export async function refreshAccessToken() {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

  if (!refreshToken) throw new Error("No refresh token available");

  const { refreshSession } = await import("../services/authService");
  const { token, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  }

  return token;
}
