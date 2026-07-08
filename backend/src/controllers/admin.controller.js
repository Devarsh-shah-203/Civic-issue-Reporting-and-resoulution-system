import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    dashboardService,
    getAllComplaintsAdminService,
    getComplaintAdminService,
    assignComplaintService,
    updateComplaintStatusService,
    deleteComplaintAdminService,
    monthlyReportService,
    categoryReportService,
    resolutionAnalyticsService,
} from "../services/admin.service.js";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req, res) => {

    const dashboard = await dashboardService();

    return res.status(200).json(

        new ApiResponse(

            200,

            dashboard,

            "Dashboard fetched successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Get All Complaints
|--------------------------------------------------------------------------
*/

export const getAllComplaints = asyncHandler(async (req, res) => {

    const complaints =
        await getAllComplaintsAdminService(req);

    return res.status(200).json(

        new ApiResponse(

            200,

            complaints,

            "Complaints fetched successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Get Complaint
|--------------------------------------------------------------------------
*/

export const getComplaint = asyncHandler(async (req, res) => {

    const complaint =
        await getComplaintAdminService(req);

    return res.status(200).json(

        new ApiResponse(

            200,

            complaint,

            "Complaint fetched successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Assign Complaint
|--------------------------------------------------------------------------
*/

export const assignComplaint = asyncHandler(async (req, res) => {

    const complaint =
        await assignComplaintService(req);

    return res.status(200).json(

        new ApiResponse(

            200,

            complaint,

            "Complaint assigned successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Update Complaint Status
|--------------------------------------------------------------------------
*/

export const updateComplaintStatus = asyncHandler(async (req, res) => {

    const complaint =
        await updateComplaintStatusService(req);

    return res.status(200).json(

        new ApiResponse(

            200,

            complaint,

            "Complaint status updated successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Delete Complaint
|--------------------------------------------------------------------------
*/

export const deleteComplaint = asyncHandler(async (req, res) => {

    await deleteComplaintAdminService(req);

    return res.status(200).json(

        new ApiResponse(

            200,

            null,

            "Complaint deleted successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Monthly Report
|--------------------------------------------------------------------------
*/

export const monthlyReport = asyncHandler(async (req, res) => {

    const report =
        await monthlyReportService();

    return res.status(200).json(

        new ApiResponse(

            200,

            report,

            "Monthly report fetched successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Category Report
|--------------------------------------------------------------------------
*/

export const categoryReport = asyncHandler(async (req, res) => {

    const report =
        await categoryReportService();

    return res.status(200).json(

        new ApiResponse(

            200,

            report,

            "Category report fetched successfully."

        )

    );

});

/*
|--------------------------------------------------------------------------
| Resolution Analytics
|--------------------------------------------------------------------------
*/

export const resolutionAnalytics = asyncHandler(async (req, res) => {

    const analytics =
        await resolutionAnalyticsService();

    return res.status(200).json(

        new ApiResponse(

            200,

            analytics,

            "Resolution analytics fetched successfully."

        )

    );

});