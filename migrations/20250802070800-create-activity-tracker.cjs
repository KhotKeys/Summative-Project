'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_tracker', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      allocationId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      weekNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attendance: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      formativeOneGrading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        defaultValue: 'Not Started'
      },
      formativeTwoGrading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        defaultValue: 'Not Started'
      },
      summativeGrading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        defaultValue: 'Not Started'
      },
      courseModeration: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        defaultValue: 'Not Started'
      },
      intranetSync: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        defaultValue: 'Not Started'
      },
      gradeBookStatus: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        defaultValue: 'Not Started'
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add unique index for allocationId and weekNumber
    await queryInterface.addIndex('activity_tracker', {
      fields: ['allocationId', 'weekNumber'],
      unique: true
    });

    // Add index for weekNumber
    await queryInterface.addIndex('activity_tracker', {
      fields: ['weekNumber']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_tracker');
  }
};
