import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import PokemonListPage from "../../pages/PokemonListPage";

// Mock all the hooks and components
vi.mock("@features/pokemon/hooks/usePokemon");
vi.mock("@features/pokemon/hooks/useSearchPokemon");
vi.mock("@/shared/hooks/useDebounceSearch");
vi.mock("@features/pokemon/components/PokemonCard");
vi.mock("@features/pokemon/components/SearchInput");
vi.mock("@/shared/components/States");

// Mock icons
vi.mock("lucide-react", () => ({
  Loader2: (props: any) => React.createElement("span", { ...props, "data-testid": "loader-icon" }),
  Search: (props: any) => React.createElement("span", { ...props, "data-testid": "search-icon" }),
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

describe("PokemonListPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock useDebouncedSearch
    const debouncedSearch = await import("@/shared/hooks/useDebounceSearch");
    vi.mocked(debouncedSearch.useDebouncedSearch).mockReturnValue({
      searchTerm: "",
      debouncedSearchTerm: "",
      isTyping: false,
      updateSearchTerm: vi.fn(),
      clearSearch: vi.fn(),
      hasValidSearch: false,
    });

    // Mock useSearchPokemon
    const searchPokemon = await import("@features/pokemon/hooks/useSearchPokemon");
    vi.mocked(searchPokemon.useSearchPokemon).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      hasResults: false,
      isEmpty: false,
    });

    // Mock usePokemonList
    const pokemonHooks = await import("@features/pokemon/hooks/usePokemon");
    vi.mocked(pokemonHooks.usePokemonList).mockReturnValue({
      data: {
        pages: [
          {
            count: 100,
            next: null,
            previous: null,
            results: [
              { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
              { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    } as any);

    // Mock SearchInput component
    const SearchInput = await import("@features/pokemon/components/SearchInput");
    vi.mocked(SearchInput.SearchInput).mockImplementation(({ value, placeholder }) =>
      React.createElement("input", {
        "data-testid": "search-input",
        value,
        placeholder,
      })
    );

    // Mock PokemonCard component
    const PokemonCard = await import("@features/pokemon/components/PokemonCard");
    vi.mocked(PokemonCard.PokemonCard).mockImplementation(({ url }) =>
      React.createElement("div", {
        "data-testid": "pokemon-card",
        "data-url": url,
      })
    );

    // Mock States components
    const States = await import("@/shared/components/States");
    vi.mocked(States.EmptyState).mockImplementation(({ title, description }) =>
      React.createElement("div", {
        "data-testid": "empty-state",
      }, title, " - ", description)
    );
    vi.mocked(States.ErrorState).mockImplementation(({ title, message }) =>
      React.createElement("div", {
        "data-testid": "error-state",
      }, title, " - ", message)
    );
    vi.mocked(States.LoadingState).mockImplementation(() =>
      React.createElement("div", {
        "data-testid": "loading-state",
      })
    );
  });

  it("renders the page title", () => {
    render(<PokemonListPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Pokemon Collection")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<PokemonListPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("renders pokemon cards when data is loaded", () => {
    render(<PokemonListPage />, { wrapper: createWrapper() });

    const pokemonCards = screen.getAllByTestId("pokemon-card");
    expect(pokemonCards).toHaveLength(2);
    expect(pokemonCards[0]).toHaveAttribute("data-url", "https://pokeapi.co/api/v2/pokemon/1/");
    expect(pokemonCards[1]).toHaveAttribute("data-url", "https://pokeapi.co/api/v2/pokemon/2/");
  });

  it("renders loading state when loading", async () => {
    const pokemonHooks = await import("@features/pokemon/hooks/usePokemon");
    vi.mocked(pokemonHooks.usePokemonList).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    } as any);

    render(<PokemonListPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("renders error state when error occurs", async () => {
    const pokemonHooks = await import("@features/pokemon/hooks/usePokemon");
    vi.mocked(pokemonHooks.usePokemonList).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    } as any);

    render(<PokemonListPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("renders search results when searching", async () => {
    const debouncedSearch = await import("@/shared/hooks/useDebounceSearch");
    vi.mocked(debouncedSearch.useDebouncedSearch).mockReturnValue({
      searchTerm: "pikachu",
      debouncedSearchTerm: "pikachu",
      isTyping: false,
      updateSearchTerm: vi.fn(),
      clearSearch: vi.fn(),
      hasValidSearch: true,
    });

    const searchPokemon = await import("@features/pokemon/hooks/useSearchPokemon");
    vi.mocked(searchPokemon.useSearchPokemon).mockReturnValue({
      data: [
        {
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
              dream_world: { front_default: null, front_female: null },
              home: { front_default: null, front_female: null, front_shiny: null, front_shiny_female: null },
              "official-artwork": { front_default: null, front_shiny: null },
            },
          },
          types: [],
          abilities: [],
          stats: [],
          species: { name: "pikachu", url: "" },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      hasResults: true,
      isEmpty: false,
    });

    render(<PokemonListPage />, { wrapper: createWrapper() });

    // Should show search results instead of regular list
    expect(screen.getByText(/Found.*Pokemon matching/)).toBeInTheDocument();
  });

  it("renders empty search state when no results found", async () => {
    const debouncedSearch = await import("@/shared/hooks/useDebounceSearch");
    vi.mocked(debouncedSearch.useDebouncedSearch).mockReturnValue({
      searchTerm: "nonexistent",
      debouncedSearchTerm: "nonexistent",
      isTyping: false,
      updateSearchTerm: vi.fn(),
      clearSearch: vi.fn(),
      hasValidSearch: true,
    });

    const searchPokemon = await import("@features/pokemon/hooks/useSearchPokemon");
    vi.mocked(searchPokemon.useSearchPokemon).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      hasResults: false,
      isEmpty: true,
    });

    render(<PokemonListPage />, { wrapper: createWrapper() });

    expect(screen.getByText("No Pokemon found")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => {
      render(<PokemonListPage />, { wrapper: createWrapper() });
    }).not.toThrow();
  });
});
