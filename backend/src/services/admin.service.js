import Complaint from "../models/complaint.model.js";
import User from "../models/user.js";

import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

import {
    createNotification,
    deleteComplaintNotifications,
} from "./notification.service.js";

import {
    createActivityLog,
    deleteComplaintLogs,
} from "./activityLog.service.js";

import {
    sendComplaintAssignedEmail,
    sendStatusChangedEmail,
} from "./email.service.js";

import {
    deleteMultipleImages,
} from "./cloudinary.service.js";

import Comment from "../models/comment.model.js";



import {
    ACTIVITY_ACTIONS,
    NOTIFICATION_TYPES,
} from "../constants/index.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardService = async () => {

    const [
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        todayComplaints,
        resolutionAnalytics,
    ] = await Promise.all([

        Complaint.countDocuments(),

        Complaint.countDocuments({
            status: "Pending",
        }),

        Complaint.countDocuments({
            status: "In Progress",
        }),

        Complaint.countDocuments({
            status: "Resolved",
        }),

        Complaint.countDocuments({
            status: "Rejected",
        }),

        Complaint.countDocuments({
            createdAt: {
                $gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                ),
            },
        }),

        Complaint.aggregate([

            {
                $match: {
                    status: "Resolved",
                    resolvedAt: {
                        $exists: true,
                    },
                },
            },

            {
                $project: {

                    resolutionTime: {

                        $divide: [

                            {
                                $subtract: [
                                    "$resolvedAt",
                                    "$createdAt",
                                ],
                            },

                            1000 * 60 * 60 * 24,

                        ],

                    },

                },

            },

            {

                $group: {

                    _id: null,

                    averageResolutionTime: {
                        $avg: "$resolutionTime",
                    },

                },

            },

        ]),

    ]);

    const resolutionRate =
        totalComplaints === 0
            ? 0
            : Number(
                  (
                      (resolvedComplaints /
                          totalComplaints) *
                      100
                  ).toFixed(2)
              );

    return {

        totalComplaints,

        pendingComplaints,

        inProgressComplaints,

        resolvedComplaints,

        rejectedComplaints,

        todayComplaints,

        resolutionRate,

        averageResolutionTime:

            resolutionAnalytics.length

                ? Number(
                      resolutionAnalytics[0]
                          .averageResolutionTime.toFixed(2)
                  )

                : 0,

    };

};

/*
|--------------------------------------------------------------------------
| Get All Complaints (Admin)
|--------------------------------------------------------------------------
*/

export const getAllComplaintsAdminService = async (
    req
) => {

    const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
    } = req.query;

    const skip =
        (Number(page) - 1) * Number(limit);

    const complaints = await Complaint.find()

        .populate(
            "createdBy",
            "username email"
        )

        .populate(
            "assignedTo",
            "username email role"
        )

        .sort(sort)

        .skip(skip)

        .limit(Number(limit));

    const total =
        await Complaint.countDocuments();

    return {

        complaints,

        currentPage: Number(page),

        totalPages: Math.ceil(
            total / Number(limit)
        ),

        totalComplaints: total,

    };

};

/*
|--------------------------------------------------------------------------
| Get Complaint By Id (Admin)
|--------------------------------------------------------------------------
*/

export const getComplaintAdminService = async (
    req
) => {

    const { id } = req.params;

    const complaint =
        await Complaint.findById(id)

            .populate(
                "createdBy",
                "username email phone"
            )

            .populate(
                "assignedTo",
                "username email role"
            )

            .populate({
                path: "comments",

                populate: {

                    path: "user",

                    select:
                        "username email",

                },

            });

    if (!complaint) {

        throw new ApiError(
            404,
            "Complaint not found."
        );

    }

    return complaint;

};

export const assignComplaintService = async (req) => {

    const { id } = req.params;

    const { assignedTo } = req.body;

    const admin = req.user;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found.");
    }

    const officer = await User.findById(assignedTo);

    if (!officer) {
        throw new ApiError(404, "Officer not found.");
    }

    complaint.assignedTo = officer._id;

    complaint.status = "In Progress";

    await complaint.save();

    await createActivityLog({

        complaint: complaint._id,

        performedBy: admin._id,

        action: ACTIVITY_ACTIONS.COMPLAINT_ASSIGNED,

        remarks: `Complaint assigned to ${officer.username}`,

    });

    await createNotification({

        recipient: complaint.createdBy,

        sender: admin._id,

        complaint: complaint._id,

        type: NOTIFICATION_TYPES.COMPLAINT_ASSIGNED,

        title: "Complaint Assigned",

        message: "Your complaint has been assigned to an officer.",

    });

    await sendComplaintAssignedEmail({

        email: complaint.createdBy.email,

        complaintTitle: complaint.title,

        officerName: officer.username,

    });

    try {

        getIO().emit("complaintAssigned", complaint);

    } catch {}

    return complaint;

};

