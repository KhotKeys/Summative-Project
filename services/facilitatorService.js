import db from "../models/index.js";
import {
  buildAllocationFilters,
  getAllocationOrderClause,
  sanitizeQueryParams,
  validatePaginationParams,
  formatPaginatedResponse,
  extractPaginationParams,
} from "../utils/queryUtils.js";

// Get facilitator's assigned courses with pagination
export const getFacilitatorCoursesService = async (
  facilitatorId,
  queryParams = {}
) => {
  const sanitizedParams = sanitizeQueryParams(queryParams);
  const { page, limit, filters } = extractPaginationParams(sanitizedParams);
  const where = {
    facilitatorID: facilitatorId,
    ...buildAllocationFilters(filters),
  };

  const baseQuery = {
    where,
    include: [
      { model: db.Module, attributes: ["id", "name", "half"] },
      {
        model: db.Cohort,
        attributes: ["id", "name", "intake", "program", "year"],
      },
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
      { model: db.Mode, attributes: ["id", "name"] },
    ],
    order: getAllocationOrderClause(),
  };

  // pagination
  if (page && limit) {
    const pagination = validatePaginationParams(page, limit);
    const query = {
      ...baseQuery,
      limit: pagination.limit,
      offset: pagination.offset,
    };

    const { count, rows } = await db.Allocation.findAndCountAll(query);
    return formatPaginatedResponse(
      rows,
      pagination.page,
      pagination.limit,
      count
    );
  }

  const allocations = await db.Allocation.findAll(baseQuery);
  return { data: allocations, count: allocations.length };
};

// Get my allocations
export const getMyAllocationsService = async (
  facilitatorId,
  queryParams = {}
) => {
  return getFacilitatorCoursesService(facilitatorId, queryParams);
};

// Get specific allocation by ID
export const getAllocationByIdService = async (facilitatorId, allocationId) => {
  const allocation = await db.Allocation.findOne({
    where: {
      id: allocationId,
      facilitatorID: facilitatorId,
    },
    include: [
      { model: db.Module, attributes: ["id", "name", "half"] },
      { model: db.Facilitator, attributes: ["id", "name", "email"] },
      {
        model: db.Cohort,
        attributes: ["id", "name", "intake", "program", "year"],
      },
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
      { model: db.Mode, attributes: ["id", "name"] },
    ],
  });

  if (!allocation) {
    throw new Error("Allocation not found or not assigned to you");
  }

  return allocation;
};

// Get my allocations by trimester
export const getMyAllocationsByTrimesterService = async (
  facilitatorId,
  trimester,
  year,
  queryParams = {}
) => {
  const filters = {
    trimester,
    year,
    ...queryParams,
  };
  return getMyAllocationsService(facilitatorId, filters);
};

// Get my allocations by mode
export const getMyAllocationsByModeService = async (
  facilitatorId,
  modeId,
  queryParams = {}
) => {
  const filters = {
    modeID: modeId,
    ...queryParams,
  };
  return getMyAllocationsService(facilitatorId, filters);
};
