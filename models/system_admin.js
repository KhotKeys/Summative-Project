export default (sequelize, DataTypes) => {
  const SystemAdmin = sequelize.define(
    "SystemAdmin",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: DataTypes.STRING,
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "systemadmin",
      },
    },
    {
      tableName: "system_admin",
      timestamps: false,
    }
  );

  return SystemAdmin;
};
