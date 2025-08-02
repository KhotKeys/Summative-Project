'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('manager', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'manager'
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('manager');
  }
};
