import { COMPLAINT_STATUS, USER_ROLES, DEFAULT_MAP_CENTER } from "../utils/constants";
import { generateTicketId } from "../utils/helpers";

const DB_KEY = "civic_pulse_mock_db_v1";
const LATENCY = 450;

function seed() {
  const now = Date.now();
  const day = 86400000;

  return {
    users: [
      {
        id: "u1",
        name: "Aarav Sharma",
        email: "citizen@demo.com",
        phone: "9876543210",
        password: "password",
        role: USER_ROLES.CITIZEN,
        avatar: null,
        createdAt: new Date(now - 40 * day).toISOString(),
      },
      {
        id: "u2",
        name: "Municipal Authority",
        email: "authority@demo.com",
        phone: "9123456780",
        password: "password",
        role: USER_ROLES.AUTHORITY,
        avatar: null,
        createdAt: new Date(now - 100 * day).toISOString(),
      },
    ],
    complaints: [
      {
        id: "c1",
        ticketId: "CP-2026-4821",
        title: "Deep pothole near Malviya Circle",
        description:
          "A large pothole has formed right at the intersection, causing two-wheelers to swerve dangerously during peak hours.",
        category: "pothole",
        status: COMPLAINT_STATUS.IN_PROGRESS,
        priority: "high",
        location: { lat: 26.8535, lng: 75.8038, address: "Malviya Circle, Jaipur" },
        images: [],
        reporterId: "u1",
        upvotes: 14,
        createdAt: new Date(now - 6 * day).toISOString(),
        updatedAt: new Date(now - 1 * day).toISOString(),
        timeline: [
          { status: COMPLAINT_STATUS.PENDING, note: "Report submitted", at: new Date(now - 6 * day).toISOString() },
          { status: COMPLAINT_STATUS.IN_PROGRESS, note: "Assigned to Road Maintenance Dept.", at: new Date(now - 1 * day).toISOString() },
        ],
      },
      {
        id: "c2",
        ticketId: "CP-2026-3390",
        title: "Streetlight out on Tonk Road service lane",
        description:
          "The streetlight has been off for over a week, making the service lane unsafe for evening walkers.",
        category: "streetlight",
        status: COMPLAINT_STATUS.PENDING,
        priority: "medium",
        location: { lat: 26.8932, lng: 75.8060, address: "Tonk Road, Jaipur" },
        images: [],
        reporterId: "u1",
        upvotes: 5,
        createdAt: new Date(now - 2 * day).toISOString(),
        updatedAt: new Date(now - 2 * day).toISOString(),
        timeline: [
          { status: COMPLAINT_STATUS.PENDING, note: "Report submitted", at: new Date(now - 2 * day).toISOString() },
        ],
      },
      {
        id: "c3",
        ticketId: "CP-2026-1187",
        title: "Garbage bin overflowing near Bapu Bazaar",
        description: "Bin hasn't been cleared in days, spilling onto the footpath.",
        category: "garbage",
        status: COMPLAINT_STATUS.RESOLVED,
        priority: "medium",
        location: { lat: 26.9187, lng: 75.8256, address: "Bapu Bazaar, Jaipur" },
        images: [],
        reporterId: "u1",
        upvotes: 22,
        createdAt: new Date(now - 12 * day).toISOString(),
        updatedAt: new Date(now - 3 * day).toISOString(),
        timeline: [
          { status: COMPLAINT_STATUS.PENDING, note: "Report submitted", at: new Date(now - 12 * day).toISOString() },
          { status: COMPLAINT_STATUS.IN_PROGRESS, note: "Sanitation team dispatched", at: new Date(now - 8 * day).toISOString() },
          { status: COMPLAINT_STATUS.RESOLVED, note: "Bin cleared and schedule fixed", at: new Date(now - 3 * day).toISOString() },
        ],
      },
    ],
    notifications: [
      {
        id: "n1",
        userId: "u1",
        title: "Status updated",
        message: "Your report 'Deep pothole near Malviya Circle' is now In Progress.",
        read: false,
        createdAt: new Date(now - 1 * day).toISOString(),
        complaintId: "c1",
      },
      {
        id: "n2",
        userId: "u1",
        title: "Issue resolved",
        message: "Great news — 'Garbage bin overflowing near Bapu Bazaar' has been resolved.",
        read: true,
        createdAt: new Date(now - 3 * day).toISOString(),
        complaintId: "c3",
      },
    ],
  };
}

function readDb() {
  if (typeof window === "undefined") return seed();
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const initial = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    const initial = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
}

function writeDb(db) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
}

export const mockDb = {
  async getUsers() {
    return delay(readDb().users);
  },
  async findUserByEmail(email) {
    const db = readDb();
    return delay(db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null);
  },
  async createUser(user) {
    const db = readDb();
    const newUser = { id: `u${Date.now()}`, createdAt: new Date().toISOString(), ...user };
    db.users.push(newUser);
    writeDb(db);
    return delay(newUser);
  },
  async updateUser(userId, patch) {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    db.users[idx] = { ...db.users[idx], ...patch };
    writeDb(db);
    return delay(db.users[idx]);
  },

  async getComplaints(filters = {}) {
    const db = readDb();
    let results = [...db.complaints];
    if (filters.status) results = results.filter((c) => c.status === filters.status);
    if (filters.category) results = results.filter((c) => c.category === filters.category);
    if (filters.reporterId) results = results.filter((c) => c.reporterId === filters.reporterId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return delay(results);
  },
  async getComplaintById(id) {
    const db = readDb();
    return delay(db.complaints.find((c) => c.id === id) || null);
  },
  async createComplaint(payload) {
    const db = readDb();
    const now = new Date().toISOString();
    const complaint = {
      id: `c${Date.now()}`,
      ticketId: generateTicketId(),
      status: COMPLAINT_STATUS.PENDING,
      priority: "medium",
      upvotes: 0,
      images: [],
      createdAt: now,
      updatedAt: now,
      timeline: [{ status: COMPLAINT_STATUS.PENDING, note: "Report submitted", at: now }],
      ...payload,
    };
    db.complaints.unshift(complaint);
    writeDb(db);
    return delay(complaint);
  },
  async updateComplaintStatus(id, status, note) {
    const db = readDb();
    const idx = db.complaints.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Complaint not found");
    const now = new Date().toISOString();
    db.complaints[idx].status = status;
    db.complaints[idx].updatedAt = now;
    db.complaints[idx].timeline.push({ status, note: note || "Status updated", at: now });
    writeDb(db);
    return delay(db.complaints[idx]);
  },
  async upvoteComplaint(id) {
    const db = readDb();
    const idx = db.complaints.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Complaint not found");
    db.complaints[idx].upvotes += 1;
    writeDb(db);
    return delay(db.complaints[idx]);
  },

  async getNotifications(userId) {
    const db = readDb();
    return delay(
      db.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  },
  async markNotificationRead(id) {
    const db = readDb();
    const idx = db.notifications.findIndex((n) => n.id === id);
    if (idx === -1) return delay(null);
    db.notifications[idx].read = true;
    writeDb(db);
    return delay(db.notifications[idx]);
  },
  async markAllNotificationsRead(userId) {
    const db = readDb();
    db.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    writeDb(db);
    return delay(true);
  },
};

export { DEFAULT_MAP_CENTER };
