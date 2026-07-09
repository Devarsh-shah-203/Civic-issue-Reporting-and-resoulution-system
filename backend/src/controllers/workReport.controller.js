import {
  submitWorkReport,
  getMyReports,
  getReportById,
  approveReport,
  rejectReport,
} from "../services/workReport.service.js";

/*
|--------------------------------------------------------------------------
| Submit Work Report (Worker)
|--------------------------------------------------------------------------
*/

export const submitWorkReportController = async (
  req,
  res,
  next
) => {
  try {
    const { taskId, title, description } = req.body;

    const report = await submitWorkReport({
      taskId,
      workerId: req.user._id,
      title,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Work report submitted successfully.",
      report,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get My Work Reports
|--------------------------------------------------------------------------
*/

export const getMyReportsController = async (
  req,
  res,
  next
) => {
  try {
    const reports = await getMyReports(req.user._id);

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Work Report By Id
|--------------------------------------------------------------------------
*/

export const getReportController = async (
  req,
  res,
  next
) => {
  try {
    const report = await getReportById(req.params.id);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Approve Work Report (Admin)
|--------------------------------------------------------------------------
*/

export const approveReportController = async (
  req,
  res,
  next
) => {
  try {
    const { adminRemarks } = req.body;

    const report = await approveReport(
      req.params.id,
      req.user._id,
      adminRemarks
    );

    return res.status(200).json({
      success: true,
      message: "Work report approved successfully.",
      report,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Reject Work Report (Admin)
|--------------------------------------------------------------------------
*/

export const rejectReportController = async (
  req,
  res,
  next
) => {
  try {
    const { adminRemarks } = req.body;

    const report = await rejectReport(
      req.params.id,
      req.user._id,
      adminRemarks
    );

    return res.status(200).json({
      success: true,
      message: "Work report rejected.",
      report,
    });
  } catch (error) {
    next(error);
  }
};