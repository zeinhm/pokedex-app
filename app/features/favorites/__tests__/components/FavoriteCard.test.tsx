import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { FavoriteCard } from "../../components/FavoriteCard";
import type { FavoritePokemon } from "../../services/favorites.services";

// Mock the pokemon hook
const mockUsePokemon = vi.fn();
vi.mock("@features/pokemon/hooks/usePokemon", () => ({
  usePokemon: () => mockUsePokemon(),
}));

// Mock the favorites hook
const mockUseRemoveFavorite = vi.fn();
vi.mock("../../hooks/useFavorites", () => ({
  useRemoveFavorite: () => mockUseRemoveFavorite(),
}));

// Mock pokemon utils
vi.mock("@/shared/utils/pokemon.utils", () => ({
  getBackgroundColorByPokemonType: vi.fn((type: string) => `bg-${type}`),
}));

// Mock Button component
vi.mock("@components/Button", () => ({
  Button: ({ children, ...props }: any) =>
    React.createElement("button", props, children),
}));

// Mock AuthContext
vi.mock("@features/auth/context/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { uid: 'test-user' },
    loading: false,
    error: null,
  })),
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

const mockFavorite: FavoritePokemon = {
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
};

const mockPokemonDetails = {
  id: 1,
  name: "bulbasaur",
  types: [
    { type: { name: "grass" } },
    { type: { name: "poison" } },
  ],
};

describe("FavoriteCard", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePokemon.mockReturnValue({
      data: mockPokemonDetails,
      isLoading: false,
      error: null,
    });
    mockUseRemoveFavorite.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("renders favorite card with pokemon information", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("Added Jan 1, 2023")).toBeInTheDocument();
  });

  it("displays pokemon image with correct attributes", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const image = screen.getByAltText("bulbasaur");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/bulbasaur.png");
  });

  it("displays pokemon types when pokemon details are available", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("does not display types when pokemon details are not available", () => {
    mockUsePokemon.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByText("grass")).not.toBeInTheDocument();
    expect(screen.queryByText("poison")).not.toBeInTheDocument();
  });

  it("displays view details link with correct href", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toBeInTheDocument();
    expect(viewDetailsLink).toHaveAttribute("href", "/pokemon/1");
  });

  it("handles remove favorite action", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue(undefined);

    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const removeButton = screen.getByRole("button", { name: "" }); // Trash icon button
    await user.click(removeButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        favoriteId: "fav123",
        pokemonId: 1,
      });
    });
  });

  it("shows loading state when removing favorite", () => {
    mockUseRemoveFavorite.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    // Should show loading spinner instead of trash icon
    const removeButton = screen.getByRole("button", { name: "" });
    expect(removeButton).toBeDisabled();
  });

  it("handles remove favorite error gracefully", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockMutateAsync.mockRejectedValue(new Error("Remove failed"));

    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const removeButton = screen.getByRole("button", { name: "" });
    await user.click(removeButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to remove favorite:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("formats date correctly with timestamp object", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Added Jan 1, 2023")).toBeInTheDocument();
  });

  it("formats date correctly with regular date", () => {
    const favoriteWithRegularDate = {
      ...mockFavorite,
      createdAt: new Date("2023-06-15") as any,
    };

    render(<FavoriteCard favorite={favoriteWithRegularDate} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Added Jun 15, 2023")).toBeInTheDocument();
  });

  it("handles empty date gracefully", () => {
    const favoriteWithoutDate = {
      ...mockFavorite,
      createdAt: null as any,
    };

    render(<FavoriteCard favorite={favoriteWithoutDate} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Added")).toBeInTheDocument();
  });

  it("pads pokemon ID with leading zeros correctly", () => {
    const favoriteWithHighId = {
      ...mockFavorite,
      pokemonId: 150,
    };

    render(<FavoriteCard favorite={favoriteWithHighId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("#150")).toBeInTheDocument();
  });

  it("shows image loading state initially", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const image = screen.getByAltText("bulbasaur");
    expect(image).toHaveClass("opacity-0");
  });

  it("handles image load event", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const image = screen.getByAltText("bulbasaur");
    fireEvent.load(image);

    expect(image).toHaveClass("opacity-100");
  });

  it("handles image error event", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    const image = screen.getByAltText("bulbasaur");
    fireEvent.error(image);

    expect(image).toHaveClass("opacity-100");
  });

  it("applies hover effects with proper CSS classes", () => {
    render(<FavoriteCard favorite={mockFavorite} />, {
      wrapper: createWrapper(),
    });

    // Find the outermost card container by looking for the container with specific background classes
    const cardContainer = document.querySelector('.bg-gray-800\\/50');
    expect(cardContainer).toHaveClass(
      "hover:bg-gray-800/70",
      "hover:transform",
      "hover:-translate-y-2"
    );
  });
});
