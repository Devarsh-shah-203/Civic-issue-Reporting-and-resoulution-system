import {
  getUserNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notification.service.js";

/*
|--------------------------------------------------------------------------
| Get All Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await getUserNotifications(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Notification By ID
|--------------------------------------------------------------------------
*/

export const getNotification = async (req, res, next) => {
  try {
    const notification = await getNotificationById(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export const readNotification = async (req, res, next) => {
  try {
    const notification = await markNotificationAsRead(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

export const readAllNotifications = async (req, res, next) => {
  try {
    const result = await markAllNotificationsAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export const removeNotification = async (req, res, next) => {
  try {
    const notification = await deleteNotification(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};