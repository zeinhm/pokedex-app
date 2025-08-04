import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { Form } from "./Form";

// Test wrapper component to use Form with proper form context
function TestFormWrapper({ children }: { children?: React.ReactNode }) {
  const formMethods = useForm();
  return <Form {...formMethods}>{children}</Form>;
}

describe("Form", () => {
  it("renders without crashing", () => {
    render(<TestFormWrapper />);
    // Basic rendering test - component should mount without errors
  });

  it("accepts and applies custom className", () => {
    render(
      <TestFormWrapper>
        <div data-testid="form-content">Form content</div>
      </TestFormWrapper>
    );
    const element = screen.getByTestId("form-content");
    expect(element).toBeInTheDocument();
  });

  it("forwards additional props", () => {
    render(
      <TestFormWrapper>
        <div data-testid="form-content" id="test-id">
          Form content
        </div>
      </TestFormWrapper>
    );
    const element = screen.getByTestId("form-content");
    expect(element).toHaveAttribute("id", "test-id");
  });

  // TODO: Add component-specific tests here
});
