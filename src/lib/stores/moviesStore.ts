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
          console.log('Using cached movies, no need to fetch');
          return;
        }

        // Get token from auth store
        const { token } = useAuthStore.getState();
        
        console.log('fetchMovies called, token:', token ? 'present' : 'missing');
        
        if (!token) {
          console.log('No token, setting error');
          set({ 
            loading: false, 
            error: 'Usuario no autenticado' 
          });
          return;
        }

        console.log('Setting loading to true');
        set({ loading: true, error: null });

    try {
      console.log('Calling videoService.getVideos...');
      // Fetch 2 pages to get 20 movies total
      const response1 = await videoService.getVideos(1, token);
      const response2 = await videoService.getVideos(2, token);
      
      console.log('Response 1 received:', response1);
      console.log('Response 2 received:', response2);
      
      // Combine videos from both pages
      const allVideos = [
        ...('videos' in response1 ? response1.videos : []),
        ...('videos' in response2 ? response2.videos : [])
      ];
      
      console.log('Combined videos count:', allVideos.length);

      // Check for errors in either response
      if ('message' in response1 || 'message' in response2) {
        const errorMessage = ('message' in response1) ? response1.message : ('message' in response2) ? response2.message : 'Error desconocido';
        console.log('Error response:', errorMessage);
        set({ 
          loading: false, 
          error: errorMessage 
        });
        return;
      }
      
      console.log('Success! Total videos count:', allVideos.length);
      // Set movies and featured movie (first one)
      set({
        movies: allVideos,
        featuredMovie: allVideos.length > 0 ? allVideos[0] : null,
        lastFetchedAt: Date.now(),
        loading: false,
        error: null,
      });
    } catch (err) {
      console.log('Error in fetchMovies:', err);
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

