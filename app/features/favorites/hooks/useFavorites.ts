import { useAuth } from "@/features/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  FavoritesService,
  type CreateFavoriteData,
} from "../services/favorites.services";

export const favoritesKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoritesKeys.all, "list"] as const,
  list: (userId: string) => [...favoritesKeys.lists(), userId] as const,
  detail: (userId: string, pokemonId: number) =>
    [...favoritesKeys.all, "detail", userId, pokemonId] as const,
};

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: favoritesKeys.list(user?.uid || ""),
    queryFn: () =>
      user?.uid ? FavoritesService.getUserFavorites(user.uid) : [],
    enabled: !!user?.uid,
  });

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = FavoritesService.subscribeToUserFavorites(
      user.uid,
      (favorites) => {
        queryClient.setQueryData(favoritesKeys.list(user.uid), favorites);
      }
    );

    return unsubscribe;
  }, [user?.uid, queryClient]);

  return query;
}

export function useIsFavorited(pokemonId: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: favoritesKeys.detail(user?.uid || "", pokemonId),
    queryFn: () =>
      user?.uid
        ? FavoritesService.isFavorited(user.uid, pokemonId)
        : { isFavorited: false, favoriteId: null },
    enabled: !!user?.uid && !!pokemonId,
  });
}

export function useAddFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteData: CreateFavoriteData) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return FavoritesService.addFavorite(user.uid, favoriteData);
    },
    onSuccess: (_, favoriteData) => {
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: favoritesKeys.list(user.uid),
        });
        queryClient.invalidateQueries({
          queryKey: favoritesKeys.detail(user.uid, favoriteData.pokemonId),
        });
      }
    },
  });
}

export function useRemoveFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      favoriteId,
      pokemonId,
    }: {
      favoriteId: string;
      pokemonId?: number;
    }) => FavoritesService.removeFavorite(favoriteId),
    onSuccess: (_, { pokemonId }) => {
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: favoritesKeys.list(user.uid),
        });
        if (pokemonId) {
          queryClient.invalidateQueries({
            queryKey: favoritesKeys.detail(user.uid, pokemonId),
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: favoritesKeys.all,
            predicate: (query) => {
              const queryKey = query.queryKey;
              return (
                queryKey.length === 4 &&
                queryKey[0] === "favorites" &&
                queryKey[1] === "detail" &&
                queryKey[2] === user.uid
              );
            },
          });
        }
      }
    },
  });
}

export function useToggleFavorite() {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  return {
    toggleFavorite: async (
      isFavorited: boolean,
      favoriteId: string | undefined,
      favoriteData: CreateFavoriteData
    ) => {
      if (isFavorited && favoriteId) {
        await removeFavorite.mutateAsync({
          favoriteId,
          pokemonId: favoriteData.pokemonId,
        });
      } else {
        await addFavorite.mutateAsync(favoriteData);
      }
    },
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  };
}
