import express from "express";

import {
  submitWorkReportController,
  getMyReportsController,
  getReportController,
  approveReportController,
  rejectReportController,
} from "../controllers/workReport.controller.js";

import authenticate from "../middleware/authMiddleware.js";
import {authorize} from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Worker Routes
|--------------------------------------------------------------------------
*/

// Submit work report
router.post(
  "/submit",
  authenticate,
  authorize("worker"),
  submitWorkReportController
);

// Get logged-in worker reports
router.get(
  "/my-reports",
  authenticate,
  authorize("worker"),
  getMyReportsController
);

/*
|--------------------------------------------------------------------------
| Shared Route
|--------------------------------------------------------------------------
*/

// Get report by ID
router.get(
  "/:id",
  authenticate,
  getReportController
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Approve report
router.patch(
  "/:id/approve",
  authenticate,
  authorize("admin"),
  approveReportController
);

// Reject report
router.patch(
  "/:id/reject",
  authenticate,
  authorize("admin"),
  rejectReportController
);

export default router;