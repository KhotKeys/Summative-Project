import {
  getAllActivityLogsService,
  getLogsByFacilitatorService,
  getLogsByCourseService,
  getLogsByWeekService,
  getLogsByStatusService,
  getActivityLogByIdService,
  updateActivityLogStatusService,
  getComplianceSummaryService,
  getMissingSubmissionsService,
  getWeeklyComplianceReportService,
} from "../services/managerActivityService.js";

// Activity log controller
const handleRequest = async (req, res, serviceFn, successMessage) => {
  try {
    const result = await serviceFn();
    res.json({ message: successMessage, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActivityLogsController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getAllActivityLogsService(req.query),
    "All activity logs retrieved successfully"
  );

export const getLogsByFacilitatorController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getLogsByFacilitatorService(req.params.facilitatorId, req.query),
    `Activity logs for facilitator retrieved successfully`
  );

export const getLogsByCourseController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getLogsByCourseService(req.params.allocationId, req.query),
    `Activity logs for course retrieved successfully`
  );

export const getLogsByWeekController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getLogsByWeekService(req.params.weekNumber, req.query),
    `Activity logs for week ${req.params.weekNumber} retrieved successfully`
  );

export const getLogsByStatusController = async (req, res) => {
  const { status, field } = req.params;
  const validFields = [
    "formativeOneGrading",
    "formativeTwoGrading",
    "summativeGrading",
  ];

  if (!validFields.includes(field)) {
    return res.status(400).json({
      error: `Invalid field. Must be one of: ${validFields.join(", ")}`,
    });
  }

  handleRequest(
    req,
    res,
    () => getLogsByStatusService(status, field, req.query),
    `Activity logs with ${field} status '${status}' retrieved successfully`
  );
};

export const getActivityLogByIdController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getActivityLogByIdService(req.params.logId),
    "Activity log retrieved successfully"
  );

export const updateActivityLogStatusController = (req, res) =>
  handleRequest(
    req,
    res,
    () => updateActivityLogStatusService(req.params.logId, req.body),
    "Activity log status updated successfully"
  );

export const getComplianceSummaryController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getComplianceSummaryService(req.params.weekNumber),
    `Compliance summary for week ${req.params.weekNumber} retrieved successfully`
  );

export const getMissingSubmissionsController = (req, res) =>
  handleRequest(
    req,
    res,
    () => getMissingSubmissionsService(req.params.weekNumber),
    `Missing submissions for week ${req.params.weekNumber} retrieved successfully`
  );

export const getWeeklyComplianceReportController = (req, res) =>
  handleRequest(
    req,
    res,
    () =>
      getWeeklyComplianceReportService(
        parseInt(req.params.startWeek),
        parseInt(req.params.endWeek)
      ),
    `Weekly compliance report retrieved successfully`
  );
