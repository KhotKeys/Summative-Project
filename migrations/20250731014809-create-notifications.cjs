"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          "facilitator_reminder",
          "manager_alert",
          "compliance_warning",
          "deadline_alert"
        ),
        allowNull: false,
      },
      recipientType: {
        type: Sequelize.ENUM("facilitator", "manager", "admin"),
        allowNull: false,
      },
      recipientId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipientEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "sent", "failed", "delivered"),
        defaultValue: "pending",
      },
      scheduledAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      failureReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
      },
      retryCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      maxRetries: {
        type: Sequelize.INTEGER,
        defaultValue: 3,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex("notifications", ["recipientId"]);
    await queryInterface.addIndex("notifications", ["status"]);
    await queryInterface.addIndex("notifications", ["type"]);
    await queryInterface.addIndex("notifications", ["sentAt"]);
    await queryInterface.addIndex("notifications", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};
