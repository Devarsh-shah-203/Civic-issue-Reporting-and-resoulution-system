import { mockDb } from "./mockDb";

export async function fetchComplaints(filters) {
  return mockDb.getComplaints(filters);
}

export async function fetchComplaintById(id) {
  return mockDb.getComplaintById(id);
}

export async function submitComplaint(payload) {
  return mockDb.createComplaint(payload);
}

export async function updateStatus(id, status, note) {
  return mockDb.updateComplaintStatus(id, status, note);
}

export async function upvote(id) {
  return mockDb.upvoteComplaint(id);
}
