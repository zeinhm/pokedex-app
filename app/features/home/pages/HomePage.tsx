import type { MetaFunction } from "react-router";
import { HeroSection } from "../components/HeroSection";
import { FeaturesGrid } from "../components/FeaturesGrid";
import { StatusIndicator } from "../components/StatusIndicator";

export const meta: MetaFunction = () => {
  return [
    { title: "Pokedex App - Catch 'Em All!" },
    { name: "description", content: "Explore the world of Pokemon" },
  ];
};

export default function HomePage() {
  return (
    <div className="min-h-screen ">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      <div className="relative container mx-auto px-4 py-16">
        <HeroSection />
        <FeaturesGrid />
        <StatusIndicator />
      </div>
    </div>
  );
}
