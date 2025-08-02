import express from "express";
import {
  createAllocation,
  getAllocations,
  getAllocationById,
  updateAllocation,
  deleteAllocation,
  getAllocationsByTrimester,
  getAllocationsByCohort,
  getAllocationsByIntake,
  getAllocationsByFacilitator,
  getAllocationsByMode,
} from "../controllers/managerController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Manager  CRUD operations
router.post(
  "/allocations",
  verifyToken,
  checkRole("manager"),
  createAllocation
);
router.get("/allocations", verifyToken, checkRole("manager"), getAllocations);
router.get(
  "/allocations/:id",
  verifyToken,
  checkRole("manager"),
  getAllocationById
);
router.patch(
  "/allocations/:id",
  verifyToken,
  checkRole("manager"),
  updateAllocation
);
router.delete(
  "/allocations/:id",
  verifyToken,
  checkRole("manager"),
  deleteAllocation
);

// Filtering routes
router.get(
  "/allocations/filter/trimester/:trimester/year/:year",
  verifyToken,
  checkRole("manager"),
  getAllocationsByTrimester
);
router.get(
  "/allocations/filter/cohort/:cohortId",
  verifyToken,
  checkRole("manager"),
  getAllocationsByCohort
);
router.get(
  "/allocations/filter/intake/:intake",
  verifyToken,
  checkRole("manager"),
  getAllocationsByIntake
);
router.get(
  "/allocations/filter/facilitator/:facilitatorId",
  verifyToken,
  checkRole("manager"),
  getAllocationsByFacilitator
);
router.get(
  "/allocations/filter/mode/:modeId",
  verifyToken,
  checkRole("manager"),
  getAllocationsByMode
);

export default router;
