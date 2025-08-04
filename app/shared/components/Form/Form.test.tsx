import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { vi, describe, it, expect } from "vitest";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "./Form";
import { Input } from "@components/Input";
import "@testing-library/jest-dom";

// Test wrapper component to use Form with proper form context
function TestFormWrapper({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
}: {
  children?: React.ReactNode;
  defaultValues?: Record<string, any>;
  onSubmit?: (data: any) => void;
}) {
  const formMethods = useForm({ defaultValues });
  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}

// Component to test useFormField hook
function TestFormFieldHookComponent() {
  try {
    const field = useFormField();
    return (
      <div data-testid="form-field-info">
        <span data-testid="field-name">{field.name}</span>
        <span data-testid="field-id">{field.id}</span>
        <span data-testid="form-item-id">{field.formItemId}</span>
      </div>
    );
  } catch (error) {
    return <div data-testid="form-field-error">{(error as Error).message}</div>;
  }
}

describe("Form", () => {
  it("renders without crashing", () => {
    render(<TestFormWrapper />);
  });

  it("provides form context to children", () => {
    const onSubmit = vi.fn();
    render(
      <TestFormWrapper onSubmit={onSubmit}>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const input = screen.getByTestId("test-input");
    const submitButton = screen.getByTestId("submit-button");

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const onSubmit = vi.fn();
    render(
      <TestFormWrapper onSubmit={onSubmit} defaultValues={{ test: "initial" }}>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { test: "initial" },
        expect.any(Object)
      );
    });
  });

  it("supports default values", () => {
    render(
      <TestFormWrapper defaultValues={{ username: "testuser" }}>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="username-input" />
              </FormControl>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const input = screen.getByTestId("username-input") as HTMLInputElement;
    expect(input.value).toBe("testuser");
  });
});

describe("FormItem", () => {
  it("renders without crashing", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem data-testid="form-item-test">
              <div>Item content</div>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const item = screen.getByTestId("form-item-test");
    expect(item).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem className="test-class" data-testid="form-item-test">
              <div>Item content</div>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-item-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem data-testid="form-item-test">
              <div>Item content</div>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-item-test");
    expect(element).toHaveClass("grid", "gap-2");
  });

  it("has data-slot attribute", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem data-testid="form-item-test">
              <div>Item content</div>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-item-test");
    expect(element).toHaveAttribute("data-slot", "form-item");
  });

  it("provides unique id context", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test1"
          render={() => (
            <FormItem>
              <TestFormFieldHookComponent />
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const fieldId = screen.getByTestId("field-id");
    expect(fieldId.textContent).toBeTruthy();
    expect(fieldId.textContent).toMatch(/^«r\d+»$/); // React useId format in test env
  });
});

describe("FormLabel", () => {
  it("renders without crashing", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormLabel data-testid="form-label-test">Test Label</FormLabel>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const label = screen.getByTestId("form-label-test");
    expect(label).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormLabel className="test-class" data-testid="form-label-test">
                Test Label
              </FormLabel>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-label-test");
    expect(element).toHaveClass("test-class");
  });

  it("has data-slot attribute", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormLabel data-testid="form-label-test">Test Label</FormLabel>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-label-test");
    expect(element).toHaveAttribute("data-slot", "form-label");
  });

  it("associates with form control via htmlFor", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormLabel data-testid="form-label-test">Test Label</FormLabel>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const label = screen.getByTestId("form-label-test");
    const input = screen.getByTestId("test-input");

    expect(label).toHaveAttribute("for", input.id);
  });

  it("shows error state styling", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel data-testid="form-label-test">Test Label</FormLabel>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const label = screen.getByTestId("form-label-test");
      expect(label).toHaveAttribute("data-error", "true");
    });
  });

  it("renders children content", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormLabel>Username Label</FormLabel>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    expect(screen.getByText("Username Label")).toBeInTheDocument();
  });
});

describe("FormControl", () => {
  it("renders without crashing", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("data-slot", "form-control");
  });

  it("sets proper accessibility attributes", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
              <FormDescription>This is a description</FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("aria-describedby");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("updates aria-invalid on error", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });
});

describe("FormDescription", () => {
  it("renders without crashing", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormDescription data-testid="form-description-test">
                This is a description
              </FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const description = screen.getByTestId("form-description-test");
    expect(description).toBeInTheDocument();
  });

  it("accepts and applies custom className", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormDescription
                className="test-class"
                data-testid="form-description-test"
              >
                This is a description
              </FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-description-test");
    expect(element).toHaveClass("test-class");
  });

  it("applies default styling classes", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormDescription data-testid="form-description-test">
                This is a description
              </FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-description-test");
    expect(element).toHaveClass("text-muted-foreground", "text-sm");
  });

  it("has data-slot attribute", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormDescription data-testid="form-description-test">
                This is a description
              </FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-description-test");
    expect(element).toHaveAttribute("data-slot", "form-description");
  });

  it("has proper id for accessibility", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormDescription data-testid="form-description-test">
                This is a description
              </FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    const element = screen.getByTestId("form-description-test");
    expect(element).toHaveAttribute("id");
    expect(element.id).toMatch(/form-item-description$/);
  });

  it("renders children content", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormDescription>Enter your username here</FormDescription>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    expect(screen.getByText("Enter your username here")).toBeInTheDocument();
  });
});

