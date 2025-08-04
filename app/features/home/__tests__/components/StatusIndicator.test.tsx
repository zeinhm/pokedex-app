import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusIndicator } from "../../components/StatusIndicator";
import { resetMocks } from "../__mocks__/home.mock";

describe("StatusIndicator", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should render status message", () => {
    render(<StatusIndicator />);

    expect(screen.getByText("Join thousands of trainers worldwide")).toBeInTheDocument();
  });

  it("should render animated indicator dot", () => {
    render(<StatusIndicator />);

    const indicatorDot = screen.getByText("Join thousands of trainers worldwide").previousElementSibling;
    expect(indicatorDot).toHaveClass("w-2", "h-2", "bg-emerald-400", "rounded-full", "animate-pulse");
  });

  it("should have correct container styling", () => {
    render(<StatusIndicator />);

    // Find the outer container, not the inner badge
    const outerContainer = screen.getByText("Join thousands of trainers worldwide").parentElement?.parentElement;
    expect(outerContainer).toHaveClass("mt-16", "text-center");
  });

  it("should have correct badge styling", () => {
    render(<StatusIndicator />);

    const badge = screen.getByText("Join thousands of trainers worldwide").parentElement;
    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "gap-2",
      "bg-gray-800/30",
      "backdrop-blur-sm",
      "rounded-full",
      "px-6",
      "py-3",
      "border",
      "border-gray-700/50"
    );
  });

  it("should have correct text styling", () => {
    render(<StatusIndicator />);

    const text = screen.getByText("Join thousands of trainers worldwide");
    expect(text).toHaveClass("text-gray-300", "text-sm");
  });

  it("should render complete component structure", () => {
    render(<StatusIndicator />);

    // Check that both the dot and text are present
    const dot = screen.getByText("Join thousands of trainers worldwide").previousElementSibling;
    const text = screen.getByText("Join thousands of trainers worldwide");
    
    expect(dot).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    
    // Check they are in the same container
    expect(dot?.parentElement).toBe(text.parentElement);
  });
});
