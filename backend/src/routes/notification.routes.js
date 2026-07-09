import express from "express";

import {
  getNotifications,
  getNotification,
  readNotification,
  readAllNotifications,
  removeNotification,
} from "../controllers/notification.controller.js";

import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/

// Get all notifications
router.get("/", authenticate, getNotifications);

// Get one notification
router.get("/:id", authenticate, getNotification);

// Mark one notification as read
router.patch("/:id/read", authenticate, readNotification);

// Mark all notifications as read
router.patch("/read-all", authenticate, readAllNotifications);

// Delete notification
router.delete("/:id", authenticate, removeNotification);

export default router;