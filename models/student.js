export default (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      address: DataTypes.TEXT,
      classID: DataTypes.STRING,
      cohortID: DataTypes.STRING,
      academicYear: DataTypes.INTEGER,
      enrollmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "student",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "active",
          "inactive",
          "graduated",
          "suspended",
          "dropped"
        ),
        defaultValue: "pending",
        allowNull: false,
      },
      emergencyContact: DataTypes.STRING,
      emergencyPhone: DataTypes.STRING,
      nationality: DataTypes.STRING,
      gender: {
        type: DataTypes.ENUM("male", "female", "other", "prefer_not_to_say"),
        allowNull: true,
      },
      profilePicture: DataTypes.STRING,
      currentTrimester: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      totalCredits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastLogin: DataTypes.DATE,
      loginCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "student",
      timestamps: false,
    }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.Class, { foreignKey: "classID" });
    Student.belongsTo(models.Cohort, { foreignKey: "cohortID" });
  };

  return Student;
};
