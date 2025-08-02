export default (sequelize, DataTypes) => {
  const ActivityTracker = sequelize.define(
    "ActivityTracker",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      allocationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Allocation",
          key: "id",
        },
      },
      weekNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 52,
        },
      },
      attendance: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      formativeOneGrading: {
        type: DataTypes.ENUM("Done", "Pending", "Not Started"),
        defaultValue: "Not Started",
      },
      formativeTwoGrading: {
        type: DataTypes.ENUM("Done", "Pending", "Not Started"),
        defaultValue: "Not Started",
      },
      summativeGrading: {
        type: DataTypes.ENUM("Done", "Pending", "Not Started"),
        defaultValue: "Not Started",
      },
      courseModeration: {
        type: DataTypes.ENUM("Done", "Pending", "Not Started"),
        defaultValue: "Not Started",
      },
      intranetSync: {
        type: DataTypes.ENUM("Done", "Pending", "Not Started"),
        defaultValue: "Not Started",
      },
      gradeBookStatus: {
        type: DataTypes.ENUM("Done", "Pending", "Not Started"),
        defaultValue: "Not Started",
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "activity_tracker",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["allocationId", "weekNumber"],
        },
        {
          fields: ["weekNumber"],
        },
      ],
    }
  );

  ActivityTracker.associate = (models) => {
    ActivityTracker.belongsTo(models.Allocation, {
      foreignKey: "allocationId",
      as: "Allocation",
    });
  };

  return ActivityTracker;
};
