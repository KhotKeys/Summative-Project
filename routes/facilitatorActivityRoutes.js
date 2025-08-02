import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";
import {
  createActivityLog,
  getMyActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog,
} from "../controllers/facilitatorActivityController.js";

const router = express.Router();

// Apply middleware to all routes
router.use(verifyToken, checkRole("facilitator"));

// Activity log routes
router.post("/activity-logs", createActivityLog);
router.get("/activity-logs", getMyActivityLogs);
router.get("/activity-logs/:id", getActivityLogById);
router.patch("/activity-logs/:id", updateActivityLog);
router.delete("/activity-logs/:id", deleteActivityLog);

export default router;
