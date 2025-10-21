import { useAuthStore, useIsAuthenticated, useAuthToken, syncAuthFromStorage } from '../stores/authStore';

/**
 * Interface representing the authentication state.
 */
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

/**
 * Custom hook for managing user authentication state and operations.
 *
 * Provides utilities to check authentication status, manage JWT tokens,
 * and handle login/logout operations using Zustand store.
 * Automatically initializes authentication state from stored tokens.
 * 
 * @returns {AuthState & { login: (token: string, user?: { id: string; email: string }) => void; logout: () => void }} 
 * Authentication state and control functions
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, login, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   // User is logged in
 * } else {
 *   // User needs to log in
 * }
 * ```
 */
export function useAuth(): AuthState & {
  login: (token: string, user?: { id: string; email: string }) => void;
  logout: () => void;
} {
  const { isAuthenticated, token, login: storeLogin, logout: storeLogout, user } = useAuthStore();

  const login = (token: string, user?: { id: string; email: string }) => {
    // If no user provided, try to extract from token
    if (!user) {
      try {
        const parts = token.split('.');
        if (parts.length === 3 && parts[1]) {
          const payload = JSON.parse(atob(parts[1]));
          user = {
            id: payload.id || '',
            email: payload.email || '',
          };
        }
      } catch (error) {
        console.error('Failed to parse user info from token:', error);
        user = { id: '', email: '' };
      }
    }
    
    // Ensure user is defined before calling storeLogin
    if (user) {
      storeLogin(token, user);
    }
  };

  const logout = () => {
    storeLogout();
  };

  return {
    isAuthenticated,
    token,
    login,
    logout,
  };
}

/**
 * Checks if the current user is authenticated by validating stored JWT token.
 * 
 * Uses Zustand store for authentication state management.
 * 
 * @returns {boolean} True if user has a valid, non-expired token
 */
export function isAuthenticated(): boolean {
  return useIsAuthenticated();
}

/**
 * Retrieves the current authentication token from Zustand store.
 * 
 * Automatically validates token and returns null if expired.
 * 
 * @returns {string | null} The valid JWT token or null if not authenticated
 */
export function getAuthToken(): string | null {
  return useAuthToken();
}

/**
 * Syncs authentication state from localStorage on app initialization.
 * This should be called once when the app starts.
 */
export function initializeAuth(): void {
  syncAuthFromStorage();
}
