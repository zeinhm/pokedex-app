import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './Label';
import '@testing-library/jest-dom';

describe('Label', () => {
  it('renders without crashing', () => {
    render(<Label />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Label className="test-class" data-testid="label-test" />);
    const element = screen.getByTestId('label-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Label data-testid="label-test" id="test-id" />);
    const element = screen.getByTestId('label-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
