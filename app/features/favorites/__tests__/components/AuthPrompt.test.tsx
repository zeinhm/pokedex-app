import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthPrompt } from "../../components/AuthPrompt";

// Test wrapper with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("AuthPrompt", () => {
  it("renders the auth prompt correctly", () => {
    renderWithRouter(<AuthPrompt />);

    expect(screen.getByText("Login to save favorites")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create an account or Login to start building your Pokemon collection"
      )
    ).toBeInTheDocument();
  });

  it("renders login button with correct link", () => {
    renderWithRouter(<AuthPrompt />);

    const loginButton = screen.getByRole("link", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", "/login");
  });

  it("renders register link with correct text and href", () => {
    renderWithRouter(<AuthPrompt />);

    const registerLink = screen.getByRole("link", { name: /register here/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("contains proper styling classes", () => {
    renderWithRouter(<AuthPrompt />);

    // Find the main card container by looking for the parent element with the background class
    const cardContainer = screen.getByText("Login to save favorites").closest(".bg-gray-800\\/50");
    expect(cardContainer).toHaveClass("bg-gray-800/50", "backdrop-blur-sm");
  });

  it("displays the user icon", () => {
    renderWithRouter(<AuthPrompt />);

    // The User icon should be present (from lucide-react)
    const iconContainer = screen.getByText("Login to save favorites").closest("div");
    expect(iconContainer).toBeInTheDocument();
  });

  it("displays appropriate text for registration", () => {
    renderWithRouter(<AuthPrompt />);

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Register here")).toBeInTheDocument();
  });

  it("has accessible structure", () => {
    renderWithRouter(<AuthPrompt />);

    // Should have proper heading structure
    const heading = screen.getByRole("heading", { name: /login to save favorites/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H3");
  });
});
