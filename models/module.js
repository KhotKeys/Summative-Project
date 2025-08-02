export default (sequelize, DataTypes) => {
  const Module = sequelize.define(
    "Module",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      half: DataTypes.STRING,
    },
    {
      tableName: "module",
      timestamps: false,
    }
  );

  Module.associate = (models) => {
    Module.hasMany(models.Allocation, { foreignKey: "moduleID" });
  };

  return Module;
};
