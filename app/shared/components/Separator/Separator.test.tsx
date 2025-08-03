import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator } from './Separator';
import '@testing-library/jest-dom';

describe('Separator', () => {
  it('renders without crashing', () => {
    render(<Separator />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Separator className="test-class" data-testid="separator-test" />);
    const element = screen.getByTestId('separator-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Separator data-testid="separator-test" id="test-id" />);
    const element = screen.getByTestId('separator-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
