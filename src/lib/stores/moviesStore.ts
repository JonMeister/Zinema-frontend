/**
 * Movies store using Zustand for state management.
 * Simple store for managing 10 popular movies.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Video, VideosResponse, ApiError } from '@/lib/api/types';
import { videoService } from '@/lib/api/videoService';
import { useAuthStore } from './authStore';

/**
 * Interface representing the movies state.
 */
interface MoviesState {
  // Data
  movies: Video[];
  featuredMovie: Video | null;
  lastFetchedAt: number | null;
  
  // UI State
  loading: boolean;
  error: string | null;
}

/**
 * Interface representing movies actions.
 */
interface MoviesActions {
  fetchMovies: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Combined movies store type.
 */
type MoviesStore = MoviesState & MoviesActions;

/**
 * Zustand store for movies state management with persistence.
 */
export const useMoviesStore = create<MoviesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      movies: [],
      featuredMovie: null,
      lastFetchedAt: null,
      loading: false,
      error: null,

      // Actions
      fetchMovies: async () => {
        // Check if we have recent data (less than 5 minutes old)
        const { lastFetchedAt, movies } = get();
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        
        if (lastFetchedAt && lastFetchedAt > fiveMinutesAgo && movies.length > 0) {
          return;
        }

        // Get token from auth store
        const { token } = useAuthStore.getState();
        
        if (!token) {
          set({ 
            loading: false, 
            error: 'Usuario no autenticado' 
          });
          return;
        }

        set({ loading: true, error: null });

    try {
      // List of specific video IDs to fetch
      const videoIds = [
        6963395, 5386411, 7438482, 1526909, 1409899, 
        3163534, 2169880, 857251, 856973, 2098989,
        1093662, 857195, 5329239, 1580455, 4057252,
        3363552, 2480792, 6560039, 5322475, 1757800
      ];

      // Fetch videos by their specific IDs
      const videoPromises = videoIds.map(id => videoService.getVideoById(id, token));
      const responses = await Promise.all(videoPromises);
      
      // Filter out errors and extract valid videos
      const allVideos = responses
        .filter(response => response && !('message' in response))
        .map(response => response as Video);
      
      // Set movies and featured movie (first one)
      set({
        movies: allVideos,
        featuredMovie: allVideos.length > 0 ? allVideos[0] : null,
        lastFetchedAt: Date.now(),
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ 
        loading: false, 
        error: 'Error al cargar las películas' 
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}),
{
  name: 'movies-storage', // localStorage key
  partialize: (state) => ({
    movies: state.movies,
    featuredMovie: state.featuredMovie,
    lastFetchedAt: state.lastFetchedAt,
  }),
}
));

/**
 * Hook to get movies with automatic loading.
 */
export const useMovies = () => {
  const { 
    movies, 
    featuredMovie,
    loading, 
    error, 
    fetchMovies 
  } = useMoviesStore();
  
  return {
    movies,
    featuredMovie,
    loading,
    error,
    fetchMovies,
  };
};

