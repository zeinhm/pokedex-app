import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';
import '@testing-library/jest-dom';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Input className="test-class" data-testid="input-test" />);
    const element = screen.getByTestId('input-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Input data-testid="input-test" id="test-id" />);
    const element = screen.getByTestId('input-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
