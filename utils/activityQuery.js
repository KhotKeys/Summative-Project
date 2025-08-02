import db from "../models/index.js";
import {
  validatePaginationParams,
  formatPaginatedResponse,
} from "./queryUtils.js";

export const buildActivityQuery = (filters = {}, options = {}) => {
  const activityWhere = {};

  // Map filters to query parameters
  const filterMap = {
    id: (value) => value,
    weekNumber: (value) => parseInt(value),
    formativeOneGrading: (value) => value,
    formativeTwoGrading: (value) => value,
    summativeGrading: (value) => value,
    courseModeration: (value) => value,
    intranetSync: (value) => value,
    gradeBookStatus: (value) => value,
    allocationId: (value) => value,
  };

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      filterMap[key]
    ) {
      activityWhere[key] = filterMap[key](value);
    }
  });

  // Build includes with proper alias usage
  const includes = [
    {
      model: db.Allocation,
      as: "Allocation",
      ...(options.facilitatorId && {
        where: { facilitatorID: options.facilitatorId },
      }),
      include: [
        { model: db.Module, attributes: ["id", "name", "half"] },
        { model: db.Facilitator, attributes: ["id", "name", "email"] },
        { model: db.Cohort, attributes: ["id", "name", "intake", "program"] },
        { model: db.Class, attributes: ["id", "name"] },
        { model: db.Mode, attributes: ["id", "name"] },
      ],
    },
  ];

  return {
    where: activityWhere,
    include: includes,
    order: options.order || [
      ["weekNumber", "DESC"],
      ["updatedAt", "DESC"],
    ],
  };
};

export const executeQuery = async (baseQuery, pagination = null) => {
  try {
    if (pagination?.page && pagination?.limit) {
      const validatedPagination = validatePaginationParams(
        pagination.page,
        pagination.limit
      );
      const query = {
        ...baseQuery,
        limit: validatedPagination.limit,
        offset: validatedPagination.offset,
      };

      const { count, rows } = await db.ActivityTracker.findAndCountAll(query);
      return formatPaginatedResponse(
        rows,
        validatedPagination.page,
        validatedPagination.limit,
        count
      );
    }

    const logs = await db.ActivityTracker.findAll(baseQuery);
    return { data: logs, count: logs.length };
  } catch (error) {
    console.error("ActivityTracker Query Error:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
};
