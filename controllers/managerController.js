import {
  createAllocationService,
  getAllocationsService,
  getAllocationByIdService,
  updateAllocationService,
  deleteAllocationService,
  getAllocationsByTrimesterService,
  getAllocationsByCohortService,
  getAllocationsByFacilitatorService,
  getAllocationsByModeService,
  getAllocationsByIntakeService,
} from "../services/managerService.js";

// Create allocation
export const createAllocation = async (req, res) => {
  try {
    const allocation = await createAllocationService(req.body);
    res.status(201).json({
      message: "Allocation created successfully",
      allocation,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all allocations with filters
export const getAllocations = async (req, res) => {
  try {
    const allocations = await getAllocationsService(req.query);
    res.status(200).json({
      message: "Allocations retrieved successfully",
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocation by ID
export const getAllocationById = async (req, res) => {
  try {
    const allocation = await getAllocationByIdService(req.params.id);
    res.status(200).json({
      message: "Allocation retrieved successfully",
      allocation,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update allocation
export const updateAllocation = async (req, res) => {
  try {
    const allocation = await updateAllocationService(req.params.id, req.body);
    res.status(200).json({
      message: "Allocation updated successfully",
      allocation,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete allocation
export const deleteAllocation = async (req, res) => {
  try {
    const result = await deleteAllocationService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get allocations by trimester
export const getAllocationsByTrimester = async (req, res) => {
  try {
    const { trimester, year } = req.params;
    const allocations = await getAllocationsByTrimesterService(trimester, year);
    res.status(200).json({
      message: `Allocations for Trimester ${trimester}, ${year} retrieved successfully`,
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by cohort
export const getAllocationsByCohort = async (req, res) => {
  try {
    const allocations = await getAllocationsByCohortService(
      req.params.cohortId
    );
    res.status(200).json({
      message: "Cohort allocations retrieved successfully",
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by facilitator
export const getAllocationsByFacilitator = async (req, res) => {
  try {
    const allocations = await getAllocationsByFacilitatorService(
      req.params.facilitatorId
    );
    res.status(200).json({
      message: "Facilitator allocations retrieved successfully",
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by mode
export const getAllocationsByMode = async (req, res) => {
  try {
    const allocations = await getAllocationsByModeService(req.params.modeId);
    res.status(200).json({
      message: "Mode allocations retrieved successfully",
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by intake
export const getAllocationsByIntake = async (req, res) => {
  try {
    const allocations = await getAllocationsByIntakeService(req.params.intake);
    res.status(200).json({
      message: `Allocations for ${req.params.intake} intake retrieved successfully`,
      count: allocations.length,
      allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
