const API_BASE_URL = import.meta.env.VITE_POKEMON_API_BASE_URL as string;

export const API_ENDPOINTS = {
  POKEMON_LIST: `${API_BASE_URL}/api/v2/pokemon`,
  POKEMON_TYPES: `${API_BASE_URL}/api/v2/type`,
} as const;
