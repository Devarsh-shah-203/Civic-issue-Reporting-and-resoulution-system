"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: "border-resolved bg-resolved/10 text-resolved-dark",
  error: "border-urgent bg-urgent/10 text-urgent-dark",
  info: "border-civic-400 bg-civic-50 text-civic-600",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-fadeUp rounded-lg border px-4 py-3 text-sm font-medium shadow-raised ${VARIANT_STYLES[toast.variant]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
