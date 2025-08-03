import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PokemonCard } from "@features/pokemon/components/PokemonCard";
import { usePokemonList } from "@features/pokemon/hooks/usePokemon";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/States";

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
        <LoadingState
          title="Loading Pokemon..."
          description="Fetching data from the Pokemon API"
          size="lg"
          className="pt-24"
        />
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="Oops! Something went wrong"
          message={
            error instanceof Error
              ? error.message
              : "Failed to load Pokemon data"
          }
          onRetry={() => refetch()}
        />
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
      <EmptyState
        title="No Pokemon found"
        description="Try adjusting your search criteria"
      />
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
