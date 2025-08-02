export default (sequelize, DataTypes) => {
  const Facilitator = sequelize.define(
    "Facilitator",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      qualification: DataTypes.STRING,
      location: DataTypes.STRING,
      managerID: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "facilitator",
      },
      status: {
        type: DataTypes.ENUM("pending", "active", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      tableName: "facilitator",
      timestamps: false,
    }
  );

  Facilitator.associate = (models) => {
    Facilitator.belongsTo(models.Manager, { foreignKey: "managerID" });
    Facilitator.hasMany(models.Allocation, { foreignKey: "facilitatorID" });
  };

  return Facilitator;
};
