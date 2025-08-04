import { vi } from "vitest";
import type { ReactNode } from "react";

// Mock React Router
export const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  Link: ({ children, to, className, ...props }: { 
    children: ReactNode; 
    to: string; 
    className?: string; 
    [key: string]: any; 
  }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

// Mock auth context
export const mockUseAuth = vi.fn();

vi.mock("@/features/auth", () => ({
  useAuth: mockUseAuth,
}));

// Mock Button component
vi.mock("@components/Button", () => ({
  Button: ({ children, asChild, size, className, ...props }: { 
    children: ReactNode; 
    asChild?: boolean; 
    size?: string; 
    className?: string; 
    [key: string]: any; 
  }) => {
    if (asChild) {
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    }
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  },
}));

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  FileText: ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <svg data-testid="file-text-icon" className={className} {...props} />
  ),
  Heart: ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <svg data-testid="heart-icon" className={className} {...props} />
  ),
  BarChart3: ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <svg data-testid="bar-chart-icon" className={className} {...props} />
  ),
}));

// Reset mocks before each test
export const resetMocks = () => {
  mockNavigate.mockClear();
  mockUseAuth.mockClear();
};
