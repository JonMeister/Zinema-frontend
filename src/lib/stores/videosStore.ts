/**
 * Videos store using Zustand for state management.
 * 
 * Manages video data, loading states, pagination, and search functionality.
 * Provides a centralized way to handle video operations and state.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Video, VideosResponse, ApiError, VideoCategory, CategoriesResponse } from '@/lib/api/types';
import { videoService } from '@/lib/api/videoService';
import { useAuthStore } from './authStore';

/**
 * Interface representing the videos state.
 */
interface VideosState {
  // Data
  videos: Video[];
  currentPage: number;
  totalResults: number;
  hasMorePages: boolean;
  currentCategory: string;
  lastFetchedAt: number | null;
  
  // Categories
  categories: VideoCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Search
  searchQuery: string;
  searchResults: Video[];
  searchLoading: boolean;
  searchError: string | null;
}

/**
 * Interface representing videos actions.
 */
interface VideosActions {
  // Popular videos
  fetchVideosByCategory: (category?: string, page?: number) => Promise<void>;
  loadMoreVideos: () => Promise<void>;
  clearVideos: () => void;
  
  // Categories
  fetchCategories: () => Promise<void>;
  
  // Search
  searchVideos: (query: string, page?: number) => Promise<void>;
  clearSearch: () => void;
  
  // UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchLoading: (loading: boolean) => void;
  setSearchError: (error: string | null) => void;
}

/**
 * Combined videos store type.
 */
type VideosStore = VideosState & VideosActions;

/**
 * Zustand store for videos state management.
 * 
 * Features:
 * - Popular videos with pagination
 * - Search functionality
 * - Loading and error states
 * - Automatic state management
 */
export const useVideosStore = create<VideosStore>()(
  persist(
    (set, get) => ({
  // Initial state
  videos: [],
  currentPage: 1,
  totalResults: 0,
  hasMorePages: true,
  currentCategory: 'all',
  lastFetchedAt: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
  searchLoading: false,
  searchError: null,

  // Actions
  fetchVideosByCategory: async (category: string = 'all', page: number = 1) => {
    // Get token from auth store
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ 
        loading: false, 
        error: 'Usuario no autenticado' 
      });
      return;
    }

    set({ loading: true, error: null, currentCategory: category });

    try {
      // Use featured videos endpoint for 'featured' category
      const response = category === 'featured' 
        ? await videoService.getFeaturedVideos(page, token)
        : await videoService.getVideosByCategory(page, token, category);

      if ('message' in response) {
        set({ 
          loading: false, 
          error: response.message 
        });
        return;
      }

      // Always accumulate videos from different categories
      const existingVideos = get().videos;
      const newVideos = response.videos;
      
      // Filter out duplicates by ID
      const uniqueNewVideos = newVideos.filter(newVideo => 
        !existingVideos.some(existingVideo => existingVideo.id === newVideo.id)
      );
      
      set({
        videos: [...existingVideos, ...uniqueNewVideos],
        currentPage: page,
        totalResults: response.total_results,
        hasMorePages: response.videos.length > 0,
        loading: false,
        error: null,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      set({ 
        loading: false, 
        error: 'Error al cargar las películas' 
      });
    }
  },

  loadMoreVideos: async () => {
    const { currentPage, hasMorePages, loading, currentCategory } = get();
    
    if (loading || !hasMorePages) return;

    const nextPage = currentPage + 1;
    await get().fetchVideosByCategory(currentCategory, nextPage);
  },

  clearVideos: () => {
    set({
      videos: [],
      currentPage: 1,
      totalResults: 0,
      hasMorePages: true,
      error: null,
    });
  },

  fetchCategories: async () => {
    const { categoriesLoading } = get();
    if (categoriesLoading) return;

    set({ categoriesLoading: true, categoriesError: null });

    try {
      console.log('Fetching categories');
      const response = await videoService.getCategories();

      if ('message' in response) {
        console.log('Categories fetch error:', response.message);
        set({ 
          categoriesLoading: false, 
          categoriesError: response.message 
        });
        return;
      }

      console.log('Categories fetch success:', response.categories.length, 'categories');
      
      set({
        categories: response.categories,
        categoriesLoading: false,
        categoriesError: null,
      });
    } catch (err) {
      console.log('Categories fetch exception:', err);
      set({ 
        categoriesLoading: false, 
        categoriesError: 'Error al cargar las categorías' 
      });
    }
  },

  searchVideos: async (query: string, page: number = 1) => {
    const { searchLoading } = get();
    if (searchLoading) return; // Prevent concurrent requests

    // Get token from auth store
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ 
        searchLoading: false, 
        searchError: 'Usuario no autenticado' 
      });
      return;
    }

    set({ 
      searchLoading: true, 
      searchError: null,
      searchQuery: query,
    });

    try {
      console.log('Searching videos for query:', query, 'page:', page);
      const response = await videoService.searchVideos(query, page, token);

      if ('message' in response) {
        console.log('Search error:', response.message);
        set({ 
          searchLoading: false, 
          searchError: response.message 
        });
        return;
      }

      console.log('Search success:', response.videos.length, 'videos');
      
      set({
        searchResults: page === 1 ? response.videos : [...get().searchResults, ...response.videos],
        searchLoading: false,
        searchError: null,
      });
    } catch (err) {
      console.log('Search exception:', err);
      set({ 
        searchLoading: false, 
        searchError: 'Error al buscar películas' 
      });
    }
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      searchError: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setSearchLoading: (searchLoading: boolean) => {
    set({ searchLoading });
  },

  setSearchError: (searchError: string | null) => {
    set({ searchError });
  },
    }),
    {
      name: 'videos-storage',
      partialize: (state) => ({
        videos: state.videos,
        currentPage: state.currentPage,
        totalResults: state.totalResults,
        hasMorePages: state.hasMorePages,
        currentCategory: state.currentCategory,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);

/**
 * Hook to get videos with automatic loading.
 * 
 * @returns Videos data and loading state
 */
export const useVideos = () => {
  const { 
    videos, 
    loading, 
    error, 
    currentCategory,
    hasMorePages,
    lastFetchedAt,
    fetchVideosByCategory, 
    loadMoreVideos 
  } = useVideosStore();
  
  return {
    videos,
    loading,
    error,
    currentCategory,
    hasMorePages,
    lastFetchedAt,
    fetchVideosByCategory,
    loadMoreVideos,
  };
};

/**
 * Hook to get categories functionality.
 * 
 * @returns Categories data and functions
 */
export const useVideoCategories = () => {
  const { 
    categories, 
    categoriesLoading, 
    categoriesError, 
    fetchCategories 
  } = useVideosStore();
  
  return {
    categories,
    categoriesLoading,
    categoriesError,
    fetchCategories,
  };
};

/**
 * Hook to get search functionality.
 * 
 * @returns Search data and search functions
 */
export const useVideoSearch = () => {
  const { 
    searchQuery, 
    searchResults, 
    searchLoading, 
    searchError, 
    searchVideos, 
    clearSearch 
  } = useVideosStore();
  
  return {
    searchQuery,
    searchResults,
    searchLoading,
    searchError,
    searchVideos,
    clearSearch,
  };
};
