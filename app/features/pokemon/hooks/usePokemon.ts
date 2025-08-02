import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PokemonApiService } from "../services/pokemon.api";
import type { PokemonSearchFilters } from "../types/pokemon.types";

export const pokemonKeys = {
  all: ["pokemon"] as const,
  list: (filters: PokemonSearchFilters) =>
    [...pokemonKeys.all, filters] as const,
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: string | number) => [...pokemonKeys.details(), id] as const,
};

export function usePokemonList(filters: PokemonSearchFilters = {}) {
  return useInfiniteQuery({
    queryKey: pokemonKeys.list(filters),
    queryFn: ({ pageParam = 0 }) =>
      PokemonApiService.getPokemonList({
        ...filters,
        offset: pageParam,
        limit: filters.limit || 20,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * (filters.limit || 20);
    },
    initialPageParam: 0,
  });
}

export function usePokemon(nameOrId: string | number) {
  return useQuery({
    queryKey: pokemonKeys.detail(nameOrId),
    queryFn: () => PokemonApiService.getPokemon(nameOrId),
    enabled: !!nameOrId,
  });
}
