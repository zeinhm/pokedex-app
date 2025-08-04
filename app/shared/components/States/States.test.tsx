import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorState, LoadingState, EmptyState } from "./States";

describe("ErrorState", () => {
  it("renders with default props", () => {
    render(<ErrorState />);

    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("An unexpected error occurred. Please try again.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders with custom title and message", () => {
    render(
      <ErrorState title="Custom Error Title" message="Custom error message" />
    );

    expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const mockRetry = vi.fn();
    render(<ErrorState onRetry={mockRetry} />);

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const mockRetry = vi.fn();
    render(<ErrorState onRetry={mockRetry} />);

    const retryButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("renders custom retry text", () => {
    const mockRetry = vi.fn();
    render(<ErrorState onRetry={mockRetry} retryText="Reload Data" />);

    expect(
      screen.getByRole("button", { name: /reload data/i })
    ).toBeInTheDocument();
  });

  it("displays error icon", () => {
    render(<ErrorState />);

    // Check for the AlertCircle icon (Lucide icons render as SVG)
    const icon = screen
      .getByText("Oops! Something went wrong")
      .parentElement?.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});

describe("LoadingState", () => {
  it("renders with default props", () => {
    render(<LoadingState />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("description")).not.toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(<LoadingState title="Fetching data..." />);

    expect(screen.getByText("Fetching data...")).toBeInTheDocument();
  });

  it("renders with title and description", () => {
    render(
      <LoadingState
        title="Please wait"
        description="This might take a few seconds"
      />
    );

    expect(screen.getByText("Please wait")).toBeInTheDocument();
    expect(
      screen.getByText("This might take a few seconds")
    ).toBeInTheDocument();
  });

  it("applies correct size classes for small size", () => {
    render(<LoadingState size="sm" title="Small Loading" />);

    const title = screen.getByText("Small Loading");
    expect(title).toHaveClass("text-base");
  });

  it("applies correct size classes for medium size (default)", () => {
    render(<LoadingState title="Medium Loading" />);

    const title = screen.getByText("Medium Loading");
    expect(title).toHaveClass("text-lg");
  });

  it("applies correct size classes for large size", () => {
    render(<LoadingState size="lg" title="Large Loading" />);

    const title = screen.getByText("Large Loading");
    expect(title).toHaveClass("text-xl");
  });

  it("applies custom className", () => {
    const { container } = render(
      <LoadingState className="custom-class" title="Custom Loading" />
    );

    const loadingContainer = container.firstChild;
    expect(loadingContainer).toHaveClass("custom-class");
  });

  it("displays loading spinner icon", () => {
    render(<LoadingState />);

    // Check for the Loader2 icon (Lucide icons render as SVG)
    const icon = screen
      .getByText("Loading...")
      .parentElement?.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders with default props", () => {
    render(<EmptyState />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search or filter criteria")
    ).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    render(
      <EmptyState
        title="No Pokemon found"
        description="Try searching for a different Pokemon name"
      />
    );

    expect(screen.getByText("No Pokemon found")).toBeInTheDocument();
    expect(
      screen.getByText("Try searching for a different Pokemon name")
    ).toBeInTheDocument();
  });

  it("has proper styling structure", () => {
    const { container } = render(<EmptyState />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("text-center", "py-16");

    const innerDiv = wrapper?.firstChild;
    expect(innerDiv).toHaveClass(
      "bg-gray-800/30",
      "backdrop-blur-sm",
      "rounded-lg",
      "p-8",
      "border",
      "border-gray-700/50"
    );
  });
});
