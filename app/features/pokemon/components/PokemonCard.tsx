import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Heart, Eye, Loader2 } from "lucide-react";
import { Button } from "@components/Button";
import { Card, CardContent, CardHeader } from "@components/Card";
import { Badge } from "@components/Badge";
import { Skeleton } from "@components/Skeleton";
import { usePokemon } from "../hooks/usePokemon";
import {
  useIsFavorited,
  useAddFavorite,
  useRemoveFavorite,
} from "@features/favorites/hooks/useFavorites";
import {
  extractIdFromUrl,
  getBackgroundColorByPokemonType,
} from "@/shared/utils/pokemon.utils";
import { useAuth } from "@/features/auth";

interface PokemonCardProps {
  url: string;
}

export function PokemonCard({ url }: PokemonCardProps) {
  const pokemonId = extractIdFromUrl(url);
  const { data: pokemon, isLoading } = usePokemon(pokemonId);
  const [imageLoading, setImageLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: favoriteStatus, isLoading: favoriteLoading } =
    useIsFavorited(pokemonId);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleToggleFavorite = async () => {
    if (!pokemon || !user || !favoriteStatus) return;

    const favoriteData = {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      pokemonImage:
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default ||
        "/placeholder-pokemon.png",
    };

    try {
      if (favoriteStatus.isFavorited && favoriteStatus.favoriteId) {
        await removeFavorite.mutateAsync({
          favoriteId: favoriteStatus.favoriteId,
          pokemonId: pokemon.id,
        });
      } else {
        await addFavorite.mutateAsync(favoriteData);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleLoginRedirect = () => {
    const currentSearch = searchParams.toString();
    navigate(`/login${currentSearch ? `?${currentSearch}` : ""}`);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
        <CardHeader className="relative">
          <Skeleton className="w-full h-48 bg-gray-700/50" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 bg-gray-700/50" />
          <Skeleton className="h-3 bg-gray-700/50 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!pokemon) return null;

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "/placeholder-pokemon.png";

  const isFavorited = Boolean(favoriteStatus?.isFavorited);

  const isToggleLoading = addFavorite.isPending || removeFavorite.isPending;

  const currentSearch = searchParams.toString();
  const detailUrl = `/pokemon/${pokemon.id}${currentSearch ? `?${currentSearch}` : ""}`;

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 group">
      <CardHeader className="relative p-0">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={`transition-all duration-200 ${
              isFavorited
                ? "text-red-400 hover:text-red-300"
                : "text-gray-400 hover:text-red-400"
            } hover:bg-gray-700/50`}
            onClick={user ? handleToggleFavorite : handleLoginRedirect}
            disabled={favoriteLoading || isToggleLoading}
          >
            {isToggleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart
                className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
              />
            )}
          </Button>
        </div>

        <div className="w-full h-48 flex items-center justify-center p-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
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
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg capitalize text-white">
            {pokemon.name}
          </h3>
          <span className="text-sm text-gray-400">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              variant="pokemon"
              className={getBackgroundColorByPokemonType(type.type.name)}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>

        <Button
          asChild
          size="sm"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white border-blue-500 transition-all duration-200"
        >
          <Link
            to={detailUrl}
            className="flex items-center gap-1 justify-center"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
