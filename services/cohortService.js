import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

export const createCohortService = async (data) => {
  const {
    name,
    year,
    intake,
    program,
    maxStudents,
    startDate,
    endDate,
    classID,
  } = data;

  // Validate required fields
  if (!name) {
    throw new Error("Name is required");
  }

  // Generate ID if not provided
  const cohortId = uuidv4();

  // Create cohort
  const cohort = await db.Cohort.create({
    id: cohortId,
    name,
    year: year || new Date().getFullYear(),
    intake: intake || "HT1",
    program,
    maxStudents: maxStudents || 30,
    currentStudents: 0,
    startDate,
    endDate,
    classID,
    status: "active",
  });

  return await db.Cohort.findByPk(cohort.id, {
    include: [
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
    ],
  });
};

export const getAllCohortsService = async () => {
  const whereClause = {};

  return await db.Cohort.findAll({
    where: whereClause,
    include: [
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
      { model: db.Student, attributes: ["id", "name", "email"] },
    ],
    order: [["name", "ASC"]],
  });
};

export const getCohortByIdService = async (id) => {
  const cohort = await db.Cohort.findByPk(id, {
    include: [
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
      { model: db.Student, attributes: ["id", "name", "email"] },
    ],
  });

  if (!cohort) {
    throw new Error("Cohort not found");
  }

  return cohort;
};

export const updateCohortService = async (id, data) => {
  const cohort = await db.Cohort.findByPk(id);
  if (!cohort) {
    throw new Error("Cohort not found");
  }

  await cohort.update(data);
  return await db.Cohort.findByPk(id, {
    include: [
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
    ],
  });
};

export const deleteCohortService = async (id) => {
  const cohort = await db.Cohort.findByPk(id);
  if (!cohort) {
    throw new Error("Cohort not found");
  }

  await cohort.destroy();
  return { message: "Cohort deleted successfully" };
};
