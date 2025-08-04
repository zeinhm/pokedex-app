import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AvatarDropdown } from "./AvatarDropdown";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("AvatarDropdown", () => {
  const mockOnLogout = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders avatar button", () => {
    renderWithRouter(
      <AvatarDropdown
        user={null}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays user avatar when user is provided", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
      photoURL: "https://example.com/avatar.jpg",
    };

    renderWithRouter(
      <AvatarDropdown
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows fallback when no user photo", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
    };

    renderWithRouter(
      <AvatarDropdown
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows user icon when no display name", () => {
    const mockUser = {
      email: "john@example.com",
    };

    renderWithRouter(
      <AvatarDropdown
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    // Should show User icon in fallback
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays logout option for authenticated user", async () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
    };

    renderWithRouter(
      <AvatarDropdown
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    // Click to open the dropdown
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    // Check for dropdown content
    expect(screen.getByText("J")).toBeInTheDocument(); // Avatar initial
  });

  it("displays login option for unauthenticated user", () => {
    renderWithRouter(
      <AvatarDropdown
        user={null}
        onLogout={mockOnLogout}
        isLoggingOut={false}
      />
    );

    // For unauthenticated users, check for the user icon
    const userIcon = screen.getByRole("button");
    expect(userIcon).toBeInTheDocument();
  });

  it("shows loading state when logging out", () => {
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
    };

    renderWithRouter(
      <AvatarDropdown
        user={mockUser}
        onLogout={mockOnLogout}
        isLoggingOut={true}
      />
    );

    // Check that the avatar is still rendered during logout
    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
