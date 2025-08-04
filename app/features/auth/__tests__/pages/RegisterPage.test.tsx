import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import RegisterPage, { meta } from "../../pages/RegisterPage";

// Mock the RegisterForm component
vi.mock("../../components/RegisterForm", () => ({
  RegisterForm: () => (
    <div data-testid="register-form">Register Form Component</div>
  ),
}));

// Mock the auth context
vi.mock("../../context/auth.context", () => ({
  useAuth: () => ({
    register: vi.fn(),
    error: null,
    clearError: vi.fn(),
  }),
}));

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe("RegisterPage", () => {
  it("renders RegisterForm component", () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(screen.getByText("Register Form Component")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => {
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  describe("meta function", () => {
    it("returns correct meta data", () => {
      // Meta function expects args parameter
      const metaData = meta({} as any);

      expect(metaData).toEqual([
        { title: "Create Account - Pokedex App" },
        { name: "description", content: "Join the Pokemon adventure today" },
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
      expect((titleMeta as any)?.title).toBe("Create Account - Pokedex App");
    });

    it("has correct description meta tag", () => {
      const metaData = meta({} as any);
      const descriptionMeta = metaData?.find(
        (item) => "name" in item && (item as any).name === "description"
      );

      expect(descriptionMeta).toBeDefined();
      expect((descriptionMeta as any)?.content).toBe(
        "Join the Pokemon adventure today"
      );
    });
  });

  it("exports default component", () => {
    expect(RegisterPage).toBeDefined();
    expect(typeof RegisterPage).toBe("function");
  });

  it("exports meta function", () => {
    expect(meta).toBeDefined();
    expect(typeof meta).toBe("function");
  });
});
