"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../Toast/Toast";
import { submitComplaint } from "../../services/complaintService";
import { validateReportForm, hasErrors } from "../../utils/validation";
import { COMPLAINT_CATEGORIES } from "../../utils/constants";

const LocationPicker = dynamic(() => import("../Map/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-lg bg-surface-sunk text-sm text-ink-muted dark:bg-darksurface-raised">
      Loading map…
    </div>
  ),
});

const initialState = {
  title: "",
  description: "",
  category: "",
  location: null,
};

export default function ReportForm() {
  const { user } = useAuth();
  const { emitLocal } = useSocket();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationChange = (location) => {
    setForm((prev) => ({ ...prev, location }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateReportForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitting(true);
    try {
      const complaint = await submitComplaint({
        ...form,
        reporterId: user.id,
      });

      emitLocal("notification:new", {
        id: `local-${Date.now()}`,
        userId: user.id,
        title: "Report received",
        message: `Your report '${complaint.title}' is now on record as ${complaint.ticketId}.`,
        read: false,
        createdAt: new Date().toISOString(),
        complaintId: complaint.id,
      });

      showToast(`Report submitted as ${complaint.ticketId}`, "success");
      router.push(`/complaints/${complaint.id}`);
    } catch (err) {
      showToast(err.message || "Could not submit report", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="E.g. Deep pothole near the market entrance"
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
        />
        {errors.title && <p className="mt-1 text-xs text-urgent">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
          Category
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COMPLAINT_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.value}
              onClick={() => setForm((prev) => ({ ...prev, category: cat.value }))}
              className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                form.category === cat.value
                  ? "border-civic-600 bg-civic-50 text-civic-600"
                  : "border-surface-border text-ink-muted hover:border-civic-400 dark:border-darksurface-border"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
        {errors.category && <p className="mt-1 text-xs text-urgent">{errors.category}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="What's wrong, and why does it matter? Mention any safety risk."
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-urgent">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
          Location
        </label>
        <LocationPicker value={form.location} onChange={handleLocationChange} />
        {errors.location && <p className="mt-1 text-xs text-urgent">{errors.location}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-civic-700 disabled:opacity-60"
      >
        {submitting ? "Filing report…" : "Submit report"}
      </button>
    </form>
  );
}
