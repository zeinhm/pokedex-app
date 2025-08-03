import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';
import '@testing-library/jest-dom';

describe('Badge', () => {
  it('renders without crashing', () => {
    render(<Badge />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Badge className="test-class" data-testid="badge-test" />);
    const element = screen.getByTestId('badge-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Badge data-testid="badge-test" id="test-id" />);
    const element = screen.getByTestId('badge-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
