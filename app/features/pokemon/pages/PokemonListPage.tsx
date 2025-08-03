import { useRef, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { PokemonCard } from "@features/pokemon/components/PokemonCard";
import { usePokemonList } from "@features/pokemon/hooks/usePokemon";
import { Button } from "@components/Button";

export default function PokemonListPage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
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

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center ">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-300 text-lg">Loading Pokemon...</p>
            <p className="text-gray-300 text-sm mt-2">
              Fetching data from the Pokemon API
            </p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-red-300 text-lg font-semibold mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-200 mb-4">
              {error instanceof Error
                ? error.message
                : "Failed to load Pokemon data"}
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-red-600 hover:bg-red-700 text-white border-red-500 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    if (allPokemon.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.name} url={pokemon.url} />
            ))}
          </div>

          <div ref={loadMoreRef} className="py-8 text-center">
            {isFetchingNextPage && (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span className="text-gray-300">Loading more Pokemon...</span>
              </div>
            )}
            {!hasNextPage && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <p className="text-gray-400">🎉 You've seen all Pokemon!</p>
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <div className="text-center py-16">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/50">
          <p className="text-gray-400 text-lg">No Pokemon found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search criteria
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-4 pt-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
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

        {data && !isLoading && !isError && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-300">
                {allPokemon.length > 0 ? (
                  <>
                    Showing{" "}
                    <span className="text-purple-400 font-semibold">
                      {allPokemon.length}
                    </span>{" "}
                    Pokemon
                    {hasNextPage && (
                      <span className="text-gray-500 ml-2">
                        (More available)
                      </span>
                    )}
                  </>
                ) : (
                  <>No Pokemon found</>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
