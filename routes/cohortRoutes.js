import express from "express";
import {
  createCohort,
  getAllCohorts,
  getCohortById,
  updateCohort,
  deleteCohort,
} from "../controllers/cohortController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Create cohort (Manager/Admin only)
router.post(
  "/",
  verifyToken,
  checkRole("manager", "system_admin"),
  createCohort
);

// Get all cohorts
router.get("/", verifyToken, getAllCohorts);

// Get cohort by ID
router.get("/:id", verifyToken, getCohortById);

// Update cohort (Manager/Admin only)
router.put(
  "/:id",
  verifyToken,
  checkRole("manager", "system_admin"),
  updateCohort
);

// Delete cohort (Manager/Admin only)
router.delete(
  "/:id",
  verifyToken,
  checkRole("manager", "system_admin"),
  deleteCohort
);

export default router;
