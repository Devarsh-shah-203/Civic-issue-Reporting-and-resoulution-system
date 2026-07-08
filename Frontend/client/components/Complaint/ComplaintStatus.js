import { STATUS_LABELS, STATUS_STAMP_CLASS } from "../../utils/constants";

export default function ComplaintStatus({ status, animate = false }) {
  return (
    <span
      className={`stamp ${STATUS_STAMP_CLASS[status] || "stamp-pending"} ${
        animate ? "animate-stampIn" : ""
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
