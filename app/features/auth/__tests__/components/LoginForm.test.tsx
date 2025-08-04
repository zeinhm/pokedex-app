import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { LoginForm } from "../../components/LoginForm";

// Mock the auth context
const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock("../../context/auth.context", () => ({
  useAuth: () => ({
    login: mockLogin,
    error: null,
    clearError: mockClearError,
  }),
}));

// Mock react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockClearError.mockReset();
    mockNavigate.mockReset();
  });

  it("renders login form elements", () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("allows user to fill form fields", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls login function on form submission", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("displays validation errors for empty fields", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("exports LoginForm component", () => {
    expect(LoginForm).toBeDefined();
    expect(typeof LoginForm).toBe("function");
  });
});
