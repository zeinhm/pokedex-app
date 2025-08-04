import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";
import "@testing-library/jest-dom";

describe("Input", () => {
  it("renders without crashing", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Input className="test-class" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Input data-testid="input-test" id="test-id" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("has default type when not specified", () => {
    render(<Input data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element.tagName).toBe("INPUT");
  });

  it("accepts custom type attribute", () => {
    render(<Input type="email" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("type", "email");
  });

  it("accepts placeholder text", () => {
    render(<Input placeholder="Enter your name" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("placeholder", "Enter your name");
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input-test" />);

    const input = screen.getByTestId("input-test");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("displays controlled value", () => {
    render(
      <Input
        value="controlled value"
        onChange={() => {}}
        data-testid="input-test"
      />
    );
    const input = screen.getByTestId("input-test") as HTMLInputElement;
    expect(input.value).toBe("controlled value");
  });

  it("can be disabled", () => {
    render(<Input disabled data-testid="input-test" />);
    const input = screen.getByTestId("input-test");
    expect(input).toBeDisabled();
  });

  it("applies default styling classes", () => {
    render(<Input data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveClass(
      "flex",
      "h-9",
      "w-full",
      "rounded-md",
      "border",
      "bg-transparent",
      "px-3",
      "py-1"
    );
  });

  it("applies focus styles", () => {
    render(<Input data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveClass(
      "focus-visible:border-ring",
      "focus-visible:ring-ring/50",
      "focus-visible:ring-[3px]"
    );
  });

  it("applies disabled styles", () => {
    render(<Input disabled data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveClass(
      "disabled:pointer-events-none",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );
  });

  it("applies aria-invalid styles", () => {
    render(<Input aria-invalid="true" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveClass(
      "aria-invalid:ring-destructive/20",
      "aria-invalid:border-destructive"
    );
  });

  it("has data-slot attribute", () => {
    render(<Input data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("data-slot", "input");
  });

  it("supports required attribute", () => {
    render(<Input required data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toBeRequired();
  });

  it("supports min and max attributes for number inputs", () => {
    render(<Input type="number" min="0" max="100" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("min", "0");
    expect(element).toHaveAttribute("max", "100");
  });

  it("supports pattern attribute", () => {
    render(<Input pattern="[0-9]+" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("pattern", "[0-9]+");
  });

  it("handles focus and blur events", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="input-test"
      />
    );

    const input = screen.getByTestId("input-test");

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("supports file input type", () => {
    render(<Input type="file" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("type", "file");
  });

  it("supports password input type", () => {
    render(<Input type="password" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("type", "password");
  });

  it("supports readonly attribute", () => {
    render(<Input readOnly data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("readonly");
  });

  it("supports autoComplete attribute", () => {
    render(<Input autoComplete="email" data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("autocomplete", "email");
  });

  it("supports maxLength attribute", () => {
    render(<Input maxLength={50} data-testid="input-test" />);
    const element = screen.getByTestId("input-test");
    expect(element).toHaveAttribute("maxlength", "50");
  });
});
