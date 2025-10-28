/**
 * Rating service for managing video ratings through the backend API.
 * 
 * Provides methods to create, update, delete, and retrieve ratings
 * with proper authentication handling.
 */
import { apiFetch } from './client';
import { RatingResponse, RatingsResponse, CheckRatingResponse, ApiError } from './types';

/**
 * Creates or updates a rating for a specific video.
 * 
 * @param videoId - ID of the video to rate
 * @param stars - Rating value (1-5)
 * @param token - Authentication token
 * @returns Promise resolving to rating response or error
 */
async function createRating(videoId: string, stars: number, token: string): Promise<RatingResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<RatingResponse>(`/api/ratings/${videoId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    json: { stars },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to create rating' };
  }

  return response.data!;
}

/**
 * Deletes a user's rating for a specific video.
 * 
 * @param videoId - ID of the video
 * @param token - Authentication token
 * @returns Promise resolving to response or error
 */
async function deleteRating(videoId: string, token: string): Promise<{ message: string } | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<{ message: string }>(`/api/ratings/${videoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to delete rating' };
  }

  return response.data!;
}

/**
 * Retrieves all ratings for a specific video.
 * 
 * @param videoId - ID of the video
 * @param token - Authentication token
 * @returns Promise resolving to ratings response or error
 */
async function getRatings(videoId: string, token: string): Promise<RatingsResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<RatingsResponse>(`/api/ratings/${videoId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to fetch ratings' };
  }

  return response.data!;
}

/**
 * Updates an existing rating.
 * 
 * @param ratingId - ID of the rating to update
 * @param stars - New rating value (1-5)
 * @param token - Authentication token
 * @returns Promise resolving to rating response or error
 */
async function updateRating(ratingId: string, stars: number, token: string): Promise<RatingResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<RatingResponse>(`/api/ratings/${ratingId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    json: { stars },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to update rating' };
  }

  return response.data!;
}

/**
 * Checks if the user has rated a specific video.
 * 
 * @param videoId - ID of the video
 * @param token - Authentication token
 * @returns Promise resolving to check response or error
 */
async function checkRating(videoId: string, token: string): Promise<CheckRatingResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<CheckRatingResponse>(`/api/ratings/check/${videoId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to check rating' };
  }

  return response.data!;
}

/**
 * Service object with all rating-related methods.
 */
export const ratingService = {
  createRating,
  deleteRating,
  getRatings,
  updateRating,
  checkRating,
};

