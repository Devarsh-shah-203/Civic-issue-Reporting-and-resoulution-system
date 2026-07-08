export default function Loader({ label = "Loading", size = "md" }) {
  const dimensions = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";

  return (
    <div className="flex items-center justify-center gap-3 py-8 text-ink-muted" role="status">
      <span
        className={`${dimensions} animate-spin rounded-full border-2 border-civic-200 border-t-civic-600`}
      />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
}
