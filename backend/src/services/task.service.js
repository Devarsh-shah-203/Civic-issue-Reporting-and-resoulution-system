import Task from "../models/task.model.js";
import Complaint from "../models/complaint.model.js";
import ApiError from "../utils/ApiError.js";

import { createNotification } from "./notification.service.js";

/*
|--------------------------------------------------------------------------
| Assign Task
|--------------------------------------------------------------------------
*/

export const assignTask = async ({
  complaintId,
  assignedBy,
  assignedTo,
  deadline = null,
  remarks = "",
}) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new ApiError(404, "Complaint not found.");
  }

  const alreadyAssigned = await Task.findOne({
    complaint: complaintId,
    status: {
      $in: ["Assigned", "Accepted", "Working"],
    },
  });

  if (alreadyAssigned) {
    throw new ApiError(
      400,
      "This complaint is already assigned."
    );
  }

  const task = await Task.create({
    complaint: complaintId,
    assignedBy,
    assignedTo,
    deadline,
    remarks,
    priority: complaint.priority,
  });

  complaint.assignedTo = assignedTo;
  complaint.status = "In Progress";

  await complaint.save();

  await createNotification({
    recipient: assignedTo,
    sender: assignedBy,
    complaint: complaintId,
    type: "Complaint Assigned",
    title: "New Task Assigned",
    message: `You have been assigned complaint "${complaint.title}".`,
  });

  return task;
};

/*
|--------------------------------------------------------------------------
| Get Worker Tasks
|--------------------------------------------------------------------------
*/

export const getWorkerTasks = async (workerId) => {
  return await Task.find({
    assignedTo: workerId,
  })
    .populate("complaint")
    .populate("assignedBy", "username email")
    .sort({
      createdAt: -1,
    });
};

/*
|--------------------------------------------------------------------------
| Get Task By ID
|--------------------------------------------------------------------------
*/

export const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate("complaint")
    .populate("assignedBy", "username email")
    .populate("assignedTo", "username email");

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task;
};

/*
|--------------------------------------------------------------------------
| Accept Task
|--------------------------------------------------------------------------
*/

export const acceptTask = async (
  taskId,
  workerId
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (task.assignedTo.toString() !== workerId.toString()) {
    throw new ApiError(
      403,
      "You are not allowed."
    );
  }

  task.status = "Accepted";
  task.acceptedAt = new Date();

  await task.save();

  return task;
};

/*
|--------------------------------------------------------------------------
| Start Task
|--------------------------------------------------------------------------
*/

export const startTask = async (
  taskId,
  workerId
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (task.assignedTo.toString() !== workerId.toString()) {
    throw new ApiError(
      403,
      "You are not allowed."
    );
  }

  task.status = "Working";
  task.startedAt = new Date();

  await task.save();

  return task;
};

/*
|--------------------------------------------------------------------------
| Complete Task
|--------------------------------------------------------------------------
*/

export const completeTask = async (
  taskId,
  workerId,
 workerRemarks
) => {

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (task.assignedTo.toString() !== workerId.toString()) {
    throw new ApiError(
      403,
      "You are not allowed."
    );
  }

  task.status = "Completed";

  task.completedAt = new Date();

  task.workerRemarks = workerRemarks;

  await task.save();

  await createNotification({
    recipient: task.assignedBy,
    sender: workerId,
    complaint: task.complaint,
    type: "Complaint Updated",
    title: "Task Completed",
    message:
      "Worker completed the assigned task. Please verify.",
  });

  return task;

};

/*
|--------------------------------------------------------------------------
| Verify Task
|--------------------------------------------------------------------------
*/

export const verifyTask = async (
  taskId,
  adminId
) => {

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(
      404,
      "Task not found."
    );
  }

  task.status = "Verified";

  task.verifiedAt = new Date();

  await task.save();

  const complaint =
      await Complaint.findById(task.complaint);

  complaint.status = "Resolved";

  await complaint.save();

  await createNotification({

      recipient: complaint.createdBy,
      sender: adminId,
      complaint: complaint._id,
      type: "Complaint Resolved",
      title: "Complaint Resolved",
      message:
        `Your complaint has been resolved.\n\nWorker Remarks:\n${task.workerRemarks}`,
  });

  return task;

};

/*
|--------------------------------------------------------------------------
| Reject Task
|--------------------------------------------------------------------------
*/

export const rejectTask = async (
  taskId,
  adminId,
  remarks
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  task.status = "Rejected";
  task.remarks = remarks;

  await task.save();

  await createNotification({
    recipient: task.assignedTo,
    sender: adminId,
    complaint: task.complaint,
    type: "Complaint Updated",
    title: "Task Rejected",
    message:
      "Please rework and submit again.",
  });

  return task;
};