/**
 * Centralized exports for all Zustand stores.
 * 
 * Provides a single import point for all store-related functionality.
 * This makes it easier to import stores and maintain consistency.
 */

// Authentication store exports
export {
  useAuthStore,
  useAuthToken,
  useIsAuthenticated,
  syncAuthFromStorage,
} from './authStore';

// Movies store exports
export {
  useMoviesStore,
  useMovies,
} from './moviesStore';

// Favorites store exports
export {
  useFavorites,
} from './favoritesStore';
