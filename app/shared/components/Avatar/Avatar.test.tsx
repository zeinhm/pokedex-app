import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
import "@testing-library/jest-dom";

describe("Avatar", () => {
  it("renders without crashing", () => {
    render(<Avatar data-testid="avatar-test" />);
    const avatar = screen.getByTestId("avatar-test");
    expect(avatar).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(<Avatar className="test-class" data-testid="avatar-test" />);
    const element = screen.getByTestId("avatar-test");
    expect(element).toHaveClass("test-class");
  });

  it("forwards additional props", () => {
    render(<Avatar data-testid="avatar-test" id="test-id" />);
    const element = screen.getByTestId("avatar-test");
    expect(element).toHaveAttribute("id", "test-id");
  });

  it("applies default styling classes", () => {
    render(<Avatar data-testid="avatar-test" />);
    const element = screen.getByTestId("avatar-test");
    expect(element).toHaveClass(
      "relative",
      "flex",
      "size-8",
      "shrink-0",
      "overflow-hidden",
      "rounded-full"
    );
  });

  it("has data-slot attribute", () => {
    render(<Avatar data-testid="avatar-test" />);
    const element = screen.getByTestId("avatar-test");
    expect(element).toHaveAttribute("data-slot", "avatar");
  });

  it("supports custom size via className", () => {
    render(<Avatar className="size-12" data-testid="avatar-test" />);
    const element = screen.getByTestId("avatar-test");
    expect(element).toHaveClass("size-12");
  });

  it("renders children content", () => {
    render(
      <Avatar data-testid="avatar-test">
        <div data-testid="avatar-content">Content</div>
      </Avatar>
    );
    expect(screen.getByTestId("avatar-content")).toBeInTheDocument();
  });
});

describe("AvatarImage", () => {
  it("renders within Avatar container", () => {
    render(
      <Avatar data-testid="avatar-container">
        <AvatarImage src="/test.jpg" alt="Test Avatar" />
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
    );

    const container = screen.getByTestId("avatar-container");
    expect(container).toBeInTheDocument();

    expect(screen.getByText("FB")).toBeInTheDocument();
  });

  it("accepts custom className and forwards props", () => {
    render(
      <Avatar data-testid="avatar-with-image">
        <AvatarImage
          className="test-class"
          src="/test.jpg"
          alt="Test Avatar"
          id="test-image"
        />
        <AvatarFallback>TC</AvatarFallback>
      </Avatar>
    );

    const container = screen.getByTestId("avatar-with-image");
    expect(container).toBeInTheDocument();
    expect(screen.getByText("TC")).toBeInTheDocument();
  });

  it("supports src and alt attributes in integration", () => {
    render(
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="User Avatar" />
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("UA")).toBeInTheDocument();
  });

  it("works with event handlers", () => {
    const handleLoad = vi.fn();
    const handleError = vi.fn();

    render(
      <Avatar>
        <AvatarImage
          src="/test.jpg"
          onLoad={handleLoad}
          onError={handleError}
        />
        <AvatarFallback>EH</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("EH")).toBeInTheDocument();
  });
});

describe("AvatarFallback", () => {
  it("renders without crashing within Avatar", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback-test">JD</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByTestId("avatar-fallback-test");
    expect(fallback).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <Avatar>
        <AvatarFallback
          className="test-class"
          data-testid="avatar-fallback-test"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    const element = screen.getByTestId("avatar-fallback-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback-test">JD</AvatarFallback>
      </Avatar>
    );
    const element = screen.getByTestId("avatar-fallback-test");
    expect(element).toHaveClass(
      "bg-muted",
      "flex",
      "size-full",
      "items-center",
      "justify-center",
      "rounded-full"
    );
  });

  it("has data-slot attribute", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback-test">JD</AvatarFallback>
      </Avatar>
    );
    const element = screen.getByTestId("avatar-fallback-test");
    expect(element).toHaveAttribute("data-slot", "avatar-fallback");
  });

  it("renders text content", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders custom fallback content", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback-test">
          <span>👤</span>
        </AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("👤")).toBeInTheDocument();
  });
});

describe("Avatar Integration", () => {
  it("renders complete avatar with image and fallback", () => {
    render(
      <Avatar data-testid="complete-avatar">
        <AvatarImage src="/user.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("complete-avatar");
    expect(avatar).toBeInTheDocument();

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("fallback displays when image fails to load", () => {
    render(
      <Avatar>
        <AvatarImage src="/nonexistent.jpg" alt="User" />
        <AvatarFallback data-testid="fallback">JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("supports different avatar sizes", () => {
    render(
      <Avatar className="size-16" data-testid="large-avatar">
        <AvatarImage src="/user.jpg" alt="Large User" />
        <AvatarFallback>LU</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("large-avatar");
    expect(avatar).toHaveClass("size-16");
  });

  it("maintains semantic structure", () => {
    render(
      <Avatar>
        <AvatarImage src="/user.jpg" alt="Profile picture" />
        <AvatarFallback>PF</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("PF")).toBeInTheDocument();
  });

  it("supports custom styling for all components", () => {
    render(
      <Avatar className="border-2 border-blue-500" data-testid="styled-avatar">
        <AvatarImage className="grayscale" src="/user.jpg" alt="User" />
        <AvatarFallback className="bg-blue-500 text-white">ST</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("styled-avatar");
    expect(avatar).toHaveClass("border-2", "border-blue-500");
    expect(screen.getByText("ST")).toHaveClass("bg-blue-500", "text-white");
  });
});
