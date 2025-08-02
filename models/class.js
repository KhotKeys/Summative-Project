export default (sequelize, DataTypes) => {
  const Class = sequelize.define(
    "Class",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      startDate: DataTypes.DATE,
      graduationDate: DataTypes.DATE,
    },
    {
      tableName: "class",
      timestamps: false,
    }
  );

  Class.associate = (models) => {
    Class.hasMany(models.Student, { foreignKey: "classID" });
    Class.hasMany(models.Allocation, { foreignKey: "classID" });
  };

  return Class;
};
