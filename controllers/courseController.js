import db from "../models/index.js";

const { Module, Allocation, Facilitator, Cohort, Class } = db;

// Get all course offerings (modules with their allocations)
export const getCourseOfferings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const courses = await Module.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Allocation,
          as: "Allocations",
          include: [
            {
              model: Facilitator,
              attributes: ["id", "name", "email"]
            },
            {
              model: Cohort,
              attributes: ["id", "name", "year"]
            },
            {
              model: Class,
              attributes: ["id", "name", "level"]
            }
          ]
        }
      ],
      order: [["name", "ASC"]]
    });

    res.status(200).json({
      message: "Course offerings retrieved successfully",
      courses: courses.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(courses.count / limit),
        totalCourses: courses.count,
        hasNext: page * limit < courses.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching course offerings:", error);
    res.status(500).json({
      error: "Failed to fetch course offerings",
      details: error.message
    });
  }
};

// Get all courses (admin view)
export const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search 
      ? {
          [db.Sequelize.Op.or]: [
            { name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
            { id: { [db.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const courses = await Module.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Allocation,
          as: "Allocations",
          include: [
            {
              model: Facilitator,
              attributes: ["id", "name", "email"]
            },
            {
              model: Cohort,
              attributes: ["id", "name", "year"]
            }
          ]
        }
      ],
      order: [["name", "ASC"]]
    });

    res.status(200).json({
      message: "Courses retrieved successfully",
      courses: courses.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(courses.count / limit),
        totalCourses: courses.count,
        hasNext: page * limit < courses.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      error: "Failed to fetch courses",
      details: error.message
    });
  }
};
