# API Documentation

## External APIs Integration

### PokeAPI Integration

**Base URL**: `https://pokeapi.co/api/v2`

The app integrates with PokeAPI for Pokemon data through a centralized service layer.

#### Implementation

```typescript
// app/features/pokemon/services/pokemon.api.ts
import { ApiClient } from "@/shared/services/http-service";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";

export const PokemonApiService = {
  getPokemonList: (params?: PokemonSearchFilters) =>
    ApiClient.get<PokemonListResponse>(API_ENDPOINTS.POKEMON_LIST, { params }),

  getPokemon: (nameOrId: string | number) =>
    ApiClient.get<Pokemon>(`${API_ENDPOINTS.POKEMON_LIST}/${nameOrId}`),
};
```

#### Endpoints Used

##### 1. Get Pokemon List

```http
GET /pokemon?limit={limit}&offset={offset}
```

**Response Structure:**

```typescript
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonListItem {
  name: string;
  url: string;
}
```

**Usage:**

```typescript
// Get first 20 Pokemon with pagination
const { data, fetchNextPage, hasNextPage } = usePokemonList({
  limit: 20,
  offset: 0,
});
```

##### 2. Get Pokemon Details

```http
GET /pokemon/{id-or-name}
```

**Response Structure:**

```typescript
interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: {
    name: string;
    url: string;
  };
}
```

**Usage:**

```typescript
// Get specific Pokemon
const { data: pokemon, isLoading } = usePokemon("pikachu");
const { data: pokemon2 } = usePokemon(25); // By ID
```

## Firebase Integration

### Authentication Service

**Implementation:**

```typescript
// app/features/auth/services/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/shared/config/firebase.config";

export class AuthService {
  static async login(email: string, password: string): Promise<User>;
  static async register(data: RegisterFormData): Promise<User>;
  static async logout(): Promise<void>;
  static getCurrentUser(): User | null;
}
```

#### Authentication Data Models

```typescript
// app/features/auth/types/auth.types.ts
interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}
```

### Firestore - Favorites Service

**Collection Structure:**

```typescript
// Firestore collection: 'favorites'
interface FavoritePokemon {
  id: string; // Document ID
  userId: string; // User who favorited
  pokemonId: number; // Pokemon ID from PokeAPI
  pokemonName: string; // Pokemon name
  pokemonImage: string; // Pokemon image URL
  createdAt: Timestamp; // When favorited
}
```

**Service Implementation:**

```typescript
// app/features/favorites/services/favorites.services.ts
export class FavoritesService {
  // Add Pokemon to favorites
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

  // Remove from favorites
  static async removeFavorite(favoriteId: string): Promise<void> {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
  }

  // Get user's favorites
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

  // Check if Pokemon is favorited
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

  // Real-time subscription
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
}
```

## HTTP Service Layer

### Custom HTTP Client

**Base Implementation:**

```typescript
// app/shared/services/http-service.ts
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface RequestOptions extends RequestInit {
  method: HttpMethod;
  data?: any;
  params?: Record<string, any>;
  baseURL?: string;
}

const createHttpService = (defaultBaseURL?: string): HttpService => {
  // URL building with params
  const buildUrl = (
    endpoint: string,
    params?: Record<string, any>,
    baseURL?: string
  ) => {
    const base = baseURL || defaultBaseURL || window.location.origin;
    let url: URL;

    try {
      url = new URL(endpoint);
    } catch {
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;
      url = new URL(cleanEndpoint, base);
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  };

  // Request implementation with error handling
  const request = async <T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> => {
    const { params, data, baseURL, ...restOptions } = options;
    const url = buildUrl(endpoint, params, baseURL);

    const headers = new Headers(restOptions.headers);
    headers.set("Accept", "application/json");

    if (data && !headers.has("Content-Type") && !(data instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    let body: string | FormData | undefined;
    if (data) {
      body = data instanceof FormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body,
      });

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      const contentType = response.headers.get("content-type");
      if (response.status === 204 || !contentType) {
        return {} as T;
      }

      return contentType.includes("application/json")
        ? await response.json()
        : ((await response.text()) as T);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(
        error instanceof Error ? error.message : "Network error",
        0,
        error
      );
    }
  };

  return {
    get: <T>(endpoint: string, options?) =>
      request<T>(endpoint, { method: "GET", ...options }),
    post: <T>(endpoint: string, data?: any, options?) =>
      request<T>(endpoint, { method: "POST", data, ...options }),
    put: <T>(endpoint: string, data: any, options?) =>
      request<T>(endpoint, { method: "PUT", data, ...options }),
    patch: <T>(endpoint: string, data: any, options?) =>
      request<T>(endpoint, { method: "PATCH", data, ...options }),
    delete: <T>(endpoint: string, options?) =>
      request<T>(endpoint, { method: "DELETE", ...options }),
  };
};

export const ApiClient = createHttpService();
```

