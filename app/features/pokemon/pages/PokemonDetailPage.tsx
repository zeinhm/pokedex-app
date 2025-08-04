import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Heart, AlertCircle } from "lucide-react";
import { usePokemon } from "@features/pokemon/hooks/usePokemon";
import {
  useIsFavorited,
  useAddFavorite,
  useRemoveFavorite,
} from "@features/favorites/hooks/useFavorites";
import { PokemonDetailMobile } from "../components/PokemonDetailMobileView";
import { PokemonDetailDesktopView } from "../components/PokemonDetailDesktopView";
import type { MetaFunction } from "react-router";
import { useAuth } from "@/features/auth";
import { LoadingState } from "@/shared/components/States";

export const meta: MetaFunction = ({ params }) => {
  const pokemonId = params.id;
  return [
    { title: `Pokemon #${pokemonId} - Pokedex App` },
    {
      name: "description",
      content: `View detailed information about Pokemon #${pokemonId}`,
    },
  ];
};

export default function PokemonDetailPage() {
  const { id } = useParams();
  const [imageLoading, setImageLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.toString();
  const { data: pokemon, isLoading, isError, error } = usePokemon(id as string);
  const { user } = useAuth();
  const { data: favoriteStatus } = useIsFavorited(pokemon?.id || 0);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const toggleFavoriteLoading =
    addFavorite.isPending || removeFavorite.isPending;

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

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Pokemon..."
        description="Fetching data from the Pokemon API"
        size="lg"
        className="pt-24"
      />
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen pt-16">
        <div className="w-full h-screen flex flex-col">
          <div className="flex items-center justify-between p-6">
            <Link to={`/pokemon?${currentSearch}`}>
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <span className="text-white font-semibold">Error</span>
            <Heart className="w-6 h-6 text-gray-500" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-red-400 text-lg font-semibold mb-2">
                Pokemon not found
              </h3>
              <p className="text-red-400 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load Pokemon details"}
              </p>
              <Link
                to={`/pokemon?${currentSearch}`}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Back to Pokemon List
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "/placeholder-pokemon.png";

  const totalStats = pokemon.stats.reduce(
    (sum, stat) => sum + stat.base_stat,
    0
  );

  const isFavorited = Boolean(favoriteStatus?.isFavorited);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-16">
      <PokemonDetailMobile
        pokemon={pokemon}
        isFavorite={isFavorited}
        onToggleFavorite={handleToggleFavorite}
        totalStats={totalStats}
        imageUrl={imageUrl}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
        toggleLoading={toggleFavoriteLoading}
      />

      <PokemonDetailDesktopView
        pokemon={pokemon}
        isFavorite={isFavorited}
        onToggleFavorite={handleToggleFavorite}
        imageUrl={imageUrl}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
        totalStats={totalStats}
        toggleLoading={toggleFavoriteLoading}
      />
    </div>
  );
}
