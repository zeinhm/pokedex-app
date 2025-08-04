import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useSearchPokemon } from "../../hooks/useSearchPokemon";
import { PokemonApiService } from "../../services/pokemon.api";

// Mock the PokemonApiService
vi.mock("../../services/pokemon.api");

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
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useSearchPokemon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty results for empty search term", () => {
    const { result } = renderHook(() => useSearchPokemon(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("returns empty results for search term less than 2 characters", () => {
    const { result } = renderHook(() => useSearchPokemon("a"), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("searches for pokemon by exact name", async () => {
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
            front_default: null,
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

    const mockListResponse = {
      count: 100,
      next: null,
      previous: null,
      results: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        { name: "pichu", url: "https://pokeapi.co/api/v2/pokemon/172/" },
      ],
    };

    vi.mocked(PokemonApiService.getPokemon).mockResolvedValue(mockPokemon);
    vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
      mockListResponse
    );

    const { result } = renderHook(() => useSearchPokemon("pikachu"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(PokemonApiService.getPokemon).toHaveBeenCalledWith("pikachu");
    expect(result.current.data[0]).toEqual(mockPokemon);
  });

  it("searches for pokemon in list by partial name", async () => {
    const mockListResponse = {
      count: 1000,
      next: null,
      previous: null,
      results: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        { name: "pichu", url: "https://pokeapi.co/api/v2/pokemon/172/" },
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ],
    };

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
            front_default: null,
            front_shiny: null,
          },
        },
      },
      types: [],
      abilities: [],
      stats: [],
      species: { name: "pikachu", url: "" },
    };

    vi.mocked(PokemonApiService.getPokemon)
      .mockResolvedValueOnce(mockPokemon) // First call for direct search
      .mockResolvedValue(mockPokemon); // Subsequent calls for detailed results
      
    vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
      mockListResponse
    );

    const { result } = renderHook(() => useSearchPokemon("pika"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data.length).toBeGreaterThan(0);
    });

    expect(PokemonApiService.getPokemonList).toHaveBeenCalledWith({
      limit: 1000,
    });
  });

  it("handles pokemon not found gracefully", async () => {
    vi.mocked(PokemonApiService.getPokemon).mockRejectedValue(
      new Error("Pokemon not found")
    );

    const mockListResponse = {
      count: 100,
      next: null,
      previous: null,
      results: [],
    };

    vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
      mockListResponse
    );

    const { result } = renderHook(() => useSearchPokemon("nonexistent"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });

    expect(result.current.data).toEqual([]);
  });

  it("trims and converts search term to lowercase", async () => {
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
            front_default: null,
            front_shiny: null,
          },
        },
      },
      types: [],
      abilities: [],
      stats: [],
      species: { name: "pikachu", url: "" },
    };

    vi.mocked(PokemonApiService.getPokemon).mockResolvedValue(mockPokemon);

    const { result } = renderHook(() => useSearchPokemon("  PIKACHU  "), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(PokemonApiService.getPokemon).toHaveBeenCalledWith("pikachu");
  });

  it("limits list search results to 20", async () => {
    const mockResults = Array.from({ length: 30 }, (_, i) => ({
      name: `pokemon${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i}/`,
    }));

    const mockListResponse = {
      count: 1000,
      next: null,
      previous: null,
      results: mockResults,
    };

    const mockPokemon = {
      id: 1,
      name: "pokemon1",
      base_experience: 112,
      height: 4,
      weight: 60,
      sprites: {
        front_default: "https://example.com/pokemon.png",
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
            front_default: null,
            front_shiny: null,
          },
        },
      },
      types: [],
      abilities: [],
      stats: [],
      species: { name: "pokemon1", url: "" },
    };

    vi.mocked(PokemonApiService.getPokemon).mockResolvedValue(mockPokemon);
    vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
      mockListResponse
    );

    const { result } = renderHook(() => useSearchPokemon("pokemon"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data.length).toBeGreaterThan(0);
    });

    // The hook should limit results to 20 internally
    expect(result.current.data.length).toBeLessThanOrEqual(21); // Allow for the direct search + 20 list results
  });

  it("provides combined results", async () => {
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
            front_default: null,
            front_shiny: null,
          },
        },
      },
      types: [],
      abilities: [],
      stats: [],
      species: { name: "pikachu", url: "" },
    };

    const mockListResponse = {
      count: 100,
      next: null,
      previous: null,
      results: [
        { name: "pichu", url: "https://pokeapi.co/api/v2/pokemon/172/" },
      ],
    };

    vi.mocked(PokemonApiService.getPokemon).mockResolvedValue(mockPokemon);
    vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
      mockListResponse
    );

    const { result } = renderHook(() => useSearchPokemon("pika"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data.length).toBeGreaterThan(0);
    });

    expect(result.current.data.length).toBeGreaterThan(0);
  });
});
