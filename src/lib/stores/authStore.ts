/**
 * Authentication store using Zustand for state management.
 * 
 * Manages user authentication state, JWT tokens, and authentication operations.
 * Provides a centralized way to handle login, logout, and token validation.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Interface representing the authentication state.
 */
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    email: string;
  } | null;
}

/**
 * Interface representing authentication actions.
 */
interface AuthActions {
  login: (token: string, user: { id: string; email: string }) => void;
  logout: () => void;
  setUser: (user: { id: string; email: string }) => void;
  checkTokenValidity: () => boolean;
}

/**
 * Combined authentication store type.
 */
type AuthStore = AuthState & AuthActions;

/**
 * Checks if a JWT token is expired by parsing its payload.
 * 
 * @param token - The JWT token to validate
 * @returns True if token is expired or malformed, false if valid
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const mid = parts[1];
    if (!mid) return true;
    const payload = JSON.parse(atob(mid));
    const currentTime = Date.now() / 1000;
    return !payload.exp || Number(payload.exp) < currentTime;
  } catch {
    return true; // If token is malformed, consider it expired
  }
}

/**
 * Zustand store for authentication state management.
 * 
 * Features:
 * - Persistent storage using localStorage
 * - Automatic token validation
 * - Centralized authentication state
 * - Type-safe operations
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      user: null,

      // Actions
      login: (token: string, user: { id: string; email: string }) => {
        // Validate token before setting
        if (isTokenExpired(token)) {
          console.warn('Attempted to login with expired token');
          return;
        }

        set({
          isAuthenticated: true,
          token,
          user,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      },

      setUser: (user: { id: string; email: string }) => {
        set({ user });
      },

      checkTokenValidity: () => {
        const { token } = get();
        if (!token) return false;
        
        if (isTokenExpired(token)) {
          // Auto-logout if token is expired
          get().logout();
          return false;
        }
        
        return true;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Validate token on app startup
        if (state?.token && isTokenExpired(state.token)) {
          state.logout();
        }
      },
    }
  )
);

/**
 * Hook to get authentication token with automatic validation.
 * 
 * @returns Valid token or null if not authenticated or expired
 */
export const useAuthToken = (): string | null => {
  const { token, checkTokenValidity } = useAuthStore();
  
  if (!token) return null;
  
  // Check if token is still valid
  if (!checkTokenValidity()) {
    return null;
  }
  
  return token;
};

/**
 * Hook to check if user is authenticated with automatic token validation.
 * 
 * @returns True if user is authenticated with valid token
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated, checkTokenValidity } = useAuthStore();
  
  if (!isAuthenticated) return false;
  
  // Double-check token validity
  return checkTokenValidity();
};

/**
 * Syncs Zustand auth store with existing localStorage token.
 * This function should be called when the app starts to ensure
 * the Zustand store is synchronized with any existing authentication.
 */
export const syncAuthFromStorage = (): void => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      // Parse the stored Zustand state
      const storedState = JSON.parse(token);
      const authToken = storedState.state?.token;
      
      if (authToken && !isTokenExpired(authToken)) {
        const user = storedState.state?.user;
        if (user) {
          // Update Zustand store
          useAuthStore.getState().login(authToken, user);
          console.log('Auth store synchronized with existing token');
        }
      }
    } catch (error) {
      console.error('Failed to sync auth from storage:', error);
      localStorage.removeItem('auth-storage');
    }
  }
};
