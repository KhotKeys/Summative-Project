import { jest } from "@jest/globals";
import {
  updateNotificationStatus,
  checkWeeklyComplianceService,
} from "../services/notificationService.js";

jest.mock("../config/redis.js", () => ({
  notificationQueue: { add: jest.fn() },
  complianceQueue: { add: jest.fn() },
}));

let db;

beforeAll(async () => {
  db = (await import("../models/index.js")).default;

  // Mock all model methods

  for (const modelName of Object.keys(db)) {
    if (typeof db[modelName] === "object" && db[modelName] !== null) {
      db[modelName].findAll = db[modelName].findAll || jest.fn();
      db[modelName].findAll.mockResolvedValue([]);
    }
  }
});

describe("NotificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const modelName of Object.keys(db)) {
      if (db[modelName] && db[modelName].findAll) {
        db[modelName].findAll.mockResolvedValue([]);
      }
    }
  });

  describe("updateNotificationStatus", () => {
    test("should update notification status to sent", async () => {
      db.Notification.update.mockResolvedValue([1]);
      await updateNotificationStatus("notif-1", "sent");
      expect(db.Notification.update).toHaveBeenCalledWith(
        { status: "sent", sentAt: expect.any(Date) },
        { where: { id: "notif-1" } }
      );
    });

    test("should update notification status to failed with reason", async () => {
      db.Notification.update.mockResolvedValue([1]);
      await updateNotificationStatus("notif-1", "failed", {
        failureReason: "Network error",
      });
      expect(db.Notification.update).toHaveBeenCalledWith(
        { status: "failed", failureReason: "Network error" },
        { where: { id: "notif-1" } }
      );
    });
  });

  describe("checkWeeklyComplianceService", () => {
    test("should calculate compliance rate correctly", async () => {
      db.Allocation.count.mockResolvedValue(10);
      db.ActivityTracker.count.mockResolvedValue(8);

      const result = await checkWeeklyComplianceService(4);

      expect(result).toEqual({
        weekNumber: 4,
        complianceRate: "80.00",
        totalAllocations: 10,
        submittedLogs: 8,
        alertSent: false,
      });
    });

    test("should handle zero allocations", async () => {
      db.Allocation.count.mockResolvedValue(0);
      db.ActivityTracker.count.mockResolvedValue(0);

      const result = await checkWeeklyComplianceService(4);

      expect(result.complianceRate).toBe("0.00");
    });
  });
});
