import express from "express";

import {
    dashboard,
    getAllComplaints,
    getComplaint,
    assignComplaint,
    updateComplaintStatus,
    deleteComplaint,
    monthlyReport,
    categoryReport,
    resolutionAnalytics,
} from "../controllers/admin.controller.js";

import authenticate from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    authenticate,
    authorize("admin"),
    dashboard
);

/*
|--------------------------------------------------------------------------
| Complaint Management
|--------------------------------------------------------------------------
*/

router.get(
    "/complaints",
    authenticate,
    authorize("admin"),
    getAllComplaints
);

router.get(
    "/complaints/:id",
    authenticate,
    authorize("admin"),
    getComplaint
);

router.patch(
    "/complaints/:id/assign",
    authenticate,
    authorize("admin"),
    assignComplaint
);

router.patch(
    "/complaints/:id/status",
    authenticate,
    authorize("admin"),
    updateComplaintStatus
);

router.delete(
    "/complaints/:id",
    authenticate,
    authorize("admin"),
    deleteComplaint
);

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

router.get(
    "/reports/monthly",
    authenticate,
    authorize("admin"),
    monthlyReport
);

router.get(
    "/reports/category",
    authenticate,
    authorize("admin"),
    categoryReport
);

router.get(
    "/reports/resolution",
    authenticate,
    authorize("admin"),
    resolutionAnalytics
);

export default router;