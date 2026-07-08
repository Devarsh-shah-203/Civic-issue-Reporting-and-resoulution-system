"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as notificationService from "../services/notificationService";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { onLocal } = useContext(SocketContext) || {};
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await notificationService.fetchNotifications(user.id);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!onLocal) return undefined;
    return onLocal("notification:new", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
  }, [onLocal]);

  const markAsRead = useCallback(async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
