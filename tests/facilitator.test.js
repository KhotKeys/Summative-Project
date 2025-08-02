import { jest } from "@jest/globals";
import {
  createActivityLogService,
  getFacilitatorActivityLogsService,
  updateActivityLogService,
  deleteActivityLogService,
} from "../services/facilitatorActivityService.js";

jest.mock("uuid", () => ({ v4: () => "mock-uuid-activity" }));

jest.mock("../utils/activityQuery.js", () => ({
  buildActivityQuery: jest.fn(),
  executeQuery: jest.fn(),
}));

jest.mock("../utils/queryUtils.js", () => ({
  extractPaginationParams: jest.fn(),
}));

describe("FacilitatorActivityService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createActivityLogService", () => {
    test("should create activity log successfully", async () => {
      const mockAllocation = { id: "alloc-1", facilitatorID: "fac-1" };
      const mockCreatedLog = {
        id: "mock-uuid-activity",
        allocationId: "alloc-1",
        weekNumber: 1,
      };

      const { default: db } = await import("../models/index.js");

      db.Allocation.findOne.mockResolvedValue(mockAllocation);
      db.ActivityTracker.findOne
        .mockResolvedValueOnce(null) // No existing log before creation
        .mockResolvedValueOnce(mockCreatedLog); // Return created log after creation
      db.ActivityTracker.create.mockResolvedValue(mockCreatedLog);

      const result = await createActivityLogService("fac-1", {
        allocationId: "alloc-1",
        weekNumber: 1,
        attendance: [true, false, true],
      });

      expect(db.Allocation.findOne).toHaveBeenCalledWith({
        where: { id: "alloc-1", facilitatorID: "fac-1" },
      });
      expect(db.ActivityTracker.create).toHaveBeenCalledWith({
        id: "mock-uuid-activity",
        allocationId: "alloc-1",
        weekNumber: 1,
        attendance: [true, false, true],
        formativeOneGrading: "Not Started",
        formativeTwoGrading: "Not Started",
        summativeGrading: "Not Started",
        courseModeration: "Not Started",
        intranetSync: "Not Started",
        gradeBookStatus: "Not Started",
        submittedAt: expect.any(Date),
      });
      expect(result).toEqual(mockCreatedLog);
    });

    test("should throw error if allocation not accessible", async () => {
      const { default: db } = await import("../models/index.js");

      db.Allocation.findOne.mockResolvedValue(null);

      await expect(
        createActivityLogService("fac-1", {
          allocationId: "alloc-1",
          weekNumber: 1,
        })
      ).rejects.toThrow("Allocation not found or not accessible");
    });

    test("should throw error if log already exists", async () => {
      const mockAllocation = { id: "alloc-1", facilitatorID: "fac-1" };
      const mockExistingLog = { id: "existing-log" };

      const { default: db } = await import("../models/index.js");

      db.Allocation.findOne.mockResolvedValue(mockAllocation);
      db.ActivityTracker.findOne.mockResolvedValue(mockExistingLog);

      await expect(
        createActivityLogService("fac-1", {
          allocationId: "alloc-1",
          weekNumber: 1,
        })
      ).rejects.toThrow("Activity log for week 1 already exists");
    });
  });

  describe("getFacilitatorActivityLogsService", () => {
    test("should retrieve facilitator activity logs with pagination", async () => {
      const mockResult = {
        data: [{ id: "1" }, { id: "2" }],
        count: 2,
        totalPages: 1,
        currentPage: 1,
      };

      const { extractPaginationParams } = await import(
        "../utils/queryUtils.js"
      );
      const { buildActivityQuery, executeQuery } = await import(
        "../utils/activityQuery.js"
      );

      extractPaginationParams.mockReturnValue({
        page: 1,
        limit: 10,
        filters: {},
      });
      buildActivityQuery.mockReturnValue({ where: {}, include: [] });
      executeQuery.mockResolvedValue(mockResult);

      const result = await getFacilitatorActivityLogsService("fac-1", {
        page: 1,
        limit: 10,
      });

      expect(result.message).toBe("Activity logs retrieved successfully");
      expect(result.data).toEqual(mockResult.data);
    });
  });

  describe("updateActivityLogService", () => {
    test("should update activity log successfully", async () => {
      const mockLog = {
        id: "log-1",
        update: jest.fn().mockResolvedValue(),
      };

      const { buildActivityQuery } = await import("../utils/activityQuery.js");
      const { default: db } = await import("../models/index.js");

      buildActivityQuery.mockReturnValue({ where: {} });
      db.ActivityTracker.findOne.mockResolvedValue(mockLog);

      await updateActivityLogService("fac-1", "log-1", {
        formativeOneGrading: "Done",
        comments: "All graded",
      });

      expect(mockLog.update).toHaveBeenCalledWith({
        formativeOneGrading: "Done",
        comments: "All graded",
        updatedAt: expect.any(Date),
      });
    });

    test("should throw error if log not found", async () => {
      const { buildActivityQuery } = await import("../utils/activityQuery.js");
      const { default: db } = await import("../models/index.js");

      buildActivityQuery.mockReturnValue({ where: {} });
      db.ActivityTracker.findOne.mockResolvedValue(null);

      await expect(
        updateActivityLogService("fac-1", "log-1", {})
      ).rejects.toThrow("Activity log not found or not accessible");
    });
  });

  describe("deleteActivityLogService", () => {
    test("should delete activity log successfully", async () => {
      const mockLog = {
        id: "log-1",
        destroy: jest.fn().mockResolvedValue(),
      };

      const { buildActivityQuery } = await import("../utils/activityQuery.js");
      const { default: db } = await import("../models/index.js");

      buildActivityQuery.mockReturnValue({ where: {} });
      db.ActivityTracker.findOne.mockResolvedValue(mockLog);

      const result = await deleteActivityLogService("fac-1", "log-1");

      expect(mockLog.destroy).toHaveBeenCalled();
      expect(result.message).toBe("Activity log deleted successfully");
    });

    test("should throw error if log not found for deletion", async () => {
      const { buildActivityQuery } = await import("../utils/activityQuery.js");
      const { default: db } = await import("../models/index.js");

      buildActivityQuery.mockReturnValue({ where: {} });
      db.ActivityTracker.findOne.mockResolvedValue(null);

      await expect(deleteActivityLogService("fac-1", "log-1")).rejects.toThrow(
        "Activity log not found or not accessible"
      );
    });
  });
});
