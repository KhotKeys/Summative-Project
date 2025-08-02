export default (sequelize, DataTypes) => {
  const Allocation = sequelize.define(
    "Allocation",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      moduleID: DataTypes.STRING,
      classID: DataTypes.STRING,
      facilitatorID: DataTypes.STRING,
      cohortID: DataTypes.STRING,
      trimester: DataTypes.INTEGER,
      modeID: DataTypes.STRING,
      year: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
    },
    {
      tableName: "allocation",
      timestamps: false,
    }
  );

  Allocation.associate = (models) => {
    Allocation.belongsTo(models.Module, { foreignKey: "moduleID" });
    Allocation.belongsTo(models.Class, { foreignKey: "classID" });
    Allocation.belongsTo(models.Facilitator, { foreignKey: "facilitatorID" });
    Allocation.belongsTo(models.Cohort, { foreignKey: "cohortID" }); // Add this
    Allocation.belongsTo(models.Mode, { foreignKey: "modeID" });
    Allocation.hasMany(models.ActivityTracker, { foreignKey: "allocationId" });
  };

  return Allocation;
};
