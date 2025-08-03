import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';
import '@testing-library/jest-dom';

describe('Avatar', () => {
  it('renders without crashing', () => {
    render(<Avatar />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Avatar className="test-class" data-testid="avatar-test" />);
    const element = screen.getByTestId('avatar-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Avatar data-testid="avatar-test" id="test-id" />);
    const element = screen.getByTestId('avatar-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
