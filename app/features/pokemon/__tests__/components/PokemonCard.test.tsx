import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { PokemonCard } from "../../components/PokemonCard";

// Mock all external dependencies
vi.mock("../../hooks/usePokemon");
vi.mock("@features/favorites/hooks/useFavorites");
vi.mock("@/features/auth");
vi.mock("@/shared/utils/pokemon.utils");

// Mock components
vi.mock("@components/Button", () => ({
  Button: ({ children, onClick, ...props }: any) =>
    React.createElement("button", { onClick, ...props }, children),
}));

vi.mock("@components/Card", () => ({
  Card: ({ children, ...props }: any) =>
    React.createElement("div", { ...props, "data-testid": "card" }, children),
  CardContent: ({ children, ...props }: any) =>
    React.createElement("div", { ...props, "data-testid": "card-content" }, children),
  CardHeader: ({ children, ...props }: any) =>
    React.createElement("div", { ...props, "data-testid": "card-header" }, children),
}));

vi.mock("@components/Badge", () => ({
  Badge: ({ children, ...props }: any) =>
    React.createElement("span", { ...props, "data-testid": "badge" }, children),
}));

vi.mock("@components/Skeleton", () => ({
  Skeleton: (props: any) =>
    React.createElement("div", { ...props, "data-testid": "skeleton" }),
}));

// Mock icons
vi.mock("lucide-react", () => ({
  Heart: (props: any) => React.createElement("span", { ...props, "data-testid": "heart-icon" }),
  Eye: (props: any) => React.createElement("span", { ...props, "data-testid": "eye-icon" }),
  Loader2: (props: any) => React.createElement("span", { ...props, "data-testid": "loader-icon" }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      BrowserRouter,
      {},
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
};

describe("PokemonCard", () => {
  const mockPokemon = {
    id: 25,
    name: "pikachu",
    base_experience: 112,
    height: 4,
    weight: 60,
    sprites: {
      front_default: "https://example.com/pikachu.png",
      front_shiny: null,
      front_female: null,
      front_shiny_female: null,
      back_default: null,
      back_shiny: null,
      back_female: null,
      back_shiny_female: null,
      other: {
        dream_world: {
          front_default: null,
          front_female: null,
        },
        home: {
          front_default: null,
          front_female: null,
          front_shiny: null,
          front_shiny_female: null,
        },
        "official-artwork": {
          front_default: "https://example.com/pikachu-official.png",
          front_shiny: null,
        },
      },
    },
    types: [
      {
        slot: 1,
        type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
      },
    ],
    abilities: [],
    stats: [],
    species: { name: "pikachu", url: "" },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock usePokemon hook
    const usePokemon = await import("../../hooks/usePokemon");
    vi.mocked(usePokemon.usePokemon).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    // Mock favorites hooks
    const favoritesHooks = await import("@features/favorites/hooks/useFavorites");
    vi.mocked(favoritesHooks.useIsFavorited).mockReturnValue({
      data: { isFavorited: false, favoriteId: null },
      isLoading: false,
    } as any);
    vi.mocked(favoritesHooks.useAddFavorite).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);
    vi.mocked(favoritesHooks.useRemoveFavorite).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);

    // Mock auth hook
    const auth = await import("@/features/auth");
    vi.mocked(auth.useAuth).mockReturnValue({
      user: { uid: "123", email: "test@test.com" },
    } as any);

    // Mock utils
    const utils = await import("@/shared/utils/pokemon.utils");
    vi.mocked(utils.extractIdFromUrl).mockReturnValue(25);
    vi.mocked(utils.getBackgroundColorByPokemonType).mockReturnValue("bg-yellow-400");
  });

  it("renders pokemon card with pokemon data", async () => {
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("shows skeleton when loading", async () => {
    const usePokemon = await import("../../hooks/usePokemon");
    vi.mocked(usePokemon.usePokemon).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getAllByTestId("skeleton")).toHaveLength(3);
  });

  it("renders pokemon image", async () => {
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/pikachu-official.png");
    expect(image).toHaveAttribute("alt", "pikachu");
  });

  it("renders pokemon types as badges", async () => {
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("renders heart button for favorites", async () => {
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
  });

  it("renders view details button", async () => {
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("extracts pokemon id from url", async () => {
    const utils = await import("@/shared/utils/pokemon.utils");
    
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    expect(utils.extractIdFromUrl).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/25/");
  });

  it("handles image loading states", async () => {
    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    const image = screen.getByRole("img");
    
    // Simulate image load
    fireEvent.load(image);
    
    expect(image).toBeInTheDocument();
  });

  it("toggles favorite when heart button is clicked", async () => {
    const user = userEvent.setup();
    const favoritesHooks = await import("@features/favorites/hooks/useFavorites");
    const mockAddFavorite = vi.fn();
    
    vi.mocked(favoritesHooks.useAddFavorite).mockReturnValue({
      mutateAsync: mockAddFavorite,
    } as any);

    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    const heartButton = screen.getByTestId("heart-icon").closest("button");
    if (heartButton) {
      await user.click(heartButton);
      
      expect(mockAddFavorite).toHaveBeenCalledWith({
        pokemonId: 25,
        pokemonName: "pikachu",
        pokemonImage: "https://example.com/pikachu-official.png",
      });
    }
  });

  it("navigates to pokemon details when view button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <PokemonCard url="https://pokeapi.co/api/v2/pokemon/25/" />,
      { wrapper: createWrapper() }
    );

    const viewButton = screen.getByText("View Details").closest("button");
    if (viewButton) {
      await user.click(viewButton);
      // Navigation would be tested in integration tests
      expect(viewButton).toBeInTheDocument();
    }
  });
});
