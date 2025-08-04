import { describe, it, expect } from "vitest";
import type {
  Pokemon,
  PokemonListItem,
  PokemonListResponse,
  PokemonSprites,
  PokemonType,
  PokemonStat,
  PokemonAbility,
  PokemonSearchFilters,
} from "../../types/pokemon.types";

describe("Pokemon Types", () => {
  describe("PokemonListItem", () => {
    it("has correct structure", () => {
      const mockPokemonListItem: PokemonListItem = {
        name: "pikachu",
        url: "https://pokeapi.co/api/v2/pokemon/25/",
      };

      expect(mockPokemonListItem).toHaveProperty("name");
      expect(mockPokemonListItem).toHaveProperty("url");
      expect(typeof mockPokemonListItem.name).toBe("string");
      expect(typeof mockPokemonListItem.url).toBe("string");
    });
  });

  describe("PokemonListResponse", () => {
    it("has correct structure", () => {
      const mockResponse: PokemonListResponse = {
        count: 100,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
        previous: null,
        results: [
          {
            name: "pikachu",
            url: "https://pokeapi.co/api/v2/pokemon/25/",
          },
        ],
      };

      expect(mockResponse).toHaveProperty("count");
      expect(mockResponse).toHaveProperty("next");
      expect(mockResponse).toHaveProperty("previous");
      expect(mockResponse).toHaveProperty("results");
      expect(Array.isArray(mockResponse.results)).toBe(true);
    });
  });

  describe("PokemonSprites", () => {
    it("allows null values for sprite properties", () => {
      const mockSprites: PokemonSprites = {
        front_default: "https://example.com/sprite.png",
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
      };

      expect(mockSprites.front_default).toBe("https://example.com/sprite.png");
      expect(mockSprites.front_shiny).toBeNull();
    });
  });

  describe("PokemonType", () => {
    it("has correct structure", () => {
      const mockType: PokemonType = {
        slot: 1,
        type: {
          name: "electric",
          url: "https://pokeapi.co/api/v2/type/13/",
        },
      };

      expect(mockType).toHaveProperty("slot");
      expect(mockType).toHaveProperty("type");
      expect(mockType.type).toHaveProperty("name");
      expect(mockType.type).toHaveProperty("url");
    });
  });

  describe("PokemonStat", () => {
    it("has correct structure", () => {
      const mockStat: PokemonStat = {
        base_stat: 55,
        effort: 0,
        stat: {
          name: "hp",
          url: "https://pokeapi.co/api/v2/stat/1/",
        },
      };

      expect(mockStat).toHaveProperty("base_stat");
      expect(mockStat).toHaveProperty("effort");
      expect(mockStat).toHaveProperty("stat");
      expect(typeof mockStat.base_stat).toBe("number");
    });
  });

  describe("PokemonAbility", () => {
    it("has correct structure", () => {
      const mockAbility: PokemonAbility = {
        is_hidden: false,
        slot: 1,
        ability: {
          name: "static",
          url: "https://pokeapi.co/api/v2/ability/9/",
        },
      };

      expect(mockAbility).toHaveProperty("is_hidden");
      expect(mockAbility).toHaveProperty("slot");
      expect(mockAbility).toHaveProperty("ability");
      expect(typeof mockAbility.is_hidden).toBe("boolean");
    });
  });

  describe("Pokemon", () => {
    it("has correct structure", () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: "pikachu",
        base_experience: 112,
        height: 4,
        weight: 60,
        species: {
          name: "pikachu",
          url: "https://pokeapi.co/api/v2/pokemon-species/25/",
        },
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
            type: {
              name: "electric",
              url: "https://pokeapi.co/api/v2/type/13/",
            },
          },
        ],
        stats: [
          {
            base_stat: 55,
            effort: 0,
            stat: {
              name: "hp",
              url: "https://pokeapi.co/api/v2/stat/1/",
            },
          },
        ],
        abilities: [
          {
            is_hidden: false,
            slot: 1,
            ability: {
              name: "static",
              url: "https://pokeapi.co/api/v2/ability/9/",
            },
          },
        ],
      };

      expect(mockPokemon).toHaveProperty("id");
      expect(mockPokemon).toHaveProperty("name");
      expect(mockPokemon).toHaveProperty("base_experience");
      expect(mockPokemon).toHaveProperty("height");
      expect(mockPokemon).toHaveProperty("weight");
      expect(mockPokemon).toHaveProperty("species");
      expect(mockPokemon).toHaveProperty("sprites");
      expect(mockPokemon).toHaveProperty("types");
      expect(mockPokemon).toHaveProperty("stats");
      expect(mockPokemon).toHaveProperty("abilities");
    });
  });

  describe("PokemonSearchFilters", () => {
    it("allows all properties to be optional", () => {
      const mockFilters: PokemonSearchFilters = {};
      expect(mockFilters).toBeDefined();
    });

    it("has correct structure when properties are provided", () => {
      const mockFilters: PokemonSearchFilters = {
        limit: 20,
        offset: 0,
      };

      expect(mockFilters.limit).toBe(20);
      expect(mockFilters.offset).toBe(0);
    });
  });
});
