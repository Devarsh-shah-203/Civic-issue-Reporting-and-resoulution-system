import { mockDb } from "./mockDb";

export async function fetchNotifications(userId) {
  return mockDb.getNotifications(userId);
}

export async function markAsRead(id) {
  return mockDb.markNotificationRead(id);
}

export async function markAllAsRead(userId) {
  return mockDb.markAllNotificationsRead(userId);
}
