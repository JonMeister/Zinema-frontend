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

// Videos store exports
export {
  useVideosStore,
  useVideos,
  useVideoCategories,
  useVideoSearch,
} from './videosStore';
