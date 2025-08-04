import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { usePokemon, usePokemonList, pokemonKeys } from "../../hooks/usePokemon";
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

describe("usePokemon hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("pokemonKeys", () => {
    it("generates correct query keys", () => {
      expect(pokemonKeys.all).toEqual(["pokemon"]);
      expect(pokemonKeys.list({ limit: 20 })).toEqual([
        "pokemon",
        { limit: 20 },
      ]);
      expect(pokemonKeys.details()).toEqual(["pokemon", "detail"]);
      expect(pokemonKeys.detail(25)).toEqual(["pokemon", "detail", 25]);
      expect(pokemonKeys.detail("pikachu")).toEqual([
        "pokemon",
        "detail",
        "pikachu",
      ]);
    });
  });

  describe("usePokemonList", () => {
    it("fetches pokemon list with default parameters", async () => {
      const mockResponse = {
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      };

      vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(PokemonApiService.getPokemonList).toHaveBeenCalledWith({
        offset: 0,
        limit: 20,
      });
      expect(result.current.data?.pages[0]).toEqual(mockResponse);
    });

    it("fetches pokemon list with custom filters", async () => {
      const mockResponse = {
        count: 50,
        next: null,
        previous: null,
        results: [
          { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
        ],
      };

      const filters = { limit: 10, offset: 5 };

      vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => usePokemonList(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(PokemonApiService.getPokemonList).toHaveBeenCalledWith({
        ...filters,
        offset: 0, // pageParam overrides filters.offset
        limit: 10,
      });
    });

    it("handles pagination correctly", async () => {
      const mockFirstPage = {
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
      };

      const mockSecondPage = {
        count: 100,
        next: null,
        previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
        results: [
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      };

      vi.mocked(PokemonApiService.getPokemonList)
        .mockResolvedValueOnce(mockFirstPage)
        .mockResolvedValueOnce(mockSecondPage);

      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Test getNextPageParam
      expect(result.current.hasNextPage).toBe(true);

      // Fetch next page
      await result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages[0]).toEqual(mockFirstPage);
      expect(result.current.data?.pages[1]).toEqual(mockSecondPage);
    });

    it("determines when there are no more pages", async () => {
      const mockResponse = {
        count: 20,
        next: null,
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
      };

      vi.mocked(PokemonApiService.getPokemonList).mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe("usePokemon", () => {
    it("fetches pokemon by name", async () => {
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

      vi.mocked(PokemonApiService.getPokemon).mockResolvedValue(mockPokemon);

      const { result } = renderHook(() => usePokemon("pikachu"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(PokemonApiService.getPokemon).toHaveBeenCalledWith("pikachu");
      expect(result.current.data).toEqual(mockPokemon);
    });

    it("fetches pokemon by id", async () => {
      const mockPokemon = {
        id: 1,
        name: "bulbasaur",
        base_experience: 64,
        height: 7,
        weight: 69,
        sprites: {
          front_default: "https://example.com/bulbasaur.png",
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
            type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
          },
        ],
        abilities: [],
        stats: [],
        species: { name: "bulbasaur", url: "" },
      };

      vi.mocked(PokemonApiService.getPokemon).mockResolvedValue(mockPokemon);

      const { result } = renderHook(() => usePokemon(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(PokemonApiService.getPokemon).toHaveBeenCalledWith(1);
      expect(result.current.data).toEqual(mockPokemon);
    });

    it("is disabled when nameOrId is empty", () => {
      const { result } = renderHook(() => usePokemon(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(PokemonApiService.getPokemon).not.toHaveBeenCalled();
    });

    it("is disabled when nameOrId is 0", () => {
      const { result } = renderHook(() => usePokemon(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(PokemonApiService.getPokemon).not.toHaveBeenCalled();
    });

    it("handles API errors gracefully", async () => {
      const mockError = new Error("Pokemon not found");
      vi.mocked(PokemonApiService.getPokemon).mockRejectedValue(mockError);

      const { result } = renderHook(() => usePokemon("nonexistent"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });
});
