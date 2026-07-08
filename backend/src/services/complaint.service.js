import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Complaint from "../models/complaint.model.js";
import ApiError from "../utils/ApiError.js";

import {
    uploadMultipleImages,
} from "./cloudinary.service.js";

import {
    detectDuplicateComplaint,
} from "./duplicateDetection.service.js";

import {
    calculatePriority,
} from "./priority.service.js";

import {
    createActivityLog,
} from "./activityLog.service.js";

import {
    createNotification,
} from "./notification.service.js";

import {
    sendComplaintCreatedEmail,
} from "./email.service.js";

//import { getIO } from "../config/socket.js";

import {
    ACTIVITY_ACTIONS,
    NOTIFICATION_TYPES,
} from "../constants/index.js";

import {
    deleteComplaintLogs,
} from "./activityLog.service.js";

import {
    deleteComplaintNotifications,
} from "./notification.service.js";

import {
    recalculatePriority,
} from "./priority.service.js";

import {
    getNearbyComplaints,
} from "./duplicateDetection.service.js";

import {
    deleteMultipleImages,
} from "./cloudinary.service.js";


export const createComplaintService = async (req) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const { body, files, user } = req;

        const {
            title,
            description,
            category,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
        } = body;

        if (
            !title ||
            !description ||
            !category ||
            !address ||
            !city ||
            !state ||
            !latitude ||
            !longitude
        ) {
            throw new ApiError(
                400,
                "Please provide all required fields."
            );
        }

        //const images = 
           // await uploadMultipleImages(files);

        const duplicateComplaint =
            await detectDuplicateComplaint({

                title,

                description,

                category,

                latitude,

                longitude,

            });

        const priority =
            await calculatePriority({

                category,

                duplicateComplaint,

            });

        const complaints =
            await Complaint.create(
                [
                    {

                        title,

                        description,

                        category,

                       // images,

                        priority,

                        createdBy: user._id,

                        isDuplicate:
                            Boolean(
                                duplicateComplaint
                            ),

                        duplicateOf:
                            duplicateComplaint?._id || null,

                        location: {

                            address,

                            city,

                            state,

                            pincode,

                            coordinates: {

                                type: "Point",

                                coordinates: [
                                    Number(longitude),
                                    Number(latitude),
                                ],

                            },

                        },

                    },
                ],
                { session }
            );

        const complaint = complaints[0];

        /*
        |--------------------------------------------------------------------------
        | Activity Log
        |--------------------------------------------------------------------------
        */

        await createActivityLog({

            complaint: complaint._id,

            performedBy: user._id,

            action: ACTIVITY_ACTIONS.COMPLAINT_CREATED,

            newValue: {
                status: complaint.status,
                priority: complaint.priority,
            },

            remarks: "Complaint created successfully.",

            ipAddress: req.ip,

            device: req.headers["user-agent"],

            session,

        });

        /*
        |--------------------------------------------------------------------------
        | Notification
        |--------------------------------------------------------------------------
        */

        await createNotification({

            recipient: user._id,

            sender: user._id,

            complaint: complaint._id,

            type: NOTIFICATION_TYPES.COMPLAINT_CREATED,

            title: "Complaint Submitted",

            message:
                "Your complaint has been submitted successfully.",

            session,

        });

        /*
        |--------------------------------------------------------------------------
        | Commit Transaction
        |--------------------------------------------------------------------------
        */

       

        /*
       
        | Send Email
       */
        await sendComplaintCreatedEmail({

            email: user.email,

            name: user.username,

            complaintTitle: complaint.title,

        });
        
        await session.commitTransaction();

        session.endSession();

        /*
        |--------------------------------------------------------------------------
        | Socket Event
        |--------------------------------------------------------------------------
        */

        

        return complaint;

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
    
        console.error(error);
        throw error;
      

    }

};

