import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Badge } from "./Badge";
import "@testing-library/jest-dom";

describe("Badge", () => {
  it("renders without crashing", () => {
    render(<Badge />);
    const badge = document.querySelector("div");
    expect(badge).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Badge className="test-class" data-testid="badge-test" />);
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Badge data-testid="badge-test" id="test-id" />);
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("renders children content", () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText("Badge Text")).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<Badge data-testid="badge-test">Default Badge</Badge>);
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass(
      "inline-flex",
      "items-center",
      "rounded-full",
      "border",
      "px-2.5",
      "py-0.5",
      "text-xs",
      "font-semibold"
    );
  });

  it("applies default variant styles", () => {
    render(<Badge data-testid="badge-test">Default</Badge>);
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass(
      "border-transparent",
      "bg-primary",
      "text-primary-foreground"
    );
  });

  it("applies secondary variant styles", () => {
    render(
      <Badge variant="secondary" data-testid="badge-test">
        Secondary
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass(
      "border-transparent",
      "bg-secondary",
      "text-secondary-foreground"
    );
  });

  it("applies destructive variant styles", () => {
    render(
      <Badge variant="destructive" data-testid="badge-test">
        Error
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass(
      "border-transparent",
      "bg-destructive",
      "text-destructive-foreground"
    );
  });

  it("applies outline variant styles", () => {
    render(
      <Badge variant="outline" data-testid="badge-test">
        Outline
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass("text-foreground");
    expect(element).not.toHaveClass("border-transparent");
  });

  it("applies pokemon variant styles", () => {
    render(
      <Badge variant="pokemon" data-testid="badge-test">
        Fire
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass(
      "border-transparent",
      "text-white",
      "font-medium"
    );
  });

  it("combines custom className with variant classes", () => {
    render(
      <Badge
        variant="destructive"
        className="custom-badge"
        data-testid="badge-test"
      >
        Custom
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass("custom-badge", "bg-destructive");
  });

  it("supports focus styles", () => {
    render(<Badge data-testid="badge-test">Focusable</Badge>);
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-ring",
      "focus:ring-offset-2"
    );
  });

  it("supports transition classes", () => {
    render(<Badge data-testid="badge-test">Transition</Badge>);
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass("transition-colors");
  });

  it("supports hover styles for variants", () => {
    render(
      <Badge variant="default" data-testid="badge-test">
        Hover
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveClass("hover:bg-primary/80");
  });

  it("renders with complex content", () => {
    render(
      <Badge data-testid="badge-test">
        <span>🔥</span>
        Fire Type
      </Badge>
    );
    const element = screen.getByTestId("badge-test");
    expect(element).toHaveTextContent("🔥Fire Type");
  });

  it("supports onClick events", () => {
    const handleClick = vi.fn();
    render(
      <Badge onClick={handleClick} data-testid="badge-test">
        Clickable
      </Badge>
    );

    const element = screen.getByTestId("badge-test");
    element.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports all HTML div attributes", () => {
    render(
      <Badge
        data-testid="badge-test"
        title="Badge tooltip"
        role="status"
        aria-label="Status badge"
      >
        Status
      </Badge>
    );

    const element = screen.getByTestId("badge-test");
    expect(element).toHaveAttribute("title", "Badge tooltip");
    expect(element).toHaveAttribute("role", "status");
    expect(element).toHaveAttribute("aria-label", "Status badge");
  });
});
