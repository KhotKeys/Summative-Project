import { jest } from "@jest/globals";
import {
  createCohortService,
  getAllCohortsService,
  getCohortByIdService,
  updateCohortService,
  deleteCohortService,
} from "../services/cohortService.js";

jest.mock("uuid", () => ({ v4: () => "mock-cohort-uuid" }));

describe("CohortService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCohortService", () => {
    test("should create cohort successfully with minimal data", async () => {
      const mockCohort = {
        id: "mock-cohort-uuid",
        name: "Test Cohort",
        year: 2024,
        intake: "HT1",
        status: "active",
      };
      const mockFullCohort = {
        ...mockCohort,
        Class: { id: "class-1", name: "2024S" },
      };

      const { default: db } = await import("../models/index.js");

      db.Cohort.create.mockResolvedValue(mockCohort);
      db.Cohort.findByPk.mockResolvedValue(mockFullCohort);

      const result = await createCohortService({
        name: "Test Cohort",
      });

      expect(db.Cohort.create).toHaveBeenCalledWith({
        id: "mock-cohort-uuid",
        name: "Test Cohort",
        year: new Date().getFullYear(),
        intake: "HT1",
        program: undefined,
        maxStudents: 30,
        currentStudents: 0,
        startDate: undefined,
        endDate: undefined,
        classID: undefined,
        status: "active",
      });
      expect(result).toEqual(mockFullCohort);
    });

    test("should create cohort with all provided data", async () => {
      const mockCohort = {
        id: "mock-cohort-uuid",
        name: "Advanced Cohort",
        year: 2025,
        intake: "FT",
        program: "Computer Science",
        maxStudents: 25,
        status: "active",
      };

      const { default: db } = await import("../models/index.js");

      db.Cohort.create.mockResolvedValue(mockCohort);
      db.Cohort.findByPk.mockResolvedValue(mockCohort);

      const result = await createCohortService({
        name: "Advanced Cohort",
        year: 2025,
        intake: "FT",
        program: "Computer Science",
        maxStudents: 25,
        classID: "class-1",
      });

      expect(db.Cohort.create).toHaveBeenCalledWith({
        id: "mock-cohort-uuid",
        name: "Advanced Cohort",
        year: 2025,
        intake: "FT",
        program: "Computer Science",
        maxStudents: 25,
        currentStudents: 0,
        startDate: undefined,
        endDate: undefined,
        classID: "class-1",
        status: "active",
      });
    });

    test("should throw error if name is not provided", async () => {
      await expect(createCohortService({})).rejects.toThrow("Name is required");
    });
  });

  describe("getAllCohortsService", () => {
    test("should get all cohorts with includes", async () => {
      const mockCohorts = [
        {
          id: "coh-1",
          name: "Cohort A",
          Class: { id: "class-1", name: "2024S" },
          Students: [{ id: "std-1", name: "John Doe", email: "john@test.com" }],
        },
        {
          id: "coh-2",
          name: "Cohort B",
          Class: { id: "class-2", name: "2024J" },
          Students: [],
        },
      ];

      const { default: db } = await import("../models/index.js");

      db.Cohort.findAll.mockResolvedValue(mockCohorts);

      const result = await getAllCohortsService();

      expect(db.Cohort.findAll).toHaveBeenCalledWith({
        where: {},
        include: [
          {
            model: db.Class,
            attributes: ["id", "name", "startDate", "graduationDate"],
          },
          { model: db.Student, attributes: ["id", "name", "email"] },
        ],
        order: [["name", "ASC"]],
      });
      expect(result).toEqual(mockCohorts);
    });
  });

  describe("getCohortByIdService", () => {
    test("should get cohort by ID successfully", async () => {
      const mockCohort = {
        id: "coh-1",
        name: "Test Cohort",
        Class: { id: "class-1", name: "2024S" },
        Students: [{ id: "std-1", name: "John Doe", email: "john@test.com" }],
      };

      const { default: db } = await import("../models/index.js");

      db.Cohort.findByPk.mockResolvedValue(mockCohort);

      const result = await getCohortByIdService("coh-1");

      expect(db.Cohort.findByPk).toHaveBeenCalledWith("coh-1", {
        include: [
          {
            model: db.Class,
            attributes: ["id", "name", "startDate", "graduationDate"],
          },
          { model: db.Student, attributes: ["id", "name", "email"] },
        ],
      });
      expect(result).toEqual(mockCohort);
    });

    test("should throw error if cohort not found", async () => {
      const { default: db } = await import("../models/index.js");

      db.Cohort.findByPk.mockResolvedValue(null);

      await expect(getCohortByIdService("non-existent")).rejects.toThrow(
        "Cohort not found"
      );
    });
  });

  describe("updateCohortService", () => {
    test("should update cohort successfully", async () => {
      const mockCohort = {
        id: "coh-1",
        update: jest.fn().mockResolvedValue(),
      };
      const mockUpdatedCohort = {
        id: "coh-1",
        name: "Updated Cohort",
        Class: { id: "class-1", name: "2024S" },
      };

      const { default: db } = await import("../models/index.js");

      db.Cohort.findByPk
        .mockResolvedValueOnce(mockCohort)
        .mockResolvedValueOnce(mockUpdatedCohort);

      const result = await updateCohortService("coh-1", {
        name: "Updated Cohort",
        maxStudents: 35,
      });

      expect(mockCohort.update).toHaveBeenCalledWith({
        name: "Updated Cohort",
        maxStudents: 35,
      });
      expect(result).toEqual(mockUpdatedCohort);
    });

    test("should throw error if cohort not found for update", async () => {
      const { default: db } = await import("../models/index.js");

      db.Cohort.findByPk.mockResolvedValue(null);

      await expect(updateCohortService("non-existent", {})).rejects.toThrow(
        "Cohort not found"
      );
    });
  });

  describe("deleteCohortService", () => {
    test("should delete cohort successfully", async () => {
      const mockCohort = {
        id: "coh-1",
        destroy: jest.fn().mockResolvedValue(),
      };

      const { default: db } = await import("../models/index.js");

      db.Cohort.findByPk.mockResolvedValue(mockCohort);

      const result = await deleteCohortService("coh-1");

      expect(mockCohort.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Cohort deleted successfully",
      });
    });

    test("should throw error if cohort not found for deletion", async () => {
      const { default: db } = await import("../models/index.js");

      db.Cohort.findByPk.mockResolvedValue(null);

      await expect(deleteCohortService("non-existent")).rejects.toThrow(
        "Cohort not found"
      );
    });
  });
});
