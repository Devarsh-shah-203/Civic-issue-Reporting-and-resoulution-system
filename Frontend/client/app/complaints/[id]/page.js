"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useSocket } from "../../../hooks/useSocket";
import { useToast } from "../../../components/Toast/Toast";
import {
  fetchComplaintById,
  updateStatus,
  upvote,
} from "../../../services/complaintService";
import ComplaintStatus from "../../../components/Complaint/ComplaintStatus";
import ComplaintTimeline from "../../../components/Complaint/ComplaintTimeline";
import Loader from "../../../components/Loader/Loader";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUS, STATUS_LABELS } from "../../../utils/constants";
import { formatDateTime } from "../../../utils/helpers";

const LocationPicker = dynamic(() => import("../../../components/Map/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg bg-surface-sunk text-sm text-ink-muted dark:bg-darksurface-raised">
      Loading map…
    </div>
  ),
});

const NEXT_STATUS = {
  [COMPLAINT_STATUS.PENDING]: COMPLAINT_STATUS.IN_PROGRESS,
  [COMPLAINT_STATUS.IN_PROGRESS]: COMPLAINT_STATUS.RESOLVED,
};

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { emitLocal } = useSocket();
  const { showToast } = useToast();
  const isAuthority = user?.role === "authority";

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmReject, setConfirmReject] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchComplaintById(id);
    setComplaint(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpvote = async () => {
    await upvote(id);
    load();
  };

  const pushStatus = async (status, note) => {
    setUpdating(true);
    try {
      const updated = await updateStatus(id, status, note);
      setComplaint(updated);

      if (updated.reporterId) {
        emitLocal("notification:new", {
          id: `local-${Date.now()}`,
          userId: updated.reporterId,
          title: "Status updated",
          message: `Your report '${updated.title}' is now ${STATUS_LABELS[status]}.`,
          read: false,
          createdAt: new Date().toISOString(),
          complaintId: updated.id,
        });
      }
      showToast(`Marked as ${STATUS_LABELS[status]}`, "success");
    } catch (err) {
      showToast(err.message || "Could not update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader label="Loading complaint" />;

  if (!complaint) {
    return (
      <div className="ticket p-6 pl-8 text-sm text-ink-muted">
        This complaint doesn&apos;t exist or was removed.
      </div>
    );
  }

  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);
  const nextStatus = NEXT_STATUS[complaint.status];

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm font-medium text-ink-muted hover:text-civic-600"
      >
        ← Back
      </button>

      <div className="ticket p-6 pl-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ticket-id">{complaint.ticketId}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
              {category?.icon} {complaint.title}
            </h1>
          </div>
          <ComplaintStatus status={complaint.status} />
        </div>

        <p className="mt-4 text-sm text-ink-muted">{complaint.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-muted">
          <span>📍 {complaint.location?.address || "Pinned location"}</span>
          <span>🗓️ Filed {formatDateTime(complaint.createdAt)}</span>
          <span>🏷️ {category?.label}</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-surface-border pt-4 dark:border-darksurface-border">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 rounded-full border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-civic-400 hover:text-civic-600 dark:border-darksurface-border"
          >
            👍 {complaint.upvotes} confirm this too
          </button>

          {isAuthority && (
            <div className="flex gap-2">
              {nextStatus && (
                <button
                  disabled={updating}
                  onClick={() => pushStatus(nextStatus)}
                  className="rounded-md bg-civic-600 px-4 py-2 text-xs font-semibold text-white hover:bg-civic-700 disabled:opacity-60"
                >
                  Mark {STATUS_LABELS[nextStatus]}
                </button>
              )}
              {complaint.status !== COMPLAINT_STATUS.REJECTED &&
                complaint.status !== COMPLAINT_STATUS.RESOLVED && (
                  <button
                    disabled={updating}
                    onClick={() => setConfirmReject(true)}
                    className="rounded-md border border-urgent px-4 py-2 text-xs font-semibold text-urgent hover:bg-urgent/10 disabled:opacity-60"
                  >
                    Reject
                  </button>
                )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="ticket p-6 pl-8">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Location
          </h2>
          <LocationPicker value={complaint.location} readOnly height="220px" />
        </div>

        <div className="ticket p-6 pl-8">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Timeline
          </h2>
          <ComplaintTimeline timeline={complaint.timeline} />
        </div>
      </div>

      <ConfirmModal
        open={confirmReject}
        title="Reject this report?"
        message="The citizen will be notified that this report was rejected."
        confirmLabel="Reject report"
        danger
        onCancel={() => setConfirmReject(false)}
        onConfirm={async () => {
          setConfirmReject(false);
          await pushStatus(COMPLAINT_STATUS.REJECTED, "Report rejected by municipal authority");
        }}
      />
    </div>
  );
}
