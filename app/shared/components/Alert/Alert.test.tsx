import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Alert, AlertTitle, AlertDescription } from "./Alert";
import "@testing-library/jest-dom";

describe("Alert", () => {
  it("renders without crashing", () => {
    render(<Alert />);
    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Alert className="test-class" data-testid="alert-test" />);
    const element = screen.getByTestId("alert-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Alert data-testid="alert-test" id="test-id" />);
    const element = screen.getByTestId("alert-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("has correct role attribute", () => {
    render(<Alert />);
    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveAttribute("role", "alert");
  });

  it("applies default variant styles", () => {
    render(<Alert data-testid="alert-test" />);
    const element = screen.getByTestId("alert-test");
    expect(element).toHaveClass("bg-background", "text-foreground");
  });

  it("applies destructive variant styles", () => {
    render(<Alert variant="destructive" data-testid="alert-test" />);
    const element = screen.getByTestId("alert-test");
    expect(element).toHaveClass("border-destructive/50", "text-destructive");
  });

  it("renders children content", () => {
    render(
      <Alert>
        <div data-testid="alert-content">Alert content</div>
      </Alert>
    );
    expect(screen.getByTestId("alert-content")).toBeInTheDocument();
    expect(screen.getByText("Alert content")).toBeInTheDocument();
  });

  it("combines custom className with variant classes", () => {
    render(
      <Alert
        variant="destructive"
        className="custom-class"
        data-testid="alert-test"
      />
    );
    const element = screen.getByTestId("alert-test");
    expect(element).toHaveClass("custom-class", "text-destructive");
  });
});

describe("AlertTitle", () => {
  it("renders as h5 element", () => {
    render(<AlertTitle>Alert Title</AlertTitle>);
    const titleElement = screen.getByRole("heading", { level: 5 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("Alert Title");
  });

  it("applies default styling classes", () => {
    render(<AlertTitle data-testid="alert-title">Test Title</AlertTitle>);
    const element = screen.getByTestId("alert-title");
    expect(element).toHaveClass(
      "mb-1",
      "font-medium",
      "leading-none",
      "tracking-tight"
    );
  });

  it("accepts custom className", () => {
    render(
      <AlertTitle className="custom-title-class" data-testid="alert-title">
        Title
      </AlertTitle>
    );
    const element = screen.getByTestId("alert-title");
    expect(element).toHaveClass("custom-title-class");
  });

  it("forwards additional props", () => {
    render(
      <AlertTitle id="title-id" data-testid="alert-title">
        Title
      </AlertTitle>
    );
    const element = screen.getByTestId("alert-title");
    expect(element).toHaveAttribute("id", "title-id");
  });
});

describe("AlertDescription", () => {
  it("renders as div element", () => {
    render(
      <AlertDescription data-testid="alert-desc">
        Description text
      </AlertDescription>
    );
    const element = screen.getByTestId("alert-desc");
    expect(element.tagName).toBe("DIV");
    expect(element).toHaveTextContent("Description text");
  });

  it("applies default styling classes", () => {
    render(
      <AlertDescription data-testid="alert-desc">Description</AlertDescription>
    );
    const element = screen.getByTestId("alert-desc");
    expect(element).toHaveClass("text-sm", "[&_p]:leading-relaxed");
  });

  it("accepts custom className", () => {
    render(
      <AlertDescription className="custom-desc-class" data-testid="alert-desc">
        Description
      </AlertDescription>
    );
    const element = screen.getByTestId("alert-desc");
    expect(element).toHaveClass("custom-desc-class");
  });

  it("forwards additional props", () => {
    render(
      <AlertDescription id="desc-id" data-testid="alert-desc">
        Description
      </AlertDescription>
    );
    const element = screen.getByTestId("alert-desc");
    expect(element).toHaveAttribute("id", "desc-id");
  });

  it("renders nested paragraph elements correctly", () => {
    render(
      <AlertDescription>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </AlertDescription>
    );
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
  });
});

describe("Alert Component Integration", () => {
  it("renders complete alert with title and description", () => {
    render(
      <Alert data-testid="complete-alert">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning message</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId("complete-alert");
    const title = screen.getByRole("heading", { level: 5 });
    const description = screen.getByText("This is a warning message");

    expect(alert).toBeInTheDocument();
    expect(title).toHaveTextContent("Warning");
    expect(description).toBeInTheDocument();
  });

  it("works with destructive variant and custom content", () => {
    render(
      <Alert variant="destructive" data-testid="destructive-alert">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId("destructive-alert");
    expect(alert).toHaveClass("text-destructive");
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
