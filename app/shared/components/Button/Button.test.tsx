import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";
import "@testing-library/jest-dom";

describe("Button", () => {
  it("renders without crashing", () => {
    render(<Button />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Button className="test-class" data-testid="button-test" />);
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Button data-testid="button-test" id="test-id" />);
    const element = screen.getByTestId("button-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("renders children content", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("applies default variant styles", () => {
    render(<Button data-testid="button-test">Default</Button>);
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("applies destructive variant styles", () => {
    render(
      <Button variant="destructive" data-testid="button-test">
        Delete
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("bg-destructive", "text-white");
  });

  it("applies outline variant styles", () => {
    render(
      <Button variant="outline" data-testid="button-test">
        Outline
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("border", "bg-background");
  });

  it("applies secondary variant styles", () => {
    render(
      <Button variant="secondary" data-testid="button-test">
        Secondary
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("bg-secondary", "text-secondary-foreground");
  });

  it("applies ghost variant styles", () => {
    render(
      <Button variant="ghost" data-testid="button-test">
        Ghost
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass(
      "hover:bg-accent",
      "hover:text-accent-foreground"
    );
  });

  it("applies link variant styles", () => {
    render(
      <Button variant="link" data-testid="button-test">
        Link
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("text-primary", "underline-offset-4");
  });

  it("applies default size styles", () => {
    render(<Button data-testid="button-test">Default Size</Button>);
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("h-9", "px-4", "py-2");
  });

  it("applies small size styles", () => {
    render(
      <Button size="sm" data-testid="button-test">
        Small
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("h-8", "px-3");
  });

  it("applies large size styles", () => {
    render(
      <Button size="lg" data-testid="button-test">
        Large
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("h-10", "px-6");
  });

  it("applies icon size styles", () => {
    render(
      <Button size="icon" data-testid="button-test">
        🔍
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("size-9");
  });

  it("combines variant and size classes correctly", () => {
    render(
      <Button variant="destructive" size="lg" data-testid="button-test">
        Large Destructive
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass("bg-destructive", "h-10", "px-6");
  });

  it("renders as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test" data-testid="link-button">
          Link Button
        </a>
      </Button>
    );

    const linkElement = screen.getByTestId("link-button");
    expect(linkElement.tagName).toBe("A");
    expect(linkElement).toHaveAttribute("href", "/test");
    expect(linkElement).toHaveTextContent("Link Button");
  });

  it("applies data-slot attribute", () => {
    render(<Button data-testid="button-test">Test</Button>);
    const element = screen.getByTestId("button-test");
    expect(element).toHaveAttribute("data-slot", "button");
  });

  it("maintains focus styles", () => {
    render(<Button data-testid="button-test">Focus Test</Button>);
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass(
      "focus-visible:border-ring",
      "focus-visible:ring-ring/50"
    );
  });

  it("maintains disabled styles", () => {
    render(
      <Button disabled data-testid="button-test">
        Disabled
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveClass(
      "disabled:pointer-events-none",
      "disabled:opacity-50"
    );
  });

  it("supports type attribute", () => {
    render(
      <Button type="submit" data-testid="button-test">
        Submit
      </Button>
    );
    const element = screen.getByTestId("button-test");
    expect(element).toHaveAttribute("type", "submit");
  });

  it("prevents click when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
