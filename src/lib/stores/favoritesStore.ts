import { create } from 'zustand';
import { Video } from '../api/types';
import { apiFetch } from '../api/client';
import { useAuthStore } from './authStore';

interface FavoritesState {
  favorites: Video[];
  loading: boolean;
  error: string | null;
  favoriteIds: Set<string>;
}

interface FavoritesActions {
  fetchFavorites: () => Promise<void>;
  addFavorite: (videoId: string) => Promise<void>;
  removeFavorite: (videoId: string) => Promise<void>;
  checkFavorite: (videoId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavorites = create<FavoritesState & FavoritesActions>((set, get) => ({
  favorites: [],
  loading: false,
  error: null,
  favoriteIds: new Set<string>(),

  fetchFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const { token, checkTokenValidity } = useAuthStore.getState();
      
      if (!token || !checkTokenValidity()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await apiFetch<{ videos: Video[]; count: number }>('/api/favorites', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.error?.message || 'Error al cargar favoritos');
      }

      const videos = response.data?.videos || [];
      const ids = new Set(videos.map((v: Video) => String(v.id)));

      set({
        favorites: videos,
        favoriteIds: ids,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      set({
        favorites: [],
        favoriteIds: new Set(),
        loading: false,
        error: error.message || 'Error al cargar favoritos',
      });
    }
  },

  addFavorite: async (videoId: string) => {
    try {
      const { token, checkTokenValidity } = useAuthStore.getState();
      
      if (!token || !checkTokenValidity()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await apiFetch('/api/favorites', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: { videoId },
      });

      if (!response.ok) {
        throw new Error(response.error?.message || 'Error al agregar a favoritos');
      }

      // Update local state optimistically
      const newIds = new Set(get().favoriteIds);
      newIds.add(videoId);
      set({ favoriteIds: newIds });

      // Refresh favorites to get full video data
      await get().fetchFavorites();
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      set({
        error: error.message || 'Error al agregar a favoritos',
      });
      throw error;
    }
  },

  removeFavorite: async (videoId: string) => {
    try {
      const { token, checkTokenValidity } = useAuthStore.getState();
      
      if (!token || !checkTokenValidity()) {
        throw new Error('Usuario no autenticado');
      }

      const response = await apiFetch(`/api/favorites/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.error?.message || 'Error al eliminar de favoritos');
      }

      // Update local state
      const newIds = new Set(get().favoriteIds);
      newIds.delete(videoId);
      const newFavorites = get().favorites.filter((v) => String(v.id) !== videoId);

      set({
        favoriteIds: newIds,
        favorites: newFavorites,
      });
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      set({
        error: error.message || 'Error al eliminar de favoritos',
      });
      throw error;
    }
  },

  checkFavorite: (videoId: string) => {
    return get().favoriteIds.has(videoId);
  },

  clearFavorites: () => {
    set({
      favorites: [],
      favoriteIds: new Set(),
      loading: false,
      error: null,
    });
  },
}));
