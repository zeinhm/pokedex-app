import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "../../schemas/auth.schemas";

describe("Auth Schemas", () => {
  describe("loginSchema", () => {
    it("validates valid login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("requires email field", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email is required");
        expect(result.error.issues[0].path).toEqual(["email"]);
      }
    });

    it("validates email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });

    it("requires password field", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
        expect(result.error.issues[0].path).toEqual(["password"]);
      }
    });

    it("validates minimum password length", () => {
      const invalidData = {
        email: "test@example.com",
        password: "12345",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must be at least 6 characters"
        );
      }
    });

    it("accepts empty string as invalid email", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email is required");
      }
    });

    it("accepts empty string as invalid password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
      }
    });
  });

  describe("registerSchema", () => {
    it("validates valid registration data", () => {
      const validData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("requires display name field", () => {
      const invalidData = {
        displayName: "",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Display name is required");
        expect(result.error.issues[0].path).toEqual(["displayName"]);
      }
    });

    it("validates display name minimum length", () => {
      const invalidData = {
        displayName: "A",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Display name must be at least 2 characters"
        );
      }
    });

    it("validates display name maximum length", () => {
      const invalidData = {
        displayName: "A".repeat(51),
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Display name must be less than 50 characters"
        );
      }
    });

    it("requires email field", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email is required");
        expect(result.error.issues[0].path).toEqual(["email"]);
      }
    });

    it("validates email format", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "invalid-email",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });

    it("requires password field", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
        expect(result.error.issues[0].path).toEqual(["password"]);
      }
    });

    it("validates password minimum length", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "12345",
        confirmPassword: "12345",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must be at least 6 characters"
        );
      }
    });

    it("validates password complexity requirements", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        );
      }
    });

    it("validates password complexity - missing uppercase", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("validates password complexity - missing lowercase", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "PASSWORD123",
        confirmPassword: "PASSWORD123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("validates password complexity - missing number", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "Password",
        confirmPassword: "Password",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("requires confirm password field", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please confirm your password"
        );
        expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
      }
    });

    it("validates password confirmation match", () => {
      const invalidData = {
        displayName: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "DifferentPassword123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
        expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
      }
    });

    it("accepts valid display name edge cases", () => {
      const validData = {
        displayName: "Jo",
        email: "jo@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts valid display name with maximum length", () => {
      const validData = {
        displayName: "A".repeat(50),
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
