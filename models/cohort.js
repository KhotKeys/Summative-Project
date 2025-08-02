export default (sequelize, DataTypes) => {
  const Cohort = sequelize.define(
    "Cohort",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      intake: {
        type: DataTypes.ENUM("HT1", "HT2", "FT"),
        allowNull: false,
      },
      program: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      maxStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      currentStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "completed"),
        allowNull: false,
        defaultValue: "active",
      },
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      classID: DataTypes.STRING,
    },
    {
      tableName: "cohort",
      timestamps: false,
    }
  );

  Cohort.associate = (models) => {
    Cohort.hasMany(models.Student, { foreignKey: "cohortID" });
    Cohort.hasMany(models.Allocation, { foreignKey: "cohortID" }); // Add this
    Cohort.belongsTo(models.Class, { foreignKey: "classID" }); // Add this
  };

  return Cohort;
};
