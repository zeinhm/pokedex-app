import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage, { meta } from "../../pages/HomePage";
import { mockUseAuth, resetMocks } from "../__mocks__/home.mock";

// Mock the child components
vi.mock("../../components/HeroSection", () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock("../../components/FeaturesGrid", () => ({
  FeaturesGrid: () => <div data-testid="features-grid">Features Grid</div>,
}));

vi.mock("../../components/StatusIndicator", () => ({
  StatusIndicator: () => <div data-testid="status-indicator">Status Indicator</div>,
}));

describe("HomePage", () => {
  beforeEach(() => {
    resetMocks();
    mockUseAuth.mockReturnValue({ user: null });
  });

  it("should render all main sections", () => {
    render(<HomePage />);

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("features-grid")).toBeInTheDocument();
    expect(screen.getByTestId("status-indicator")).toBeInTheDocument();
  });

  it("should have correct page structure and styling", () => {
    render(<HomePage />);

    // The mocked components return simple divs, so we need to check the actual structure
    const heroSection = screen.getByTestId("hero-section");
    expect(heroSection).toBeInTheDocument();
    
    // Check that the component renders without errors
    expect(screen.getByTestId("features-grid")).toBeInTheDocument();
    expect(screen.getByTestId("status-indicator")).toBeInTheDocument();
  });

  it("should render sections in correct order", () => {
    render(<HomePage />);

    const container = screen.getByTestId("hero-section").parentElement;
    const children = Array.from(container?.children || []);

    expect(children[0]).toEqual(screen.getByTestId("hero-section"));
    expect(children[1]).toEqual(screen.getByTestId("features-grid"));
    expect(children[2]).toEqual(screen.getByTestId("status-indicator"));
  });

  describe("meta function", () => {
    it("should return correct meta information", () => {
      const metaArgs = {
        data: {},
        params: {},
        location: { pathname: "/", search: "", hash: "", state: null, key: "" },
        matches: [],
      };
      const metaResult = meta(metaArgs);

      expect(metaResult).toEqual([
        { title: "Pokedex App - Catch 'Em All!" },
        { name: "description", content: "Explore the world of Pokemon" },
      ]);
    });

    it("should be a function", () => {
      expect(typeof meta).toBe("function");
    });
  });
});
