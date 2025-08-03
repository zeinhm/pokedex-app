import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@shared/config/firebase.config";

export interface FavoritePokemon {
  id: string;
  userId: string;
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
  createdAt: Timestamp;
}

export interface CreateFavoriteData {
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
}

const FAVORITES_COLLECTION = "favorites";

export class FavoritesService {
  static async addFavorite(
    userId: string,
    favoriteData: CreateFavoriteData
  ): Promise<string> {
    const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      pokemonId: favoriteData.pokemonId,
      pokemonName: favoriteData.pokemonName,
      pokemonImage: favoriteData.pokemonImage,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  static async removeFavorite(favoriteId: string): Promise<void> {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
  }

  static async getUserFavorites(userId: string): Promise<FavoritePokemon[]> {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FavoritePokemon[];
  }

  static async isFavorited(
    userId: string,
    pokemonId: number
  ): Promise<{ isFavorited: boolean; favoriteId?: string | null }> {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("pokemonId", "==", pokemonId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { isFavorited: false, favoriteId: null };
    }

    return {
      isFavorited: true,
      favoriteId: querySnapshot.docs[0].id,
    };
  }

  static subscribeToUserFavorites(
    userId: string,
    callback: (favorites: FavoritePokemon[]) => void
  ): () => void {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (querySnapshot) => {
      const favorites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FavoritePokemon[];

      callback(favorites);
    });
  }

  static async getUserFavoriteIds(userId: string): Promise<number[]> {
    const favorites = await this.getUserFavorites(userId);
    return favorites.map((fav) => fav.pokemonId);
  }
}
