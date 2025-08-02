'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      classID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cohortID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      academicYear: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      enrollmentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      gpa: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.0
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'student'
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'inactive', 'graduated', 'suspended', 'dropped'),
        defaultValue: 'pending',
        allowNull: false
      },
      emergencyContact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        allowNull: true
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      currentTrimester: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      totalCredits: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      loginCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student');
  }
};
