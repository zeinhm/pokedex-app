import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';
import '@testing-library/jest-dom';

describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Card className="test-class" data-testid="card-test" />);
    const element = screen.getByTestId('card-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Card data-testid="card-test" id="test-id" />);
    const element = screen.getByTestId('card-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
