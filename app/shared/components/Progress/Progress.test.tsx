import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Progress } from './Progress';
import '@testing-library/jest-dom';

describe('Progress', () => {
  it('renders without crashing', () => {
    render(<Progress />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Progress className="test-class" data-testid="progress-test" />);
    const element = screen.getByTestId('progress-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Progress data-testid="progress-test" id="test-id" />);
    const element = screen.getByTestId('progress-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
