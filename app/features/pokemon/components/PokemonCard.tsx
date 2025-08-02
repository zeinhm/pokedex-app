import { useState } from "react";
import { Link } from "react-router";
import { Heart, Eye } from "lucide-react";
import { Button } from "@components/Button";
import { usePokemon } from "../hooks/usePokemon";
import {
  extractIdFromUrl,
  getBackgroundColorByPokemonType,
} from "@/shared/utils/pokemon.utils";

interface PokemonCardProps {
  url: string;
  onToggleFavorite?: (pokemonId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export function PokemonCard({
  url,
  onToggleFavorite,
  isFavorite = false,
}: PokemonCardProps) {
  const pokemonId = extractIdFromUrl(url);
  const { data: pokemon, isLoading } = usePokemon(pokemonId);
  const [imageLoading, setImageLoading] = useState(true);

  const handleToggleFavorite = () => {
    if (onToggleFavorite && pokemon) {
      onToggleFavorite(pokemon.id, !isFavorite);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 animate-pulse">
        <div className="w-full h-48 bg-gray-700/50 rounded mb-4"></div>
        <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
        <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
      </div>
    );
  }

  if (!pokemon) return null;

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "/placeholder-pokemon.png";

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center text-white border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="relative">
        <div className="w-full h-48 flex items-center justify-center p-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={pokemon.name}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 ${
            isFavorite ? "text-red-400" : "text-gray-400"
          } hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg capitalize text-white">
            {pokemon.name}
          </h3>
          <span className="text-sm text-gray-400">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getBackgroundColorByPokemonType(type.type.name)}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 transition-all duration-200"
          >
            <Link
              to={`/pokemon/${pokemon.id}`}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
