import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tabs } from './Tabs';
import '@testing-library/jest-dom';

describe('Tabs', () => {
  it('renders without crashing', () => {
    render(<Tabs />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<Tabs className="test-class" data-testid="tabs-test" />);
    const element = screen.getByTestId('tabs-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<Tabs data-testid="tabs-test" id="test-id" />);
    const element = screen.getByTestId('tabs-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
