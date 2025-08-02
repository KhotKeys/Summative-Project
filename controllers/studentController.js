import {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  getStudentDashboard,
} from "../services/studentService.js";

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const profile = await getStudentProfile(studentId);

    res.status(200).json({
      message: "Profile retrieved successfully",
      profile,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update student profile
export const updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const updatedProfile = await updateStudentProfile(studentId, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await changeStudentPassword(studentId, req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get student dashboard
export const getDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const dashboard = await getStudentDashboard(studentId);

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      ...dashboard,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
