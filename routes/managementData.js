import express from "express";
import {
  createModule,
  getAllModules,
} from "../controllers/moduleController.js";
import { createClass, getAllClasses } from "../controllers/classController.js";
import { createMode, getAllModes } from "../controllers/modeController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Module routes (Manager/System Admin)
router.post(
  "/modules",
  verifyToken,
  checkRole("manager", "system_admin"),
  createModule
);
router.get("/modules", getAllModules);

// Class routes
router.post(
  "/classes",
  verifyToken,
  checkRole("manager", "system_admin"),
  createClass
);
router.get("/classes", getAllClasses);

// Mode routes
router.post(
  "/modes",
  verifyToken,
  checkRole("manager", "system_admin"),
  createMode
);
router.get("/modes", getAllModes);

export default router;
