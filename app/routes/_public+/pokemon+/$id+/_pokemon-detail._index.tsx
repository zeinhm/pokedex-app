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

export { default } from "@/features/pokemon/pages/PokemonDetailPage";
