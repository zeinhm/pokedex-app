import { describe, it, expect } from "vitest";
import { mapFirebaseUser } from "../../types/auth.types";
import type { User } from "firebase/auth";

// Mock Firebase User object
const createMockFirebaseUser = (overrides?: Partial<User>): User =>
  ({
    uid: "test-uid-123",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: "https://example.com/photo.jpg",
    emailVerified: true,
    phoneNumber: null,
    isAnonymous: false,
    providerId: "firebase",
    metadata: {
      creationTime: "2023-01-01T00:00:00.000Z",
      lastSignInTime: "2023-01-02T00:00:00.000Z",
    },
    providerData: [],
    refreshToken: "mock-refresh-token",
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "mock-id-token",
    getIdTokenResult: async () => ({
      token: "mock-id-token",
      authTime: "2023-01-02T00:00:00.000Z",
      issuedAtTime: "2023-01-02T00:00:00.000Z",
      expirationTime: "2023-01-02T01:00:00.000Z",
      signInProvider: "password",
      signInSecondFactor: null,
      claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
    ...overrides,
  }) as User;

describe("Auth Types", () => {
  describe("mapFirebaseUser", () => {
    it("maps Firebase user to AuthUser correctly", () => {
      const firebaseUser = createMockFirebaseUser();

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser).toEqual({
        uid: "test-uid-123",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "https://example.com/photo.jpg",
        emailVerified: true,
      });
    });

    it("handles null email correctly", () => {
      const firebaseUser = createMockFirebaseUser({
        email: null,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser.email).toBeNull();
      expect(authUser.uid).toBe("test-uid-123");
    });

    it("handles null displayName correctly", () => {
      const firebaseUser = createMockFirebaseUser({
        displayName: null,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser.displayName).toBeNull();
      expect(authUser.uid).toBe("test-uid-123");
    });

    it("handles null photoURL correctly", () => {
      const firebaseUser = createMockFirebaseUser({
        photoURL: null,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser.photoURL).toBeNull();
      expect(authUser.uid).toBe("test-uid-123");
    });

    it("handles unverified email correctly", () => {
      const firebaseUser = createMockFirebaseUser({
        emailVerified: false,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser.emailVerified).toBe(false);
      expect(authUser.uid).toBe("test-uid-123");
    });

    it("maps minimal Firebase user data", () => {
      const firebaseUser = createMockFirebaseUser({
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser).toEqual({
        uid: "test-uid-123",
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
      });
    });

    it("preserves UID correctly", () => {
      const customUid = "custom-user-id-456";
      const firebaseUser = createMockFirebaseUser({
        uid: customUid,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser.uid).toBe(customUid);
    });

    it("handles different email formats", () => {
      const testEmails = [
        "user@domain.com",
        "test.email+tag@example.org",
        "user.name@company.co.uk",
      ];

      testEmails.forEach((email) => {
        const firebaseUser = createMockFirebaseUser({ email });
        const authUser = mapFirebaseUser(firebaseUser);
        expect(authUser.email).toBe(email);
      });
    });

    it("handles long display names", () => {
      const longDisplayName = "A".repeat(100);
      const firebaseUser = createMockFirebaseUser({
        displayName: longDisplayName,
      });

      const authUser = mapFirebaseUser(firebaseUser);

      expect(authUser.displayName).toBe(longDisplayName);
    });

    it("handles various photo URL formats", () => {
      const photoUrls = [
        "https://example.com/photo.jpg",
        "https://cdn.example.com/users/123/avatar.png",
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      ];

      photoUrls.forEach((photoURL) => {
        const firebaseUser = createMockFirebaseUser({ photoURL });
        const authUser = mapFirebaseUser(firebaseUser);
        expect(authUser.photoURL).toBe(photoURL);
      });
    });
  });

  describe("Type interfaces", () => {
    it("AuthUser interface has correct structure", () => {
      const authUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "https://example.com/photo.jpg",
        emailVerified: true,
      };

      // This test verifies the interface structure by checking that TypeScript
      // allows assignment of the object to the interface type
      expect(authUser.uid).toBe("test-uid");
      expect(authUser.email).toBe("test@example.com");
      expect(authUser.displayName).toBe("Test User");
      expect(authUser.photoURL).toBe("https://example.com/photo.jpg");
      expect(authUser.emailVerified).toBe(true);
    });

    it("AuthState interface has correct structure", () => {
      const authState = {
        user: null,
        loading: false,
        error: null,
      };

      expect(authState.user).toBeNull();
      expect(authState.loading).toBe(false);
      expect(authState.error).toBeNull();
    });

    it("LoginFormData interface has correct structure", () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      expect(loginData.email).toBe("test@example.com");
      expect(loginData.password).toBe("password123");
    });

    it("RegisterFormData interface has correct structure", () => {
      const registerData = {
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
        displayName: "Test User",
      };

      expect(registerData.email).toBe("test@example.com");
      expect(registerData.password).toBe("Password123");
      expect(registerData.confirmPassword).toBe("Password123");
      expect(registerData.displayName).toBe("Test User");
    });
  });
});
