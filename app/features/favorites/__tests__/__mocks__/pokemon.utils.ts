// Mock for pokemon utils
export const getBackgroundColorByPokemonType = (type: string) => `bg-${type}`;

// Mock for other pokemon utilities if needed
export const getPokemonTypeColor = (type: string) => `text-${type}`;
export const formatPokemonId = (id: number) => `#${id.toString().padStart(3, "0")}`;
