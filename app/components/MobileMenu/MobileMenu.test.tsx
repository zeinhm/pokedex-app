import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { MobileMenu } from "./MobileMenu";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("MobileMenu", () => {
  const mockOnLogout = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders menu trigger button", () => {
    renderWithRouter(
      <MobileMenu user={null} onLogout={mockOnLogout} isLoggingOut={false} />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton).toHaveClass("md:hidden");
  });

  it("opens menu when trigger is clicked", () => {
    renderWithRouter(
      <MobileMenu user={null} onLogout={mockOnLogout} isLoggingOut={false} />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText("Pokedex")).toBeInTheDocument();
  });

  it("displays user information when user is logged in", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
      photoURL: "https://example.com/avatar.jpg",
    };

    renderWithRouter(
      <MobileMenu
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("displays login link when user is not logged in", () => {
    renderWithRouter(
      <MobileMenu user={null} onLogout={mockOnLogout} isLoggingOut={false} />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows loading state when logging out", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
    };

    renderWithRouter(
      <MobileMenu user={mockUser} onLogout={mockOnLogout} isLoggingOut={true} />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeDisabled();
  });

  it("calls onLogout when logout button is clicked", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
    };

    renderWithRouter(
      <MobileMenu
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it("displays fallback avatar when no user photo", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
    };

    renderWithRouter(
      <MobileMenu
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
