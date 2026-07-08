"use client";

import Link from "next/link";
import ComplaintStatus from "./ComplaintStatus";
import { COMPLAINT_CATEGORIES } from "../../utils/constants";
import { timeAgo, truncate } from "../../utils/helpers";

export default function ComplaintCard({ complaint, onUpvote }) {
  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);

  return (
    <div className="ticket p-5 pl-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ticket-id">{complaint.ticketId}</p>
          <Link href={`/complaints/${complaint.id}`}>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink hover:text-civic-600 dark:text-surface-sunk">
              {category?.icon} {complaint.title}
            </h3>
          </Link>
        </div>
        <ComplaintStatus status={complaint.status} />
      </div>

      <p className="mt-2 text-sm text-ink-muted">{truncate(complaint.description, 120)}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
        <span>{complaint.location?.address}</span>
        <span>{timeAgo(complaint.createdAt)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3 dark:border-darksurface-border">
        <button
          onClick={() => onUpvote?.(complaint.id)}
          className="flex items-center gap-1.5 rounded-full border border-surface-border px-3 py-1 text-xs font-medium text-ink-muted hover:border-civic-400 hover:text-civic-600 dark:border-darksurface-border"
        >
          👍 {complaint.upvotes} confirm this too
        </button>
        <Link
          href={`/complaints/${complaint.id}`}
          className="text-xs font-semibold text-civic-600 hover:underline"
        >
          View timeline →
        </Link>
      </div>
    </div>
  );
}
