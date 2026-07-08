import { formatDateTime } from "../../utils/helpers";
import { STATUS_LABELS } from "../../utils/constants";

export default function ComplaintTimeline({ timeline = [] }) {
  if (!timeline.length) {
    return <p className="text-sm text-ink-muted">No updates yet.</p>;
  }

  return (
    <ol className="relative ml-3 border-l-2 border-surface-border pl-6 dark:border-darksurface-border">
      {timeline.map((entry, idx) => (
        <li key={idx} className="mb-6 last:mb-0">
          <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-civic-600 bg-surface dark:bg-darksurface-raised" />
          <p className="font-mono text-xs uppercase tracking-wide text-civic-600">
            {STATUS_LABELS[entry.status] || entry.status}
          </p>
          <p className="mt-1 text-sm text-ink dark:text-surface-sunk">{entry.note}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{formatDateTime(entry.at)}</p>
        </li>
      ))}
    </ol>
  );
}
