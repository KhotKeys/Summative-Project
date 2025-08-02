'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('allocation', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      moduleID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      classID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facilitatorID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cohortID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trimester: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      modeID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('allocation');
  }
};
