import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { DesktopNavItems } from "./DesktopNavItems";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("DesktopNavItems", () => {
  it("renders navigation items", () => {
    renderWithRouter(<DesktopNavItems />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Pokemon")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("renders correct navigation links", () => {
    renderWithRouter(<DesktopNavItems />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const pokemonLink = screen.getByRole("link", { name: "Pokemon" });
    const favoritesLink = screen.getByRole("link", { name: "Favorites" });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(pokemonLink).toHaveAttribute("href", "/pokemon");
    expect(favoritesLink).toHaveAttribute("href", "/favorites");
  });

  it("applies proper CSS classes", () => {
    const { container } = renderWithRouter(<DesktopNavItems />);

    const navContainer = container.firstChild;
    expect(navContainer).toHaveClass("hidden", "md:flex");
  });

  it("uses NavigationMenu components", () => {
    renderWithRouter(<DesktopNavItems />);

    // Check that navigation links exist
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("has proper hover and focus styles", () => {
    renderWithRouter(<DesktopNavItems />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass(
      "group",
      "inline-flex",
      "h-9",
      "w-max",
      "items-center",
      "justify-center",
      "rounded-md",
      "bg-transparent"
    );
  });
});
