import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AppNavigation from "./AppNavigation";

// Mock the auth hook
const mockUser = {
  displayName: "John Doe",
  email: "john@example.com",
};

const mockLogout = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/features/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock scroll direction hook
vi.mock("@/shared/hooks/useScrollDirection", () => ({
  useScrollDirection: () => "up",
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("AppNavigation", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation bar", () => {
    renderWithRouter(<AppNavigation />);

    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(2); // One for desktop NavigationMenu, one for main nav

    const mainNav = navs.find((nav) => nav.classList.contains("fixed"));
    expect(mainNav).toBeInTheDocument();
    expect(mainNav).toHaveClass("fixed", "top-0", "left-0", "right-0", "z-50");
  });

  it("renders logo", () => {
    renderWithRouter(<AppNavigation />);

    expect(screen.getByText("Pokedex")).toBeInTheDocument();
  });

  it("renders desktop navigation items", () => {
    renderWithRouter(<AppNavigation />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Pokemon")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("renders mobile menu trigger", () => {
    renderWithRouter(<AppNavigation />);

    const mobileMenuButton = screen.getByRole("button", {
      name: /toggle menu/i,
    });
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toHaveClass("md:hidden");
  });

  it("renders avatar dropdown when user is logged in", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    renderWithRouter(<AppNavigation />);

    // Check for the avatar initial that appears when user is logged in
    expect(screen.getByText("J")).toBeInTheDocument(); // User's first initial
  });

  it("applies correct styling classes", () => {
    renderWithRouter(<AppNavigation />);

    const navs = screen.getAllByRole("navigation");
    const mainNav = navs.find((nav) => nav.classList.contains("fixed"));
    expect(mainNav).toHaveClass(
      "fixed",
      "top-0",
      "left-0",
      "right-0",
      "z-50",
      "bg-gray-800/50",
      "border-b",
      "border-purple-800/30"
    );
  });

  it("has proper container structure", () => {
    const { container } = renderWithRouter(<AppNavigation />);

    const navContainer = container.querySelector(".container");
    expect(navContainer).toBeInTheDocument();
    expect(navContainer).toHaveClass("mx-auto", "px-4");
  });

  it("maintains proper height", () => {
    const { container } = renderWithRouter(<AppNavigation />);

    const flexContainer = container.querySelector(".flex.h-16");
    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass(
      "h-16",
      "items-center",
      "justify-between"
    );
  });
});
