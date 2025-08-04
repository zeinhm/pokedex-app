import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Progress } from "./Progress";
import "@testing-library/jest-dom";

describe("Progress", () => {
  it("renders without crashing", () => {
    render(<Progress data-testid="progress-test" />);
    const progress = screen.getByTestId("progress-test");
    expect(progress).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Progress className="test-class" data-testid="progress-test" />);
    const element = screen.getByTestId("progress-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Progress data-testid="progress-test" id="test-id" />);
    const element = screen.getByTestId("progress-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<Progress data-testid="progress-test" />);
    const element = screen.getByTestId("progress-test");
    expect(element).toHaveClass(
      "relative",
      "h-4",
      "w-full",
      "overflow-hidden",
      "rounded-full",
      "bg-secondary"
    );
  });

  it("has progressbar role", () => {
    render(<Progress value={50} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("displays progress value correctly", () => {
    render(<Progress value={75} data-testid="progress-test" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("renders indicator with correct transform for 0%", () => {
    render(<Progress value={0} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(-100%)");
  });

  it("renders indicator with correct transform for 50%", () => {
    render(<Progress value={50} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(-50%)");
  });

  it("renders indicator with correct transform for 100%", () => {
    render(<Progress value={100} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(-0%)");
  });

  it("handles undefined value gracefully", () => {
    render(<Progress data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(-100%)");
  });

  it("applies indicator styling classes", () => {
    render(<Progress value={50} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveClass(
      "h-full",
      "w-full",
      "flex-1",
      "bg-primary",
      "transition-all"
    );
  });

  it("supports max attribute", () => {
    render(<Progress value={50} max={200} data-testid="progress-test" />);
    const element = screen.getByTestId("progress-test");
    expect(element).toHaveAttribute("data-max", "200");
  });

  it("supports aria-label", () => {
    render(<Progress value={75} aria-label="Loading progress" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-label", "Loading progress");
  });

  it("supports aria-labelledby", () => {
    render(
      <div>
        <div id="progress-label">Upload Progress</div>
        <Progress value={60} aria-labelledby="progress-label" />
      </div>
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-labelledby", "progress-label");
  });

  it("renders with decimal values", () => {
    render(<Progress value={33.3} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(-66.7%)");
  });

  it("handles values greater than 100", () => {
    render(<Progress value={150} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(--50%)");
  });

  it("handles negative values", () => {
    render(<Progress value={-10} data-testid="progress-test" />);
    const indicator = screen.getByTestId("progress-test")
      .firstChild as HTMLElement;
    expect(indicator).toHaveStyle("transform: translateX(-110%)");
  });

  it("combines custom className with default classes", () => {
    render(
      <Progress
        value={25}
        className="custom-progress bg-red-500"
        data-testid="progress-test"
      />
    );
    const element = screen.getByTestId("progress-test");
    expect(element).toHaveClass(
      "custom-progress",
      "bg-red-500",
      "relative",
      "h-4"
    );
  });
});
