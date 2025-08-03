import { useState } from "react";
import { Link } from "react-router";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@components/Button";
import { getBackgroundColorByPokemonType } from "@/shared/utils/pokemon.utils";
import { usePokemon } from "@features/pokemon/hooks/usePokemon";
import { useRemoveFavorite } from "../hooks/useFavorites";
import type { FavoritePokemon } from "../services/favorites.services";

interface FavoriteCardProps {
  favorite: FavoritePokemon;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const { data: pokemonDetails } = usePokemon(favorite.pokemonId);
  const { mutateAsync: removeFavorite, isPending } = useRemoveFavorite();

  const handleRemoveFavorite = async () => {
    try {
      await removeFavorite({
        favoriteId: favorite.id,
        pokemonId: pokemonDetails?.id,
      });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 group">
      <div className="relative">
        <div className="w-full h-48 flex items-center justify-center p-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={favorite.pokemonImage}
            alt={favorite.pokemonName}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>

        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
            onClick={handleRemoveFavorite}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg capitalize text-white">
            {favorite.pokemonName}
          </h3>
          <span className="text-sm text-gray-400">
            #{favorite.pokemonId.toString().padStart(3, "0")}
          </span>
        </div>

        {pokemonDetails && (
          <div className="flex flex-wrap gap-1 mb-3">
            {pokemonDetails.types.map((type) => (
              <span
                key={type.type.name}
                className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getBackgroundColorByPokemonType(type.type.name)}`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 mb-3">
          Added {formatDate(favorite.createdAt)}
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 transition-all duration-200"
          >
            <Link
              to={`/pokemon/${favorite.pokemonId}`}
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
