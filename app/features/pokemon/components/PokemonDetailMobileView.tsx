import { Link } from "react-router";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Weight,
  Ruler,
  Shuffle,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
import { getBackgroundColorByPokemonType } from "@/shared/utils/pokemon.utils";
import type { Pokemon } from "@features/pokemon/types/pokemon.types";
import { StatusBar } from "./StatusBar";

interface PokemonDetailMobileProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  totalStats: number;
  imageUrl: string;
  imageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
}

export function PokemonDetailMobile({
  pokemon,
  isFavorite,
  onToggleFavorite,
  totalStats,
  imageUrl,
  imageLoading,
  setImageLoading,
}: PokemonDetailMobileProps) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-6">
        <Link to="/pokemon">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <span className="text-white font-semibold text-lg">
          #{pokemon.id.toString().padStart(3, "0")}
        </span>
        <button onClick={onToggleFavorite}>
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "text-red-400 fill-current" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="px-6 pb-8 text-center">
        <div className="relative w-64 h-64 mx-auto mb-6">
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

        <h1 className="text-3xl font-bold text-white capitalize mb-3">
          {pokemon.name}
        </h1>

        <p className="text-gray-400 mb-6">
          {pokemon.types.map((type) => type.type.name).join(" • ")} Pokemon
        </p>

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

      <Tabs defaultValue="about" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700/50">
          <TabsTrigger
            value="about"
            className="data-[state=active]:bg-gray-600/50 text-white px-2"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-gray-600/50 text-white px-2"
          >
            Stats
          </TabsTrigger>
          <TabsTrigger
            value="moves"
            className="data-[state=active]:bg-gray-600/50 text-white px-2"
          >
            Moves
          </TabsTrigger>
          <TabsTrigger
            value="evolutions"
            className="data-[state=active]:bg-gray-600/50 text-white px-2 "
          >
            Evolution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-0">
          <div className="space-y-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Weight className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {pokemon.weight / 10} kg
                </p>
                <p className="text-sm text-gray-400">Weight</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Ruler className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {pokemon.height / 10} m
                </p>
                <p className="text-sm text-gray-400">Height</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">
                Having been domesticated from birth,{" "}
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}{" "}
                is regarded as both a rare and well-behaved Pokemon.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 text-lg">
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
        </TabsContent>

        <TabsContent value="stats" className="mt-0">
          <div className="py-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Base Stats</h3>
                <span className="text-purple-400 font-semibold">
                  Total: {totalStats}
                </span>
              </div>
              <div className="space-y-2">
                {pokemon.stats.map((stat) => (
                  <StatusBar key={stat.stat.name} stat={stat} />
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 mt-6">
              <h3 className="text-white font-semibold mb-4 text-lg">
                Type Defenses
              </h3>
              <p className="text-gray-400 mb-6">
                The effectiveness of each type on{" "}
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}.
              </p>
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Type effectiveness data coming soon...
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="moves" className="mt-0">
          <div className="py-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shuffle className="w-6 h-6 text-purple-400" />
                <h3 className="text-white font-semibold text-lg">Moves</h3>
              </div>
              <div className="text-center py-12">
                <p className="text-gray-500">Move data coming soon...</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evolutions" className="mt-0">
          <div className="py-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-white font-semibold text-lg">Evolutions</h3>
              </div>
              <div className="text-center py-12">
                <p className="text-gray-500">Evolution data coming soon...</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
