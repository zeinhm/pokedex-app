import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import type { FavoritePokemon } from "../../services/favorites.services";

// Test utilities for favorites feature

export const createMockUser = (overrides = {}) => ({
  uid: "user123",
  email: "test@example.com",
  displayName: "Test User",
  ...overrides,
});

export const createMockFavorite = (overrides: Partial<FavoritePokemon> = {}): FavoritePokemon => ({
  id: "fav123",
  userId: "user123",
  pokemonId: 1,
  pokemonName: "bulbasaur",
  pokemonImage: "https://example.com/bulbasaur.png",
  createdAt: {
    toDate: () => new Date("2023-01-01"),
    seconds: 1672531200,
    nanoseconds: 0,
  } as any,
  ...overrides,
});

export const createMockPokemonDetails = (overrides = {}) => ({
  id: 1,
  name: "bulbasaur",
  types: [
    { type: { name: "grass" } },
    { type: { name: "poison" } },
  ],
  ...overrides,
});

// Test wrapper with all providers
export const createTestWrapper = (options: { initialRoute?: string } = {}) => {
  const { initialRoute = "/" } = options;
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialRoute] },
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
};

// Custom render function with test wrapper
export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions & { initialRoute?: string } = {}
) => {
  const { initialRoute, ...renderOptions } = options;
  const Wrapper = createTestWrapper({ initialRoute });
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock auth states
export const createMockAuthState = {
  authenticated: (user = createMockUser()) => ({
    user,
    loading: false,
  }),
  loading: () => ({
    user: null,
    loading: true,
  }),
  unauthenticated: () => ({
    user: null,
    loading: false,
  }),
};

// Mock favorites states
export const createMockFavoritesState = {
  loading: () => ({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
  }),
  success: (favorites: FavoritePokemon[] = []) => ({
    data: favorites,
    isLoading: false,
    isError: false,
    error: null,
  }),
  error: (error: Error | string = new Error("Failed to load")) => ({
    data: undefined,
    isLoading: false,
    isError: true,
    error,
  }),
  empty: () => ({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
  }),
};

// Mock mutation states
export const createMockMutationState = {
  idle: (mutateAsync = vi.fn()) => ({
    mutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
  pending: (mutateAsync = vi.fn()) => ({
    mutateAsync,
    isPending: true,
    isError: false,
    error: null,
  }),
  error: (error: Error = new Error("Mutation failed"), mutateAsync = vi.fn()) => ({
    mutateAsync,
    isPending: false,
    isError: true,
    error,
  }),
};

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Common test data
export const TEST_CONSTANTS = {
  POKEMON_IDS: {
    BULBASAUR: 1,
    CHARMANDER: 4,
    SQUIRTLE: 7,
    PIKACHU: 25,
  },
  USER_IDS: {
    DEFAULT: "user123",
    ALTERNATE: "user456",
  },
  FAVORITE_IDS: {
    DEFAULT: "fav123",
    ALTERNATE: "fav456",
  },
  DATES: {
    DEFAULT: new Date("2023-01-01"),
    RECENT: new Date("2023-12-01"),
  },
  IMAGES: {
    BULBASAUR: "https://example.com/bulbasaur.png",
    CHARMANDER: "https://example.com/charmander.png",
    PLACEHOLDER: "https://example.com/placeholder.png",
  },
};
