/**
 * Movies store using Zustand for state management.
 * Simple store for managing 10 popular movies.
 */
import { create } from 'zustand';
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
 * Zustand store for movies state management.
 */
export const useMoviesStore = create<MoviesStore>((set, get) => ({
  // Initial state
  movies: [],
  featuredMovie: null,
  loading: false,
  error: null,

  // Actions
  fetchMovies: async () => {
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
      const response = await videoService.getVideos(1, token);
      console.log('Response received:', response);

      if ('message' in response) {
        console.log('Error response:', response.message);
        set({ 
          loading: false, 
          error: response.message 
        });
        return;
      }
      
      console.log('Success! Videos count:', response.videos?.length || 0);
      // Set movies and featured movie (first one)
      set({
        movies: response.videos,
        featuredMovie: response.videos.length > 0 ? response.videos[0] : null,
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
}));

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

