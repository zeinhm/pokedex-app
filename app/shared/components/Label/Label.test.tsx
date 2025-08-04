import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Label } from "./Label";
import "@testing-library/jest-dom";

describe("Label", () => {
  it("renders without crashing", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Label className="test-class" data-testid="label-test" />);
    const element = screen.getByTestId("label-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Label data-testid="label-test" id="test-id" />);
    const element = screen.getByTestId("label-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("renders children content", () => {
    render(<Label>Label Text</Label>);
    expect(screen.getByText("Label Text")).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<Label data-testid="label-test">Styled Label</Label>);
    const element = screen.getByTestId("label-test");
    expect(element).toHaveClass(
      "flex",
      "items-center",
      "gap-2",
      "text-sm",
      "leading-none",
      "font-medium",
      "select-none"
    );
  });

  it("has data-slot attribute", () => {
    render(<Label data-testid="label-test">Test</Label>);
    const element = screen.getByTestId("label-test");
    expect(element).toHaveAttribute("data-slot", "label");
  });

  it("supports htmlFor attribute for form association", () => {
    render(
      <Label htmlFor="input-id" data-testid="label-test">
        Form Label
      </Label>
    );
    const element = screen.getByTestId("label-test");
    expect(element).toHaveAttribute("for", "input-id");
  });

  it("works with associated input element", () => {
    render(
      <div>
        <Label htmlFor="test-input">Username</Label>
        <input id="test-input" type="text" />
      </div>
    );

    const label = screen.getByText("Username");
    const input = screen.getByRole("textbox");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  it("supports click events", () => {
    const handleClick = vi.fn();
    render(
      <Label onClick={handleClick} data-testid="label-test">
        Clickable Label
      </Label>
    );

    const label = screen.getByTestId("label-test");
    fireEvent.click(label);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is associated with input element correctly", () => {
    render(
      <div>
        <Label htmlFor="focus-input">Click to focus</Label>
        <input id="focus-input" type="text" data-testid="focus-input" />
      </div>
    );

    const label = screen.getByText("Click to focus");
    const input = screen.getByTestId("focus-input");

    expect(label).toHaveAttribute("for", "focus-input");
    expect(input).toHaveAttribute("id", "focus-input");
  });

  it("applies disabled styles when group is disabled", () => {
    render(
      <div data-disabled="true">
        <Label data-testid="label-test">Disabled Label</Label>
      </div>
    );
    const element = screen.getByTestId("label-test");
    expect(element).toHaveClass(
      "group-data-[disabled=true]:pointer-events-none"
    );
  });

  it("applies peer disabled styles", () => {
    render(<Label data-testid="label-test">Peer Disabled Label</Label>);
    const element = screen.getByTestId("label-test");
    expect(element).toHaveClass(
      "peer-disabled:cursor-not-allowed",
      "peer-disabled:opacity-50"
    );
  });

  it("renders with icon content", () => {
    render(
      <Label data-testid="label-test">
        <span>📧</span>
        Email
      </Label>
    );
    const element = screen.getByTestId("label-test");
    expect(element).toHaveTextContent("📧Email");
  });

  it("supports aria-label attribute", () => {
    render(
      <Label aria-label="Accessible label" data-testid="label-test">
        Visual Label
      </Label>
    );
    const element = screen.getByTestId("label-test");
    expect(element).toHaveAttribute("aria-label", "Accessible label");
  });

  it("supports required field indication", () => {
    render(
      <Label data-testid="label-test">
        Username <span aria-label="required">*</span>
      </Label>
    );
    const element = screen.getByTestId("label-test");
    expect(element).toHaveTextContent("Username *");
    expect(screen.getByLabelText("required")).toBeInTheDocument();
  });

  it("combines custom className with default classes", () => {
    render(
      <Label
        className="custom-label-class text-red-500"
        data-testid="label-test"
      >
        Custom Label
      </Label>
    );
    const element = screen.getByTestId("label-test");
    expect(element).toHaveClass(
      "custom-label-class",
      "text-red-500",
      "flex",
      "items-center"
    );
  });

  it("supports complex content structure", () => {
    render(
      <Label data-testid="label-test">
        <div>
          <span>Primary Text</span>
          <small>Secondary text</small>
        </div>
      </Label>
    );
    expect(screen.getByText("Primary Text")).toBeInTheDocument();
    expect(screen.getByText("Secondary text")).toBeInTheDocument();
  });
});