### Error Handling Strategy

```typescript
const handleErrorResponse = async (response: Response): Promise<never> => {
  let errorMessage = response.statusText || "An error occurred";
  let errorData: any;

  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      errorData = await response.json();
      errorMessage =
        errorData.error_message ||
        errorData.message ||
        errorData.error ||
        errorMessage;
    } else {
      errorMessage = (await response.text()) || errorMessage;
    }
  } catch (parseError) {
    console.warn("Failed to parse error response:", parseError);
  }

  throw new HttpError(errorMessage, response.status, errorData);
};
```

## React Query Integration

### Query Key Management

```typescript
// app/features/pokemon/hooks/usePokemon.ts
export const pokemonKeys = {
  all: ["pokemon"] as const,
  list: (filters: PokemonSearchFilters) =>
    [...pokemonKeys.all, filters] as const,
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: string | number) => [...pokemonKeys.details(), id] as const,
};

// app/features/favorites/hooks/useFavorites.ts
export const favoritesKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoritesKeys.all, "list"] as const,
  list: (userId: string) => [...favoritesKeys.lists(), userId] as const,
  detail: (userId: string, pokemonId: number) =>
    [...favoritesKeys.all, "detail", userId, pokemonId] as const,
};
```

### Custom Hooks Implementation

#### Pokemon Hooks

```typescript
// Infinite query for Pokemon list
export function usePokemonList(filters: PokemonSearchFilters = {}) {
  return useInfiniteQuery({
    queryKey: pokemonKeys.list(filters),
    queryFn: ({ pageParam = 0 }) =>
      PokemonApiService.getPokemonList({
        ...filters,
        offset: pageParam,
        limit: filters.limit || 20,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * (filters.limit || 20);
    },
    initialPageParam: 0,
  });
}

// Single Pokemon query
export function usePokemon(nameOrId: string | number) {
  return useQuery({
    queryKey: pokemonKeys.detail(nameOrId),
    queryFn: () => PokemonApiService.getPokemon(nameOrId),
    enabled: !!nameOrId,
  });
}
```

#### Favorites Hooks

```typescript
// Real-time favorites with Firestore subscription
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

// Check if Pokemon is favorited
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

// Add favorite mutation
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

// Remove favorite mutation
export function useRemoveFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      favoriteId,
      pokemonId,
    }: {
      favoriteId: string;
      pokemonId: number;
    }) => FavoritesService.removeFavorite(favoriteId),
    onSuccess: (_, { pokemonId }) => {
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: favoritesKeys.list(user.uid),
        });
        queryClient.invalidateQueries({
          queryKey: favoritesKeys.detail(user.uid, pokemonId),
        });
      }
    },
  });
}
```

## Data Models

### Pokemon Types

```typescript
// app/features/pokemon/types/pokemon.types.ts
export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: PokemonOtherSprites;
}

export interface PokemonOtherSprites {
  dream_world: {
    front_default: string | null;
  };
  home: {
    front_default: string | null;
    front_shiny: string | null;
  };
  "official-artwork": {
    front_default: string | null;
    front_shiny: string | null;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSearchFilters {
  search?: string;
  type?: string;
  generation?: string;
  limit?: number;
  offset?: number;
}
```

### Favorites Types

```typescript
// app/features/favorites/services/favorites.services.ts
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
```

## Real-time Data Flow

### Component Integration Example

```typescript
// How components use the API layer
import { usePokemon } from "@features/pokemon/hooks/usePokemon";
import {
  useAddFavorite,
  useIsFavorited,
} from "@features/favorites/hooks/useFavorites";

export function PokemonCard({ url }: { url: string }) {
  const pokemonId = extractIdFromUrl(url);
  const { data: pokemon, isLoading } = usePokemon(pokemonId);
  const { data: favoriteStatus } = useIsFavorited(pokemonId);
  const addFavorite = useAddFavorite();

  const handleToggleFavorite = async () => {
    if (!pokemon || !user || !favoriteStatus) return;

    const favoriteData = {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      pokemonImage:
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default ||
        "/placeholder-pokemon.png",
    };

    if (favoriteStatus.isFavorited && favoriteStatus.favoriteId) {
      await removeFavorite.mutateAsync({
        favoriteId: favoriteStatus.favoriteId,
        pokemonId: pokemon.id,
      });
    } else {
      await addFavorite.mutateAsync(favoriteData);
    }
  };

  // Component render logic...
}
```
