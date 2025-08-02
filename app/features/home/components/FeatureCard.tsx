import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientColors: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradientColors 
}: FeatureCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2">
      <div className={`w-12 h-12 bg-gradient-to-r ${gradientColors} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
