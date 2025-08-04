import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./Card";
import "@testing-library/jest-dom";

describe("Card", () => {
  it("renders without crashing", () => {
    render(<Card data-testid="card-test" />);
    const card = screen.getByTestId("card-test");
    expect(card).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Card className="test-class" data-testid="card-test" />);
    const element = screen.getByTestId("card-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Card data-testid="card-test" id="test-id" />);
    const element = screen.getByTestId("card-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<Card data-testid="card-test" />);
    const element = screen.getByTestId("card-test");
    expect(element).toHaveClass(
      "bg-card",
      "text-card-foreground",
      "flex",
      "flex-col",
      "gap-6",
      "rounded-xl",
      "border",
      "py-6",
      "shadow-sm"
    );
  });

  it("has data-slot attribute", () => {
    render(<Card data-testid="card-test" />);
    const element = screen.getByTestId("card-test");
    expect(element).toHaveAttribute("data-slot", "card");
  });

  it("renders children content", () => {
    render(
      <Card>
        <div data-testid="card-content">Card Content</div>
      </Card>
    );
    expect(screen.getByTestId("card-content")).toBeInTheDocument();
  });
});

describe("CardHeader", () => {
  it("renders without crashing", () => {
    render(<CardHeader data-testid="card-header-test" />);
    const header = screen.getByTestId("card-header-test");
    expect(header).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<CardHeader data-testid="card-header-test" />);
    const element = screen.getByTestId("card-header-test");
    expect(element).toHaveClass(
      "@container/card-header",
      "grid",
      "auto-rows-min",
      "items-start",
      "gap-1.5",
      "px-6"
    );
  });

  it("has data-slot attribute", () => {
    render(<CardHeader data-testid="card-header-test" />);
    const element = screen.getByTestId("card-header-test");
    expect(element).toHaveAttribute("data-slot", "card-header");
  });

  it("renders children content", () => {
    render(
      <CardHeader>
        <div data-testid="header-content">Header Content</div>
      </CardHeader>
    );
    expect(screen.getByTestId("header-content")).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders without crashing", () => {
    render(<CardTitle data-testid="card-title-test">Title</CardTitle>);
    const title = screen.getByTestId("card-title-test");
    expect(title).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<CardTitle data-testid="card-title-test">Title</CardTitle>);
    const element = screen.getByTestId("card-title-test");
    expect(element).toHaveClass("leading-none", "font-semibold");
  });

  it("has data-slot attribute", () => {
    render(<CardTitle data-testid="card-title-test">Title</CardTitle>);
    const element = screen.getByTestId("card-title-test");
    expect(element).toHaveAttribute("data-slot", "card-title");
  });

  it("renders text content", () => {
    render(<CardTitle>My Card Title</CardTitle>);
    expect(screen.getByText("My Card Title")).toBeInTheDocument();
  });
});

describe("CardDescription", () => {
  it("renders without crashing", () => {
    render(
      <CardDescription data-testid="card-description-test">
        Description
      </CardDescription>
    );
    const description = screen.getByTestId("card-description-test");
    expect(description).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(
      <CardDescription data-testid="card-description-test">
        Description
      </CardDescription>
    );
    const element = screen.getByTestId("card-description-test");
    expect(element).toHaveClass("text-muted-foreground", "text-sm");
  });

  it("has data-slot attribute", () => {
    render(
      <CardDescription data-testid="card-description-test">
        Description
      </CardDescription>
    );
    const element = screen.getByTestId("card-description-test");
    expect(element).toHaveAttribute("data-slot", "card-description");
  });

  it("renders text content", () => {
    render(<CardDescription>This is a card description</CardDescription>);
    expect(screen.getByText("This is a card description")).toBeInTheDocument();
  });
});

describe("CardAction", () => {
  it("renders without crashing", () => {
    render(<CardAction data-testid="card-action-test">Action</CardAction>);
    const action = screen.getByTestId("card-action-test");
    expect(action).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<CardAction data-testid="card-action-test">Action</CardAction>);
    const element = screen.getByTestId("card-action-test");
    expect(element).toHaveClass(
      "col-start-2",
      "row-span-2",
      "row-start-1",
      "self-start",
      "justify-self-end"
    );
  });

  it("has data-slot attribute", () => {
    render(<CardAction data-testid="card-action-test">Action</CardAction>);
    const element = screen.getByTestId("card-action-test");
    expect(element).toHaveAttribute("data-slot", "card-action");
  });

  it("renders button content", () => {
    render(
      <CardAction>
        <button>Click me</button>
      </CardAction>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("CardContent", () => {
  it("renders without crashing", () => {
    render(<CardContent data-testid="card-content-test">Content</CardContent>);
    const content = screen.getByTestId("card-content-test");
    expect(content).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<CardContent data-testid="card-content-test">Content</CardContent>);
    const element = screen.getByTestId("card-content-test");
    expect(element).toHaveClass("px-6");
  });

  it("has data-slot attribute", () => {
    render(<CardContent data-testid="card-content-test">Content</CardContent>);
    const element = screen.getByTestId("card-content-test");
    expect(element).toHaveAttribute("data-slot", "card-content");
  });

  it("renders complex content", () => {
    render(
      <CardContent>
        <p>Paragraph content</p>
        <ul>
          <li>List item</li>
        </ul>
      </CardContent>
    );
    expect(screen.getByText("Paragraph content")).toBeInTheDocument();
    expect(screen.getByText("List item")).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders without crashing", () => {
    render(<CardFooter data-testid="card-footer-test">Footer</CardFooter>);
    const footer = screen.getByTestId("card-footer-test");
    expect(footer).toBeInTheDocument();
  });

  it("applies default styling classes", () => {
    render(<CardFooter data-testid="card-footer-test">Footer</CardFooter>);
    const element = screen.getByTestId("card-footer-test");
    expect(element).toHaveClass("flex", "items-center", "px-6");
  });

  it("has data-slot attribute", () => {
    render(<CardFooter data-testid="card-footer-test">Footer</CardFooter>);
    const element = screen.getByTestId("card-footer-test");
    expect(element).toHaveAttribute("data-slot", "card-footer");
  });

  it("renders button actions", () => {
    render(
      <CardFooter>
        <button>Cancel</button>
        <button>Save</button>
      </CardFooter>
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

describe("Card Integration", () => {
  it("renders complete card structure", () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Footer Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId("complete-card")).toBeInTheDocument();
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Card content goes here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Footer Action" })
    ).toBeInTheDocument();
  });

  it("maintains proper semantic structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Accessible Card</CardTitle>
        </CardHeader>
        <CardContent>Content section</CardContent>
      </Card>
    );

    const card = screen
      .getByText("Accessible Card")
      .closest('[data-slot="card"]');
    const header = screen
      .getByText("Accessible Card")
      .closest('[data-slot="card-header"]');
    const content = screen
      .getByText("Content section")
      .closest('[data-slot="card-content"]');

    expect(card).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });
});
