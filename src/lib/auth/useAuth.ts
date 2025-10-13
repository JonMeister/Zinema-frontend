/**
 * Authentication hook for managing user session state.
 *
 * Provides utilities to check authentication status, get/set tokens,
 * and handle login/logout operations.
 */
import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

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
 * Check if a JWT token is expired.
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
 * Check if user is authenticated by looking for valid token in localStorage.
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
 * Get the current auth token from localStorage.
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
