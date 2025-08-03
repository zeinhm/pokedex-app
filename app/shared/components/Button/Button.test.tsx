import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";
import "@testing-library/jest-dom";

describe("Button", () => {
  it("renders without crashing", () => {
    render(<Button />);
    // Basic rendering test - component should mount without errors
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

  // TODO: Add component-specific tests here
});
