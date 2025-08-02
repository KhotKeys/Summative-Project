import { jest } from "@jest/globals";
import {
  createAllocationService,
  getAllocationsService,
  getAllocationByIdService,
  updateAllocationService,
  deleteAllocationService,
} from "../services/managerService.js";

jest.mock("uuid", () => ({ v4: () => "mock-allocation-uuid" }));

jest.mock("../utils/queryUtils.js", () => ({
  buildAllocationFilters: jest.fn(),
  getAllocationOrderClause: jest.fn(),
  sanitizeQueryParams: jest.fn(),
  validatePaginationParams: jest.fn(),
  formatPaginatedResponse: jest.fn(),
  extractPaginationParams: jest.fn(),
}));

describe("ManagerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createAllocationService", () => {
    test("should create allocation successfully", async () => {
      const mockAllocation = {
        id: "mock-allocation-uuid",
        moduleID: "mod-1",
        facilitatorID: "fac-1",
        cohortID: "coh-1",
      };
      const mockFullAllocation = {
        ...mockAllocation,
        Module: { id: "mod-1", name: "Test Module" },
        Facilitator: { id: "fac-1", name: "Test Facilitator" },
      };

      const { default: db } = await import("../models/index.js");

      db.Allocation.create.mockResolvedValue(mockAllocation);
      db.Allocation.findByPk.mockResolvedValue(mockFullAllocation);

      const result = await createAllocationService({
        moduleID: "mod-1",
        facilitatorID: "fac-1",
        cohortID: "coh-1",
      });

      expect(db.Allocation.create).toHaveBeenCalledWith({
        id: "mock-allocation-uuid",
        moduleID: "mod-1",
        facilitatorID: "fac-1",
        cohortID: "coh-1",
      });
      expect(result).toEqual(mockFullAllocation);
    });
  });

  describe("getAllocationsService", () => {
    test("should get allocations with pagination", async () => {
      const mockAllocations = [
        { id: "alloc-1", moduleID: "mod-1" },
        { id: "alloc-2", moduleID: "mod-2" },
      ];

      const {
        sanitizeQueryParams,
        extractPaginationParams,
        buildAllocationFilters,
        getAllocationOrderClause,
        validatePaginationParams,
        formatPaginatedResponse,
      } = await import("../utils/queryUtils.js");
      const { default: db } = await import("../models/index.js");

      sanitizeQueryParams.mockReturnValue({ page: 1, limit: 10 });
      extractPaginationParams.mockReturnValue({
        page: 1,
        limit: 10,
        filters: {},
      });
      buildAllocationFilters.mockReturnValue({});
      getAllocationOrderClause.mockReturnValue([["createdAt", "DESC"]]);
      validatePaginationParams.mockReturnValue({
        page: 1,
        limit: 10,
        offset: 0,
      });
      formatPaginatedResponse.mockReturnValue({
        data: mockAllocations,
        pagination: { page: 1, limit: 10, total: 2 },
      });

      db.Allocation.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockAllocations,
      });

      const result = await getAllocationsService({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockAllocations);
    });

    test("should get allocations without pagination", async () => {
      const mockAllocations = [
        { id: "alloc-1", moduleID: "mod-1" },
        { id: "alloc-2", moduleID: "mod-2" },
      ];

      const {
        sanitizeQueryParams,
        extractPaginationParams,
        buildAllocationFilters,
        getAllocationOrderClause,
      } = await import("../utils/queryUtils.js");
      const { default: db } = await import("../models/index.js");

      sanitizeQueryParams.mockReturnValue({});
      extractPaginationParams.mockReturnValue({
        page: null,
        limit: null,
        filters: {},
      });
      buildAllocationFilters.mockReturnValue({});
      getAllocationOrderClause.mockReturnValue([["createdAt", "DESC"]]);

      db.Allocation.findAll.mockResolvedValue(mockAllocations);

      const result = await getAllocationsService({});

      expect(result).toEqual({
        data: mockAllocations,
        count: 2,
      });
    });
  });

  describe("getAllocationByIdService", () => {
    test("should get allocation by ID successfully", async () => {
      const mockAllocation = {
        id: "alloc-1",
        moduleID: "mod-1",
        Module: { id: "mod-1", name: "Test Module" },
      };

      const { default: db } = await import("../models/index.js");

      db.Allocation.findByPk.mockResolvedValue(mockAllocation);

      const result = await getAllocationByIdService("alloc-1");

      expect(result).toEqual(mockAllocation);
    });

    test("should throw error if allocation not found", async () => {
      const { default: db } = await import("../models/index.js");

      db.Allocation.findByPk.mockResolvedValue(null);

      await expect(getAllocationByIdService("non-existent")).rejects.toThrow(
        "Allocation not found"
      );
    });
  });

  describe("updateAllocationService", () => {
    test("should update allocation successfully", async () => {
      const mockAllocation = {
        id: "alloc-1",
        update: jest.fn().mockResolvedValue(),
      };
      const mockUpdatedAllocation = {
        id: "alloc-1",
        moduleID: "mod-2",
      };

      const { default: db } = await import("../models/index.js");

      db.Allocation.findByPk
        .mockResolvedValueOnce(mockAllocation)
        .mockResolvedValueOnce(mockUpdatedAllocation);

      const result = await updateAllocationService("alloc-1", {
        moduleID: "mod-2",
      });

      expect(mockAllocation.update).toHaveBeenCalledWith({
        moduleID: "mod-2",
      });
      expect(result).toEqual(mockUpdatedAllocation);
    });

    test("should throw error if allocation not found for update", async () => {
      const { default: db } = await import("../models/index.js");

      db.Allocation.findByPk.mockResolvedValue(null);

      await expect(updateAllocationService("non-existent", {})).rejects.toThrow(
        "Allocation not found"
      );
    });
  });

  describe("deleteAllocationService", () => {
    test("should delete allocation successfully", async () => {
      const mockAllocation = {
        id: "alloc-1",
        destroy: jest.fn().mockResolvedValue(),
      };

      const { default: db } = await import("../models/index.js");

      db.Allocation.findByPk.mockResolvedValue(mockAllocation);

      const result = await deleteAllocationService("alloc-1");

      expect(mockAllocation.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Allocation deleted successfully",
      });
    });

    test("should throw error if allocation not found for deletion", async () => {
      const { default: db } = await import("../models/index.js");

      db.Allocation.findByPk.mockResolvedValue(null);

      await expect(deleteAllocationService("non-existent")).rejects.toThrow(
        "Allocation not found"
      );
    });
  });
});
