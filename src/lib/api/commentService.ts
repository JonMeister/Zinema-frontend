/**
 * Comment service for managing video comments through the backend API.
 * 
 * Provides methods to create, update, delete, and retrieve comments
 * with proper authentication handling.
 */
import { apiFetch } from './client';
import { CommentResponse, CommentsResponse, CheckCommentResponse, ApiError } from './types';

/**
 * Creates a comment for a specific video.
 * 
 * @param videoId - ID of the video to comment on
 * @param content - Comment content (5-100 characters)
 * @param token - Authentication token
 * @returns Promise resolving to comment response or error
 */
async function createComment(videoId: string, content: string, token: string): Promise<CommentResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<CommentResponse>(`/api/comments/${videoId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    json: { content },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to create comment' };
  }

  return response.data!;
}

/**
 * Updates an existing comment.
 * 
 * @param commentId - ID of the comment to update
 * @param content - New comment content (5-100 characters)
 * @param token - Authentication token
 * @returns Promise resolving to comment response or error
 */
async function updateComment(commentId: string, content: string, token: string): Promise<CommentResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<CommentResponse>(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    json: { content },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to update comment' };
  }

  return response.data!;
}

/**
 * Deletes a user's comment for a specific video.
 * 
 * @param commentId - ID of the comment to delete
 * @param token - Authentication token
 * @returns Promise resolving to response or error
 */
async function deleteComment(commentId: string, token: string): Promise<CommentResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<CommentResponse>(`/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to delete comment' };
  }

  return response.data!;
}

/**
 * Retrieves the authenticated user's comment for a specific video.
 * 
 * @param videoId - ID of the video
 * @param token - Authentication token
 * @returns Promise resolving to check comment response or error
 */
async function getUserComment(videoId: string, token: string): Promise<CheckCommentResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<CheckCommentResponse>(`/api/comments/check/${videoId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to get user comment' };
  }

  return response.data!;
}

/**
 * Retrieves all comments for a specific video.
 * 
 * @param videoId - ID of the video
 * @param token - Authentication token
 * @returns Promise resolving to comments response or error
 */
async function getVideoComments(videoId: string, token: string): Promise<CommentsResponse | ApiError> {
  if (!token) {
    return { message: 'No authentication token provided' };
  }

  const response = await apiFetch<CommentsResponse>(`/api/comments/${videoId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { message: response.error?.message || 'Failed to fetch comments' };
  }

  return response.data!;
}

export const commentService = {
  createComment,
  updateComment,
  deleteComment,
  getUserComment,
  getVideoComments,
};

