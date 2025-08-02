export const buildWhereClause = (filters, fieldMappings = {}) => {
  const where = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      const mappedField = fieldMappings[key] || key;
      where[mappedField] = value;
    }
  });

  return where;
};

export const sanitizeQueryParams = (queryParams) => {
  const sanitized = {};

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Convert string numbers to integers for specific fields
      if (["trimester", "year", "page", "limit"].includes(key)) {
        sanitized[key] = parseInt(value);
      } else {
        sanitized[key] = value;
      }
    }
  });

  return sanitized;
};

// Pagination

export const validatePaginationParams = (page, limit) => {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  if (pageNumber < 1) throw new Error("Page number must be greater than 0");
  if (limitNumber < 1) throw new Error("Limit must be greater than 0");
  if (limitNumber > 100) throw new Error("Limit cannot exceed 100");

  return {
    page: pageNumber,
    limit: limitNumber,
    offset: (pageNumber - 1) * limitNumber,
  };
};

export const formatPaginatedResponse = (data, page, limit, total) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const totalPages = Math.ceil(total / limitNumber);

  return {
    data,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalItems: total,
      itemsPerPage: limitNumber,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    },
  };
};

export const extractPaginationParams = (queryParams) => {
  const { page, limit, ...otherParams } = queryParams;
  return {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    filters: otherParams,
  };
};

export const buildAllocationFilters = (filters) => {
  const mappings = {
    trimester: "trimester",
    year: "year",
    moduleID: "moduleID",
    facilitatorID: "facilitatorID",
    cohortID: "cohortID",
    classID: "classID",
    modeID: "modeID",
  };

  return buildWhereClause(filters, mappings);
};

export const getAllocationOrderClause = () => [
  ["year", "DESC"],
  ["trimester", "ASC"],
];
