import express from "express";
import {
  loginSystemAdmin,
  approveUser,
  registerManager,
  loginManager,
  registerFacilitator,
  loginFacilitator,
  registerStudentController,
  loginStudentController,
  generalLogin,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// General login endpoint (auto-detects user type)
router.post("/login", generalLogin);

// System Admin routes
router.post("/system-admin/login", loginSystemAdmin);

// Approval routes (System Admin only)
router.patch(
  "/approve/:role/:id",
  verifyToken,
  checkRole("system_admin"),
  approveUser
);

// Manager routes
router.post("/manager/signup", registerManager);
router.post("/manager/login", loginManager);

// Facilitator routes
router.post("/facilitator/signup", registerFacilitator);
router.post("/facilitator/login", loginFacilitator);

// Student routes
router.post("/student/signup", registerStudentController);
router.post("/student/login", loginStudentController);

export default router;
