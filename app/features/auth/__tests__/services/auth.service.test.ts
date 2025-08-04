import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../services/auth.service";

// Mock Firebase functions
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@/shared/config/firebase.config", () => ({
  auth: {},
}));

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });

  it("creates AuthService instance", () => {
    expect(authService).toBeInstanceOf(AuthService);
  });

  it("exports AuthService class", () => {
    expect(AuthService).toBeDefined();
    expect(typeof AuthService).toBe("function");
  });
});
