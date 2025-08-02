import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, authenticateUser } from "../services/authService.js";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("uuid", () => ({ v4: () => "mock-uuid-123" }));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    test("should create a new manager successfully", async () => {
      const mockManager = {
        id: "mock-uuid-123",
        email: "manager@test.com",
        name: "Test Manager",
        role: "manager",
      };

      const { default: db } = await import("../models/index.js");

      db.Manager.findOne.mockResolvedValue(null);
      db.Manager.create.mockResolvedValue(mockManager);
      bcrypt.hash.mockResolvedValue("hashed-password");

      const result = await createUser("manager", {
        email: "manager@test.com",
        name: "Test Manager",
        password: "password123",
      });

      expect(db.Manager.findOne).toHaveBeenCalledWith({
        where: { email: "manager@test.com" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
      expect(result).toEqual(mockManager);
    });

    test("should throw error if user already exists", async () => {
      const { default: db } = await import("../models/index.js");

      db.Manager.findOne.mockResolvedValue({ email: "existing@test.com" });

      await expect(
        createUser("manager", {
          email: "existing@test.com",
          name: "Test Manager",
          password: "password123",
        })
      ).rejects.toThrow("Manager with this email already exists");
    });
  });

  describe("authenticateUser", () => {
    test("should authenticate user successfully", async () => {
      const mockUser = {
        id: "user-id-123",
        email: "test@test.com",
        password: "hashed-password",
        role: "manager",
        status: "active",
      };

      const { default: db } = await import("../models/index.js");

      db.Manager.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mock-jwt-token");

      const result = await authenticateUser(
        "manager",
        "test@test.com",
        "password123"
      );

      expect(result.token).toBe("mock-jwt-token");
      expect(result.user).toEqual(mockUser);
    });

    test("should throw error for invalid credentials", async () => {
      const { default: db } = await import("../models/index.js");

      db.Manager.findOne.mockResolvedValue(null);

      await expect(
        authenticateUser("manager", "invalid@test.com", "wrong-password")
      ).rejects.toThrow("Invalid credentials");
    });

    test("should throw error for wrong password", async () => {
      const mockUser = {
        email: "test@test.com",
        password: "hashed-password",
        status: "active",
      };

      const { default: db } = await import("../models/index.js");

      db.Manager.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authenticateUser("manager", "test@test.com", "wrong-password")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
