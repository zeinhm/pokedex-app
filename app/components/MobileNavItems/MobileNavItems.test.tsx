import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { MobileNavItems } from "./MobileNavItems";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("MobileNavItems", () => {
  const mockOnNavigate = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation items", () => {
    renderWithRouter(<MobileNavItems onNavigate={mockOnNavigate} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Pokemon")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("displays icons for each navigation item", () => {
    renderWithRouter(<MobileNavItems onNavigate={mockOnNavigate} />);

    // Check that icons are present (they should be svg elements inside links)
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    links.forEach((link) => {
      expect(link.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("calls onNavigate when item is clicked", () => {
    renderWithRouter(<MobileNavItems onNavigate={mockOnNavigate} />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    fireEvent.click(homeLink);

    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  it("renders correct links", () => {
    renderWithRouter(<MobileNavItems onNavigate={mockOnNavigate} />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    const pokemonLink = screen.getByRole("link", { name: /pokemon/i });
    const favoritesLink = screen.getByRole("link", { name: /favorites/i });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(pokemonLink).toHaveAttribute("href", "/pokemon");
    expect(favoritesLink).toHaveAttribute("href", "/favorites");
  });

  it("applies proper mobile styling classes", () => {
    const { container } = renderWithRouter(
      <MobileNavItems onNavigate={mockOnNavigate} />
    );

    const navContainer = container.firstChild;
    expect(navContainer).toHaveClass("flex", "flex-col", "space-y-1", "mt-6");
  });

  it("has proper button styling", () => {
    renderWithRouter(<MobileNavItems onNavigate={mockOnNavigate} />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass(
        "justify-start",
        "h-12",
        "text-base",
        "font-medium"
      );
    });
  });
});
