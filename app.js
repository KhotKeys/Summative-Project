import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import cohortRoutes from "./routes/cohortRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import setupRoutes from "./routes/managementData.js";
import studentRoutes from "./routes/studentRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import facilitatorRoutes from "./routes/facilitatorRoutes.js";
import managerActivityLogRoutes from "./routes/managerActivityLogRoutes.js";
import facilitatorActivityRoutes from "./routes/facilitatorActivityRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Course Management Platform Backend Service API");
});

app.use("/api/auth", authRoutes);

app.use("/api/cohorts", cohortRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/facilitators", facilitatorRoutes);
app.use("/api/managers/", managerActivityLogRoutes);
app.use("/api/facilitators/", facilitatorActivityRoutes);

export default app;
