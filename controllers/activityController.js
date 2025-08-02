import db from "../models/index.js";

const { ActivityTracker, Facilitator, Allocation, Module, Cohort, Class } = db;

// Get activity logs
export const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, facilitatorId, allocationId } = req.query;
    const { id } = req.params;
    const offset = (page - 1) * limit;

    // Build where clause based on query parameters
    let whereClause = {};
    
    if (id) {
      whereClause.id = id;
    }
    
    if (facilitatorId) {
      whereClause.facilitatorId = facilitatorId;
    }
    
    if (allocationId) {
      whereClause.allocationId = allocationId;
    }

    // If user is a facilitator, only show their own logs
    if (req.user.role === "facilitator") {
      // We need to find allocations for this facilitator
      const facilitatorAllocations = await Allocation.findAll({
        where: { facilitatorID: req.user.id },
        attributes: ["id"]
      });
      const allocationIds = facilitatorAllocations.map(alloc => alloc.id);
      whereClause.allocationId = allocationIds;
    }

    const activities = await ActivityTracker.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Allocation,
          as: "Allocation",
          include: [
            {
              model: Facilitator,
              attributes: ["id", "name", "email"]
            },
            {
              model: Module,
              attributes: ["id", "name", "half"]
            },
            {
              model: Cohort,
              attributes: ["id", "name", "year"]
            },
            {
              model: Class,
              attributes: ["id", "name", "level"]
            }
          ]
        }
      ],
      order: [["week", "DESC"]]
    });

    res.status(200).json({
      message: "Activity logs retrieved successfully",
      activities: activities.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(activities.count / limit),
        totalActivities: activities.count,
        hasNext: page * limit < activities.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      error: "Failed to fetch activity logs",
      details: error.message
    });
  }
};
