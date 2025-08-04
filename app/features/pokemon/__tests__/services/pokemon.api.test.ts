import { describe, it, expect, vi, beforeEach } from "vitest";
import { PokemonApiService, pokemonApiClient } from "../../services/pokemon.api";
import { ApiClient } from "@/shared/services/http-service";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";

// Mock the API client
vi.mock("@/shared/services/http-service", () => ({
  ApiClient: {
    get: vi.fn(),
  },
}));

vi.mock("@/shared/constants/api.constants", () => ({
  API_ENDPOINTS: {
    POKEMON_LIST: "/pokemon",
  },
}));

describe("PokemonApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPokemonList", () => {
    it("calls ApiClient.get with correct endpoint", async () => {
      const mockResponse = {
        count: 100,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(ApiClient.get).mockResolvedValue(mockResponse);

      await pokemonApiClient.getPokemonList();

      expect(ApiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.POKEMON_LIST, {
        params: undefined,
      });
    });

    it("calls ApiClient.get with search parameters", async () => {
      const mockParams = { limit: 20, offset: 0 };
      const mockResponse = {
        count: 100,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(ApiClient.get).mockResolvedValue(mockResponse);

      await pokemonApiClient.getPokemonList(mockParams);

      expect(ApiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.POKEMON_LIST, {
        params: mockParams,
      });
    });

    it("returns pokemon list response", async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      };

      vi.mocked(ApiClient.get).mockResolvedValue(mockResponse);

      const result = await pokemonApiClient.getPokemonList();

      expect(result).toEqual(mockResponse);
    });
  });

  describe("getPokemon", () => {
    it("calls ApiClient.get with pokemon name", async () => {
      const mockPokemon = {
        id: 25,
        name: "pikachu",
        base_experience: 112,
        height: 4,
        weight: 60,
        sprites: {},
        types: [],
        abilities: [],
        stats: [],
        species: { name: "pikachu", url: "" },
      };

      vi.mocked(ApiClient.get).mockResolvedValue(mockPokemon);

      await pokemonApiClient.getPokemon("pikachu");

      expect(ApiClient.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.POKEMON_LIST}/pikachu`
      );
    });

    it("calls ApiClient.get with pokemon id", async () => {
      const mockPokemon = {
        id: 25,
        name: "pikachu",
        base_experience: 112,
        height: 4,
        weight: 60,
        sprites: {},
        types: [],
        abilities: [],
        stats: [],
        species: { name: "pikachu", url: "" },
      };

      vi.mocked(ApiClient.get).mockResolvedValue(mockPokemon);

      await pokemonApiClient.getPokemon(25);

      expect(ApiClient.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.POKEMON_LIST}/25`
      );
    });

    it("returns pokemon data", async () => {
      const mockPokemon = {
        id: 1,
        name: "bulbasaur",
        base_experience: 64,
        height: 7,
        weight: 69,
        sprites: {
          front_default: "https://example.com/bulbasaur.png",
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

      vi.mocked(ApiClient.get).mockResolvedValue(mockPokemon);

      const result = await pokemonApiClient.getPokemon("bulbasaur");

      expect(result).toEqual(mockPokemon);
    });
  });

  describe("PokemonApiService export", () => {
    it("exports PokemonApiService as pokemonApiClient", () => {
      expect(PokemonApiService).toBe(pokemonApiClient);
    });

    it("has getPokemonList method", () => {
      expect(typeof PokemonApiService.getPokemonList).toBe("function");
    });

    it("has getPokemon method", () => {
      expect(typeof PokemonApiService.getPokemon).toBe("function");
    });
  });
});
