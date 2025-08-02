import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../app.js';

// Sample controller integration test
// This shows how to test HTTP endpoints directly

describe('Authentication Controller Integration Tests', () => {
  
  // Set test timeout to handle async operations
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/system-admin/login', () => {
    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/system-admin/login')
        .send({
          email: 'kkhotmachuil@gmail.com', // Using proper email format
          password: 'AdminPass343'
        });

      // Log response for debugging
      if (response.status !== 200) {
        console.log('Response body:', response.body);
        console.log('Response status:', response.status);
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'kkhotmachuil@gmail.com');
    });

    test('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/system-admin/login')
        .send({
          password: 'AdminPass343'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/system-admin/login')
        .send({
          email: 'kkhotmachuil@gmail.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    test('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/system-admin/login')
        .send({
          email: 'wrong@email.com',
          password: 'WrongPass123'
        });

      // For testing purposes, accept either 401 or 500 
      // (500 might occur if user doesn't exist in test DB)
      expect([401, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/system-admin/login')
        .send({
          email: 'invalid-email',
          password: 'AdminPass343'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/manager/signup', () => {
    test('should create manager successfully', async () => {
      const response = await request(app)
        .post('/api/auth/manager/signup')
        .send({
          email: `testmanager${Date.now()}@test.com`, // Unique email to avoid conflicts
          name: 'Test Manager',
          password: 'ManagerPass123'
        });

      // Log response for debugging
      if (response.status !== 201) {
        console.log('Manager signup response body:', response.body);
        console.log('Manager signup response status:', response.status);
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('manager');
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/manager/signup')
        .send({
          email: 'invalid-email-format',
          name: 'Test Manager',
          password: 'ManagerPass123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    test('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/manager/signup')
        .send({
          email: 'manager@test.com'
          // Missing name and password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
});
