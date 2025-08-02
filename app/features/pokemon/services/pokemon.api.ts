import { ApiClient } from "@/shared/services/http-service";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import type {
  Pokemon,
  PokemonListResponse,
  PokemonSearchFilters,
} from "../types/pokemon.types";

export const pokemonApiClient = {
  getPokemonList: (params?: PokemonSearchFilters) =>
    ApiClient.get<PokemonListResponse>(API_ENDPOINTS.POKEMON_LIST, {
      params,
    }),

  getPokemon: (nameOrId: string | number) =>
    ApiClient.get<Pokemon>(`${API_ENDPOINTS.POKEMON_LIST}/${nameOrId}`),
};

export const PokemonApiService = pokemonApiClient;
