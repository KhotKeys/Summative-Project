import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import {
  buildAllocationFilters,
  getAllocationOrderClause,
  sanitizeQueryParams,
  validatePaginationParams,
  formatPaginatedResponse,
  extractPaginationParams,
} from "../utils/queryUtils.js";

// Create allocation
export const createAllocationService = async (data) => {
  const allocation = await db.Allocation.create({
    id: uuidv4(),
    ...data,
  });

  return await getAllocationByIdService(allocation.id);
};

// Get all allocations with filters and pagination
export const getAllocationsService = async (queryParams = {}) => {
  const sanitizedParams = sanitizeQueryParams(queryParams);
  const { page, limit, filters } = extractPaginationParams(sanitizedParams);
  const where = buildAllocationFilters(filters);

  const baseQuery = {
    where,
    include: [
      { model: db.Module, attributes: ["id", "name", "half"] },
      { model: db.Facilitator, attributes: ["id", "name", "email", "status"] },
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

// Get allocation by ID
export const getAllocationByIdService = async (id) => {
  const allocation = await db.Allocation.findByPk(id, {
    include: [
      { model: db.Module, attributes: ["id", "name", "half"] },
      { model: db.Facilitator, attributes: ["id", "name", "email", "status"] },
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
    throw new Error("Allocation not found");
  }

  return allocation;
};

// Update allocation
export const updateAllocationService = async (id, data) => {
  const allocation = await db.Allocation.findByPk(id);
  if (!allocation) {
    throw new Error("Allocation not found");
  }

  await allocation.update(data);
  return await getAllocationByIdService(id);
};

// Delete allocation
export const deleteAllocationService = async (id) => {
  const allocation = await db.Allocation.findByPk(id);
  if (!allocation) {
    throw new Error("Allocation not found");
  }

  await allocation.destroy();
  return { message: "Allocation deleted successfully" };
};

// Filter by trimester
export const getAllocationsByTrimesterService = async (trimester, year) => {
  return getAllocationsService({ trimester, year });
};

// Filter by cohort
export const getAllocationsByCohortService = async (cohortId) => {
  return getAllocationsService({ cohortID: cohortId });
};

// Filter by facilitator
export const getAllocationsByFacilitatorService = async (facilitatorId) => {
  return getAllocationsService({ facilitatorID: facilitatorId });
};

// Filter by mode
export const getAllocationsByModeService = async (modeId) => {
  return getAllocationsService({ modeID: modeId });
};

// Filter by intake
export const getAllocationsByIntakeService = async (intake) => {
  return db.Allocation.findAll({
    include: [
      { model: db.Module, attributes: ["id", "name", "half"] },
      { model: db.Facilitator, attributes: ["id", "name", "email", "status"] },
      {
        model: db.Cohort,
        where: { intake },
        attributes: ["id", "name", "intake", "program", "year"],
        required: true,
      },
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
      { model: db.Mode, attributes: ["id", "name"] },
    ],
    order: getAllocationOrderClause(),
  });
};
