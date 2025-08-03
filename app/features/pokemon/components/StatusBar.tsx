import { getShortStatName, getStatColor } from "@/shared/utils/pokemon.utils";

interface StatusBarProps {
  stat: {
    base_stat: number;
    stat: { name: string };
  };
  maxStat?: number;
}

export function StatusBar({ stat, maxStat = 255 }: StatusBarProps) {
  const percentage = Math.min((stat.base_stat / maxStat) * 100, 100);

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="min-w-[70px] text-left">
        <span className="text-sm font-medium text-gray-300">
          {getShortStatName(stat.stat.name)}
        </span>
      </div>

      <div className="flex items-center gap-4 flex-1">
        <span className="text-sm font-bold text-white min-w-[35px] text-right">
          {stat.base_stat}
        </span>
        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${getStatColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
