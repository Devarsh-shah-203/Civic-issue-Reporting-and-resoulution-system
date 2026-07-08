import Notification from "../models/notification.model.js";

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const createNotification = async ({
    recipient,
    sender = null,
    complaint = null,
    type,
    title,
    message,
    metadata = {},
    session = null,
}) => {

    const notifications = await Notification.create(
        [
            {
                recipient,
                sender,
                complaint,
                type,
                title,
                message,
                metadata,
            },
        ],
        session ? { session } : {}
    );

    return notifications[0];

};

/*
|--------------------------------------------------------------------------
| Get User Notifications
|--------------------------------------------------------------------------
*/

export const getUserNotifications = async (
    userId,
    page = 1,
    limit = 10
) => {

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
        recipient: userId,
    })
        .populate("sender", "username email")
        .populate("complaint", "title status")
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    const totalNotifications =
        await Notification.countDocuments({
            recipient: userId,
        });

    return {

        notifications,

        currentPage: Number(page),

        totalPages: Math.ceil(
            totalNotifications / limit
        ),

        totalNotifications,

    };

};

/*
|--------------------------------------------------------------------------
| Get Notification By Id
|--------------------------------------------------------------------------
*/

export const getNotificationById = async (
    notificationId,
    userId
) => {

    return await Notification.findOne({

        _id: notificationId,

        recipient: userId,

    })

        .populate("sender", "username email")

        .populate("complaint", "title status");

};

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export const markNotificationAsRead = async (
    notificationId,
    userId
) => {

    return await Notification.findOneAndUpdate(

        {

            _id: notificationId,

            recipient: userId,

        },

        {

            isRead: true,

            readAt: new Date(),

        },

        {

            new: true,

        }

    );

};

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

export const markAllNotificationsAsRead = async (
    userId
) => {

    return await Notification.updateMany(

        {

            recipient: userId,

            isRead: false,

        },

        {

            isRead: true,

            readAt: new Date(),

        }

    );

};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export const deleteNotification = async (
    notificationId,
    userId
) => {

    return await Notification.findOneAndDelete({

        _id: notificationId,

        recipient: userId,

    });

};

/*
|--------------------------------------------------------------------------
| Delete Complaint Notifications
|--------------------------------------------------------------------------
*/

export const deleteComplaintNotifications = async (
    complaintId,
    session = null
) => {

    if (session) {

        return await Notification.deleteMany(

            {

                complaint: complaintId,

            },

            {

                session,

            }

        );

    }

    return await Notification.deleteMany({

        complaint: complaintId,

    });

};