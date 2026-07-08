
import express from "express";

import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
  filterComplaints,
  upvoteComplaint,
  getNearbyComplaints,
} from "../controllers/complaint.controller.js";

import authenticate  from "../middleware/authmiddleware.js";
//import  authorize  from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/allcomplaints", getAllComplaints);

router.get("/search", searchComplaints);

router.get("/filter", filterComplaints);

router.get("/nearby", getNearbyComplaints);

router.get("/:id", getComplaintById);

/*
|--------------------------------------------------------------------------
| Citizen Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/create",
  authenticate,
  upload.array("images", 5),
  createComplaint
);

router.patch(
  "/:id",
  authenticate,
  upload.array("images", 5),
  updateComplaint
);

router.delete(
  "/:id",
  authenticate,
  deleteComplaint
);

router.post(
  "/:id/upvote",
  authenticate,
  upvoteComplaint
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

//router.delete(
//  "/admin/:id",
//  authenticate,
//  authorize("Admin"),
//  deleteComplaint
//);

export default router;