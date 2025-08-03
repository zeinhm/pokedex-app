import { Card, CardContent } from "@components/Card";
import { cn } from "@/lib/utils";

interface PokemonInfoProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function PokemonInfo({
  icon,
  title,
  value,
  subtitle,
  className,
}: PokemonInfoProps) {
  return (
    <Card className={cn("bg-gray-800/50 border-gray-700/50", className)}>
      <CardContent className="text-center py-6">
        <div className="flex items-center justify-center mb-3">{icon}</div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
