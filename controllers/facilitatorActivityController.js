import {
  createActivityLogService,
  getFacilitatorActivityLogsService,
  getActivityLogByIdService,
  updateActivityLogService,
  deleteActivityLogService,
} from "../services/facilitatorActivityService.js";

// Helper function to handle requests
const handleRequest = async (req, res, operation) => {
  try {
    const facilitatorId = req.user.id;
    const result = await operation(facilitatorId, req);
    res.status(result.status || 200).json(result.data || result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createActivityLog = (req, res) =>
  handleRequest(req, res, (id, req) =>
    createActivityLogService(id, req.body).then((log) => ({
      status: 201,
      data: { message: "Activity log created successfully", log },
    }))
  );

export const getMyActivityLogs = (req, res) =>
  handleRequest(req, res, (id, req) =>
    getFacilitatorActivityLogsService(id, req.query)
  );

export const getActivityLogById = (req, res) =>
  handleRequest(req, res, (id, req) =>
    getActivityLogByIdService(id, req.params.id).then((log) => ({
      message: "Activity log retrieved successfully",
      log,
    }))
  );

export const updateActivityLog = (req, res) =>
  handleRequest(req, res, (id, req) =>
    updateActivityLogService(id, req.params.id, req.body).then((log) => ({
      message: "Activity log updated successfully",
      log,
    }))
  );

export const deleteActivityLog = (req, res) =>
  handleRequest(req, res, (id, req) =>
    deleteActivityLogService(id, req.params.id)
  );
