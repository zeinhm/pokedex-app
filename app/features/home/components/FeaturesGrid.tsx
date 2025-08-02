import { FileText, Heart, BarChart3 } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesGrid() {
  const features = [
    {
      icon: FileText,
      title: "Complete Pokedex",
      description:
        "Access detailed information about all Pokemon species, their stats, and abilities.",
      gradientColors: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description:
        "Create your personal collection by saving your favorite Pokemon to your profile.",
      gradientColors: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Compare Stats",
      description:
        "Compare different Pokemon side by side to find the perfect team combination.",
      gradientColors: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}
