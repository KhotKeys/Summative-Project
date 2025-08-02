import { jest } from "@jest/globals";
import {
  getAllActivityLogsService,
  getComplianceSummaryService,
  getMissingSubmissionsService,
  updateActivityLogStatusService,
} from "../services/managerActivityService.js";

jest.mock("uuid", () => ({ v4: () => "mock-activity-uuid" }));

describe("ManagerActivityService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllActivityLogsService", () => {
    test("should retrieve all activity logs successfully", async () => {
      const mockLogs = [
        { id: "1", weekNumber: 1, allocationId: "alloc-1" },
        { id: "2", weekNumber: 2, allocationId: "alloc-2" },
      ];

      const { default: db } = await import("../models/index.js");

      db.ActivityTracker.findAll.mockResolvedValue(mockLogs);

      const result = await getAllActivityLogsService();

      expect(result.data).toEqual(mockLogs);
      expect(result.count).toBe(2);
      expect(db.ActivityTracker.findAll).toHaveBeenCalledWith({
        where: {},
        attributes: expect.any(Array),
        order: [
          ["weekNumber", "DESC"],
          ["updatedAt", "DESC"],
        ],
        limit: 10,
      });
    });

    test("should handle pagination parameters", async () => {
      const mockLogs = [{ id: "1", weekNumber: 1 }];

      const { default: db } = await import("../models/index.js");

      db.ActivityTracker.findAll.mockResolvedValue(mockLogs);

      const result = await getAllActivityLogsService({ page: 2, limit: 5 });

      expect(db.ActivityTracker.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          order: [
            ["weekNumber", "DESC"],
            ["updatedAt", "DESC"],
          ],
        })
      );
    });
  });

  describe("getComplianceSummaryService", () => {
    test("should calculate compliance summary correctly", async () => {
      const { default: db } = await import("../models/index.js");

      db.Allocation.count.mockResolvedValue(10);
      db.ActivityTracker.count.mockResolvedValue(8);

      const result = await getComplianceSummaryService(4);

      expect(result).toEqual({
        weekNumber: 4,
        totalAllocations: 10,
        submittedLogs: 8,
        missingLogs: 2,
        complianceRate: "80.00",
      });
    });

    test("should handle zero allocations", async () => {
      const { default: db } = await import("../models/index.js");

      db.Allocation.count.mockResolvedValue(0);
      db.ActivityTracker.count.mockResolvedValue(0);

      const result = await getComplianceSummaryService(4);

      expect(result.complianceRate).toBe("0.00");
    });
  });

  describe("getMissingSubmissionsService", () => {
    test("should find missing submissions correctly", async () => {
      const mockSubmittedLogs = [
        { allocationId: "alloc-1" },
        { allocationId: "alloc-2" },
      ];
      const mockMissingAllocations = [
        { id: "alloc-3", facilitatorID: "fac-1" },
        { id: "alloc-4", facilitatorID: "fac-2" },
      ];

      const { default: db } = await import("../models/index.js");

      db.ActivityTracker.findAll.mockResolvedValue(mockSubmittedLogs);
      db.Allocation.findAll.mockResolvedValue(mockMissingAllocations);

      const result = await getMissingSubmissionsService(4);

      expect(result.data).toEqual(mockMissingAllocations);
      expect(result.count).toBe(2);
    });
  });

  describe("updateActivityLogStatusService", () => {
    test("should update activity log status successfully", async () => {
      const mockLog = {
        id: "log-1",
        formativeOneGrading: "Done",
      };

      const { default: db } = await import("../models/index.js");

      db.ActivityTracker.update.mockResolvedValue([1]);
      db.ActivityTracker.findByPk.mockResolvedValue(mockLog);

      const result = await updateActivityLogStatusService("log-1", {
        formativeOneGrading: "Done",
        unauthorizedField: "should be filtered",
      });

      expect(db.ActivityTracker.update).toHaveBeenCalledWith(
        { formativeOneGrading: "Done" },
        { where: { id: "log-1" } }
      );
      expect(result).toEqual(mockLog);
    });

    test("should throw error if log not found", async () => {
      const { default: db } = await import("../models/index.js");

      db.ActivityTracker.update.mockResolvedValue([0]);
      db.ActivityTracker.findByPk.mockResolvedValue(null); // Add this line to ensure service throws

      await expect(
        updateActivityLogStatusService("non-existent", {})
      ).rejects.toThrow("Activity log not found");
    });
  });
});
