import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Button } from "@/components/Button";

export const meta: MetaFunction = () => {
  return [
    { title: "Pokedex App - Catch 'Em All!" },
    { name: "description", content: "Explore the world of Pokemon" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      <div className="relative container mx-auto px-4 py-16">
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

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Complete Pokedex</h3>
            <p className="text-gray-400">
              Access detailed information about all Pokemon species, their
              stats, and abilities.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Save Favorites</h3>
            <p className="text-gray-400">
              Create your personal collection by saving your favorite Pokemon to
              your profile.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Compare Stats</h3>
            <p className="text-gray-400">
              Compare different Pokemon side by side to find the perfect team
              combination.
            </p>
          </div>
        </div>

        {/* Additional gaming-style elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm">
              Join thousands of trainers worldwide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
