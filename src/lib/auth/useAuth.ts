import { useState, useEffect } from 'react';

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
 * and handle login/logout operations with localStorage persistence.
 * Automatically initializes authentication state from stored tokens.
 * 
 * @returns {AuthState & { login: (token: string) => void; logout: () => void }} 
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
  login: (token: string) => void;
  logout: () => void;
} {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthState({
        isAuthenticated: true,
        token,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthState({
      isAuthenticated: true,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      token: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}

/**
 * Checks if a JWT token is expired by parsing its payload.
 * 
 * @param {string} token - The JWT token to validate
 * @returns {boolean} True if token is expired or malformed, false if valid
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
 * Checks if the current user is authenticated by validating stored JWT token.
 * 
 * Automatically removes expired tokens from localStorage.
 * 
 * @returns {boolean} True if user has a valid, non-expired token
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    return false;
  }
  
  return true;
}

/**
 * Retrieves the current authentication token from localStorage.
 * 
 * Automatically removes expired tokens and returns null if no valid token exists.
 * 
 * @returns {string | null} The valid JWT token or null if not authenticated
 */
export function getAuthToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    return null;
  }
  
  return token;
}
