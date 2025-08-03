import { Heart, Loader2, UserX, Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@components/Button";
import { useFavorites } from "../hooks/useFavorites";
import type { MetaFunction } from "react-router";
import { useAuth } from "@/features/auth";
import { AuthPrompt } from "../components/AuthPrompt";
import { FavoriteCard } from "../components/FavoriteCard";

export const meta: MetaFunction = () => {
  return [
    { title: "My Favorites - Pokedex App" },
    {
      name: "description",
      content: "View and manage your favorite Pokemon collection",
    },
  ];
};

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: favorites, isLoading, isError, error } = useFavorites();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">My Favorites</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Login to save and manage your favorite Pokemon collection
            </p>
          </div>
          <AuthPrompt />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-300 text-lg">Loading your favorites...</p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <UserX className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-red-300 text-lg font-semibold mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-200 mb-4">
              {error instanceof Error
                ? error.message
                : "Failed to load favorites"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white border-red-500"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    if (!favorites || favorites.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-gray-500" />
            <h3 className="text-gray-300 text-xl font-semibold mb-4">
              No favorites yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Start building your collection by exploring Pokemon and adding
              them to your favorites!
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Link to="/pokemon">Browse Pokemon</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <FavoriteCard key={favorite.id} favorite={favorite} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">My Favorites</h1>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your personal Pokemon collection
          </p>
          {favorites && favorites.length > 0 && (
            <div className="mt-4">
              <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm">
                {favorites.length} Pokemon in your collection
              </span>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
