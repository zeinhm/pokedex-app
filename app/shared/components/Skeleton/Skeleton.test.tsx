import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';
import '@testing-library/jest-dom';

describe('Skeleton', () => {
  it('renders without crashing', () => {
    render(<Skeleton />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Skeleton className="test-class" data-testid="skeleton-test" />);
    const element = screen.getByTestId('skeleton-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Skeleton data-testid="skeleton-test" id="test-id" />);
    const element = screen.getByTestId('skeleton-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
