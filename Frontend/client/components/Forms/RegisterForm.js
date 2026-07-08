"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../Toast/Toast";
import { validateRegisterForm, hasErrors } from "../../utils/validation";

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      showToast("Account created — welcome to CivicPulse!", "success");
      router.push("/dashboard");
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "name", label: "Full name", type: "text", placeholder: "Aarav Sharma" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "phone", label: "Phone number", type: "tel", placeholder: "9876543210" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { name: "confirmPassword", label: "Confirm password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {fields.map((field) => (
        <div key={field.name}>
          <label className="mb-1 block text-sm font-medium text-ink dark:text-surface-sunk">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-civic-400 dark:border-darksurface-border dark:bg-darksurface-raised dark:text-surface-sunk"
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-urgent">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-civic-700 disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
