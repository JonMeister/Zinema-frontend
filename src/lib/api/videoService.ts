/**
 * Video service for fetching movie data from the backend API.
 * 
 * Provides methods to retrieve popular videos and search functionality
 * with proper authentication handling.
 */
import { apiFetch } from './client';
import { VideosResponse, ApiError, CategoriesResponse } from './types';
import { useAuthToken } from '@/lib/stores/authStore';

/**
 * Retrieves a paginated list of videos by category.
 * 
 * @param page - Page number for pagination (default: 1)
 * @param token - Authentication token
 * @param category - Category filter (default: 'all')
 * @returns Promise resolving to videos response or error
 */
async function getVideosByCategory(page: number = 1, token: string, category: string = 'all'): Promise<VideosResponse | ApiError> {
  if (!token) {
    console.log('No authentication token provided');
    return { message: 'No authentication token provided' };
  }

  console.log('Making API call to fetch videos with category:', category, 'page:', page);
  const response = await apiFetch<VideosResponse>(`/api/videos/page/${page}?category=${encodeURIComponent(category)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log('API call failed:', response.status, response.error);
    return { message: response.error?.message || 'Failed to fetch videos' };
  }

  console.log('API call successful, received videos:', response.data?.videos?.length || 0);
  return response.data!;
}

/**
 * Searches videos by title with pagination.
 * 
 * @param title - Title to search for
 * @param page - Page number for pagination (default: 1)
 * @param token - Authentication token
 * @returns Promise resolving to videos response or error
 */
async function searchVideos(title: string, page: number = 1, token: string): Promise<VideosResponse | ApiError> {
  if (!token) {
    console.log('No authentication token provided');
    return { message: 'No authentication token provided' };
  }

  console.log('Making API call to search videos with token:', token.substring(0, 20) + '...');
  const response = await apiFetch<VideosResponse>(`/api/videos/info/title/${encodeURIComponent(title)}/page/${page}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log('Search API call failed:', response.status, response.error);
    return { message: response.error?.message || 'Failed to search videos' };
  }

  console.log('Search API call successful, received videos:', response.data?.videos?.length || 0);
  return response.data!;
}

/**
 * Gets detailed information for a specific video by ID.
 * 
 * @param id - Video ID
 * @param token - Authentication token
 * @returns Promise resolving to video details or error
 */
async function getVideoById(id: number, token: string): Promise<any> {
  if (!token) {
    console.log('No authentication token provided');
    return { message: 'No authentication token provided' };
  }

  console.log('Making API call to get video details with token:', token.substring(0, 20) + '...');
  const response = await apiFetch(`/api/videos/info/id/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log('Video details API call failed:', response.status, response.error);
    return { message: response.error?.message || 'Failed to fetch video details' };
  }

  console.log('Video details API call successful');
  return response.data;
}

/**
 * Gets available video categories
 * 
 * @returns Promise resolving to categories response or error
 */
async function getCategories(): Promise<CategoriesResponse | ApiError> {
  console.log('Making API call to fetch categories');
  const response = await apiFetch<CategoriesResponse>('/api/videos/categories', {
    method: 'GET',
  });

  if (!response.ok) {
    console.log('Categories API call failed:', response.status, response.error);
    return { message: response.error?.message || 'Failed to fetch categories' };
  }

  console.log('Categories API call successful, received categories:', response.data?.categories?.length || 0);
  return response.data!;
}

/**
 * Retrieves featured videos from Pexels curated collections.
 * 
 * @param page - Page number for pagination (default: 1)
 * @param token - Authentication token
 * @returns Promise resolving to videos response or error
 */
async function getFeaturedVideos(page: number = 1, token: string): Promise<VideosResponse | ApiError> {
  console.log('getFeaturedVideos called with page:', page, 'token:', token ? 'present' : 'missing');
  
  if (!token) {
    console.log('No token provided to getFeaturedVideos');
    return { message: 'No authentication token provided' };
  }

  console.log('Making API call to /api/videos/featured/' + page);
  const response = await apiFetch<VideosResponse>(`/api/videos/featured/${page}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('Featured videos API response:', response.ok ? 'success' : 'failed', response.status);

  if (!response.ok) {
    console.log('Featured videos API error:', response.error);
    return { message: response.error?.message || 'Failed to fetch featured videos' };
  }

  console.log('Featured videos API success, videos count:', response.data?.videos?.length || 0);
  return response.data!;
}

/**
 * Retrieves a paginated list of popular videos.
 * 
 * @param page - Page number for pagination (default: 1)
 * @param token - Authentication token
 * @returns Promise resolving to videos response or error
 */
async function getVideos(page: number = 1, token: string): Promise<VideosResponse | ApiError> {
  console.log('getVideos called with page:', page, 'token:', token ? 'present' : 'missing');
  
  if (!token) {
    console.log('No token provided to getVideos');
    return { message: 'No authentication token provided' };
  }

  console.log('Making API call to /api/videos/page/' + page);
  const response = await apiFetch<VideosResponse>(`/api/videos/page/${page}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('API response:', response.ok ? 'success' : 'failed', response.status);

  if (!response.ok) {
    console.log('API error:', response.error);
    return { message: response.error?.message || 'Failed to fetch videos' };
  }

  console.log('API success, videos count:', response.data?.videos?.length || 0);
  return response.data!;
}

/**
 * Service object with methods that work with Zustand stores.
 * These methods expect the token to be passed as a parameter.
 */
export const videoService = {
  getVideos,
  getFeaturedVideos,
  getVideosByCategory,
  searchVideos,
  getVideoById,
  getCategories,
};
