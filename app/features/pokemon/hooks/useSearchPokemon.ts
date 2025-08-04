import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { PokemonApiService } from "../services/pokemon.api";
import { pokemonKeys } from "./usePokemon";
import type { Pokemon, PokemonListItem } from "../types/pokemon.types";

export function useSearchPokemon(searchTerm: string) {
  const trimmedSearch = searchTerm.trim().toLowerCase();

  const searchQuery = useQuery({
    queryKey: [...pokemonKeys.all, "search", trimmedSearch],
    queryFn: async (): Promise<Pokemon[]> => {
      if (!trimmedSearch) return [];

      try {
        const pokemon = await PokemonApiService.getPokemon(trimmedSearch);
        return [pokemon];
      } catch (error) {
        return [];
      }
    },
    enabled: !!trimmedSearch && trimmedSearch.length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const listSearchQuery = useQuery({
    queryKey: [...pokemonKeys.all, "search-list", trimmedSearch],
    queryFn: async (): Promise<PokemonListItem[]> => {
      if (!trimmedSearch || trimmedSearch.length < 2) return [];

      try {
        const response = await PokemonApiService.getPokemonList({
          limit: 1000,
        });

        const filteredPokemon = response.results.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(trimmedSearch)
        );

        return filteredPokemon.slice(0, 20);
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    enabled: !!trimmedSearch && trimmedSearch.length >= 2,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const detailedResults = useQuery({
    queryKey: [...pokemonKeys.all, "search-detailed", trimmedSearch],
    queryFn: async (): Promise<Pokemon[]> => {
      if (!listSearchQuery.data || listSearchQuery.data.length === 0) {
        return [];
      }

      try {
        const pokemonPromises = listSearchQuery.data.map((pokemon) => {
          const id = pokemon.url.split("/").filter(Boolean).pop();
          return PokemonApiService.getPokemon(id || pokemon.name);
        });

        const results = await Promise.allSettled(pokemonPromises);

        return results
          .filter(
            (result): result is PromiseFulfilledResult<Pokemon> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);
      } catch (error) {
        console.error("Detailed search error:", error);
        return [];
      }
    },
    enabled: !!listSearchQuery.data && listSearchQuery.data.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const combinedResults = useMemo(() => {
    const directResults = searchQuery.data || [];
    const listResults = detailedResults.data || [];

    const allResults = [...directResults, ...listResults];
    const uniqueResults = allResults.filter(
      (pokemon, index, self) =>
        index === self.findIndex((p) => p.id === pokemon.id)
    );

    return uniqueResults;
  }, [searchQuery.data, detailedResults.data]);

  const isLoading =
    searchQuery.isLoading ||
    listSearchQuery.isLoading ||
    detailedResults.isLoading;
  const isError = searchQuery.isError && listSearchQuery.isError;
  const error = searchQuery.error || listSearchQuery.error;

  return {
    data: combinedResults,
    isLoading,
    isError,
    error,
    hasResults: combinedResults.length > 0,
    isEmpty:
      !isLoading &&
      !isError &&
      combinedResults.length === 0 &&
      trimmedSearch.length >= 2,
  };
}
