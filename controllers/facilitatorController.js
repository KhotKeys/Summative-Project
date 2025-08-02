import {
  getMyAllocationsService,
  getAllocationByIdService,
  getMyAllocationsByTrimesterService,
  getMyAllocationsByModeService,
} from "../services/facilitatorService.js";

export const getMyCourses = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const allocations = await getMyAllocationsService(facilitatorId, req.query);

    res.status(200).json({
      message: "My courses retrieved successfully",
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my allocations
export const getMyAllocations = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const allocations = await getMyAllocationsService(facilitatorId, req.query);

    res.status(200).json({
      message: "My allocations retrieved successfully",
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific allocation by ID
export const getAllocationById = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const allocationId = req.params.id;
    const allocation = await getAllocationByIdService(
      facilitatorId,
      allocationId
    );

    res.status(200).json({
      message: "Allocation retrieved successfully",
      allocation,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get allocations by trimester
export const getMyAllocationsByTrimester = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const { trimester, year } = req.params;
    const allocations = await getMyAllocationsByTrimesterService(
      facilitatorId,
      parseInt(trimester),
      parseInt(year),
      req.query
    );

    res.status(200).json({
      message: `Allocations for Trimester ${trimester}, Year ${year} retrieved successfully`,
      trimester: parseInt(trimester),
      year: parseInt(year),
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by mode
export const getMyAllocationsByMode = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const { modeId } = req.params;
    const allocations = await getMyAllocationsByModeService(
      facilitatorId,
      modeId,
      req.query
    );

    res.status(200).json({
      message: `Allocations for mode ${modeId} retrieved successfully`,
      modeId,
      count: allocations.count || allocations.data?.length || 0,
      ...allocations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
