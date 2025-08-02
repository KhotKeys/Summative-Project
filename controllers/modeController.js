import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Create a new mode

export const createMode = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!["Online", "In-person", "Hybrid"].includes(name)) {
      return res
        .status(400)
        .json({ error: "Mode must be Online, In-person, or Hybrid" });
    }

    const mode = await db.Mode.create({
      id: uuidv4(),
      name,
    });

    res.status(201).json({
      message: "Mode created successfully",
      mode,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllModes = async (req, res) => {
  try {
    const modes = await db.Mode.findAll();
    res.status(200).json({
      message: "Modes retrieved successfully",
      count: modes.length,
      modes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
