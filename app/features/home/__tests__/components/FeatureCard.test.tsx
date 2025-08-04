import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileText } from "lucide-react";
import { FeatureCard } from "../../components/FeatureCard";
import { resetMocks } from "../__mocks__/home.mock";

describe("FeatureCard", () => {
  beforeEach(() => {
    resetMocks();
  });

  const defaultProps = {
    icon: FileText,
    title: "Test Feature",
    description: "Test description for the feature card",
    gradientColors: "from-blue-500 to-cyan-500",
  };

  it("should render feature card with correct content", () => {
    render(<FeatureCard {...defaultProps} />);

    expect(screen.getByText("Test Feature")).toBeInTheDocument();
    expect(screen.getByText("Test description for the feature card")).toBeInTheDocument();
  });

  it("should render the icon", () => {
    render(<FeatureCard {...defaultProps} />);

    // Look for the SVG element by class
    const icon = document.querySelector(".lucide-file-text");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("w-6", "h-6", "text-white");
  });

  it("should apply correct gradient colors", () => {
    render(<FeatureCard {...defaultProps} />);

    // Find the icon container by looking for the gradient classes
    const iconContainer = document.querySelector(".from-blue-500.to-cyan-500");
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass("from-blue-500", "to-cyan-500");
  });

  it("should have correct styling classes", () => {
    render(<FeatureCard {...defaultProps} />);

    const card = screen.getByText("Test Feature").closest("div");
    expect(card).toHaveClass(
      "bg-gray-800/50",
      "backdrop-blur-sm",
      "rounded-xl",
      "p-6",
      "text-center",
      "text-white",
      "border",
      "border-gray-700/50"
    );
  });

  it("should render with different props", () => {
    const customProps = {
      icon: FileText,
      title: "Custom Title",
      description: "Custom description text",
      gradientColors: "from-purple-500 to-pink-500",
    };

    render(<FeatureCard {...customProps} />);

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom description text")).toBeInTheDocument();

    const iconContainer = document.querySelector(".from-purple-500.to-pink-500");
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass("from-purple-500", "to-pink-500");
  });
});
