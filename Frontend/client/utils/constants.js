export const COMPLAINT_CATEGORIES = [
  { value: "pothole", label: "Pothole", icon: "🕳️" },
  { value: "streetlight", label: "Broken Streetlight", icon: "💡" },
  { value: "garbage", label: "Overflowing Garbage", icon: "🗑️" },
  { value: "water", label: "Water Leakage", icon: "🚰" },
  { value: "road", label: "Damaged Road", icon: "🛣️" },
  { value: "tree", label: "Fallen Tree", icon: "🌳" },
  { value: "electricity", label: "Power Line Hazard", icon: "⚡" },
  { value: "other", label: "Other", icon: "📌" },
];

export const COMPLAINT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export const STATUS_LABELS = {
  [COMPLAINT_STATUS.PENDING]: "Pending Review",
  [COMPLAINT_STATUS.IN_PROGRESS]: "In Progress",
  [COMPLAINT_STATUS.RESOLVED]: "Resolved",
  [COMPLAINT_STATUS.REJECTED]: "Rejected",
};

export const STATUS_STAMP_CLASS = {
  [COMPLAINT_STATUS.PENDING]: "stamp-pending",
  [COMPLAINT_STATUS.IN_PROGRESS]: "stamp-progress",
  [COMPLAINT_STATUS.RESOLVED]: "stamp-resolved",
  [COMPLAINT_STATUS.REJECTED]: "stamp-rejected",
};

export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const USER_ROLES = {
  CITIZEN: "citizen",
  AUTHORITY: "authority",
  ADMIN: "admin",
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const DEFAULT_MAP_CENTER = { lat: 26.9124, lng: 75.7873 }; // Jaipur
export const DEFAULT_MAP_ZOOM = 13;

export const TOKEN_KEY = "civic_pulse_token";
export const REFRESH_TOKEN_KEY = "civic_pulse_refresh_token";
export const USER_KEY = "civic_pulse_user";
