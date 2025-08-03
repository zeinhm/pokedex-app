import { Card, CardContent } from "@components/Card";
import { Badge } from "@components/Badge";

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokemonAbilityProps {
  abilities: Ability[];
}

export function PokemonAbility({ abilities }: PokemonAbilityProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="py-6">
        <h3 className="text-white font-semibold mb-4 text-lg">Abilities</h3>
        <div className="space-y-3">
          {abilities.map((ability) => (
            <div
              key={ability.ability.name}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <span className="text-gray-300 capitalize">
                {ability.ability.name.replace("-", " ")}
              </span>
              {ability.is_hidden && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  Hidden
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
