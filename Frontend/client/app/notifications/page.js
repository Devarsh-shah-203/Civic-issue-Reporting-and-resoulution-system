"use client";

import { useContext } from "react";
import Link from "next/link";
import { NotificationContext } from "../../context/NotificationContext";
import Loader from "../../components/Loader/Loader";
import { timeAgo } from "../../utils/helpers";
import { classNames } from "../../utils/helpers";

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead } = useContext(NotificationContext);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
          Notifications
        </h1>
        <button
          onClick={markAllAsRead}
          className="text-sm font-semibold text-civic-600 hover:underline"
        >
          Mark all read
        </button>
      </div>

      {loading && <Loader label="Loading notifications" />}

      {!loading && notifications.length === 0 && (
        <div className="ticket p-6 pl-8 text-sm text-ink-muted">
          You&apos;re all caught up — nothing new to see here.
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.complaintId ? `/complaints/${n.complaintId}` : "#"}
            onClick={() => markAsRead(n.id)}
            className={classNames(
              "ticket block p-5 pl-8 transition hover:shadow-raised",
              n.read ? "opacity-60" : ""
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display font-semibold text-ink dark:text-surface-sunk">
                {n.title}
              </p>
              {!n.read && <span className="h-2 w-2 rounded-full bg-signal" />}
            </div>
            <p className="mt-1 text-sm text-ink-muted">{n.message}</p>
            <p className="mt-2 text-xs text-ink-muted">{timeAgo(n.createdAt)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
