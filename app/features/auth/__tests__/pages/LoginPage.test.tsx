import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import LoginPage, { meta } from "../../pages/LoginPage";

// Mock the LoginForm component
vi.mock("../../components/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">Login Form Component</div>,
}));

// Mock the auth context
vi.mock("../../context/auth.context", () => ({
  useAuth: () => ({
    login: vi.fn(),
    error: null,
    clearError: vi.fn(),
  }),
}));

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe("LoginPage", () => {
  it("renders LoginForm component", () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("Login Form Component")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  describe("meta function", () => {
    it("returns correct meta data", () => {
      // Meta function expects args parameter
      const metaData = meta({} as any);

      expect(metaData).toEqual([
        { title: "Login - Pokedex App" },
        {
          name: "description",
          content: "Login to your Pokemon trainer account",
        },
      ]);
    });

    it("returns array with correct length", () => {
      const metaData = meta({} as any);
      expect(Array.isArray(metaData)).toBe(true);
      expect(metaData).toHaveLength(2);
    });

    it("has correct title meta tag", () => {
      const metaData = meta({} as any);
      const titleMeta = metaData?.find((item) => "title" in item);

      expect(titleMeta).toBeDefined();
      expect((titleMeta as any)?.title).toBe("Login - Pokedex App");
    });

    it("has correct description meta tag", () => {
      const metaData = meta({} as any);
      const descriptionMeta = metaData?.find(
        (item) => "name" in item && (item as any).name === "description"
      );

      expect(descriptionMeta).toBeDefined();
      expect((descriptionMeta as any)?.content).toBe(
        "Login to your Pokemon trainer account"
      );
    });
  });

  it("exports default component", () => {
    expect(LoginPage).toBeDefined();
    expect(typeof LoginPage).toBe("function");
  });

  it("exports meta function", () => {
    expect(meta).toBeDefined();
    expect(typeof meta).toBe("function");
  });
});
