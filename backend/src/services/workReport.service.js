import WorkReport from "../models/workReport.model.js";
import Task from "../models/task.model.js";
import Complaint from "../models/complaint.model.js";
import ApiError from "../utils/ApiError.js";

import { createNotification } from "./notification.service.js";

/*
|--------------------------------------------------------------------------
| Submit Work Report (Worker)
|--------------------------------------------------------------------------
*/

export const submitWorkReport = async ({
  taskId,
  workerId,
  title,
  description,
}) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (task.assignedTo.toString() !== workerId.toString()) {
    throw new ApiError(
      403,
      "You are not assigned to this task."
    );
  }

  if (task.status !== "Working") {
    throw new ApiError(
      400,
      "Task must be in Working status."
    );
  }

  const alreadySubmitted = await WorkReport.findOne({
    task: taskId,
  });

  if (alreadySubmitted) {
    throw new ApiError(
      400,
      "Work report already submitted."
    );
  }

  const report = await WorkReport.create({
    task: task._id,
    complaint: task.complaint,
    worker: workerId,
    title,
    description,
  });

  task.status = "Completed";
  task.completedAt = new Date();

  await task.save();

  const complaint = await Complaint.findById(
    task.complaint
  );

  complaint.status = "Waiting For Verification";

  await complaint.save();

  await createNotification({
    recipient: task.assignedBy,
    sender: workerId,
    complaint: complaint._id,
    type: "Complaint Updated",
    title: "Work Completed",
    message:
      "Worker has submitted the work report. Please verify.",
  });

  return report;
};

/*
|--------------------------------------------------------------------------
| Get My Reports
|--------------------------------------------------------------------------
*/

export const getMyReports = async (workerId) => {
  return await WorkReport.find({
    worker: workerId,
  })
    .populate("complaint", "title status")
    .populate("task")
    .sort({
      createdAt: -1,
    });
};

/*
|--------------------------------------------------------------------------
| Get Report By Id
|--------------------------------------------------------------------------
*/

export const getReportById = async (
  reportId
) => {
  const report = await WorkReport.findById(reportId)
    .populate("worker", "username email")
    .populate("complaint")
    .populate("task");

  if (!report) {
    throw new ApiError(
      404,
      "Work report not found."
    );
  }

  return report;
};

/*
|--------------------------------------------------------------------------
| Approve Report (Admin)
|--------------------------------------------------------------------------
*/

export const approveReport = async (
  reportId,
  adminId,
  adminRemarks = ""
) => {
  const report = await WorkReport.findById(reportId);

  if (!report) {
    throw new ApiError(
      404,
      "Work report not found."
    );
  }

  report.status = "Approved";
  report.adminRemarks = adminRemarks;
  report.approvedAt = new Date();

  await report.save();

  const task = await Task.findById(report.task);

  task.status = "Verified";
  task.verifiedAt = new Date();

  await task.save();

  const complaint = await Complaint.findById(
    report.complaint
  );

  complaint.status = "Resolved";

  await complaint.save();

  /*
  |--------------------------------------------------------------------------
  | Notify Citizen
  |--------------------------------------------------------------------------
  */

  await createNotification({
    recipient: complaint.createdBy,
    sender: adminId,
    complaint: complaint._id,
    type: "Complaint Resolved",
    title: "Complaint Resolved",
    message:
      "Your complaint has been resolved successfully.",
  });

  /*
  |--------------------------------------------------------------------------
  | Notify Worker
  |--------------------------------------------------------------------------
  */

  await createNotification({
    recipient: report.worker,
    sender: adminId,
    complaint: complaint._id,
    type: "Complaint Updated",
    title: "Work Approved",
    message:
      "Your work report has been approved.",
  });

  return report;
};

/*
|--------------------------------------------------------------------------
| Reject Report (Admin)
|--------------------------------------------------------------------------
*/

export const rejectReport = async (
  reportId,
  adminId,
 adminRemarks
) => {
  const report = await WorkReport.findById(reportId);

  if (!report) {
    throw new ApiError(
      404,
      "Work report not found."
    );
  }

  report.status = "Rejected";
  report.adminRemarks = adminRemarks;
  report.rejectedAt = new Date();

  await report.save();

  const task = await Task.findById(report.task);

  task.status = "Working";

  await task.save();

  const complaint = await Complaint.findById(
    report.complaint
  );

  complaint.status = "In Progress";

  await complaint.save();

  await createNotification({
    recipient: report.worker,
    sender: adminId,
    complaint: complaint._id,
    type: "Complaint Updated",
    title: "Work Report Rejected",
    message:
      "Please review the admin remarks and resubmit your work.",
  });

  return report;
};