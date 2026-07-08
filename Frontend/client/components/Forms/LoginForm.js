"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../Toast/Toast";
import { validateLoginForm, hasErrors } from "../../utils/validation";

export default function LoginForm() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitting(true);
    try {
      await login(form);
      showToast("Welcome back!", "success");
      router.push("/dashboard");
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
        />
        {errors.email && <p className="mt-1 text-xs text-urgent">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
        />
        {errors.password && <p className="mt-1 text-xs text-urgent">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-civic-700 disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="rounded-md bg-surface-sunk px-3 py-2 text-xs text-ink-muted dark:bg-darksurface-raised">
        Demo citizen: citizen@demo.com · Demo authority: authority@demo.com — password:{" "}
        <span className="font-mono">password</span>
      </p>
    </form>
  );
}
