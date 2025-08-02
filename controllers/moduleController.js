import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Create a new module

export const createModule = async (req, res) => {
  try {
    const { name, half } = req.body;

    if (!name || !half) {
      return res.status(400).json({ error: "Name and half are required" });
    }

    const module = await db.Module.create({
      id: uuidv4(),
      name,
      half,
    });

    res.status(201).json({
      message: "Module created successfully",
      module,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllModules = async (req, res) => {
  try {
    const modules = await db.Module.findAll();
    res.status(200).json({
      message: "Modules retrieved successfully",
      count: modules.length,
      modules,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
