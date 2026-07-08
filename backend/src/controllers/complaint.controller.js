import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createComplaintService,
    getAllComplaintsService,
    getComplaintByIdService,
    updateComplaintService,
    deleteComplaintService,
    searchComplaintsService,
    filterComplaintsService,
    upvoteComplaintService,
    getNearbyComplaintsService,
} from "../services/complaint.service.js";

export const createComplaint = asyncHandler(async (req, res) => {

  const complaint =
      await createComplaintService(req);

  return res.status(201).json(
      new ApiResponse(
          201,
          complaint,
          "Complaint created successfully."
      )
  );

});

export const getAllComplaints = asyncHandler(async (req, res) => {

  const complaints =
      await getAllComplaintsService(req);

  return res.status(200).json(

      new ApiResponse(
          200,
          complaints,
          "Complaints fetched successfully."
      )

  );

});


export const getComplaintById = asyncHandler(async (req, res) => {

  const complaint =
      await getComplaintByIdService(req);

  return res.status(200).json(

      new ApiResponse(
          200,
          complaint,
          "Complaint fetched successfully."
      )

  );

});


export const updateComplaint = asyncHandler(async (req, res) => {

  const complaint =
      await updateComplaintService(req);

  return res.status(200).json(
      new ApiResponse(
          200,
          complaint,
          "Complaint updated successfully."
      )
  );

});

export const deleteComplaint = asyncHandler(async (req, res) => {

  await deleteComplaintService(req);

  return res.status(200).json(
      new ApiResponse(
          200,
          null,
          "Complaint deleted successfully."
      )
  );

});


export const searchComplaints = asyncHandler(async (req, res) => {

  const complaints =
      await searchComplaintsService(req);

  return res.status(200).json(
      new ApiResponse(
          200,
          complaints,
          "Search completed successfully."
      )
  );

});


export const filterComplaints = asyncHandler(async (req, res) => {

  const complaints =
      await filterComplaintsService(req);

  return res.status(200).json(
      new ApiResponse(
          200,
          complaints,
          "Complaints filtered successfully."
      )
  );

});


export const upvoteComplaint = asyncHandler(async (req, res) => {

  const complaint =
      await upvoteComplaintService(req);

  return res.status(200).json(
      new ApiResponse(
          200,
          complaint,
          "Complaint upvoted successfully."
      )
  );

});



export const getNearbyComplaints = asyncHandler(async (req, res) => {

  const complaints =
      await getNearbyComplaintsService(req);

  return res.status(200).json(
      new ApiResponse(
          200,
          complaints,
          "Nearby complaints fetched successfully."
      )
  );

});