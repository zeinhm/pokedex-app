import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Logo } from "./Logo";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("Logo", () => {
  it("renders the logo with correct text", () => {
    renderWithRouter(<Logo />);

    expect(screen.getByText("P")).toBeInTheDocument();
    expect(screen.getByText("Pokedex")).toBeInTheDocument();
  });

  it("renders as a link to home page", () => {
    renderWithRouter(<Logo />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("has proper CSS classes for styling", () => {
    renderWithRouter(<Logo />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("flex", "items-center", "space-x-3", "group");
  });

  it("contains gradient background elements", () => {
    renderWithRouter(<Logo />);

    const logoIcon = screen.getByText("P");
    expect(logoIcon.parentElement).toHaveClass(
      "h-9",
      "w-9",
      "bg-gradient-to-br",
      "from-purple-500",
      "via-blue-500",
      "to-purple-600"
    );
  });
});
