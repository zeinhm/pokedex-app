import { describe, it, expect } from "vitest";
import {
  getPokemonTypeColor,
  getBackgroundColorByPokemonType,
  extractIdFromUrl,
  getShortStatName,
  getStatColor,
} from "@/shared/utils/pokemon.utils";

describe("Pokemon Utils", () => {
  describe("getPokemonTypeColor", () => {
    it("returns correct color for known types", () => {
      expect(getPokemonTypeColor("fire")).toBe("#F08030");
      expect(getPokemonTypeColor("water")).toBe("#6890F0");
      expect(getPokemonTypeColor("electric")).toBe("#F8D030");
      expect(getPokemonTypeColor("grass")).toBe("#78C850");
      expect(getPokemonTypeColor("normal")).toBe("#A8A878");
    });

    it("returns default color for unknown types", () => {
      expect(getPokemonTypeColor("unknown")).toBe("#68A090");
      expect(getPokemonTypeColor("")).toBe("#68A090");
    });

    it("handles case insensitive input", () => {
      expect(getPokemonTypeColor("FIRE")).toBe("#F08030");
      expect(getPokemonTypeColor("Water")).toBe("#6890F0");
      expect(getPokemonTypeColor("ElEcTrIc")).toBe("#F8D030");
    });

    it("returns colors for all pokemon types", () => {
      const types = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic", "bug",
        "rock", "ghost", "dragon", "dark", "steel", "fairy"
      ];

      types.forEach(type => {
        const color = getPokemonTypeColor(type);
        expect(color).toBeTruthy();
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe("getBackgroundColorByPokemonType", () => {
    it("returns correct Tailwind class for known types", () => {
      expect(getBackgroundColorByPokemonType("fire")).toBe("bg-red-500");
      expect(getBackgroundColorByPokemonType("water")).toBe("bg-blue-500");
      expect(getBackgroundColorByPokemonType("electric")).toBe("bg-yellow-400");
      expect(getBackgroundColorByPokemonType("grass")).toBe("bg-green-500");
      expect(getBackgroundColorByPokemonType("normal")).toBe("bg-gray-400");
    });

    it("returns default background for unknown types", () => {
      expect(getBackgroundColorByPokemonType("unknown")).toBe("bg-gray-400");
      expect(getBackgroundColorByPokemonType("")).toBe("bg-gray-400");
    });

    it("returns valid Tailwind classes for all types", () => {
      const types = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic", "bug",
        "rock", "ghost", "dragon", "dark", "steel", "fairy"
      ];

      types.forEach(type => {
        const bgClass = getBackgroundColorByPokemonType(type);
        expect(bgClass).toBeTruthy();
        expect(bgClass).toMatch(/^bg-\w+-\d+$/);
      });
    });

    it("handles special type cases", () => {
      expect(getBackgroundColorByPokemonType("fighting")).toBe("bg-red-700");
      expect(getBackgroundColorByPokemonType("poison")).toBe("bg-purple-500");
      expect(getBackgroundColorByPokemonType("ground")).toBe("bg-yellow-600");
      expect(getBackgroundColorByPokemonType("flying")).toBe("bg-indigo-400");
      expect(getBackgroundColorByPokemonType("psychic")).toBe("bg-pink-500");
      expect(getBackgroundColorByPokemonType("bug")).toBe("bg-green-400");
      expect(getBackgroundColorByPokemonType("rock")).toBe("bg-yellow-800");
      expect(getBackgroundColorByPokemonType("ghost")).toBe("bg-purple-700");
      expect(getBackgroundColorByPokemonType("dragon")).toBe("bg-indigo-700");
      expect(getBackgroundColorByPokemonType("dark")).toBe("bg-gray-800");
      expect(getBackgroundColorByPokemonType("steel")).toBe("bg-gray-500");
      expect(getBackgroundColorByPokemonType("fairy")).toBe("bg-pink-300");
      expect(getBackgroundColorByPokemonType("ice")).toBe("bg-blue-200");
    });
  });

  describe("extractIdFromUrl", () => {
    it("extracts ID from valid Pokemon API URLs", () => {
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/1/")).toBe(1);
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/151/")).toBe(151);
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/1000/")).toBe(1000);
    });

    it("returns 0 for invalid URLs", () => {
      expect(extractIdFromUrl("https://example.com")).toBe(0);
      expect(extractIdFromUrl("not-a-url")).toBe(0);
      expect(extractIdFromUrl("")).toBe(0);
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/")).toBe(0);
    });

    it("handles URLs without trailing slash", () => {
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/25")).toBe(0);
    });

    it("handles URLs with different domains", () => {
      expect(extractIdFromUrl("https://other-api.com/pokemon/42/")).toBe(42);
      expect(extractIdFromUrl("http://localhost:3000/pokemon/123/")).toBe(123);
    });

    it("handles edge cases", () => {
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/0/")).toBe(0);
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/abc/")).toBe(0);
      expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon//")).toBe(0);
    });
  });

  describe("getShortStatName", () => {
    it("returns correct short names for stats", () => {
      expect(getShortStatName("hp")).toBe("HP");
      expect(getShortStatName("attack")).toBe("Attack");
      expect(getShortStatName("defense")).toBe("Defense");
      expect(getShortStatName("special-attack")).toBe("Sp. Atk");
      expect(getShortStatName("special-defense")).toBe("Sp. Def");
      expect(getShortStatName("speed")).toBe("Speed");
    });

    it("returns original name capitalized for unknown stats", () => {
      expect(getShortStatName("unknown-stat")).toBe("Unknown-stat");
      expect(getShortStatName("")).toBe("");
      expect(getShortStatName("custom")).toBe("Custom");
    });

    it("handles case sensitivity", () => {
      expect(getShortStatName("HP")).toBe("HP"); // Exact match
      expect(getShortStatName("ATTACK")).toBe("ATTACK"); // Capitalized unknown
      expect(getShortStatName("Defense")).toBe("Defense"); // Capitalized unknown
    });

    it("handles special stat names correctly", () => {
      // Test the full list of expected stat transformations
      const statMappings = [
        ["hp", "HP"],
        ["attack", "Attack"],
        ["defense", "Defense"],
        ["special-attack", "Sp. Atk"],
        ["special-defense", "Sp. Def"],
        ["speed", "Speed"]
      ];

      statMappings.forEach(([input, expected]) => {
        expect(getShortStatName(input)).toBe(expected);
      });
    });
  });

  describe("getStatColor", () => {
    it("returns green for high percentages (80+)", () => {
      expect(getStatColor(80)).toBe("bg-green-500");
      expect(getStatColor(90)).toBe("bg-green-500");
      expect(getStatColor(100)).toBe("bg-green-500");
    });

    it("returns yellow for good percentages (60-79)", () => {
      expect(getStatColor(60)).toBe("bg-yellow-500");
      expect(getStatColor(70)).toBe("bg-yellow-500");
      expect(getStatColor(79)).toBe("bg-yellow-500");
    });

    it("returns orange for medium percentages (40-59)", () => {
      expect(getStatColor(40)).toBe("bg-orange-500");
      expect(getStatColor(50)).toBe("bg-orange-500");
      expect(getStatColor(59)).toBe("bg-orange-500");
    });

    it("returns red for low percentages (0-39)", () => {
      expect(getStatColor(0)).toBe("bg-red-500");
      expect(getStatColor(20)).toBe("bg-red-500");
      expect(getStatColor(39)).toBe("bg-red-500");
    });

    it("handles edge cases", () => {
      expect(getStatColor(-10)).toBe("bg-red-500");
      expect(getStatColor(79.9)).toBe("bg-yellow-500");
      expect(getStatColor(80.1)).toBe("bg-green-500");
    });
  });
});
