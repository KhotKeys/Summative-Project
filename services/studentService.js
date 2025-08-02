import db from "../models/index.js";
import bcrypt from "bcryptjs";

// Get student profile
export const getStudentProfile = async (studentId) => {
  try {
    const student = await db.Student.findByPk(studentId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.Class,
          attributes: ["id", "name", "startDate", "graduationDate"],
        },
        {
          model: db.Cohort,
          attributes: ["id", "name", "intake", "program", "year"],
        },
      ],
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  } catch (error) {
    throw error;
  }
};

// Update student profile
export const updateStudentProfile = async (studentId, updateData) => {
  try {
    const student = await db.Student.findByPk(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    // Fields that students can update
    const allowedFields = [
      "name",
      "phone",
      "address",
      "emergencyContact",
      "emergencyPhone",
      "profilePicture",
      "nationality",
      "gender",
    ];

    // Filter update data to only allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Update student
    await student.update(filteredData);

    // Return updated profile
    return await getStudentProfile(studentId);
  } catch (error) {
    throw error;
  }
};

// Change student password
export const changeStudentPassword = async (studentId, passwordData) => {
  try {
    const { currentPassword, newPassword } = passwordData;

    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    const student = await db.Student.findByPk(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      student.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await student.update({ password: hashedNewPassword });

    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};

// Get student dashboard
export const getStudentDashboard = async (studentId) => {
  try {
    const student = await getStudentProfile(studentId);

    // Get academic statistics
    const stats = {
      currentTrimester: student.currentTrimester,
      totalCredits: student.totalCredits,
      gpa: student.gpa,
      enrollmentDate: student.enrollmentDate,
      academicYear: student.academicYear,
      status: student.status,
    };

    return {
      profile: student,
      academicStats: stats,
    };
  } catch (error) {
    throw error;
  }
};
