import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";
import {
  triggerComplianceCheck,
  sendReminders,
} from "../controllers/notificationController.js";
import {
  getAllActivityLogsController,
  getLogsByFacilitatorController,
  getLogsByCourseController,
  getLogsByWeekController,
  getLogsByStatusController,
  getComplianceSummaryController,
  getMissingSubmissionsController,
  getActivityLogByIdController,
  updateActivityLogStatusController,
  getWeeklyComplianceReportController,
} from "../controllers/managerActivityController.js";

const router = express.Router();

// Apply middleware
router.use(verifyToken, checkRole("manager"));

// Activity logs
router.get("/activity-logs", getAllActivityLogsController);
router.get("/activity-logs/:logId", getActivityLogByIdController);
router.put("/activity-logs/:logId/status", updateActivityLogStatusController);

// Filtering
router.get("/facilitator/:facilitatorId/logs", getLogsByFacilitatorController);
router.get("/course/:allocationId/logs", getLogsByCourseController);
router.get("/week/:weekNumber/logs", getLogsByWeekController);
router.get("/status/:field/:status", getLogsByStatusController);

// Compliance
router.get("/compliance/week/:weekNumber", getComplianceSummaryController);
router.get(
  "/compliance/report/:startWeek/:endWeek",
  getWeeklyComplianceReportController
);
router.get("/missing-submissions/:weekNumber", getMissingSubmissionsController);

// Notification routes
router.post("/compliance/check/:weekNumber", triggerComplianceCheck);
router.post("/reminders/send/:weekNumber", sendReminders);

export default router;
