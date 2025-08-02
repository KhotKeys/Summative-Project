import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";
import db from "../models/index.js";

const { Module, Allocation, Facilitator, Cohort, Class } = db;

const router = express.Router();

// Test endpoint for admin
router.get("/test", (req, res) => {
  res.json({ 
    message: "Admin API is working!", 
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /api/admin/modules": "Get all modules",
      "POST /api/admin/modules": "Create module",
      "GET /api/admin/users": "Get all users",
      "GET /api/admin/stats": "Get system statistics"
    }
  });
});

// Get all modules
router.get("/modules", async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Allocation,
          as: "Allocations",
          required: false,
          include: [
            {
              model: Facilitator,
              attributes: ["id", "name", "email"],
              required: false
            },
            {
              model: Cohort,
              attributes: ["id", "name", "year"],
              required: false
            },
            {
              model: Class,
              attributes: ["id", "name", "level"],
              required: false
            }
          ]
        }
      ],
      order: [["name", "ASC"]]
    });

    res.status(200).json({
      message: "Modules retrieved successfully",
      modules: modules,
      count: modules.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({
      error: "Failed to fetch modules",
      details: error.message
    });
  }
});

// Create a new module
router.post("/modules", async (req, res) => {
  try {
    const { id, name, half, description, credits, active } = req.body;
    
    const module = await Module.create({
      id: id || `MOD${Date.now()}`,
      name: name || "New Module",
      half: half || "1",
      description: description || "Module description",
      credits: credits || 4,
      active: active !== undefined ? active : true
    });

    res.status(201).json({
      message: "Module created successfully",
      module: module,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({
      error: "Failed to create module",
      details: error.message
    });
  }
});

// Get system statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = {
      modules: await Module.count(),
      allocations: await Allocation.count(),
      facilitators: await Facilitator.count(),
      cohorts: await Cohort.count(),
      classes: await Class.count(),
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      message: "System statistics retrieved",
      stats: stats
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get statistics",
      details: error.message
    });
  }
});

// Test Redis notifications
router.post("/test-notification", async (req, res) => {
  try {
    const { notificationQueue } = await import("../config/redis.js");
    
    if (!notificationQueue) {
      return res.status(503).json({
        error: "Redis notification queue not available"
      });
    }

    // Add a test job to the notification queue
    const job = await notificationQueue.add("facilitator-reminder", {
      notificationId: `test-${Date.now()}`,
      facilitatorId: "test-facilitator",
      weekNumber: 1,
      email: "test@example.com",
      name: "Test Facilitator"
    });

    console.log(`🧪 [${new Date().toISOString()}] Test notification queued:`);
    console.log(`   🆔 Job ID: ${job.id}`);
    console.log(`   📧 Test email: test@example.com`);
    console.log(`   📅 Week: 1\n`);

    res.status(200).json({
      message: "Test notification queued successfully",
      jobId: job.id,
      timestamp: new Date().toISOString(),
      details: "Check the terminal for Redis processing logs"
    });
  } catch (error) {
    console.error("Test notification error:", error);
    res.status(500).json({
      error: "Failed to queue test notification",
      details: error.message
    });
  }
});

export default router;
