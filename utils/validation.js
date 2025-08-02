export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  studentID: (studentID) => {
    const studentIDRegex = /^ALU\d{4}\d{3}$/;
    return studentIDRegex.test(studentID);
  },

  phone: (phone) => {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,}$/;
    return phoneRegex.test(phone);
  },

  name: (name) => name && name.length >= 2 && name.length <= 100,

  qualification: (qualification) =>
    !qualification || qualification.length <= 255,

  location: (location) => !location || location.length <= 100,

  academicYear: (year) => !year || (year >= 1 && year <= 5),

  gender: (gender) =>
    !gender ||
    ["male", "female", "other", "prefer_not_to_say"].includes(gender),

  dateOfBirth: (date) => !date || new Date(date) <= new Date(),
};

export const validateRequest = (body, allowedFields, requiredFields = []) => {
  const errors = [];

  // Check for missing required fields
  const missingFields = requiredFields.filter((field) => !body[field]);
  if (missingFields.length > 0) {
    errors.push({
      type: "missing_fields",
      message: "Missing required fields",
      required: requiredFields,
      missing: missingFields,
      received: Object.keys(body),
    });
  }

  // Check for unexpected fields
  const extraFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (extraFields.length > 0) {
    errors.push({
      type: "unexpected_fields",
      message: "Unexpected fields in request",
      unexpected: extraFields,
      allowed: allowedFields,
    });
  }

  return errors;
};

export const validateFields = (data) => {
  const errors = [];

  Object.entries(data).forEach(([field, value]) => {
    if (value === null || value === undefined) return;

    switch (field) {
      case "email":
        if (!validators.email(value)) {
          errors.push({ field, message: "Invalid email format" });
        }
        break;
      case "password":
        if (!validators.password(value)) {
          errors.push({
            field,
            message:
              "Password must be at least 8 characters with uppercase, lowercase, and number",
          });
        }
        break;
      case "name":
        if (!validators.name(value)) {
          errors.push({
            field,
            message: "Name must be between 2 and 100 characters",
          });
        }
        break;
      case "studentID":
        if (!validators.studentID(value)) {
          errors.push({
            field,
            message:
              "Invalid student ID format. Expected: ALUyyyynnn (e.g., ALU2024001)",
          });
        }
        break;
      case "phone":
        if (!validators.phone(value)) {
          errors.push({ field, message: "Invalid phone number format" });
        }
        break;
      case "qualification":
        if (!validators.qualification(value)) {
          errors.push({
            field,
            message: "Qualification must be less than 255 characters",
          });
        }
        break;
      case "location":
        if (!validators.location(value)) {
          errors.push({
            field,
            message: "Location must be less than 100 characters",
          });
        }
        break;
      case "academicYear":
        if (!validators.academicYear(value)) {
          errors.push({
            field,
            message: "Academic year must be between 1 and 5",
          });
        }
        break;
      case "gender":
        if (!validators.gender(value)) {
          errors.push({
            field,
            message:
              "Invalid gender. Allowed: male, female, other, prefer_not_to_say",
          });
        }
        break;
      case "dateOfBirth":
        if (!validators.dateOfBirth(value)) {
          errors.push({
            field,
            message: "Date of birth cannot be in the future",
          });
        }
        break;
    }
  });

  return errors;
};
