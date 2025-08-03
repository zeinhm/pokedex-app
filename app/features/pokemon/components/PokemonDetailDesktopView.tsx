import { Button } from "@components/Button";
import { ArrowLeft, Heart, Loader2, Ruler, Star, Weight } from "lucide-react";
import { Link } from "react-router";
import type { Pokemon } from "@features/pokemon/types/pokemon.types";
import { getBackgroundColorByPokemonType } from "@/shared/utils/pokemon.utils";
import { StatusBar } from "./StatusBar";

interface PokemonDetailProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  imageUrl: string;
  imageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
  totalStats: number;
}

export function PokemonDetailDesktopView(props: PokemonDetailProps) {
  const {
    pokemon,
    isFavorite,
    onToggleFavorite,
    imageUrl,
    imageLoading,
    setImageLoading,
    totalStats,
  } = props;

  return (
    <div className="hidden lg:block">
      <div className="container mx-auto px-8 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          >
            <Link to="/pokemon" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Pokemon List
            </Link>
          </Button>
          <button onClick={onToggleFavorite}>
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? "text-red-400 fill-current" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="text-center">
              <div className="relative w-80 h-80 mx-auto mb-6">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-white capitalize">
                  {pokemon.name}
                </h1>
                <span className="text-2xl font-bold text-purple-400">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="flex justify-center gap-3 mb-8">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`px-6 py-2 rounded-full text-sm font-medium text-white ${getBackgroundColorByPokemonType(type.type.name)}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <Weight className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <p className="text-2xl font-bold text-white mb-1">
                  {pokemon.weight / 10} kg
                </p>
                <p className="text-sm text-gray-400">Weight</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <Ruler className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <p className="text-2xl font-bold text-white mb-1">
                  {pokemon.height / 10} m
                </p>
                <p className="text-sm text-gray-400">Height</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <p className="text-2xl font-bold text-white mb-1">
                  {pokemon.base_experience}
                </p>
                <p className="text-sm text-gray-400">Base EXP</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Base Stats</h3>
                <span className="text-purple-400 font-semibold">
                  Total: {totalStats}
                </span>
              </div>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <StatusBar key={stat.stat.name} stat={stat} />
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Abilities
              </h3>
              <div className="space-y-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                  >
                    <span className="text-gray-300 capitalize">
                      {ability.ability.name.replace("-", " ")}
                    </span>
                    {ability.is_hidden && (
                      <span className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
