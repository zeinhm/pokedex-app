import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Create mock function
const mockUseAuth = vi.fn();

// Mock the auth context before importing the component
vi.mock("@/features/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock React Router
vi.mock("react-router", () => ({
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock Button component
vi.mock("@components/Button", () => ({
  Button: ({ children, asChild, size, className, ...props }: any) => {
    if (asChild) {
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    }
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  },
}));

// Import component after mocks
import { HeroSection } from "../../components/HeroSection";

describe("HeroSection", () => {
  beforeEach(() => {
    mockUseAuth.mockClear();
  });

  it("should render hero title and description", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<HeroSection />);

    expect(screen.getByText("Welcome to the Pokedex")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover, explore, and collect information about all your favorite Pokemon. Join our community and start your journey today!"
      )
    ).toBeInTheDocument();
  });

  it("should render Browse Pokemon button for all users", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<HeroSection />);

    const browsePokemonLink = screen.getByText("Browse Pokemon").closest("a");
    expect(browsePokemonLink).toBeInTheDocument();
    expect(browsePokemonLink).toHaveAttribute("href", "/pokemon");
  });

  it("should render My Favorites button when user is logged in", () => {
    mockUseAuth.mockReturnValue({ 
      user: { 
        uid: "test-uid", 
        email: "test@example.com" 
      } 
    });

    render(<HeroSection />);

    const browsePokemonLink = screen.getByText("Browse Pokemon").closest("a");
    const favoritesLink = screen.getByText("My Favorites").closest("a");

    expect(browsePokemonLink).toBeInTheDocument();
    expect(favoritesLink).toBeInTheDocument();
    expect(favoritesLink).toHaveAttribute("href", "/favorites");
  });

  it("should not render My Favorites button when user is not logged in", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<HeroSection />);

    expect(screen.queryByText("My Favorites")).not.toBeInTheDocument();
    expect(screen.getByText("Browse Pokemon")).toBeInTheDocument();
  });

  it("should have correct styling for hero title", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<HeroSection />);

    const title = screen.getByText("Welcome to the Pokedex");
    expect(title).toHaveClass(
      "text-6xl",
      "font-bold",
      "mb-6",
      "bg-gradient-to-r",
      "from-blue-400",
      "via-purple-400",
      "to-emerald-400",
      "bg-clip-text",
      "text-transparent"
    );
  });

  it("should have correct button styling", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<HeroSection />);

    const button = screen.getByText("Browse Pokemon").parentElement;
    expect(button).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-600",
      "to-purple-600"
    );
  });

  it("should render correct container structure", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<HeroSection />);

    const container = screen.getByText("Welcome to the Pokedex").closest("div");
    expect(container).toHaveClass("text-center", "text-white");
  });
});
