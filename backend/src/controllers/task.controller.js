import {
  assignTask,
  getWorkerTasks,
  getTaskById,
  acceptTask,
  startTask,
  completeTask,
  verifyTask,
  rejectTask,
} from "../services/task.service.js";

/*
|--------------------------------------------------------------------------
| Assign Task (Admin)
|--------------------------------------------------------------------------
*/

export const assignTaskController = async (req, res, next) => {
  try {
    const { complaintId, assignedTo, deadline, remarks } = req.body;

    const task = await assignTask({
      complaintId,
      assignedBy: req.user._id,
      assignedTo,
      deadline,
      remarks,
    });

    return res.status(201).json({
      success: true,
      message: "Task assigned successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get My Tasks (Worker)
|--------------------------------------------------------------------------
*/

export const getMyTasksController = async (req, res, next) => {
  try {
    const tasks = await getWorkerTasks(req.user._id);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Task By ID
|--------------------------------------------------------------------------
*/

export const getTaskController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Accept Task
|--------------------------------------------------------------------------
*/

export const acceptTaskController = async (req, res, next) => {
  try {
    const task = await acceptTask(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Task accepted.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Start Task
|--------------------------------------------------------------------------
*/

export const startTaskController = async (req, res, next) => {
  try {
    const task = await startTask(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Task started.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Complete Task
|--------------------------------------------------------------------------
*/

export const completeTaskController = async (
      req,
      res,
      next
) => {

  try {
    const { workerRemarks } = req.body;
    const task = await completeTask(
      req.params.id,
      req.user._id,
      workerRemarks
    );

    return res.status(200).json({
      success: true,
      message: "Task completed successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Verify Task (Admin)
|--------------------------------------------------------------------------
*/

export const verifyTaskController = async (req, res, next) => {
  try {
    const task = await verifyTask(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Task verified successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Reject Task (Admin)
|--------------------------------------------------------------------------
*/

export const rejectTaskController = async (req, res, next) => {
  try {
    const { remarks } = req.body;

    const task = await rejectTask(
      req.params.id,
      req.user._id,
      remarks
    );

    return res.status(200).json({
      success: true,
      message: "Task rejected.",
      task,
    });
  } catch (error) {
    next(error);
  }
};