describe("FormMessage", () => {
  it("renders error messages", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} data-testid="test-input" />
              </FormControl>
              <FormMessage data-testid="form-message-test" />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("accepts and applies custom className", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage
                className="test-class"
                data-testid="form-message-test"
              />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const element = screen.getByTestId("form-message-test");
      expect(element).toHaveClass("test-class");
    });
  });

  it("applies default styling classes", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage data-testid="form-message-test" />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const element = screen.getByTestId("form-message-test");
      expect(element).toHaveClass("text-destructive", "text-sm");
    });
  });

  it("has data-slot attribute", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage data-testid="form-message-test" />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const element = screen.getByTestId("form-message-test");
      expect(element).toHaveAttribute("data-slot", "form-message");
    });
  });

  it("has proper id for accessibility", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage data-testid="form-message-test" />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const element = screen.getByTestId("form-message-test");
      expect(element).toHaveAttribute("id");
      expect(element.id).toMatch(/form-item-message$/);
    });
  });

  it("renders custom children when no error", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormMessage>Custom message content</FormMessage>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    expect(screen.getByText("Custom message content")).toBeInTheDocument();
  });

  it("does not render when no error and no children", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="test"
          render={() => (
            <FormItem>
              <FormMessage data-testid="form-message-test" />
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    expect(screen.queryByTestId("form-message-test")).not.toBeInTheDocument();
  });
});

describe("FormField", () => {
  it("renders form field with render prop", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} data-testid="username-input" />
              </FormControl>
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
  });

  it("supports validation rules", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} data-testid="email-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const input = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");

    // Test required validation
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    // Test pattern validation
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("provides field state and methods", () => {
    let fieldProps: any = null;

    render(
      <TestFormWrapper defaultValues={{ test: "initial" }}>
        <FormField
          name="test"
          render={({ field, fieldState, formState }) => {
            fieldProps = { field, fieldState, formState };
            return (
              <FormItem>
                <FormControl>
                  <Input {...field} data-testid="test-input" />
                </FormControl>
              </FormItem>
            );
          }}
        />
      </TestFormWrapper>
    );

    expect(fieldProps).toBeTruthy();
    expect(fieldProps.field).toHaveProperty("name", "test");
    expect(fieldProps.field).toHaveProperty("value", "initial");
    expect(fieldProps.field).toHaveProperty("onChange");
    expect(fieldProps.fieldState).toBeDefined();
    expect(fieldProps.formState).toBeDefined();
  });
});

describe("useFormField hook", () => {
  it("throws error when used outside FormField context", () => {
    render(<TestFormFieldHookComponent />);
    expect(screen.getByTestId("form-field-error")).toHaveTextContent(
      /Cannot destructure property|useFormField should be used within/
    );
  });

  it("provides field information when used within FormField", () => {
    render(
      <TestFormWrapper>
        <FormField
          name="testField"
          render={() => (
            <FormItem>
              <TestFormFieldHookComponent />
            </FormItem>
          )}
        />
      </TestFormWrapper>
    );

    expect(screen.getByTestId("field-name")).toHaveTextContent("testField");
    expect(screen.getByTestId("field-id")).toBeTruthy();
    expect(screen.getByTestId("form-item-id")).toBeTruthy();
  });
});

describe("Form Integration", () => {
  it("renders complete form with all components", async () => {
    const onSubmit = vi.fn();

    render(
      <TestFormWrapper
        onSubmit={onSubmit}
        defaultValues={{ username: "", email: "" }}
      >
        <FormField
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} data-testid="username-input" />
              </FormControl>
              <FormDescription>Enter your unique username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" data-testid="email-input" />
              </FormControl>
              <FormDescription>We'll never share your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    // Check all components render
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Enter your unique username")).toBeInTheDocument();
    expect(
      screen.getByText("We'll never share your email")
    ).toBeInTheDocument();

    // Test form interaction
    const usernameInput = screen.getByTestId("username-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          username: "johndoe",
          email: "john@example.com",
        },
        expect.any(Object) // SyntheticBaseEvent
      );
    });
  });

  it("supports complex validation and error states", async () => {
    render(
      <TestFormWrapper>
        <FormField
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  data-testid="password-input"
                />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </TestFormWrapper>
    );

    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("submit-button");

    // Test required validation
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    // Test minLength validation
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });

    // Check error state styling
    const label = screen.getByText("Password");
    expect(label).toHaveAttribute("data-error", "true");
  });
});
