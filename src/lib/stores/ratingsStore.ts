/**
 * Ratings store using Zustand for state management.
 * 
 * Manages video ratings, loading states, and user's rating data.
 * Provides a centralized way to handle rating operations.
 */
import { create } from 'zustand';
import { Rating, RatingStats } from '@/lib/api/types';
import { ratingService } from '@/lib/api/ratingService';
import { useAuthStore } from './authStore';

/**
 * Interface representing the ratings state.
 */
interface RatingsState {
  // Data
  userRating: Record<string, Rating | null>; // videoId -> Rating
  videoRatings: Record<string, Rating[]>; // videoId -> Ratings[]
  videoStats: Record<string, RatingStats>; // videoId -> Stats
  
  // UI State
  loading: boolean;
  error: string | null;
}

/**
 * Interface representing ratings actions.
 */
interface RatingsActions {
  // Rating operations
  createRating: (videoId: string, stars: number) => Promise<boolean>;
  updateRating: (videoId: string, ratingId: string, stars: number) => Promise<boolean>;
  deleteRating: (videoId: string) => Promise<boolean>;
  getUserRating: (videoId: string) => Promise<void>;
  getVideoRatings: (videoId: string) => Promise<void>;
  
  // Helpers
  calculateStats: (videoId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Combined ratings store type.
 */
type RatingsStore = RatingsState & RatingsActions;

/**
 * Zustand store for ratings state management.
 */
export const useRatingsStore = create<RatingsStore>((set, get) => ({
  // Initial state
  userRating: {},
  videoRatings: {},
  videoStats: {},
  loading: false,
  error: null,

  // Actions
  createRating: async (videoId: string, stars: number) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Usuario no autenticado' });
      return false;
    }

    set({ loading: true, error: null });

    try {
      const response = await ratingService.createRating(videoId, stars, token);

      // Expect a RatingResponse with a rating. If not present, treat as error
      if (!('rating' in response)) {
        const msg = 'message' in response ? response.message : 'Respuesta inválida al crear calificación';
        set({ loading: false, error: msg });
        return false;
      }

      // Refresh user rating and video ratings
      await get().getUserRating(videoId);
      await get().getVideoRatings(videoId);

      set({ loading: false });
      return true;
    } catch (err) {
      set({ loading: false, error: 'Error al crear calificación' });
      return false;
    }
  },

  updateRating: async (videoId: string, ratingId: string, stars: number) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Usuario no autenticado' });
      return false;
    }

    set({ loading: true, error: null });

    try {
      const response = await ratingService.updateRating(ratingId, stars, token);

      // Expect a RatingResponse with a rating. If not present, treat as error
      if (!('rating' in response)) {
        const msg = 'message' in response ? response.message : 'Respuesta inválida al actualizar calificación';
        set({ loading: false, error: msg });
        return false;
      }

      // Refresh user rating and video ratings
      await get().getUserRating(videoId);
      await get().getVideoRatings(videoId);

      set({ loading: false });
      return true;
    } catch (err) {
      set({ loading: false, error: 'Error al actualizar calificación' });
      return false;
    }
  },

  deleteRating: async (videoId: string) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Usuario no autenticado' });
      return false;
    }

    set({ loading: true, error: null });

    try {
      const response = await ratingService.deleteRating(videoId, token);

      if ('message' in response && response.message.includes('Error')) {
        set({ loading: false, error: response.message });
        return false;
      }

      // Clear user rating and refresh video ratings
      set(state => ({
        userRating: { ...state.userRating, [videoId]: null },
        loading: false
      }));

      await get().getVideoRatings(videoId);

      return true;
    } catch (err) {
      set({ loading: false, error: 'Error al eliminar calificación' });
      return false;
    }
  },

  getUserRating: async (videoId: string) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      const response = await ratingService.checkRating(videoId, token);

      if ('message' in response) {
        return;
      }

      set(state => ({
        userRating: { ...state.userRating, [videoId]: response.rating || null }
      }));
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  },

  getVideoRatings: async (videoId: string) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      const response = await ratingService.getRatings(videoId, token);

      if ('message' in response) {
        return;
      }

      set(state => ({
        videoRatings: { ...state.videoRatings, [videoId]: response.ratings }
      }));

      // Calculate stats after getting ratings
      get().calculateStats(videoId);
    } catch (err) {
      console.error('Error fetching video ratings:', err);
    }
  },

  calculateStats: (videoId: string) => {
    const ratings = get().videoRatings[videoId] || [];
    
    if (ratings.length === 0) {
      set(state => ({
        videoStats: { ...state.videoStats, [videoId]: { count: 0, average: 0 } }
      }));
      return;
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    const average = sum / ratings.length;

    set(state => ({
      videoStats: {
        ...state.videoStats,
        [videoId]: { count: ratings.length, average: Math.round(average * 10) / 10 }
      }
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

/**
 * Hook to get ratings functionality.
 */
export const useRatings = () => {
  const {
    userRating,
    videoRatings,
    videoStats,
    loading,
    error,
    createRating,
    updateRating,
    deleteRating,
    getUserRating,
    getVideoRatings,
  } = useRatingsStore();

  return {
    userRating,
    videoRatings,
    videoStats,
    loading,
    error,
    createRating,
    updateRating,
    deleteRating,
    getUserRating,
    getVideoRatings,
  };
};

