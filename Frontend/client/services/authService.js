import { mockDb } from "./mockDb";
import { USER_ROLES } from "../utils/constants";

function makeTokens(user) {
  return {
    token: `mock-jwt-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
  };
}

function sanitize(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export async function login({ email, password }) {
  const user = await mockDb.findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  const tokens = makeTokens(user);
  return { user: sanitize(user), ...tokens };
}

export async function register({ name, email, phone, password, role = USER_ROLES.CITIZEN }) {
  const existing = await mockDb.findUserByEmail(email);
  if (existing) throw new Error("An account with this email already exists");

  const user = await mockDb.createUser({ name, email, phone, password, role, avatar: null });
  const tokens = makeTokens(user);
  return { user: sanitize(user), ...tokens };
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) throw new Error("Missing refresh token");
  // In the mock layer any non-empty refresh token is accepted and
  // reissued; the real backend will verify signature + expiry.
  return {
    token: `mock-jwt-refreshed-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
  };
}

export async function logout() {
  return true;
}
