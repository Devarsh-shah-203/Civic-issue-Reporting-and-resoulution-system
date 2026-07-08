import ActivityLog from "../models/activityLog.model.js";

/**
 * Create Activity Log
 */

export const createActivityLog = async ({
    complaint,
    performedBy,
    action,
    oldValue = null,
    newValue = null,
    remarks = "",
    ipAddress = null,
    device = null,
    session = null,
}) => {

    const activity = await ActivityLog.create(
        [
            {
                complaint,
                performedBy,
                action,
                oldValue,
                newValue,
                remarks,
                ipAddress,
                device,
            },
        ],
        session ? { session } : {}
    );

    return activity[0];
};

/**
 * Get Complaint Timeline
 */

export const getComplaintActivity = async (complaintId) => {

    return await ActivityLog.find({
        complaint: complaintId,
    })
        .populate("performedBy", "name email")
        .sort({ createdAt: 1 });

};

/**
 * Get User Activities
 */

export const getUserActivities = async (userId) => {

    return await ActivityLog.find({
        performedBy: userId,
    })
        .populate("complaint", "title status")
        .sort({
            createdAt: -1,
        });

};

/**
 * Delete Complaint Logs
 */

export const deleteComplaintLogs = async (
    complaintId,
    session = null
) => {

    if (session) {

        return await ActivityLog.deleteMany(
            {
                complaint: complaintId,
            },
            {
                session,
            }
        );

    }

    return await ActivityLog.deleteMany({
        complaint: complaintId,
    });

};