export const getAllComplaintsService = async (req) => {

    const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const complaints = await Complaint.find()

        .populate("createdBy", "username email")

        .populate("assignedTo", "username email")

        .sort(sort)

        .skip(skip)

        .limit(Number(limit));

    const total = await Complaint.countDocuments();

    return {

        complaints,

        currentPage: Number(page),

        totalPages: Math.ceil(total / Number(limit)),

        totalComplaints: total,

    };

};

export const getComplaintByIdService = async (req) => {

    const { id } = req.params;

    const complaint = await Complaint.findById(id)

        .populate(
            "createdBy",
            "username email"
        )

        .populate(
            "assignedTo",
            "username email"
        )

        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username email",
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

export const updateComplaintService = async (req) => {

    const { id } = req.params;

    const { body, files, user } = req;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found.");
    }

    if (complaint.createdBy.toString() !== user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this complaint."
        );
    }

    if (files?.length) {

        await deleteMultipleImages(complaint.images);

        complaint.images = await uploadMultipleImages(files);

    }

    Object.assign(complaint, body);

    await complaint.save();

    await createActivityLog({

        complaint: complaint._id,

        performedBy: user._id,

        action: ACTIVITY_ACTIONS.COMPLAINT_UPDATED,

        remarks: "Complaint updated.",

    });

    return complaint;

};

export const searchComplaintsService = async (req) => {

    const { q } = req.query;

    if (!q) {
        throw new ApiError(
            400,
            "Search keyword is required."
        );
    }

    const complaints = await Complaint.find({

        $text: {
            $search: q,
        },

    })

        .populate("createdBy", "username email")

        .populate("assignedTo", "username email")

        .sort({
            score: {
                $meta: "textScore",
            },
        });

    return complaints;

};

export const deleteComplaintService = async (req) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const { id } = req.params;

        const { user } = req;

        const complaint = await Complaint.findById(id).session(session);

        if (!complaint) {
            throw new ApiError(
                404,
                "Complaint not found."
            );
        }

        if (
            complaint.createdBy.toString() !== user._id.toString()
        ) {
            throw new ApiError(
                403,
                "You are not authorized to delete this complaint."
            );
        }

        await deleteMultipleImages(
            complaint.images
        );

        await Notification.deleteMany(
            {
                complaint: complaint._id,
            },
            { session }
        );

        await ActivityLog.deleteMany(
            {
                complaint: complaint._id,
            },
            { session }
        );

        await Comment.deleteMany(
            {
                complaint: complaint._id,
            },
            { session }
        );

        await Complaint.findByIdAndDelete(
            complaint._id,
            { session }
        );

        await session.commitTransaction();

        session.endSession();

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

};

export const filterComplaintsService = async (req) => {

    const {
        category,
        status,
        priority,
        city,
    } = req.query;

    const filter = {};

    if (category) {
        filter.category = category;
    }

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    if (city) {
        filter["location.city"] = city;
    }

    return await Complaint.find(filter)

        .populate("createdBy", "username email")

        .populate("assignedTo", "username email")

        .sort({
            createdAt: -1,
        });

};

export const upvoteComplaintService = async (req) => {

    const { id } = req.params;

    const { user } = req;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
        throw new ApiError(
            404,
            "Complaint not found."
        );
    }

    const alreadyUpvoted =
        complaint.upvotes.includes(user._id);

    if (alreadyUpvoted) {
        throw new ApiError(
            400,
            "Complaint already upvoted."
        );
    }

    complaint.upvotes.push(user._id);

    complaint.priority =
        await recalculatePriority(complaint);

    await complaint.save();

    await createActivityLog({

        complaint: complaint._id,

        performedBy: user._id,

        action: ACTIVITY_ACTIONS.UPVOTED,

        remarks: "Complaint upvoted.",

    });

    return complaint;

};

export const getNearbyComplaintsService = async (req) => {

    const {
        latitude,
        longitude,
        radius = 1000,
    } = req.query;

    if (!latitude || !longitude) {

        throw new ApiError(
            400,
            "Latitude and longitude are required."
        );

    }

    return await getNearbyComplaints({

        latitude,

        longitude,

        radius,

    });

};