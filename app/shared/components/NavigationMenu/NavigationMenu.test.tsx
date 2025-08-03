import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavigationMenu } from './NavigationMenu';
import '@testing-library/jest-dom';

describe('NavigationMenu', () => {
  it('renders without crashing', () => {
    render(<NavigationMenu />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<NavigationMenu className="test-class" data-testid="navigation-menu-test" />);
    const element = screen.getByTestId('navigation-menu-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<NavigationMenu data-testid="navigation-menu-test" id="test-id" />);
    const element = screen.getByTestId('navigation-menu-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
