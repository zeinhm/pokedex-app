import { describe, it, expect, vi, beforeEach } from "vitest";
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
import { FavoritesService } from "../../services/favorites.services";

// Mock Firebase Firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  Timestamp: {
    now: vi.fn(),
  },
}));

// Mock Firebase config
vi.mock("@shared/config/firebase.config", () => ({
  db: {},
}));

const mockCollection = vi.mocked(collection);
const mockDoc = vi.mocked(doc);
const mockAddDoc = vi.mocked(addDoc);
const mockDeleteDoc = vi.mocked(deleteDoc);
const mockGetDocs = vi.mocked(getDocs);
const mockQuery = vi.mocked(query);
const mockWhere = vi.mocked(where);
const mockOnSnapshot = vi.mocked(onSnapshot);
const mockTimestamp = vi.mocked(Timestamp);

describe("FavoritesService", () => {
  const mockUserId = "user123";
  const mockPokemonId = 1;
  const mockFavoriteId = "fav123";
  const mockFavoriteData = {
    pokemonId: 1,
    pokemonName: "bulbasaur",
    pokemonImage: "https://example.com/bulbasaur.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup collection mock to return a collection reference object
    mockCollection.mockReturnValue({ _type: 'collection' } as any);
    mockDoc.mockReturnValue({ _type: 'document' } as any);
    mockQuery.mockReturnValue({ _type: 'query' } as any);
    mockWhere.mockReturnValue({ _type: 'where' } as any);
  });

  describe("addFavorite", () => {
    it("should add a favorite successfully", async () => {
      const mockTimestampValue = { seconds: 1234567890, nanoseconds: 0 };
      mockTimestamp.now.mockReturnValue(mockTimestampValue as any);
      mockAddDoc.mockResolvedValue({ id: mockFavoriteId } as any);

      const result = await FavoritesService.addFavorite(
        mockUserId,
        mockFavoriteData
      );

      expect(mockCollection).toHaveBeenCalledWith({}, "favorites");
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.any(Object),
        {
          userId: mockUserId,
          pokemonId: mockFavoriteData.pokemonId,
          pokemonName: mockFavoriteData.pokemonName,
          pokemonImage: mockFavoriteData.pokemonImage,
          createdAt: mockTimestampValue,
        }
      );
      expect(result).toBe(mockFavoriteId);
    });

    it("should handle errors when adding favorite fails", async () => {
      const error = new Error("Firebase error");
      mockAddDoc.mockRejectedValue(error);

      await expect(
        FavoritesService.addFavorite(mockUserId, mockFavoriteData)
      ).rejects.toThrow("Firebase error");
    });
  });

  describe("removeFavorite", () => {
    it("should remove a favorite successfully", async () => {
      mockDeleteDoc.mockResolvedValue(undefined);

      await FavoritesService.removeFavorite(mockFavoriteId);

      expect(mockDoc).toHaveBeenCalledWith({}, "favorites", mockFavoriteId);
      expect(mockDeleteDoc).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should handle errors when removing favorite fails", async () => {
      const error = new Error("Firebase error");
      mockDeleteDoc.mockRejectedValue(error);

      await expect(
        FavoritesService.removeFavorite(mockFavoriteId)
      ).rejects.toThrow("Firebase error");
    });
  });

  describe("getUserFavorites", () => {
    it("should get user favorites successfully", async () => {
      const mockFavorites = [
        {
          id: "fav1",
          userId: mockUserId,
          pokemonId: 1,
          pokemonName: "bulbasaur",
          pokemonImage: "https://example.com/bulbasaur.png",
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
        },
        {
          id: "fav2",
          userId: mockUserId,
          pokemonId: 4,
          pokemonName: "charmander",
          pokemonImage: "https://example.com/charmander.png",
          createdAt: { seconds: 1234567891, nanoseconds: 0 },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockFavorites.map((fav) => ({
          id: fav.id,
          data: () => ({ ...fav }),
        })),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await FavoritesService.getUserFavorites(mockUserId);

      expect(mockCollection).toHaveBeenCalledWith({}, "favorites");
      expect(mockQuery).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith("userId", "==", mockUserId);
      expect(result).toEqual(mockFavorites);
    });

    it("should return empty array when user has no favorites", async () => {
      const mockQuerySnapshot = { docs: [] };
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await FavoritesService.getUserFavorites(mockUserId);

      expect(result).toEqual([]);
    });

    it("should handle errors when getting favorites fails", async () => {
      const error = new Error("Firebase error");
      mockGetDocs.mockRejectedValue(error);

      await expect(
        FavoritesService.getUserFavorites(mockUserId)
      ).rejects.toThrow("Firebase error");
    });
  });

  describe("isFavorited", () => {
    it("should return true when pokemon is favorited", async () => {
      const mockQuerySnapshot = {
        empty: false,
        docs: [{ id: mockFavoriteId }],
      };
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await FavoritesService.isFavorited(
        mockUserId,
        mockPokemonId
      );

      expect(mockWhere).toHaveBeenCalledWith("userId", "==", mockUserId);
      expect(mockWhere).toHaveBeenCalledWith("pokemonId", "==", mockPokemonId);
      expect(result).toEqual({
        isFavorited: true,
        favoriteId: mockFavoriteId,
      });
    });

    it("should return false when pokemon is not favorited", async () => {
      const mockQuerySnapshot = {
        empty: true,
        docs: [],
      };
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await FavoritesService.isFavorited(
        mockUserId,
        mockPokemonId
      );

      expect(result).toEqual({
        isFavorited: false,
        favoriteId: null,
      });
    });

    it("should handle errors when checking favorite status fails", async () => {
      const error = new Error("Firebase error");
      mockGetDocs.mockRejectedValue(error);

      await expect(
        FavoritesService.isFavorited(mockUserId, mockPokemonId)
      ).rejects.toThrow("Firebase error");
    });
  });

  describe("subscribeToUserFavorites", () => {
    it("should subscribe to user favorites and call callback", () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();
      const mockFavorites = [
        {
          id: "fav1",
          userId: mockUserId,
          pokemonId: 1,
          pokemonName: "bulbasaur",
          pokemonImage: "https://example.com/bulbasaur.png",
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockFavorites.map((fav) => ({
          id: fav.id,
          data: () => ({ ...fav }),
        })),
      };

      mockOnSnapshot.mockImplementation((query, callback: any) => {
        callback(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const unsubscribe = FavoritesService.subscribeToUserFavorites(
        mockUserId,
        mockCallback
      );

      expect(mockOnSnapshot).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockFavorites);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe("getUserFavoriteIds", () => {
    it("should return array of favorite pokemon IDs", async () => {
      const mockFavorites = [
        {
          id: "fav1",
          userId: mockUserId,
          pokemonId: 1,
          pokemonName: "bulbasaur",
          pokemonImage: "https://example.com/bulbasaur.png",
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
        },
        {
          id: "fav2",
          userId: mockUserId,
          pokemonId: 4,
          pokemonName: "charmander",
          pokemonImage: "https://example.com/charmander.png",
          createdAt: { seconds: 1234567891, nanoseconds: 0 },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockFavorites.map((fav) => ({
          id: fav.id,
          data: () => ({ ...fav }),
        })),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await FavoritesService.getUserFavoriteIds(mockUserId);

      expect(result).toEqual([1, 4]);
    });

    it("should return empty array when user has no favorites", async () => {
      const mockQuerySnapshot = { docs: [] };
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await FavoritesService.getUserFavoriteIds(mockUserId);

      expect(result).toEqual([]);
    });
  });
});
