import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { PokemonCard } from "@features/pokemon/components/PokemonCard";
import { usePokemonList } from "@features/pokemon/hooks/usePokemon";

export default function PokemonListPage() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePokemonList();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("pokemon-favorites");
    if (savedFavorites) {
      try {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
  }, []);

  const handleToggleFavorite = useCallback(
    (pokemonId: number, isFavorite: boolean) => {
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (isFavorite) {
          newFavorites.add(pokemonId);
        } else {
          newFavorites.delete(pokemonId);
        }

        localStorage.setItem(
          "pokemon-favorites",
          JSON.stringify([...newFavorites])
        );

        return newFavorites;
      });
    },
    []
  );

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading Pokemon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600">
              {error instanceof Error
                ? error.message
                : "Failed to load Pokemon"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Pokemon Collection
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover and explore the amazing world of Pokemon. Search, filter,
            and save your favorites!
          </p>
        </div>

        {data && (
          <div className="max-w-6xl mx-auto mb-6">
            <p className="text-gray-300">
              {allPokemon.length > 0 ? (
                <>Showing {allPokemon.length} Pokemon</>
              ) : (
                <>No Pokemon found</>
              )}
            </p>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {allPokemon.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.name}
                  url={pokemon.url}
                  isFavorite={favorites.has(
                    Number(pokemon.url.split("/").slice(-2, -1)[0])
                  )}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No Pokemon found</p>
            </div>
          )}
        </div>

        <div ref={loadMoreRef} className="py-8 text-center">
          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading more Pokemon...</span>
            </div>
          )}
          {!hasNextPage && allPokemon.length > 0 && (
            <p className="text-gray-500">You've seen all Pokemon!</p>
          )}
        </div>
      </div>
    </div>
  );
}
