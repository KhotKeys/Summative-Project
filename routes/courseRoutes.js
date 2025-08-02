import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";
import { getAllCourses, getCourseOfferings } from "../controllers/courseController.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ 
    message: "Courses API is working!", 
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /api/courses/": "Get all courses (public)",
      "GET /api/courses/offerings": "Get course offerings (public)", 
      "GET /api/courses/protected/": "Get all courses (auth required)",
      "GET /api/courses/protected/offerings": "Get course offerings (auth required)"
    }
  });
});

// Public endpoints for testing (no authentication required)
router.get("/offerings", getCourseOfferings);
router.get("/", getAllCourses);

// Protected endpoints (require authentication)
router.get(
  "/protected/offerings",
  verifyToken,
  checkRole("manager", "facilitator"),
  getCourseOfferings
);

router.get(
  "/protected/",
  verifyToken,
  checkRole("system_admin", "manager"),
  getAllCourses
);

export default router;
