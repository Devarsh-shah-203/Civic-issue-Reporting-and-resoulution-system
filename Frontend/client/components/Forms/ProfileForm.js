"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../Toast/Toast";
import { updateProfile } from "../../services/profileService";
import { getInitials } from "../../utils/helpers";

export default function ProfileForm() {
  const { user, updateUserInContext } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await updateProfile(user.id, form);
      updateUserInContext(updated);
      showToast("Profile updated", "success");
    } catch (err) {
      showToast(err.message || "Could not update profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket p-6 pl-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-civic-600 font-display text-xl font-semibold text-white">
          {getInitials(user?.name)}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink dark:text-surface-sunk">
            {user?.name}
          </p>
          <p className="text-sm text-ink-muted">{user?.email}</p>
          <p className="mt-1 inline-block rounded-full bg-civic-50 px-2 py-0.5 text-xs font-medium capitalize text-civic-600">
            {user?.role}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-civic-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-civic-700 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
