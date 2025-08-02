import express from "express";
import {
  getMyCourses,
  getMyAllocations,
  getAllocationById,
  getMyAllocationsByTrimester,
  getMyAllocationsByMode,
} from "../controllers/facilitatorController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Get Facilitator assigned courses
router.get("/my-courses", verifyToken, checkRole("facilitator"), getMyCourses);
router.get(
  "/allocations",
  verifyToken,
  checkRole("facilitator"),
  getMyAllocations
);
router.get(
  "/allocations/:id",
  verifyToken,
  checkRole("facilitator"),
  getAllocationById
);

// Filtering routes for my allocations
router.get(
  "/allocations/filter/trimester/:trimester/year/:year",
  verifyToken,
  checkRole("facilitator"),
  getMyAllocationsByTrimester
);
router.get(
  "/allocations/filter/mode/:modeId",
  verifyToken,
  checkRole("facilitator"),
  getMyAllocationsByMode
);

export default router;
