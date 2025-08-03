import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Heart, Loader2, AlertCircle } from "lucide-react";
import { usePokemon } from "@features/pokemon/hooks/usePokemon";
import { PokemonDetailMobile } from "../components/PokemonDetailMobileView";
import { PokemonDetailDesktopView } from "../components/PokemonDetailDesktopView";
import type { MetaFunction } from "react-router";

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
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: pokemon, isLoading, isError, error } = usePokemon(id || "");

  useEffect(() => {
    if (pokemon) {
      const savedFavorites = localStorage.getItem("pokemon-favorites");
      if (savedFavorites) {
        try {
          const favoriteIds = JSON.parse(savedFavorites);
          setIsFavorite(favoriteIds.includes(pokemon.id));
        } catch (error) {
          console.error("Failed to parse favorites from localStorage:", error);
        }
      }
    }
  }, [pokemon]);

  const handleToggleFavorite = () => {
    if (!pokemon) return;

    const savedFavorites = localStorage.getItem("pokemon-favorites");
    let favoriteIds: number[] = [];

    if (savedFavorites) {
      try {
        favoriteIds = JSON.parse(savedFavorites);
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }

    if (isFavorite) {
      favoriteIds = favoriteIds.filter((favId) => favId !== pokemon.id);
    } else {
      favoriteIds.push(pokemon.id);
    }

    localStorage.setItem("pokemon-favorites", JSON.stringify(favoriteIds));
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="w-full h-screen flex flex-col">
          <div className="flex items-center justify-between p-6">
            <Link to="/pokemon">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <span className="text-white font-semibold">Loading...</span>
            <Heart className="w-6 h-6 text-gray-500" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4 mx-auto" />
              <p className="text-gray-300">Loading Pokemon details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="w-full h-screen flex flex-col">
          <div className="flex items-center justify-between p-6">
            <Link to="/pokemon">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <span className="text-white font-semibold">Error</span>
            <Heart className="w-6 h-6 text-gray-500" />
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4 mx-auto" />
              <h3 className="text-red-300 text-lg font-semibold mb-2">
                Pokemon Not Found
              </h3>
              <p className="text-red-200 text-center">
                {error instanceof Error
                  ? error.message
                  : "Failed to load Pokemon details"}
              </p>
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

  return (
    <div className="min-h-screen">
      <PokemonDetailMobile
        pokemon={pokemon}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        totalStats={totalStats}
        imageUrl={imageUrl}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />

      <PokemonDetailDesktopView
        pokemon={pokemon}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        totalStats={totalStats}
        imageUrl={imageUrl}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />
    </div>
  );
}
