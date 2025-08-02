import {
  createUser,
  authenticateUser,
  approveUserService,
} from "../services/authService.js";
import { validateRequest, validateFields } from "../utils/validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../models/index.js";

// System Admin login
export const loginSystemAdmin = async (req, res) => {
  try {
    const allowedFields = ["email", "password"];
    const requiredFields = ["email", "password"];

    const structureErrors = validateRequest(
      req.body,
      allowedFields,
      requiredFields
    );
    if (structureErrors.length > 0) {
      return res.status(400).json({ errors: structureErrors });
    }

    const fieldErrors = validateFields(req.body);
    if (fieldErrors.length > 0) {
      return res.status(400).json({ errors: fieldErrors });
    }

    const { email, password } = req.body;
    const admin = await db.SystemAdmin.findOne({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Factory function to create registration controllers for any user type
const registerController = (role, allowedFields, requiredFields) => {
  return async (req, res) => {
    try {
      // Validate request structure
      const structureErrors = validateRequest(
        req.body,
        allowedFields,
        requiredFields
      );
      if (structureErrors.length > 0) {
        return res.status(400).json({ errors: structureErrors });
      }

      // Validate field values
      const fieldErrors = validateFields(req.body);
      if (fieldErrors.length > 0) {
        return res.status(400).json({ errors: fieldErrors });
      }

      const user = await createUser(role, req.body);

      // Determine response message based on user status
      const message = user.status === 'active' 
        ? `${role.charAt(0).toUpperCase() + role.slice(1)} registration successful! Account is ready to use.`
        : `${role.charAt(0).toUpperCase() + role.slice(1)} registration submitted. Awaiting approval.`;

      res.status(201).json({
        message,
        [role]: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          ...(user.studentID && { studentID: user.studentID }),
          ...(user.qualification && { qualification: user.qualification }),
          ...(user.location && { location: user.location }),
          ...(user.academicYear && { academicYear: user.academicYear }),
          ...(user.currentTrimester && {
            currentTrimester: user.currentTrimester,
          }),
        },
      });
    } catch (error) {
      const statusCode = error.message.includes("already exists") ? 409 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  };
};

// Factory function to create login controllers for any user type
const loginController = (role) => {
  return async (req, res) => {
    try {
      const allowedFields = ["email", "password"];
      const requiredFields = ["email", "password"];

      const structureErrors = validateRequest(
        req.body,
        allowedFields,
        requiredFields
      );
      if (structureErrors.length > 0) {
        return res.status(400).json({ errors: structureErrors });
      }

      const fieldErrors = validateFields(req.body);
      if (fieldErrors.length > 0) {
        return res.status(400).json({ errors: fieldErrors });
      }

      const { email, password } = req.body;
      const { token, user } = await authenticateUser(role, email, password);

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          ...(user.studentID && {
            studentID: user.studentID,
            phone: user.phone,
            academicYear: user.academicYear,
            currentTrimester: user.currentTrimester,
            totalCredits: user.totalCredits,
            enrollmentDate: user.enrollmentDate,
            class: user.Class,
            nationality: user.nationality,
            cohort: user.Cohort,
          }),
          // Facilitator-specific fields
          ...(user.qualification && {
            qualification: user.qualification,
            location: user.location,
            manager: user.Manager,
          }),
        },
      });
    } catch (error) {
      const statusCode =
        error.message === "Invalid credentials"
          ? 401
          : error.message.includes("contact administrator")
          ? 403
          : 500;
      res.status(statusCode).json({ error: error.message });
    }
  };
};

// Register Manager
export const registerManager = registerController(
  "manager",
  ["email", "name", "password"],
  ["email", "name", "password"]
);

export const loginManager = loginController("manager");

// Facilitator Controllers
export const registerFacilitator = registerController(
  "facilitator",
  ["email", "name", "password", "qualification", "location", "managerID"],
  ["email", "name", "password"]
);

export const loginFacilitator = loginController("facilitator");

// Student Controllers
export const registerStudentController = registerController(
  "student",
  [
    "email",
    "name",
    "password",
    "studentID",
    "phone",
    "dateOfBirth",
    "address",
    "classID",
    "cohortID",
    "academicYear",
    "emergencyContact",
    "emergencyPhone",
    "nationality",
    "gender",
  ],
  ["email", "name", "password", "studentID"]
);

export const loginStudentController = loginController("student");

// Approve user status (admin only)
export const approveUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const allowedFields = ["status"];
    const requiredFields = ["status"];
    const allowedRoles = ["manager", "facilitator", "student"];
    const allowedStatuses = ["active", "rejected", "suspended"];

    const structureErrors = validateRequest(
      req.body,
      allowedFields,
      requiredFields
    );
    if (structureErrors.length > 0) {
      return res.status(400).json({ errors: structureErrors });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
        allowed: allowedRoles,
        received: role,
      });
    }

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        error: "Invalid status value",
        allowed: allowedStatuses,
        received: req.body.status,
      });
    }

    const updatedUser = await approveUserService(role, id, req.body.status);

    res.status(200).json({
      message: `${role} status updated to ${req.body.status}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// General login endpoint that auto-detects user type
export const generalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Check all user types in order
    const userTypes = [
      { model: db.SystemAdmin, role: "system_admin" },
      { model: db.Manager, role: "manager" },
      { model: db.Facilitator, role: "facilitator" },
      { model: db.Student, role: "student" }
    ];

    for (const userType of userTypes) {
      const user = await userType.model.findOne({ where: { email } });
      
      if (user && await bcrypt.compare(password, user.password)) {
        // Check if user is active (except for system admin)
        if (userType.role !== "system_admin" && user.status !== "active") {
          return res.status(401).json({ 
            error: "Account is pending. Please contact administrator." 
          });
        }

        const token = jwt.sign(
          { id: user.id, role: userType.role, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: userType.role,
            ...(user.studentID && { studentID: user.studentID }),
            ...(user.facilitatorID && { facilitatorID: user.facilitatorID }),
            ...(user.managerID && { managerID: user.managerID }),
          },
        });
      }
    }

    // No user found with matching credentials
    return res.status(401).json({ error: "Invalid credentials" });

  } catch (error) {
    console.error("General login error:", error);
    res.status(500).json({ 
      error: "Login failed", 
      details: error.message 
    });
  }
};
