import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Skeleton } from "./Skeleton";
import "@testing-library/jest-dom";

describe("Skeleton", () => {
  it("renders without crashing", () => {
    render(<Skeleton data-testid="skeleton-test" />);
    const skeleton = screen.getByTestId("skeleton-test");
    expect(skeleton).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Skeleton className="test-class" data-testid="skeleton-test" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Skeleton data-testid="skeleton-test" id="test-id" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<Skeleton data-testid="skeleton-test" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveClass("animate-pulse", "rounded-md", "bg-muted");
  });

  it("renders as div element", () => {
    render(<Skeleton data-testid="skeleton-test" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element.tagName).toBe("DIV");
  });

  it("supports custom dimensions via className", () => {
    render(<Skeleton className="h-4 w-full" data-testid="skeleton-test" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveClass("h-4", "w-full", "animate-pulse");
  });

  it("supports different shapes via className", () => {
    render(
      <Skeleton
        className="rounded-full h-12 w-12"
        data-testid="skeleton-test"
      />
    );
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveClass("rounded-full", "h-12", "w-12");
  });

  it("supports children content", () => {
    render(
      <Skeleton data-testid="skeleton-test">
        <span>Loading content</span>
      </Skeleton>
    );
    expect(screen.getByText("Loading content")).toBeInTheDocument();
  });

  it("supports aria-label for accessibility", () => {
    render(
      <Skeleton aria-label="Loading content" data-testid="skeleton-test" />
    );
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveAttribute("aria-label", "Loading content");
  });

  it("supports role attribute for accessibility", () => {
    render(<Skeleton role="status" data-testid="skeleton-test" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveAttribute("role", "status");
  });

  it("supports aria-busy for loading states", () => {
    render(<Skeleton aria-busy="true" data-testid="skeleton-test" />);
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveAttribute("aria-busy", "true");
  });

  it("can render text skeleton with specific height", () => {
    render(<Skeleton className="h-6 w-3/4" data-testid="text-skeleton" />);
    const element = screen.getByTestId("text-skeleton");
    expect(element).toHaveClass("h-6", "w-3/4", "animate-pulse");
  });

  it("can render avatar skeleton with circular shape", () => {
    render(
      <Skeleton
        className="rounded-full h-16 w-16"
        data-testid="avatar-skeleton"
      />
    );
    const element = screen.getByTestId("avatar-skeleton");
    expect(element).toHaveClass("rounded-full", "h-16", "w-16");
  });

  it("can render button skeleton with button-like dimensions", () => {
    render(<Skeleton className="h-9 w-24" data-testid="button-skeleton" />);
    const element = screen.getByTestId("button-skeleton");
    expect(element).toHaveClass("h-9", "w-24");
  });

  it("combines custom classes with default classes correctly", () => {
    render(
      <Skeleton
        className="h-8 w-full bg-gray-300 rounded-lg"
        data-testid="skeleton-test"
      />
    );
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveClass("h-8", "w-full", "bg-gray-300", "rounded-lg");
    expect(element).toHaveClass("animate-pulse");
  });

  it("supports onClick events for interactive skeletons", () => {
    const handleClick = vi.fn();
    render(<Skeleton onClick={handleClick} data-testid="skeleton-test" />);

    const element = screen.getByTestId("skeleton-test");
    element.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports data attributes", () => {
    render(
      <Skeleton
        data-testid="skeleton-test"
        data-loading="true"
        data-type="card"
      />
    );
    const element = screen.getByTestId("skeleton-test");
    expect(element).toHaveAttribute("data-loading", "true");
    expect(element).toHaveAttribute("data-type", "card");
  });

  it("can be used for complex loading layouts", () => {
    render(
      <div data-testid="skeleton-layout">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );

    const layout = screen.getByTestId("skeleton-layout");
    const skeletons = layout.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(3);
  });
});
