"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { fetchComplaints } from "../../services/complaintService";
import ComplaintCard from "../../components/Complaint/ComplaintCard";
import Loader from "../../components/Loader/Loader";
import { COMPLAINT_STATUS } from "../../utils/constants";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-lg bg-surface p-5 shadow-card dark:bg-darksurface-raised">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAuthority = user?.role === "authority";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchComplaints(isAuthority ? {} : { reporterId: user.id }).then((data) => {
      if (active) {
        setComplaints(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user, isAuthority]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === COMPLAINT_STATUS.PENDING).length,
    inProgress: complaints.filter((c) => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
    resolved: complaints.filter((c) => c.status === COMPLAINT_STATUS.RESOLVED).length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
            {isAuthority ? "Control room" : `Welcome back, ${user?.name?.split(" ")[0]}`}
          </h1>
          <p className="text-sm text-ink-muted">
            {isAuthority
              ? "All complaints reported across the city."
              : "Here's what's happening with your reports."}
          </p>
        </div>
        {!isAuthority && (
          <Link
            href="/report"
            className="rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink hover:bg-signal-dark"
          >
            + Report an issue
          </Link>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} accent="text-ink dark:text-surface-sunk" />
        <StatCard label="Pending" value={stats.pending} accent="text-signal-dark" />
        <StatCard label="In progress" value={stats.inProgress} accent="text-civic-600" />
        <StatCard label="Resolved" value={stats.resolved} accent="text-resolved-dark" />
      </div>

      <h2 className="mb-3 font-display text-lg font-semibold text-ink dark:text-surface-sunk">
        {isAuthority ? "Recent reports" : "Your recent reports"}
      </h2>

      {loading && <Loader label="Loading complaints" />}

      {!loading && complaints.length === 0 && (
        <div className="ticket p-6 pl-8 text-sm text-ink-muted">
          No reports yet.{" "}
          <Link href="/report" className="font-semibold text-civic-600 hover:underline">
            File your first one
          </Link>
          .
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {complaints.slice(0, 4).map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>

      {complaints.length > 4 && (
        <div className="mt-4 text-center">
          <Link href="/complaints" className="text-sm font-semibold text-civic-600 hover:underline">
            View all {complaints.length} complaints →
          </Link>
        </div>
      )}
    </div>
  );
}
