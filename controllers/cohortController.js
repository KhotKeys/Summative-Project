import {
  createCohortService,
  getAllCohortsService,
  getCohortByIdService,
  updateCohortService,
  deleteCohortService,
} from "../services/cohortService.js";

// Create Cohort

export const createCohort = async (req, res) => {
  try {
    const cohort = await createCohortService(req.body);
    res.status(201).json({
      message: "Cohort created successfully",
      cohort,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Cohorts

export const getAllCohorts = async (req, res) => {
  try {
    const cohorts = await getAllCohortsService(req.query);
    res.status(200).json({
      message: "Cohorts retrieved successfully",
      count: cohorts.length,
      cohorts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Cohort by ID

export const getCohortById = async (req, res) => {
  try {
    const cohort = await getCohortByIdService(req.params.id);
    res.status(200).json({
      message: "Cohort retrieved successfully",
      cohort,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update Cohort
export const updateCohort = async (req, res) => {
  try {
    const cohort = await updateCohortService(req.params.id, req.body);
    res.status(200).json({
      message: "Cohort updated successfully",
      cohort,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Cohort

export const deleteCohort = async (req, res) => {
  try {
    await deleteCohortService(req.params.id);
    res.status(200).json({
      message: "Cohort deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