export const updateComplaintStatusService = async (req) => {

    const { id } = req.params;

    const { status } = req.body;

    const admin = req.user;

    const complaint = await Complaint.findById(id)
        .populate("createdBy");

    if (!complaint) {

        throw new ApiError(
            404,
            "Complaint not found."
        );

    }

    complaint.status = status;

    if (status === "Resolved") {

        complaint.resolvedAt = new Date();

    }

    await complaint.save();

    await createActivityLog({

        complaint: complaint._id,

        performedBy: admin._id,

        action: ACTIVITY_ACTIONS.STATUS_CHANGED,

        remarks: `Status changed to ${status}`,

    });

    await createNotification({

        recipient: complaint.createdBy._id,

        sender: admin._id,

        complaint: complaint._id,

        type: NOTIFICATION_TYPES.STATUS_CHANGED,

        title: "Complaint Updated",

        message: `Complaint status changed to ${status}.`,

    });

    await sendComplaintStatusChangedEmail({

        email: complaint.createdBy.email,

        complaintTitle: complaint.title,

        status,

    });

    try {

        getIO().emit("statusUpdated", complaint);

    } catch {}

    return complaint;

};

export const deleteComplaintAdminService = async (req) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const { id } = req.params;

        const complaint = await Complaint.findById(id)
            .session(session);

        if (!complaint) {

            throw new ApiError(
                404,
                "Complaint not found."
            );

        }

        await deleteMultipleImages(
            complaint.images
        );

        await Comment.deleteMany(
            {
                complaint: complaint._id,
            },
            {
                session,
            }
        );

        await deleteComplaintNotifications(
            complaint._id,
            session
        );

        await deleteComplaintLogs(
            complaint._id,
            session
        );

        await Complaint.findByIdAndDelete(
            complaint._id,
            {
                session,
            }
        );

        await session.commitTransaction();

        session.endSession();

        return;

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

};

/*
|--------------------------------------------------------------------------
| Monthly Report
|--------------------------------------------------------------------------
*/

export const monthlyReportService = async () => {

    const report = await Complaint.aggregate([

        {
            $group: {

                _id: {

                    year: {
                        $year: "$createdAt",
                    },

                    month: {
                        $month: "$createdAt",
                    },

                },

                totalComplaints: {
                    $sum: 1,
                },

                resolvedComplaints: {

                    $sum: {

                        $cond: [

                            {
                                $eq: [
                                    "$status",
                                    "Resolved",
                                ],
                            },

                            1,

                            0,

                        ],

                    },

                },

                pendingComplaints: {

                    $sum: {

                        $cond: [

                            {
                                $eq: [
                                    "$status",
                                    "Pending",
                                ],
                            },

                            1,

                            0,

                        ],

                    },

                },

            },

        },

        {
            $sort: {

                "_id.year": 1,

                "_id.month": 1,

            },

        },

    ]);

    return report;

};

/*
|--------------------------------------------------------------------------
| Category Wise Report
|--------------------------------------------------------------------------
*/

export const categoryReportService = async () => {

    const report = await Complaint.aggregate([

        {

            $group: {

                _id: "$category",

                totalComplaints: {

                    $sum: 1,

                },

                resolvedComplaints: {

                    $sum: {

                        $cond: [

                            {

                                $eq: [

                                    "$status",

                                    "Resolved",

                                ],

                            },

                            1,

                            0,

                        ],

                    },

                },

                pendingComplaints: {

                    $sum: {

                        $cond: [

                            {

                                $eq: [

                                    "$status",

                                    "Pending",

                                ],

                            },

                            1,

                            0,

                        ],

                    },

                },

            },

        },

        {

            $sort: {

                totalComplaints: -1,

            },

        },

    ]);

    return report;

};

/*
|--------------------------------------------------------------------------
| Resolution Analytics
|--------------------------------------------------------------------------
*/

export const resolutionAnalyticsService = async () => {

    const analytics = await Complaint.aggregate([

        {

            $match: {

                status: "Resolved",

                resolvedAt: {

                    $exists: true,

                },

            },

        },

        {

            $project: {

                resolutionTime: {

                    $divide: [

                        {

                            $subtract: [

                                "$resolvedAt",

                                "$createdAt",

                            ],

                        },

                        1000 * 60 * 60 * 24,

                    ],

                },

            },

        },

        {

            $group: {

                _id: null,

                averageResolutionTime: {

                    $avg: "$resolutionTime",

                },

                fastestResolution: {

                    $min: "$resolutionTime",

                },

                slowestResolution: {

                    $max: "$resolutionTime",

                },

                resolvedComplaints: {

                    $sum: 1,

                },

            },

        },

    ]);

    if (!analytics.length) {

        return {

            averageResolutionTime: 0,

            fastestResolution: 0,

            slowestResolution: 0,

            resolvedComplaints: 0,

        };

    }

    return analytics[0];

};