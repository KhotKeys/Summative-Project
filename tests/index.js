import { jest } from '@jest/globals';

jest.mock('../models/index.js', () => ({
  __esModule: true,
  default: {
    Notification: {
      create: jest.fn(),
      update: jest.fn()
    },
    Facilitator: {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn()
    },
    User: {
      findAll: jest.fn()
    },
    Allocation: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      count: jest.fn()
    },
    ActivityTracker: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn()
    },
    Cohort: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn()
    },
    Class: { attributes: ['id', 'name', 'startDate', 'graduationDate'] },
    Student: { attributes: ['id', 'name', 'email'] },
    Module: { attributes: ['id', 'name', 'half'] },
    Mode: { attributes: ['id', 'name'] },
    Manager: {
      findOne: jest.fn(),
      create: jest.fn()
    },
    Sequelize: {
      Op: { notIn: Symbol('notIn'), in: Symbol('in') }
    }
  }
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_NAME = 'lms_test';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_password';
process.env.DB_HOST = 'localhost';
process.env.REDIS_URL = 'redis://localhost:6379';

// Global test timeout
jest.setTimeout(10000);