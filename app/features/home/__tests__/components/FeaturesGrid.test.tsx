import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturesGrid } from "../../components/FeaturesGrid";
import { resetMocks } from "../__mocks__/home.mock";

describe("FeaturesGrid", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should render all three feature cards", () => {
    render(<FeaturesGrid />);

    // Check that all feature titles are rendered
    expect(screen.getByText("Complete Pokedex")).toBeInTheDocument();
    expect(screen.getByText("Save Favorites")).toBeInTheDocument();
    expect(screen.getByText("Compare Stats")).toBeInTheDocument();
  });

  it("should render feature descriptions", () => {
    render(<FeaturesGrid />);

    expect(
      screen.getByText("Access detailed information about all Pokemon species, their stats, and abilities.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create your personal collection by saving your favorite Pokemon to your profile.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Compare different Pokemon side by side to find the perfect team combination.")
    ).toBeInTheDocument();
  });

  it("should render correct icons for each feature", () => {
    render(<FeaturesGrid />);

    // Look for SVG elements by their lucide classes
    expect(document.querySelector(".lucide-file-text")).toBeInTheDocument();
    expect(document.querySelector(".lucide-heart")).toBeInTheDocument();
    expect(document.querySelector(".lucide-chart-column")).toBeInTheDocument();
  });

  it("should have correct grid layout classes", () => {
    render(<FeaturesGrid />);

    const grid = screen.getByText("Complete Pokedex").closest("div")?.parentElement;
    expect(grid).toHaveClass("mt-16", "grid", "md:grid-cols-3", "gap-8", "max-w-4xl", "mx-auto");
  });

  it("should render features with correct gradient colors", () => {
    render(<FeaturesGrid />);

    // Find gradient containers by their classes
    const blueGradient = document.querySelector(".from-blue-500.to-cyan-500");
    const purpleGradient = document.querySelector(".from-purple-500.to-pink-500");
    const emeraldGradient = document.querySelector(".from-emerald-500.to-teal-500");

    expect(blueGradient).toBeInTheDocument();
    expect(purpleGradient).toBeInTheDocument();
    expect(emeraldGradient).toBeInTheDocument();
  });

  it("should render exactly three feature cards", () => {
    render(<FeaturesGrid />);

    const featureCards = screen.getAllByText(/Complete Pokedex|Save Favorites|Compare Stats/);
    expect(featureCards).toHaveLength(3);
  });
});
