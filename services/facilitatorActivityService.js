import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { buildActivityQuery, executeQuery } from "../utils/activityQuery.js";
import { extractPaginationParams } from "../utils/queryUtils.js";

// Verify facilitator access to allocation
const verifyAccess = async (facilitatorId, allocationId) => {
  const allocation = await db.Allocation.findOne({
    where: { id: allocationId, facilitatorID: facilitatorId },
  });
  if (!allocation) throw new Error("Allocation not found or not accessible");
  return allocation;
};

// CRUD OPERATIONS

export const createActivityLogService = async (facilitatorId, data) => {
  await verifyAccess(facilitatorId, data.allocationId);

  // Check for existing log
  const existing = await db.ActivityTracker.findOne({
    where: { allocationId: data.allocationId, weekNumber: data.weekNumber },
    attributes: ["id"],
  });
  if (existing) {
    throw new Error(`Activity log for week ${data.weekNumber} already exists`);
  }

  // Create new log
  const log = await db.ActivityTracker.create({
    id: uuidv4(),
    allocationId: data.allocationId,
    weekNumber: data.weekNumber,
    attendance: data.attendance || [],
    formativeOneGrading: data.formativeOneGrading || "Not Started",
    formativeTwoGrading: data.formativeTwoGrading || "Not Started",
    summativeGrading: data.summativeGrading || "Not Started",
    courseModeration: data.courseModeration || "Not Started",
    intranetSync: data.intranetSync || "Not Started",
    gradeBookStatus: data.gradeBookStatus || "Not Started",
    submittedAt: new Date(),
  });

  return getActivityLogByIdService(facilitatorId, log.id);
};

export const getFacilitatorActivityLogsService = async (
  facilitatorId,
  queryParams = {}
) => {
  try {
    // utility to extract pagination and filters
    const { page, limit, filters } = extractPaginationParams(queryParams);

    // Build query using utility function
    const baseQuery = buildActivityQuery(filters, {
      facilitatorId,
      order: [
        ["weekNumber", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });

    // Execute query with pagination
    const result = await executeQuery(baseQuery, { page, limit });

    return {
      message: "Activity logs retrieved successfully",
      ...result,
    };
  } catch (error) {
    console.error("Error in getFacilitatorActivityLogsService:", error);
    throw error;
  }
};

export const getActivityLogByIdService = async (facilitatorId, logId) => {
  // Use utility to build query
  const baseQuery = buildActivityQuery({ id: logId }, { facilitatorId });
  const log = await db.ActivityTracker.findOne(baseQuery);

  if (!log) throw new Error("Activity log not found or not accessible");
  return log;
};

export const updateActivityLogService = async (facilitatorId, logId, data) => {
  const log = await getActivityLogByIdService(facilitatorId, logId);

  await log.update({
    ...(data.attendance !== undefined && { attendance: data.attendance }),
    ...(data.formativeOneGrading && {
      formativeOneGrading: data.formativeOneGrading,
    }),
    ...(data.formativeTwoGrading && {
      formativeTwoGrading: data.formativeTwoGrading,
    }),
    ...(data.summativeGrading && { summativeGrading: data.summativeGrading }),
    ...(data.courseModeration && { courseModeration: data.courseModeration }),
    ...(data.intranetSync && { intranetSync: data.intranetSync }),
    ...(data.gradeBookStatus && { gradeBookStatus: data.gradeBookStatus }),
    ...(data.comments && { comments: data.comments }),
    updatedAt: new Date(),
  });

  return getActivityLogByIdService(facilitatorId, logId);
};

export const deleteActivityLogService = async (facilitatorId, logId) => {
  const log = await getActivityLogByIdService(facilitatorId, logId);
  await log.destroy();
  return { message: "Activity log deleted successfully" };
};

export const getActivityLogsByWeekService = async (
  facilitatorId,
  weekNumber,
  queryParams = {}
) => {
  const { page, limit } = extractPaginationParams(queryParams);
  const baseQuery = buildActivityQuery(
    { weekNumber: parseInt(weekNumber) },
    { facilitatorId }
  );

  const result = await executeQuery(baseQuery, { page, limit });
  return {
    message: `Activity logs for week ${weekNumber} retrieved successfully`,
    ...result,
  };
};

export const getActivityLogsByAllocationService = async (
  facilitatorId,
  allocationId,
  queryParams = {}
) => {
  await verifyAccess(facilitatorId, allocationId);

  const { page, limit } = extractPaginationParams(queryParams);
  const baseQuery = buildActivityQuery(
    { allocationId },
    {
      facilitatorId,
      order: [["weekNumber", "ASC"]],
    }
  );

  const result = await executeQuery(baseQuery, { page, limit });
  return {
    message: "Activity logs for allocation retrieved successfully",
    ...result,
  };
};
