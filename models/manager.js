export default (sequelize, DataTypes) => {
  const Manager = sequelize.define(
    "Manager",
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "manager",
      },
      status: {
        type: DataTypes.ENUM("pending", "active", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      tableName: "manager",
      timestamps: false,
    }
  );

  Manager.associate = (models) => {
    Manager.hasMany(models.Facilitator, { foreignKey: "managerID" });
  };

  return Manager;
};
