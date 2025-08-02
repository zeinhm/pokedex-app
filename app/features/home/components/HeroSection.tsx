import { Link } from "react-router";
import { Button } from "@components/Button";

export function HeroSection() {
  return (
    <div className="text-center text-white">
      <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
        Welcome to the Pokedex
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
        Discover, explore, and collect information about all your favorite
        Pokemon. Join our community and start your journey today!
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Link to="/pokemon">Browse Pokemon</Link>
        </Button>
      </div>
    </div>
  );
}
