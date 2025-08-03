import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from './Alert';
import '@testing-library/jest-dom';

describe('Alert', () => {
  it('renders without crashing', () => {
    render(<Alert />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Alert className="test-class" data-testid="alert-test" />);
    const element = screen.getByTestId('alert-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Alert data-testid="alert-test" id="test-id" />);
    const element = screen.getByTestId('alert-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
