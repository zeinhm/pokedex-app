import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Separator } from "./Separator";
import "@testing-library/jest-dom";

describe("Separator", () => {
  it("renders without crashing", () => {
    render(<Separator data-testid="separator-test" />);
    const separator = screen.getByTestId("separator-test");
    expect(separator).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Separator className="test-class" data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Separator data-testid="separator-test" id="test-id" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<Separator data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveClass(
      "bg-border",
      "shrink-0",
      "data-[orientation=horizontal]:h-px",
      "data-[orientation=horizontal]:w-full",
      "data-[orientation=vertical]:h-full",
      "data-[orientation=vertical]:w-px"
    );
  });

  it("has data-slot attribute", () => {
    render(<Separator data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("data-slot", "separator");
  });

  it("defaults to horizontal orientation", () => {
    render(<Separator data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("data-orientation", "horizontal");
  });

  it("supports horizontal orientation explicitly", () => {
    render(<Separator orientation="horizontal" data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("data-orientation", "horizontal");
  });

  it("supports vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("data-orientation", "vertical");
  });

  it("defaults to decorative true", () => {
    render(<Separator data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("role", "none");
  });

  it("supports decorative true explicitly", () => {
    render(<Separator decorative={true} data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("role", "none");
  });

  it("supports decorative false for semantic separator", () => {
    render(<Separator decorative={false} data-testid="separator-test" />);
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("role", "separator");
  });

  it("renders as semantic separator with proper ARIA attributes", () => {
    render(
      <Separator
        decorative={false}
        orientation="horizontal"
        data-testid="separator-test"
      />
    );
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("role", "separator");
    expect(element).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders as semantic vertical separator", () => {
    render(
      <Separator
        decorative={false}
        orientation="vertical"
        data-testid="separator-test"
      />
    );
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("role", "separator");
    expect(element).toHaveAttribute("data-orientation", "vertical");
  });

  it("supports custom styling with orientation", () => {
    render(
      <Separator
        className="border-red-500 border-2"
        orientation="horizontal"
        data-testid="separator-test"
      />
    );
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveClass("border-red-500", "border-2");
    expect(element).toHaveAttribute("data-orientation", "horizontal");
  });

  it("combines custom className with default classes", () => {
    render(
      <Separator className="custom-separator" data-testid="separator-test" />
    );
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveClass("custom-separator", "bg-border", "shrink-0");
  });

  it("renders in different contexts appropriately", () => {
    render(
      <div>
        <div>Content above</div>
        <Separator data-testid="context-separator" />
        <div>Content below</div>
      </div>
    );

    const separator = screen.getByTestId("context-separator");
    expect(separator).toBeInTheDocument();
    expect(screen.getByText("Content above")).toBeInTheDocument();
    expect(screen.getByText("Content below")).toBeInTheDocument();
  });

  it("supports all valid HTML attributes", () => {
    render(
      <Separator
        data-testid="separator-test"
        title="Visual separator"
        style={{ opacity: 0.5 }}
      />
    );
    const element = screen.getByTestId("separator-test");
    expect(element).toHaveAttribute("title", "Visual separator");
    expect(element).toHaveStyle({ opacity: "0.5" });
  });
});
