"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchComplaints, upvote } from "../../services/complaintService";
import ComplaintCard from "../../components/Complaint/ComplaintCard";
import Loader from "../../components/Loader/Loader";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUS, STATUS_LABELS } from "../../utils/constants";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const isAuthority = user?.role === "authority";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category: "", search: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const query = { ...filters };
    Object.keys(query).forEach((key) => {
      if (!query[key]) delete query[key];
    });
    if (!isAuthority) query.reporterId = user.id;
    const data = await fetchComplaints(query);
    setComplaints(data);
    setLoading(false);
  }, [filters, isAuthority, user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpvote = async (id) => {
    await upvote(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
        {isAuthority ? "Manage complaints" : "Your complaints"}
      </h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search complaints…"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk sm:w-64"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
        >
          <option value="">All statuses</option>
          {Object.values(COMPLAINT_STATUS).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
        >
          <option value="">All categories</option>
          {COMPLAINT_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {loading && <Loader label="Loading complaints" />}

        {!loading && complaints.length === 0 && (
          <p className="text-sm text-ink-muted">No complaints match these filters.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} onUpvote={handleUpvote} />
          ))}
        </div>
      </div>
    </div>
  );
}
