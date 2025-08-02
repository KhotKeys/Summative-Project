import db from "../models/index.js";
import { extractPaginationParams } from "../utils/queryUtils.js";

// Common attributes for all queries
const ACTIVITY_ATTRIBUTES = [
  "id",
  "allocationId",
  "weekNumber",
  "attendance",
  "formativeOneGrading",
  "formativeTwoGrading",
  "summativeGrading",
  "courseModeration",
  "intranetSync",
  "gradeBookStatus",
  "comments",
  "submittedAt",
  "createdAt",
  "updatedAt",
];

// Query function
const queryActivityLogs = async (
  where = {},
  order = [["weekNumber", "DESC"]],
  limit = null
) => {
  try {
    const query = {
      where,
      attributes: ACTIVITY_ATTRIBUTES,
      order,
      ...(limit && { limit }),
    };

    const logs = await db.ActivityTracker.findAll(query);
    return { data: logs, count: logs.length };
  } catch (error) {
    console.error("Query error:", error);
    throw new Error("Failed to retrieve activity logs");
  }
};

// Basic CRUD operations
export const getAllActivityLogsService = (queryParams = {}) =>
  queryActivityLogs(
    {},
    [
      ["weekNumber", "DESC"],
      ["updatedAt", "DESC"],
    ],
    10
  );

export const getLogsByWeekService = (weekNumber, queryParams = {}) =>
  queryActivityLogs({ weekNumber: parseInt(weekNumber) }, [
    ["updatedAt", "DESC"],
  ]);

export const getLogsByCourseService = (allocationId, queryParams = {}) =>
  queryActivityLogs({ allocationId }, [["weekNumber", "ASC"]]);

export const getLogsByStatusService = (status, field, queryParams = {}) =>
  queryActivityLogs({ [field]: status });

export const getLogsByFacilitatorService = async (
  facilitatorId,
  queryParams = {}
) => {
  const allocationIds = await db.Allocation.findAll({
    where: { facilitatorID: facilitatorId },
    attributes: ["id"],
  }).then((allocations) => allocations.map((a) => a.id));

  return queryActivityLogs({
    allocationId: { [db.Sequelize.Op.in]: allocationIds },
  });
};

export const getActivityLogByIdService = async (logId) => {
  const log = await db.ActivityTracker.findByPk(logId, {
    attributes: ACTIVITY_ATTRIBUTES,
  });

  if (!log) throw new Error("Activity log not found");
  return log;
};

export const updateActivityLogStatusService = async (logId, updates) => {
  const allowedFields = [
    "formativeOneGrading",
    "formativeTwoGrading",
    "summativeGrading",
    "courseModeration",
    "intranetSync",
    "gradeBookStatus",
    "comments",
  ];

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  await db.ActivityTracker.update(filteredUpdates, { where: { id: logId } });
  return getActivityLogByIdService(logId);
};

// Compliance functions
export const getComplianceSummaryService = async (weekNumber) => {
  const week = parseInt(weekNumber);
  const [totalAllocations, submittedLogs] = await Promise.all([
    db.Allocation.count(),
    db.ActivityTracker.count({ where: { weekNumber: week } }),
  ]);

  return {
    weekNumber: week,
    totalAllocations,
    submittedLogs,
    missingLogs: totalAllocations - submittedLogs,
    complianceRate:
      totalAllocations > 0
        ? ((submittedLogs / totalAllocations) * 100).toFixed(2)
        : "0.00",
  };
};

export const getMissingSubmissionsService = async (weekNumber) => {
  const week = parseInt(weekNumber);
  const submittedAllocationIds = await db.ActivityTracker.findAll({
    where: { weekNumber: week },
    attributes: ["allocationId"],
  }).then((logs) => logs.map((log) => log.allocationId));

  return db.Allocation.findAll({
    where:
      submittedAllocationIds.length > 0
        ? {
            id: { [db.Sequelize.Op.notIn]: submittedAllocationIds },
          }
        : {},
    attributes: ["id", "facilitatorID"],
  }).then((data) => ({ data, count: data.length }));
};

export const getWeeklyComplianceReportService = async (startWeek, endWeek) => {
  const weeks = await Promise.all(
    Array.from({ length: endWeek - startWeek + 1 }, (_, i) =>
      getComplianceSummaryService(startWeek + i)
    )
  );

  return {
    reportPeriod: `Week ${startWeek} - Week ${endWeek}`,
    weeks,
    totalWeeks: weeks.length,
    averageCompliance:
      weeks.length > 0
        ? (
            weeks.reduce(
              (sum, week) => sum + parseFloat(week.complianceRate),
              0
            ) / weeks.length
          ).toFixed(2)
        : "0.00",
  };
};
