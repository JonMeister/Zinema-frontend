/**
 * Zustand store for managing video comments state.
 * 
 * Handles comment creation, updates, deletion, and retrieval
 * with proper caching and error handling.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment, ApiError } from '@/lib/api/types';
import { commentService } from '@/lib/api/commentService';
import { useAuthStore } from './authStore';

/**
 * State interface for comments store.
 * Tracks user's comment and all comments per video.
 */
interface CommentsState {
  /** Map of user's comment per video ID */
  userComment: { [videoId: string]: Comment | null };
  /** Map of all comments per video ID */
  videoComments: { [videoId: string]: Comment[] };
  /** Loading state for async operations */
  loading: boolean;
  /** Error message if any operation fails */
  error: string | null;
}

/**
 * Actions interface for comments store.
 * Defines methods to manipulate comment data.
 */
interface CommentsActions {
  /** Create a new comment for a video */
  createComment: (videoId: string, content: string) => Promise<void>;
  /** Update an existing comment */
  updateComment: (videoId: string, commentId: string, content: string) => Promise<void>;
  /** Delete a comment */
  deleteComment: (videoId: string, commentId: string) => Promise<void>;
  /** Fetch user's comment for a video */
  getUserComment: (videoId: string) => Promise<void>;
  /** Fetch all comments for a video */
  getVideoComments: (videoId: string) => Promise<void>;
  /** Clear all cached comments */
  clearComments: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: string | null) => void;
}

type CommentsStore = CommentsState & CommentsActions;

export const useCommentsStore = create<CommentsStore>()(
  persist(
    (set, get) => ({
      userComment: {},
      videoComments: {},
      loading: false,
      error: null,

      createComment: async (videoId: string, content: string) => {
        set({ loading: true, error: null });
        const { token } = useAuthStore.getState();
        
        if (!token) {
          set({ loading: false, error: 'Usuario no autenticado' });
          return;
        }

        try {
          const response = await commentService.createComment(videoId, content, token);
          
          if ('message' in response && !response.comment) {
            set({ loading: false, error: response.message });
            return;
          }

          // Refresh comments after creation
          await get().getUserComment(videoId);
          await get().getVideoComments(videoId);
          
          set({ loading: false });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Error al crear comentario' });
        }
      },

      updateComment: async (videoId: string, commentId: string, content: string) => {
        set({ loading: true, error: null });
        const { token } = useAuthStore.getState();
        
        if (!token) {
          set({ loading: false, error: 'Usuario no autenticado' });
          return;
        }

        try {
          const response = await commentService.updateComment(commentId, content, token);
          
          if ('message' in response && !response.comment) {
            set({ loading: false, error: response.message });
            return;
          }

          // Refresh comments after update
          await get().getUserComment(videoId);
          await get().getVideoComments(videoId);
          
          set({ loading: false });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Error al actualizar comentario' });
        }
      },

      deleteComment: async (videoId: string, commentId: string) => {
        set({ loading: true, error: null });
        const { token } = useAuthStore.getState();
        
        if (!token) {
          set({ loading: false, error: 'Usuario no autenticado' });
          return;
        }

        try {
          const response = await commentService.deleteComment(commentId, token);
          
          if ('message' in response && response.message.includes('Error')) {
            set({ loading: false, error: response.message });
            return;
          }

          // Clear user comment and refresh all comments
          set(state => {
            const newUserComment = { ...state.userComment };
            delete newUserComment[videoId];
            return { userComment: newUserComment };
          });
          
          await get().getVideoComments(videoId);
          
          set({ loading: false });
        } catch (err: any) {
          set({ loading: false, error: err.message || 'Error al eliminar comentario' });
        }
      },

      getUserComment: async (videoId: string) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
          const response = await commentService.getUserComment(videoId, token);

          if ('message' in response) {
            return;
          }

          set(state => ({
            userComment: { ...state.userComment, [videoId]: response.comment || null }
          }));
        } catch (err) {
          console.error('Error fetching user comment:', err);
        }
      },

      getVideoComments: async (videoId: string) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
          const response = await commentService.getVideoComments(videoId, token);

          if ('message' in response) {
            return;
          }

          set(state => ({
            videoComments: { ...state.videoComments, [videoId]: response.comments }
          }));
        } catch (err) {
          console.error('Error fetching video comments:', err);
        }
      },

      clearComments: () => {
        set({ userComment: {}, videoComments: {}, error: null });
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'comments-storage',
      partialize: (state) => ({
        userComment: state.userComment,
        videoComments: state.videoComments,
      }),
    }
  )
);

/**
 * Hook to get comments functionality.
 */
export const useComments = () => {
  const {
    userComment,
    videoComments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    getUserComment,
    getVideoComments,
    clearComments,
  } = useCommentsStore();

  return {
    userComment,
    videoComments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    getUserComment,
    getVideoComments,
    clearComments,
  };
};

