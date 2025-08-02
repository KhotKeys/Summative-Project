import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";
import { getActivityLogs } from "../controllers/activityController.js";

const router = express.Router();

// Test endpoint for activities
router.get("/test", (req, res) => {
  res.json({ 
    message: "Activities API is working!", 
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /api/activities/logs": "Get activity logs (public)",
      "POST /api/activities/logs": "Create activity log (public)",
      "GET /api/activities/protected/logs": "Get activity logs (auth required)"
    }
  });
});

// Public endpoints for testing (no authentication required)
router.get("/logs", getActivityLogs);

// Allow POST for creating activity logs without auth for testing
router.post("/logs", async (req, res) => {
  try {
    // Simple activity log creation for testing
    const activityData = {
      allocationId: req.body.allocationId || 6,
      weekNumber: req.body.weekNumber || 1,
      attendance: req.body.attendance || [true, false, true, true],
      formativeOneGrading: req.body.formativeOneGrading || "Done",
      formativeTwoGrading: req.body.formativeTwoGrading || "Pending",
      summativeGrading: req.body.summativeGrading || "Not Started",
      courseModeration: req.body.courseModeration || "Not Started",
      intranetSync: req.body.intranetSync || "Done",
      gradeBookStatus: req.body.gradeBookStatus || "Pending",
      notes: req.body.notes || "Week 1 activities completed"
    };

    res.status(201).json({
      message: "Activity log created successfully (test mode)",
      activity: activityData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to create activity log", 
      details: error.message 
    });
  }
});

// Protected endpoints (require authentication)
router.get(
  "/protected/logs",
  verifyToken,
  checkRole("manager", "facilitator"),
  getActivityLogs
);

router.get(
  "/protected/logs/:id",
  verifyToken,
  checkRole("manager", "facilitator"),
  getActivityLogs
);

export default router;
