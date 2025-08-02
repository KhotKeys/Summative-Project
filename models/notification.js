import { DataTypes } from "sequelize";

const Notification = (sequelize) => {
  return sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM(
          "facilitator_reminder",
          "manager_alert",
          "compliance_warning",
          "deadline_alert"
        ),
        allowNull: false,
      },
      recipientType: {
        type: DataTypes.ENUM("facilitator", "manager", "admin"),
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "sent", "failed", "delivered"),
        defaultValue: "pending",
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
      },
      retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      maxRetries: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      indexes: [
        { fields: ["recipientId"] },
        { fields: ["status"] },
        { fields: ["type"] },
        { fields: ["sentAt"] },
        { fields: ["createdAt"] },
      ],
    }
  );
};

export default Notification;
