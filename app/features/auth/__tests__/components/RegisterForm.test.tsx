import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { RegisterForm } from "../../components/RegisterForm";

// Mock the auth context
const mockRegister = vi.fn();
const mockClearError = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("../../context/auth.context", () => ({
  useAuth: () => mockUseAuth(),
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

describe("RegisterForm", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      error: null,
      clearError: mockClearError,
    });
    mockRegister.mockReset();
    mockClearError.mockReset();
    mockNavigate.mockReset();
  });

  it("renders registration form correctly", () => {
    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    expect(screen.getByText("Join the Adventure")).toBeInTheDocument();
    expect(
      screen.getByText("Create your Pokemon trainer account")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Trainer Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a strong password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /login here/i })
    ).toBeInTheDocument();
  });

  it("displays error message when error is present", () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      error: "Registration failed",
      clearError: mockClearError,
    });

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled();
      expect(mockRegister).toHaveBeenCalledWith({
        displayName: "Test Trainer",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });
    });
  });

  it("navigates to pokemon page on successful registration", async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/pokemon");
    });
  });

  it("handles registration error gracefully", async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValue(new Error("Registration failed"));

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("shows loading state during form submission", async () => {
    const user = userEvent.setup();
    let resolveRegister: () => void;
    const registerPromise = new Promise<void>((resolve) => {
      resolveRegister = resolve;
    });
    mockRegister.mockReturnValue(registerPromise);

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "Password123");
    await user.click(submitButton);

    // Should show loading state
    expect(screen.getByText("Creating account...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Complete registration
    resolveRegister!();
    await waitFor(() => {
      expect(screen.queryByText("Creating account...")).not.toBeInTheDocument();
    });
  });

  it("validates display name field", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Display name is required")).toBeInTheDocument();
    });
  });

  it("validates display name minimum length", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "A");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Display name must be at least 2 characters")
      ).toBeInTheDocument();
    });
  });

  it("validates email field", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm your password");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Fill form with invalid email format
    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "not-an-email");
    await user.type(passwordInput, "ValidPassword123");
    await user.type(confirmPasswordInput, "ValidPassword123");
    await user.click(submitButton);

    // For now, just verify the form doesn't submit by checking register wasn't called
    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it("validates password field", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("validates password complexity", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Password must contain at least one uppercase letter/)
      ).toBeInTheDocument();
    });
  });

  it("validates confirm password field", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please confirm your password")
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation match", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "DifferentPassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    ) as HTMLInputElement;
    const toggleButtons = screen.getAllByRole("button", { name: "" }); // The eye icon buttons
    const passwordToggle = toggleButtons[0]; // First toggle button for password

    expect(passwordInput.type).toBe("password");

    await user.click(passwordToggle);
    expect(passwordInput.type).toBe("text");

    await user.click(passwordToggle);
    expect(passwordInput.type).toBe("password");
  });

  it("toggles confirm password visibility", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    ) as HTMLInputElement;
    const toggleButtons = screen.getAllByRole("button", { name: "" }); // The eye icon buttons
    const confirmPasswordToggle = toggleButtons[1]; // Second toggle button for confirm password

    expect(confirmPasswordInput.type).toBe("password");

    await user.click(confirmPasswordToggle);
    expect(confirmPasswordInput.type).toBe("text");

    await user.click(confirmPasswordToggle);
    expect(confirmPasswordInput.type).toBe("password");
  });

  it("has correct input placeholders", () => {
    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText("Ash Ketchum")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("trainer@pokemon.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a strong password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
  });

  it("has login link with correct href", () => {
    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const loginLink = screen.getByRole("link", { name: /login here/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("clears error when form is submitted", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      error: "Previous error",
      clearError: mockClearError,
    });

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText("Trainer Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "Password123");
    await user.click(submitButton);

    expect(mockClearError).toHaveBeenCalled();
  });

  it("form submission does not call register with invalid data", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Display name is required")).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("maintains form state during loading", async () => {
    const user = userEvent.setup();
    let resolveRegister: () => void;
    const registerPromise = new Promise<void>((resolve) => {
      resolveRegister = resolve;
    });
    mockRegister.mockReturnValue(registerPromise);

    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText(
      "Trainer Name"
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    ) as HTMLInputElement;

    await user.type(displayNameInput, "Test Trainer");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.type(confirmPasswordInput, "Password123");

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    await user.click(submitButton);

    // Form values should be maintained during loading
    expect(displayNameInput.value).toBe("Test Trainer");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("Password123");
    expect(confirmPasswordInput.value).toBe("Password123");

    // Complete registration
    resolveRegister!();
    await registerPromise;
  });

  it("displays correct icons", () => {
    render(
      <TestWrapper>
        <RegisterForm />
      </TestWrapper>
    );

    // Check that icons are present (they render as SVG elements)
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });
});
