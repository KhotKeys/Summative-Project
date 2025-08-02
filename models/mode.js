export default (sequelize, DataTypes) => {
  const Mode = sequelize.define(
    "Mode",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      tableName: "mode",
      timestamps: false,
    }
  );

  Mode.associate = (models) => {
    Mode.hasMany(models.Allocation, { foreignKey: "modeID" });
  };

  return Mode;
};
