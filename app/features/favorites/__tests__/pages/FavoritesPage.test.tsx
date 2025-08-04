import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import FavoritesPage from "../../pages/FavoritesPage";
import type { FavoritePokemon } from "../../services/favorites.services";

// Mock the auth context
const mockUseAuth = vi.fn();
vi.mock("@/features/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the favorites hook
const mockUseFavorites = vi.fn();
vi.mock("../../hooks/useFavorites", () => ({
  useFavorites: () => mockUseFavorites(),
}));

// Mock AuthPrompt component
vi.mock("../../components/AuthPrompt", () => ({
  AuthPrompt: () => React.createElement("div", { "data-testid": "auth-prompt" }, 
    React.createElement("h3", {}, "Login to save favorites"),
    React.createElement("p", {}, "Create an account or Login to start building your Pokemon collection")
  ),
}));

// Mock FavoriteCard component
vi.mock("../../components/FavoriteCard", () => ({
  FavoriteCard: ({ favorite }: { favorite: FavoritePokemon }) =>
    React.createElement("div", { "data-testid": "favorite-card" }, favorite.pokemonName),
}));

// Mock Button component
vi.mock("@components/Button", () => ({
  Button: ({ children, ...props }: any) =>
    React.createElement("button", props, children),
}));

// Test wrapper with router and query client
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      {},
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
};

const mockUser = {
  uid: "user123",
  email: "test@example.com",
  displayName: "Test User",
};

const mockFavorites: FavoritePokemon[] = [
  {
    id: "fav1",
    userId: "user123",
    pokemonId: 1,
    pokemonName: "bulbasaur",
    pokemonImage: "https://example.com/bulbasaur.png",
    createdAt: { seconds: 1672531200, nanoseconds: 0 } as any,
  },
  {
    id: "fav2",
    userId: "user123",
    pokemonId: 4,
    pokemonName: "charmander",
    pokemonImage: "https://example.com/charmander.png",
    createdAt: { seconds: 1672531300, nanoseconds: 0 } as any,
  },
];

describe("FavoritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner when auth is loading", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows loading favorites when favorites are loading", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("Loading your favorites...")).toBeInTheDocument();
    });
  });

  describe("Unauthenticated State", () => {
    it("shows auth prompt when user is not authenticated", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByTestId("auth-prompt")).toBeInTheDocument();
      expect(screen.getByText("My Favorites")).toBeInTheDocument();
      expect(screen.getByText("Login to save and manage your favorite Pokemon collection")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("shows error message when favorites loading fails", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Network error"),
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("shows generic error message when error is not an Error instance", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: "Something went wrong",
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("Failed to load favorites")).toBeInTheDocument();
    });

    it("handles try again button click", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Network error"),
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      const tryAgainButton = screen.getByText("Try Again");
      fireEvent.click(tryAgainButton);

      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe("Empty State", () => {
    it("shows empty state when user has no favorites", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("No favorites yet")).toBeInTheDocument();
      expect(screen.getByText("Start building your collection by exploring Pokemon and adding them to your favorites!")).toBeInTheDocument();
      
      const browseButton = screen.getByRole("link", { name: "Browse Pokemon" });
      expect(browseButton).toBeInTheDocument();
      expect(browseButton).toHaveAttribute("href", "/pokemon");
    });

    it("shows empty state when favorites data is undefined", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    });
  });

  describe("Success State with Favorites", () => {
    it("displays favorites grid when user has favorites", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: mockFavorites,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("My Favorites")).toBeInTheDocument();
      expect(screen.getByText("Your personal Pokemon collection")).toBeInTheDocument();
      expect(screen.getByText("2 Pokemon in your collection")).toBeInTheDocument();
      
      // Check that favorite cards are rendered
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
      
      const favoriteCards = screen.getAllByTestId("favorite-card");
      expect(favoriteCards).toHaveLength(2);
    });

    it("displays correct collection count", () => {
      const singleFavorite = [mockFavorites[0]];
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: singleFavorite,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.getByText("1 Pokemon in your collection")).toBeInTheDocument();
    });

    it("does not show collection count when no favorites", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      expect(screen.queryByText(/Pokemon in your collection/)).not.toBeInTheDocument();
    });
  });

  describe("Page Metadata", () => {
    it("page has proper document structure", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: mockFavorites,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      // Check that the page renders with expected content
      expect(screen.getByText("My Favorites")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("has proper heading structure", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: mockFavorites,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      const heading = screen.getByRole("heading", { name: /my favorites/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("applies proper CSS classes for layout", () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      mockUseFavorites.mockReturnValue({
        data: mockFavorites,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(<FavoritesPage />, { wrapper: createWrapper() });

      // Find the main page container by looking for the min-h-screen container
      const pageContainer = document.querySelector('.min-h-screen');
      expect(pageContainer).toHaveClass("min-h-screen");
    });
  });
});
