import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import "@testing-library/jest-dom";

describe("Tabs", () => {
  it("renders without crashing", () => {
    render(<Tabs data-testid="tabs-test" />);
    const tabs = screen.getByTestId("tabs-test");
    expect(tabs).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Tabs className="test-class" data-testid="tabs-test" />);
    const element = screen.getByTestId("tabs-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Tabs data-testid="tabs-test" id="test-id" />);
    const element = screen.getByTestId("tabs-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<Tabs data-testid="tabs-test" />);
    const element = screen.getByTestId("tabs-test");
    expect(element).toHaveClass("flex", "flex-col", "gap-2");
  });

  it("has data-slot attribute", () => {
    render(<Tabs data-testid="tabs-test" />);
    const element = screen.getByTestId("tabs-test");
    expect(element).toHaveAttribute("data-slot", "tabs");
  });

  it("supports defaultValue prop", () => {
    render(<Tabs defaultValue="tab1" data-testid="tabs-test" />);
    const element = screen.getByTestId("tabs-test");
    expect(element).toBeInTheDocument();
  });

  it("supports value prop for controlled usage", () => {
    render(<Tabs value="tab2" data-testid="tabs-test" />);
    const element = screen.getByTestId("tabs-test");
    expect(element).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Tabs data-testid="tabs-test">
        <div data-testid="tabs-content">Tab Content</div>
      </Tabs>
    );
    expect(screen.getByTestId("tabs-content")).toBeInTheDocument();
  });
});

describe("TabsList", () => {
  it("renders without crashing", () => {
    render(
      <Tabs>
        <TabsList data-testid="tabs-list-test" />
      </Tabs>
    );
    const list = screen.getByTestId("tabs-list-test");
    expect(list).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <Tabs>
        <TabsList className="test-class" data-testid="tabs-list-test" />
      </Tabs>
    );
    const element = screen.getByTestId("tabs-list-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <Tabs>
        <TabsList data-testid="tabs-list-test" />
      </Tabs>
    );
    const element = screen.getByTestId("tabs-list-test");
    expect(element).toHaveClass(
      "bg-muted",
      "text-muted-foreground",
      "inline-flex",
      "h-9",
      "w-fit",
      "items-center",
      "justify-center",
      "rounded-lg",
      "p-[3px]"
    );
  });

  it("has data-slot attribute", () => {
    render(
      <Tabs>
        <TabsList data-testid="tabs-list-test" />
      </Tabs>
    );
    const element = screen.getByTestId("tabs-list-test");
    expect(element).toHaveAttribute("data-slot", "tabs-list");
  });

  it("has proper accessibility role", () => {
    render(
      <Tabs>
        <TabsList data-testid="tabs-list-test" />
      </Tabs>
    );
    const element = screen.getByTestId("tabs-list-test");
    expect(element).toHaveAttribute("role", "tablist");
  });

  it("renders children content", () => {
    render(
      <Tabs>
        <TabsList>
          <div data-testid="list-content">List Content</div>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByTestId("list-content")).toBeInTheDocument();
  });
});

describe("TabsTrigger", () => {
  it("renders without crashing", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tabs-trigger-test">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const trigger = screen.getByTestId("tabs-trigger-test");
    expect(trigger).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger
            value="tab1"
            className="test-class"
            data-testid="tabs-trigger-test"
          >
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-trigger-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tabs-trigger-test">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-trigger-test");
    expect(element).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-md",
      "border",
      "border-transparent",
      "px-2",
      "py-1",
      "text-sm",
      "font-medium",
      "whitespace-nowrap"
    );
  });

  it("has data-slot attribute", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tabs-trigger-test">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-trigger-test");
    expect(element).toHaveAttribute("data-slot", "tabs-trigger");
  });

  it("has proper accessibility attributes", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tabs-trigger-test">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-trigger-test");
    expect(element).toHaveAttribute("role", "tab");
  });

  it("supports disabled state", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" disabled data-testid="tabs-trigger-test">
            Disabled Tab
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-trigger-test");
    expect(element).toHaveAttribute("data-disabled", "");
  });

  it("renders children content", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab Label</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText("Tab Label")).toBeInTheDocument();
  });
});

describe("TabsContent", () => {
  it("renders without crashing", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1" data-testid="tabs-content-test">
          Content 1
        </TabsContent>
      </Tabs>
    );
    const content = screen.getByTestId("tabs-content-test");
    expect(content).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent
          value="tab1"
          className="test-class"
          data-testid="tabs-content-test"
        >
          Content 1
        </TabsContent>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-content-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1" data-testid="tabs-content-test">
          Content 1
        </TabsContent>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-content-test");
    expect(element).toHaveClass("flex-1", "outline-none");
  });

  it("has data-slot attribute", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1" data-testid="tabs-content-test">
          Content 1
        </TabsContent>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-content-test");
    expect(element).toHaveAttribute("data-slot", "tabs-content");
  });

  it("has proper accessibility attributes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1" data-testid="tabs-content-test">
          Content 1
        </TabsContent>
      </Tabs>
    );
    const element = screen.getByTestId("tabs-content-test");
    expect(element).toHaveAttribute("role", "tabpanel");
  });

  it("renders children content", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1">Tab Panel Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByText("Tab Panel Content")).toBeInTheDocument();
  });
});

describe("Tabs Integration", () => {
  it("renders complete tabs structure", () => {
    render(
      <Tabs defaultValue="tab1" data-testid="complete-tabs">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content of Tab 1</TabsContent>
        <TabsContent value="tab2">Content of Tab 2</TabsContent>
        <TabsContent value="tab3">Content of Tab 3</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId("complete-tabs")).toBeInTheDocument();
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
    expect(screen.getByText("Content of Tab 1")).toBeInTheDocument();
  });

  it("supports custom styling for all components", () => {
    render(
      <Tabs
        className="custom-tabs"
        defaultValue="tab1"
        data-testid="styled-tabs"
      >
        <TabsList className="custom-list">
          <TabsTrigger value="tab1" className="custom-trigger">
            Styled Tab
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">
          Styled Content
        </TabsContent>
      </Tabs>
    );

    const tabs = screen.getByTestId("styled-tabs");
    expect(tabs).toHaveClass("custom-tabs");
    expect(screen.getByText("Styled Tab")).toBeInTheDocument();
    expect(screen.getByText("Styled Content")).toBeInTheDocument();
  });

  it("handles orientation prop", () => {
    render(
      <Tabs orientation="vertical" data-testid="vertical-tabs">
        <TabsList>
          <TabsTrigger value="tab1">Vertical Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Vertical Content</TabsContent>
      </Tabs>
    );

    const tabs = screen.getByTestId("vertical-tabs");
    expect(tabs).toHaveAttribute("data-orientation", "vertical");
  });

  it("supports activationMode prop", () => {
    render(
      <Tabs
        activationMode="manual"
        defaultValue="tab1"
        data-testid="manual-tabs"
      >
        <TabsList>
          <TabsTrigger value="tab1">Manual Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Manual Content</TabsContent>
      </Tabs>
    );

    const tabs = screen.getByTestId("manual-tabs");
    expect(tabs).toBeInTheDocument();
  });
});
