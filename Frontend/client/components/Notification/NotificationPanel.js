"use client";

import { useContext } from "react";
import Link from "next/link";
import { NotificationContext } from "../../context/NotificationContext";
import { timeAgo } from "../../utils/helpers";
import Loader from "../Loader/Loader";

export default function NotificationPanel({ onClose }) {
  const { notifications, loading, markAsRead, markAllAsRead } = useContext(NotificationContext);

  return (
    <div className="ticket absolute right-0 top-12 z-40 w-80 p-0">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3 dark:border-darksurface-border">
        <h4 className="font-display text-sm font-semibold text-ink dark:text-surface-sunk">
          Notifications
        </h4>
        <button
          onClick={markAllAsRead}
          className="text-xs font-medium text-civic-600 hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading && <Loader label="Fetching" size="sm" />}

        {!loading && notifications.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-ink-muted">
            You&apos;re all caught up.
          </p>
        )}

        {!loading &&
          notifications.map((n) => (
            <Link
              key={n.id}
              href={n.complaintId ? `/complaints/${n.complaintId}` : "/notifications"}
              onClick={() => {
                markAsRead(n.id);
                onClose?.();
              }}
              className={`block border-b border-surface-border px-4 py-3 text-sm last:border-0 hover:bg-surface-sunk dark:border-darksurface-border dark:hover:bg-darksurface-raised ${
                n.read ? "opacity-60" : ""
              }`}
            >
              <p className="font-medium text-ink dark:text-surface-sunk">{n.title}</p>
              <p className="mt-0.5 text-ink-muted">{n.message}</p>
              <p className="mt-1 text-xs text-ink-muted">{timeAgo(n.createdAt)}</p>
            </Link>
          ))}
      </div>

      <Link
        href="/notifications"
        onClick={onClose}
        className="block px-4 py-2.5 text-center text-xs font-semibold text-civic-600 hover:bg-surface-sunk dark:hover:bg-darksurface-raised"
      >
        View all notifications
      </Link>
    </div>
  );
}
