import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Create a new class

export const createClass = async (req, res) => {
  try {
    const { name, startDate, graduationDate } = req.body;

    if (!name || !startDate || !graduationDate) {
      return res
        .status(400)
        .json({ error: "Name, startDate, and graduationDate are required" });
    }

    const classEntity = await db.Class.create({
      id: uuidv4(),
      name,
      startDate,
      graduationDate,
    });

    res.status(201).json({
      message: "Class created successfully",
      class: classEntity,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await db.Class.findAll();
    res.status(200).json({
      message: "Classes retrieved successfully",
      count: classes.length,
      classes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
