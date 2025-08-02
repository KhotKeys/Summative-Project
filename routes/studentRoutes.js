import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
} from "../controllers/studentController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Profile management
router.get("/profile", verifyToken, checkRole("student"), getProfile);
router.patch("/profile", verifyToken, checkRole("student"), updateProfile);
router.put(
  "/profile/password",
  verifyToken,
  checkRole("student"),
  changePassword
);

// Dashboard and progress
router.get("/dashboard", verifyToken, checkRole("student"), getDashboard);
export default router;
