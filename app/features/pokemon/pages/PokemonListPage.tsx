import { useRef, useEffect } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { PokemonCard } from "@features/pokemon/components/PokemonCard";
import { SearchInput } from "@features/pokemon/components/SearchInput";
import { usePokemonList } from "@features/pokemon/hooks/usePokemon";
import { useSearchPokemon } from "@features/pokemon/hooks/useSearchPokemon";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/States";
import { useDebouncedSearch } from "@/shared/hooks/useDebounceSearch";

export default function PokemonListPage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    debouncedTerm,
    isTyping,
    hasValidSearch,
    updateSearch,
    clearSearch,
  } = useDebouncedSearch({ delay: 300, minLength: 2 });

  const searchResults = useSearchPokemon(debouncedTerm);

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
    if (hasValidSearch) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, hasValidSearch]);

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  const renderSearchResults = () => {
    if (isTyping) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Typing...</span>
          </div>
        </div>
      );
    }

    if (searchResults.isLoading) {
      return (
        <LoadingState
          title="Searching Pokemon..."
          description={`Looking for "${debouncedTerm}"`}
          size="lg"
          className="pt-12"
        />
      );
    }

    if (searchResults.isError) {
      return (
        <ErrorState
          title="Search failed"
          message="Unable to search Pokemon at the moment"
          onRetry={() => window.location.reload()}
        />
      );
    }

    if (searchResults.isEmpty) {
      return (
        <div className="text-center py-16">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/50 max-w-md mx-auto">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No Pokemon found</p>
            <p className="text-gray-500 text-sm">
              No Pokemon match "{debouncedTerm}". Try a different name.
            </p>
          </div>
        </div>
      );
    }

    if (searchResults.hasResults) {
      return (
        <>
          <div className="mb-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-300 text-center">
                Found {searchResults.data.length} Pokemon matching "
                {debouncedTerm}"
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.data.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                url={`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`}
              />
            ))}
          </div>
        </>
      );
    }

    return null;
  };

  const renderBrowseResults = () => {
    if (isLoading) {
      return (
        <LoadingState
          title="Loading Pokemon..."
          description="Fetching data from the Pokemon API"
          size="lg"
          className="pt-12"
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
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Discover and explore the amazing world of Pokemon. Search, filter,
            and save your favorites!
          </p>

          <SearchInput
            value={searchTerm}
            onChange={updateSearch}
            onClear={clearSearch}
            isLoading={isTyping || searchResults.isLoading}
            className="mb-8"
          />
        </div>

        {!hasValidSearch && data && !isLoading && !isError && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-300">
                {allPokemon.length > 0
                  ? `Showing ${allPokemon.length} Pokemon`
                  : "No Pokemon to display"}
              </p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/**
           * As PokeAPI doesn't directly support searching a list of resources by name,
           * I provide a custom search implementation and make it separate
           */}
          {hasValidSearch ? renderSearchResults() : renderBrowseResults()}
        </div>
      </div>
    </div>
  );
}
