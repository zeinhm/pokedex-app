import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/auth.context";

// Mock Firebase
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()), // Return a mock unsubscribe function
  signOut: vi.fn(),
}));

vi.mock("@/shared/config/firebase.config", () => ({
  auth: {},
}));

vi.mock("../../services/auth.service", () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })),
}));

// Test component to use the hook
function TestComponent() {
  const { user, error, loading } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : "No user"}</div>
      <div data-testid="error">{error || "No error"}</div>
      <div data-testid="loading">{loading ? "Loading" : "Not loading"}</div>
    </div>
  );
}

describe("AuthContext", () => {
  it("provides auth context to children", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toBeInTheDocument();
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("exports AuthProvider and useAuth", () => {
    expect(AuthProvider).toBeDefined();
    expect(typeof AuthProvider).toBe("function");
    expect(useAuth).toBeDefined();
    expect(typeof useAuth).toBe("function");
  });
});
