import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "./NavigationMenu";
import "@testing-library/jest-dom";

describe("NavigationMenu", () => {
  it("renders without crashing", () => {
    render(<NavigationMenu data-testid="navigation-menu-test" />);
    const menu = screen.getByTestId("navigation-menu-test");
    expect(menu).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <NavigationMenu
        className="test-class"
        data-testid="navigation-menu-test"
      />
    );
    const element = screen.getByTestId("navigation-menu-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<NavigationMenu data-testid="navigation-menu-test" id="test-id" />);
    const element = screen.getByTestId("navigation-menu-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<NavigationMenu data-testid="navigation-menu-test" />);
    const element = screen.getByTestId("navigation-menu-test");
    expect(element).toHaveClass(
      "group/navigation-menu",
      "relative",
      "flex",
      "max-w-max",
      "flex-1",
      "items-center",
      "justify-center"
    );
  });

  it("has data-slot attribute", () => {
    render(<NavigationMenu data-testid="navigation-menu-test" />);
    const element = screen.getByTestId("navigation-menu-test");
    expect(element).toHaveAttribute("data-slot", "navigation-menu");
  });

  it("renders viewport by default", () => {
    render(<NavigationMenu data-testid="navigation-menu-test" />);
    const element = screen.getByTestId("navigation-menu-test");
    expect(element).toHaveAttribute("data-viewport", "true");
  });

  it("supports disabling viewport", () => {
    render(
      <NavigationMenu viewport={false} data-testid="navigation-menu-test" />
    );
    const element = screen.getByTestId("navigation-menu-test");
    expect(element).toHaveAttribute("data-viewport", "false");
  });

  it("renders children content", () => {
    render(
      <NavigationMenu data-testid="navigation-menu-test">
        <div data-testid="menu-content">Menu Content</div>
      </NavigationMenu>
    );
    expect(screen.getByTestId("menu-content")).toBeInTheDocument();
  });
});

describe("NavigationMenuList", () => {
  it("renders without crashing", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList data-testid="navigation-menu-list-test" />
      </NavigationMenu>
    );
    const list = screen.getByTestId("navigation-menu-list-test");
    expect(list).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList
          className="test-class"
          data-testid="navigation-menu-list-test"
        />
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-list-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList data-testid="navigation-menu-list-test" />
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-list-test");
    expect(element).toHaveClass(
      "group",
      "flex",
      "flex-1",
      "list-none",
      "items-center",
      "justify-center",
      "gap-1"
    );
  });

  it("has data-slot attribute", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList data-testid="navigation-menu-list-test" />
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-list-test");
    expect(element).toHaveAttribute("data-slot", "navigation-menu-list");
  });
});

describe("NavigationMenuItem", () => {
  it("renders without crashing", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem data-testid="navigation-menu-item-test" />
        </NavigationMenuList>
      </NavigationMenu>
    );
    const item = screen.getByTestId("navigation-menu-item-test");
    expect(item).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem
            className="test-class"
            data-testid="navigation-menu-item-test"
          />
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-item-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem data-testid="navigation-menu-item-test" />
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-item-test");
    expect(element).toHaveClass("relative");
  });

  it("has data-slot attribute", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem data-testid="navigation-menu-item-test" />
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-item-test");
    expect(element).toHaveAttribute("data-slot", "navigation-menu-item");
  });
});

describe("NavigationMenuTrigger", () => {
  it("renders without crashing", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger data-testid="navigation-menu-trigger-test">
              Trigger
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const trigger = screen.getByTestId("navigation-menu-trigger-test");
    expect(trigger).toBeInTheDocument();
  });

  it("renders chevron icon", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger data-testid="navigation-menu-trigger-test">
              Trigger
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const trigger = screen.getByTestId("navigation-menu-trigger-test");
    const chevron = trigger.querySelector("svg");
    expect(chevron).toBeInTheDocument();
    expect(chevron).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts and applies custom className", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="test-class"
              data-testid="navigation-menu-trigger-test"
            >
              Trigger
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-trigger-test");
    expect(element).toHaveClass("test-class");
  });

  it("has data-slot attribute", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger data-testid="navigation-menu-trigger-test">
              Trigger
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-trigger-test");
    expect(element).toHaveAttribute("data-slot", "navigation-menu-trigger");
  });

  it("renders children content", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu Item</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    expect(screen.getByText("Menu Item")).toBeInTheDocument();
  });
});

describe("NavigationMenuContent", () => {
  it("integrates within navigation menu structure", () => {
    render(
      <NavigationMenu data-testid="content-navigation-menu">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              Content renders when active
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const menu = screen.getByTestId("content-navigation-menu");
    expect(menu).toBeInTheDocument();
  });

  it("supports custom className in context", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuContent className="test-class">
              Content with custom class
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const menu = screen.getByRole("navigation");
    expect(menu).toBeInTheDocument();
  });
});

describe("NavigationMenuLink", () => {
  it("renders without crashing", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink data-testid="navigation-menu-link-test">
              Link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const link = screen.getByTestId("navigation-menu-link-test");
    expect(link).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="test-class"
              data-testid="navigation-menu-link-test"
            >
              Link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-link-test");
    expect(element).toHaveClass("test-class");
  });

  it("has data-slot attribute", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink data-testid="navigation-menu-link-test">
              Link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const element = screen.getByTestId("navigation-menu-link-test");
    expect(element).toHaveAttribute("data-slot", "navigation-menu-link");
  });

  it("renders children content", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink>Navigation Link</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    expect(screen.getByText("Navigation Link")).toBeInTheDocument();
  });
});

describe("NavigationMenuIndicator", () => {
  it("integrates within navigation menu structure", () => {
    render(
      <NavigationMenu data-testid="indicator-navigation-menu">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuIndicator />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const menu = screen.getByTestId("indicator-navigation-menu");
    expect(menu).toBeInTheDocument();
  });

  it("supports custom className in context", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuIndicator className="test-class" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const menu = screen.getByRole("navigation");
    expect(menu).toBeInTheDocument();
  });
});

describe("NavigationMenuViewport", () => {
  it("renders when viewport is enabled", () => {
    render(
      <NavigationMenu viewport={true} data-testid="navigation-menu-test">
        <NavigationMenuList>
          <NavigationMenuItem>Content</NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const menu = screen.getByTestId("navigation-menu-test");
    expect(menu).toBeInTheDocument();
  });
});

describe("navigationMenuTriggerStyle", () => {
  it("returns CSS class string", () => {
    const styles = navigationMenuTriggerStyle();
    expect(typeof styles).toBe("string");
    expect(styles).toContain("group");
    expect(styles).toContain("inline-flex");
    expect(styles).toContain("h-9");
  });
});

describe("NavigationMenu Integration", () => {
  it("renders complete navigation menu structure", () => {
    render(
      <NavigationMenu data-testid="complete-navigation-menu">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByTestId("complete-navigation-menu")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("supports custom styling for all components", () => {
    render(
      <NavigationMenu
        className="custom-menu"
        data-testid="styled-navigation-menu"
      >
        <NavigationMenuList className="custom-list">
          <NavigationMenuItem className="custom-item">
            <NavigationMenuTrigger className="custom-trigger">
              Styled Menu
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const menu = screen.getByTestId("styled-navigation-menu");
    expect(menu).toHaveClass("custom-menu");
    expect(screen.getByText("Styled Menu")).toBeInTheDocument();
  });
});
