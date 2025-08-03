import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { Sheet } from "./Sheet";
import "@testing-library/jest-dom";

describe("Sheet", () => {
  it("renders without crashing", () => {
    render(<Sheet />);
    // Basic rendering test - component should mount without errors
  });

  // TODO: Add component-specific tests here
});
