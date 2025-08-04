import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useFavorites,
  useIsFavorited,
  useAddFavorite,
  useRemoveFavorite,
  useToggleFavorite,
  favoritesKeys,
} from "../../hooks/useFavorites";
import { FavoritesService } from "../../services/favorites.services";

// Mock the auth context
const mockUseAuth = vi.fn();
vi.mock("@/features/auth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the favorites service
vi.mock("../../services/favorites.services", () => ({
  FavoritesService: {
    getUserFavorites: vi.fn(),
    subscribeToUserFavorites: vi.fn(),
    isFavorited: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

const mockFavoritesService = vi.mocked(FavoritesService);

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockUser = {
  uid: "user123",
  email: "test@example.com",
  displayName: "Test User",
};

const mockFavorites = [
  {
    id: "fav1",
    userId: "user123",
    pokemonId: 1,
    pokemonName: "bulbasaur",
    pokemonImage: "https://example.com/bulbasaur.png",
    createdAt: { seconds: 1234567890, nanoseconds: 0 } as any,
  },
  {
    id: "fav2",
    userId: "user123",
    pokemonId: 4,
    pokemonName: "charmander",
    pokemonImage: "https://example.com/charmander.png",
    createdAt: { seconds: 1234567891, nanoseconds: 0 } as any,
  },
];

describe("useFavorites Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });
  });

  describe("favoritesKeys", () => {
    it("should generate correct query keys", () => {
      expect(favoritesKeys.all).toEqual(["favorites"]);
      expect(favoritesKeys.lists()).toEqual(["favorites", "list"]);
      expect(favoritesKeys.list("user123")).toEqual([
        "favorites",
        "list",
        "user123",
      ]);
      expect(favoritesKeys.detail("user123", 1)).toEqual([
        "favorites",
        "detail",
        "user123",
        1,
      ]);
    });
  });

  describe("useFavorites", () => {
    it("should fetch user favorites when user is authenticated", async () => {
      mockFavoritesService.getUserFavorites.mockResolvedValue(mockFavorites);
      mockFavoritesService.subscribeToUserFavorites.mockReturnValue(vi.fn());

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFavoritesService.getUserFavorites).toHaveBeenCalledWith(
        "user123"
      );
      expect(result.current.data).toEqual(mockFavorites);
    });

    it("should not fetch favorites when user is not authenticated", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      expect(mockFavoritesService.getUserFavorites).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });

    it("should subscribe to real-time updates when user is authenticated", () => {
      const mockUnsubscribe = vi.fn();
      mockFavoritesService.subscribeToUserFavorites.mockReturnValue(
        mockUnsubscribe
      );
      mockFavoritesService.getUserFavorites.mockResolvedValue(mockFavorites);

      renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      expect(mockFavoritesService.subscribeToUserFavorites).toHaveBeenCalledWith(
        "user123",
        expect.any(Function)
      );
    });

    it("should not subscribe when user is not authenticated", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      expect(
        mockFavoritesService.subscribeToUserFavorites
      ).not.toHaveBeenCalled();
    });
  });

  describe("useIsFavorited", () => {
    it("should check if pokemon is favorited when user is authenticated", async () => {
      const mockResult = { isFavorited: true, favoriteId: "fav1" };
      mockFavoritesService.isFavorited.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useIsFavorited(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFavoritesService.isFavorited).toHaveBeenCalledWith(
        "user123",
        1
      );
      expect(result.current.data).toEqual(mockResult);
    });

    it("should not check favorite status when user is not authenticated", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() => useIsFavorited(1), {
        wrapper: createWrapper(),
      });

      expect(mockFavoritesService.isFavorited).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });

    it("should not check favorite status when pokemonId is not provided", () => {
      const { result } = renderHook(() => useIsFavorited(0), {
        wrapper: createWrapper(),
      });

      expect(mockFavoritesService.isFavorited).not.toHaveBeenCalled();
    });
  });

  describe("useAddFavorite", () => {
    it("should add favorite successfully", async () => {
      mockFavoritesService.addFavorite.mockResolvedValue("fav123");
      const mockFavoriteData = {
        pokemonId: 1,
        pokemonName: "bulbasaur",
        pokemonImage: "https://example.com/bulbasaur.png",
      };

      const { result } = renderHook(() => useAddFavorite(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(mockFavoriteData);

      expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(
        "user123",
        mockFavoriteData
      );
    });

    it("should throw error when user is not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      const mockFavoriteData = {
        pokemonId: 1,
        pokemonName: "bulbasaur",
        pokemonImage: "https://example.com/bulbasaur.png",
      };

      const { result } = renderHook(() => useAddFavorite(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.mutateAsync(mockFavoriteData)
      ).rejects.toThrow("User not authenticated");
    });

    it("should handle service errors", async () => {
      const error = new Error("Service error");
      mockFavoritesService.addFavorite.mockRejectedValue(error);

      const mockFavoriteData = {
        pokemonId: 1,
        pokemonName: "bulbasaur",
        pokemonImage: "https://example.com/bulbasaur.png",
      };

      const { result } = renderHook(() => useAddFavorite(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.mutateAsync(mockFavoriteData)
      ).rejects.toThrow("Service error");
    });
  });

  describe("useRemoveFavorite", () => {
    it("should remove favorite successfully", async () => {
      mockFavoritesService.removeFavorite.mockResolvedValue();

      const { result } = renderHook(() => useRemoveFavorite(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        favoriteId: "fav123",
        pokemonId: 1,
      });

      expect(mockFavoritesService.removeFavorite).toHaveBeenCalledWith(
        "fav123"
      );
    });

    it("should handle service errors", async () => {
      const error = new Error("Service error");
      mockFavoritesService.removeFavorite.mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveFavorite(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.mutateAsync({
          favoriteId: "fav123",
          pokemonId: 1,
        })
      ).rejects.toThrow("Service error");
    });
  });

  describe("useToggleFavorite", () => {
    it("should add favorite when not favorited", async () => {
      mockFavoritesService.addFavorite.mockResolvedValue("fav123");

      const mockFavoriteData = {
        pokemonId: 1,
        pokemonName: "bulbasaur",
        pokemonImage: "https://example.com/bulbasaur.png",
      };

      const { result } = renderHook(() => useToggleFavorite(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleFavorite(
        false,
        undefined,
        mockFavoriteData
      );

      expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(
        "user123",
        mockFavoriteData
      );
      expect(mockFavoritesService.removeFavorite).not.toHaveBeenCalled();
    });

    it("should remove favorite when favorited", async () => {
      mockFavoritesService.removeFavorite.mockResolvedValue();

      const mockFavoriteData = {
        pokemonId: 1,
        pokemonName: "bulbasaur",
        pokemonImage: "https://example.com/bulbasaur.png",
      };

      const { result } = renderHook(() => useToggleFavorite(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleFavorite(
        true,
        "fav123",
        mockFavoriteData
      );

      expect(mockFavoritesService.removeFavorite).toHaveBeenCalledWith(
        "fav123"
      );
      expect(mockFavoritesService.addFavorite).not.toHaveBeenCalled();
    });

    it("should return loading state correctly", () => {
      const { result } = renderHook(() => useToggleFavorite(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
