import { mockDb } from "./mockDb";

export async function updateProfile(userId, patch) {
  const updated = await mockDb.updateUser(userId, patch);
  const { password, ...safe } = updated;
  return safe;
}

export async function fetchMyComplaints(userId) {
  return mockDb.getComplaints({ reporterId: userId });
}
