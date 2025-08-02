import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export const createUser = async (role, userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const Model = db[capitalize(role)];

  // Check if user already exists
  const whereClause = { email: userData.email };
  if (userData.studentID) {
    whereClause[db.Sequelize.Op.or] = [
      { email: userData.email },
      { studentID: userData.studentID },
    ];
  }

  const existingUser = await Model.findOne({ where: whereClause });
  if (existingUser) {
    const conflictField =
      existingUser.email === userData.email ? "email" : "studentID";
    throw new Error(
      `${capitalize(role)} with this ${conflictField} already exists`
    );
  }

  // Auto-approval logic based on email domain
  const autoApprovalDomains = [
    'alueducation.com',
    'alu.edu',
    'gmail.com' // Add domains that should be auto-approved
  ];
  
  const emailDomain = userData.email.split('@')[1];
  const shouldAutoApprove = autoApprovalDomains.includes(emailDomain);
  
  // Determine initial status
  let initialStatus = 'pending';
  if (shouldAutoApprove) {
    initialStatus = 'active';
    console.log(`🎯 Auto-approving ${role} with domain: ${emailDomain}`);
  }

  // Validate foreign keys
  if (userData.managerID) {
    const manager = await db.Manager.findOne({
      where: { id: userData.managerID, status: "active" },
    });
    if (!manager) {
      throw new Error("Invalid or inactive manager ID");
    }
  }

  if (userData.classID) {
    const classExists = await db.Class.findByPk(userData.classID);
    if (!classExists) {
      throw new Error("Invalid class ID");
    }
  }

  if (userData.cohortID) {
    const cohortExists = await db.Cohort.findByPk(userData.cohortID);
    if (!cohortExists) {
      throw new Error("Invalid cohort ID");
    }
  }

  // Create user with role-specific defaults
  const userDefaults = {
    id: uuidv4(),
    ...userData,
    password: hashedPassword,
    role,
    status: initialStatus, // Use auto-approval status
    ...(role === "student" && {
      academicYear: userData.academicYear || 1,
      enrollmentDate: new Date(),
      gpa: 0.0,
      currentTrimester: 1,
      totalCredits: 0,
      loginCount: 0,
    }),
  };

  const user = await Model.create(userDefaults);
  return user;
};

export const authenticateUser = async (role, email, password) => {
  const Model = db[capitalize(role)];

  // Include associations based on role
  const includeOptions = [];
  if (role === "facilitator") {
    includeOptions.push({
      model: db.Manager,
      attributes: ["id", "name", "email"],
    });
  }
  if (role === "student") {
    includeOptions.push(
      {
        model: db.Class,
        attributes: ["id", "name", "startDate", "graduationDate"],
      },
      {
        model: db.Cohort,
        attributes: ["id", "name", "year", "intake", "program"],
      }
    );
  }

  const user = await Model.findOne({
    where: { email },
    include: includeOptions,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status !== "active") {
    throw new Error(`Account is ${user.status}. Please contact administrator.`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Update login info for students
  if (role === "student") {
    await user.update({
      lastLogin: new Date(),
      loginCount: user.loginCount + 1,
    });
  }

  const tokenPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  if (user.studentID) {
    tokenPayload.studentID = user.studentID;
  }

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return { token, user };
};

export const approveUserService = async (role, id, status) => {
  const modelName = capitalize(role);
  const model = db[modelName];

  if (!model) {
    throw new Error("Invalid role type");
  }

  const user = await model.findByPk(id);
  if (!user) {
    throw new Error(`${modelName} not found`);
  }

  if (user.status === status) {
    throw new Error(`${modelName} is already ${status}`);
  }

  user.status = status;
  await user.save();

  return user;
};
