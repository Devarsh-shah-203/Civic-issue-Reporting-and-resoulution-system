import express from "express";

import {
  assignTaskController,
  getMyTasksController,
  getTaskController,
  acceptTaskController,
  startTaskController,
  completeTaskController,
  verifyTaskController,
  rejectTaskController,
} from "../controllers/task.controller.js";

import authenticate from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Assign complaint to worker
router.post(
  "/assign",
  authenticate,
  authorize("admin"),
  assignTaskController
);

// Verify completed task
router.patch(
  "/:id/verify",
  authenticate,
  authorize("admin"),
  verifyTaskController
);

// Reject completed task
router.patch(
  "/:id/reject",
  authenticate,
  authorize("admin"),
  rejectTaskController
);

/*
|--------------------------------------------------------------------------
| Worker Routes
|--------------------------------------------------------------------------
*/

// Get logged-in worker tasks
router.get(
  "/my-tasks",
  authenticate,
  authorize("worker"),
  getMyTasksController
);

// Get single task
router.get(
  "/:id",
  authenticate,
  getTaskController
);

// Accept task
router.patch(
  "/:id/accept",
  authenticate,
  authorize("worker"),
  acceptTaskController
);

// Start task
router.patch(
  "/:id/start",
  authenticate,
  authorize("worker"),
  startTaskController
);

// Complete task
router.patch(
  "/:id/complete",
  authenticate,
  authorize("worker"),
  completeTaskController
);

export default router;